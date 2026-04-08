export class Loop {
  private rafId: number | null = null
  private lastTime = 0
  private update: (delta: number) => void

  constructor(update: (delta: number) => void) {
    this.update = update
  }

  start() {
    this.lastTime = performance.now()

    const tick = (time: number) => {
      const delta = time - this.lastTime
      this.lastTime = time

      this.update(delta)

      this.rafId = requestAnimationFrame(tick)
    }

    this.rafId = requestAnimationFrame(tick)
  }

  stop() {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId)
      this.rafId = null
    }
  }
}
