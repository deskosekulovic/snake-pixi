import { Application, Graphics } from 'pixi.js'
import { getViewport, renderFrame } from '../systems/RenderSystem'
import { ReplaySystem } from '../systems/ReplaySystem'
import type { Direction, Settings } from '../types'
import { Loop } from './Loop'
import { SnakeGameModel } from './SnakeGameModel'

export class Game {
  private app: Application | null = null
  private loop: Loop | null = null

  private model: SnakeGameModel

  private accumulator = 0

  private snakeGraphics = new Graphics()
  private foodGraphics = new Graphics()

  private replaySystem = new ReplaySystem()

  private isReplaying = false
  private replayCancel: (() => void) | null = null

  private onControls?: (e: KeyboardEvent) => void

  private container: HTMLElement
  private settings: Settings

  private constructor(
    container: HTMLElement,
    settings: Settings,
    onScoreChange?: (score: number) => void,
  ) {
    this.container = container
    this.settings = settings
    this.model = new SnakeGameModel(settings, onScoreChange)
  }

  static async create(
    container: HTMLElement,
    settings: Settings,
    onScoreChange?: (score: number) => void,
  ): Promise<Game> {
    const g = new Game(container, settings, onScoreChange)
    await g.init()
    return g
  }

  private async init() {
    const app = new Application()
    const vp = getViewport()
    await app.init({
      width: vp,
      height: vp,
      backgroundAlpha: 0,
      antialias: true,
      autoDensity: true,
    })
    this.app = app

    const canvas = app.canvas as HTMLCanvasElement
    canvas.style.display = 'block'
    canvas.style.maxWidth = '100%'
    canvas.style.height = 'auto'
    this.container.appendChild(canvas)

    app.stage.addChild(this.snakeGraphics)
    app.stage.addChild(this.foodGraphics)

    this.resetState()
    if (!this.model.trySpawnFood()) {
      throw new Error('No free cell for initial food')
    }

    this.loop = new Loop(this.update)
    this.loop.start()

    this.setupControls()
    this.render()
  }

  private resetState() {
    this.model.reset()
    this.replaySystem.clear()
    this.accumulator = 0
  }

  private enqueueDirection(dir: Direction) {
    this.model.enqueueDirection(dir)
  }

  private setupControls() {
    this.onControls = (e: KeyboardEvent) => {
      if (this.isReplaying) return

      switch (e.key) {
        case 'Enter':
          e.preventDefault()
          this.restart()
          return
        case 'ArrowUp':
          e.preventDefault()
          this.enqueueDirection('UP')
          return
        case 'ArrowDown':
          e.preventDefault()
          this.enqueueDirection('DOWN')
          return
        case 'ArrowLeft':
          e.preventDefault()
          this.enqueueDirection('LEFT')
          return
        case 'ArrowRight':
          e.preventDefault()
          this.enqueueDirection('RIGHT')
          return
        case 'r':
        case 'R':
          e.preventDefault()
          this.playReplay()
          return
        default:
      }
    }
    window.addEventListener('keydown', this.onControls, { passive: false })
  }

  private update = (delta: number) => {
    if (this.model.gameOver || this.isReplaying) return

    this.accumulator += delta
    const cap = this.settings.speed * 10
    if (this.accumulator > cap) this.accumulator = cap

    while (this.accumulator >= this.settings.speed) {
      if (this.model.gameOver || this.isReplaying) break
      this.tick()
      this.accumulator -= this.settings.speed
    }
  }

  private tick() {
    const outcome = this.model.tick()

    if (outcome.kind === 'continue') {
      this.replaySystem.push(this.model.getSegments(), this.model.getFood())
    }

    this.render()
  }

  private render() {
    renderFrame(
      this.snakeGraphics,
      this.foodGraphics,
      this.model.getSegments(),
      this.model.getFood(),
      this.settings,
    )
  }

  private playReplay() {
    if (this.replaySystem.frames.length === 0) return

    this.isReplaying = true
    if (this.replayCancel) this.replayCancel()

    this.replayCancel = this.replaySystem.play(
      this.settings.speed,
      (snap) => {
        this.model.applySnapshot(snap.snake, snap.food)
        this.render()
      },
      () => {
        this.isReplaying = false
        this.replayCancel = null
      },
    )
  }

  private restart() {
    if (this.replayCancel) {
      this.replayCancel()
      this.replayCancel = null
    }
    this.isReplaying = false
    this.resetState()
    if (!this.model.trySpawnFood()) {
      this.model.endGame()
    }
    this.render()
  }

  /**
   * Apply new rules and restart the round (score reset, new snake/food).
   */
  applySettings(next: Settings) {
    this.settings = next
    this.model.setSettings(next)
    if (this.replayCancel) {
      this.replayCancel()
      this.replayCancel = null
    }
    this.isReplaying = false
    this.resetState()
    if (!this.model.trySpawnFood()) {
      this.model.endGame()
    }
    this.render()
  }

  destroy() {
    this.loop?.stop()
    this.loop = null
    if (this.replayCancel) this.replayCancel()
    if (this.onControls) {
      window.removeEventListener('keydown', this.onControls)
    }
    if (this.app) {
      const canvas = this.app.canvas as HTMLCanvasElement | undefined
      try {
        this.app.destroy(true, true)
      } finally {
        canvas?.remove()
      }
      this.app = null
    }
  }
}
