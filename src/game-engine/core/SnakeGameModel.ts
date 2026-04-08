import { bonusPoints, isBonusFood, normalPoints } from '../entities/BonusFood'
import { spawnFoodRandom } from '../entities/Food'
import { Snake } from '../entities/Snake'
import { hitsFood, hitsSelf, hitsWall } from '../systems/CollisionSystem'
import { getNextHead, isOppositeDirection } from '../systems/MovementSystem'
import type { Direction, Food, Position, Settings } from '../types'

export type TickOutcome =
  | { kind: 'continue' }
  | { kind: 'game_over' }
  | { kind: 'win_full_board' }

/**
 * Pure game rules (no Pixi, no DOM).
 */
export class SnakeGameModel {
  private settings: Settings
  private snake: Snake
  private food!: Food
  private direction: Direction = 'RIGHT'
  private directionQueue: Direction[] = []
  private score = 0
  private isGameOver = false

  private onScoreChange?: (score: number) => void

  constructor(settings: Settings, onScoreChange?: (score: number) => void) {
    this.settings = settings
    this.onScoreChange = onScoreChange
    const mid = Math.floor(settings.gridSize / 2)
    this.snake = new Snake([{ x: mid, y: mid }])
  }

  setSettings(next: Settings) {
    this.settings = next
  }

  getSegments(): Position[] {
    return this.snake.segments
  }

  getFood(): Food {
    return this.food
  }

  getScore(): number {
    return this.score
  }

  get gameOver(): boolean {
    return this.isGameOver
  }

  /** When food cannot spawn (e.g. after restart on tiny pathological grid). */
  endGame(): void {
    this.isGameOver = true
  }

  reset(): void {
    const mid = Math.floor(this.settings.gridSize / 2)
    this.snake = new Snake([{ x: mid, y: mid }])
    this.direction = 'RIGHT'
    this.directionQueue = []
    this.isGameOver = false
    this.score = 0
    this.onScoreChange?.(0)
  }

  /**
   * @returns false if there is no free cell (board full).
   */
  trySpawnFood(): boolean {
    const next = spawnFoodRandom(
      this.settings,
      this.snake.segments,
      this.settings.bonusFoodChance,
    )
    if (!next) return false
    this.food = next
    return true
  }

  enqueueDirection(dir: Direction): void {
    const last =
      this.directionQueue.length > 0
        ? this.directionQueue[this.directionQueue.length - 1]!
        : this.direction
    if (dir === last) return
    if (isOppositeDirection(dir, last)) return

    if (this.directionQueue.length >= 2) {
      this.directionQueue.pop()
    }
    this.directionQueue.push(dir)
  }

  /**
   * One simulation step (one snake move).
   */
  tick(): TickOutcome {
    if (this.directionQueue.length > 0) {
      const next = this.directionQueue.shift()!
      if (!isOppositeDirection(next, this.direction)) {
        this.direction = next
      }
    }

    const newHead = getNextHead(this.snake.head, this.direction, this.settings)

    if (hitsWall(newHead, this.settings)) {
      this.isGameOver = true
      return { kind: 'game_over' }
    }

    if (hitsSelf(this.snake.segments, newHead)) {
      this.isGameOver = true
      return { kind: 'game_over' }
    }

    const nextSnake: Position[] = [newHead, ...this.snake.segments]

    let ate = false
    if (hitsFood(this.food, newHead)) {
      ate = true
      const pts = isBonusFood(this.food) ? bonusPoints() : normalPoints()
      this.score += pts
      this.onScoreChange?.(this.score)
    }

    if (!ate) {
      nextSnake.pop()
    }

    this.snake = new Snake(nextSnake)

    if (ate) {
      if (!this.trySpawnFood()) {
        this.isGameOver = true
        return { kind: 'win_full_board' }
      }
    }

    return { kind: 'continue' }
  }

  /** Restore state for replay (no validation). */
  applySnapshot(snake: Position[], food: Food): void {
    this.snake = new Snake(snake.map((p) => ({ ...p })))
    this.food = {
      position: { ...food.position },
      type: food.type,
    }
  }
}
