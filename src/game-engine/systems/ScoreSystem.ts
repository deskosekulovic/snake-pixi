export class ScoreSystem {
  private score = 0
  private onChange?: (score: number) => void

  constructor(onChange?: (score: number) => void) {
    this.onChange = onChange
  }

  add(points: number) {
    this.score += points
    this.onChange?.(this.score)
  }

  reset() {
    this.score = 0
    this.onChange?.(this.score)
  }

  get value(): number {
    return this.score
  }
}
