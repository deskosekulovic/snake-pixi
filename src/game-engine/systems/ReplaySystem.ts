import type { Food, Position } from '../types'

export type Snapshot = {
  snake: Position[]
  food: Food
}

export class ReplaySystem {
  private history: Snapshot[] = []

  push(snake: Position[], food: Food) {
    this.history.push({
      snake: snake.map((p) => ({ ...p })),
      food: {
        position: { ...food.position },
        type: food.type,
      },
    })
  }

  clear() {
    this.history = []
  }

  get frames(): readonly Snapshot[] {
    return this.history
  }

  /**
   * Replays recorded frames. Returns a cancel function.
   */
  play(
    intervalMs: number,
    onFrame: (snap: Snapshot, index: number) => void,
    onComplete?: () => void,
  ): () => void {
    let i = 0
    const id = window.setInterval(() => {
      const frame = this.history[i]
      if (!frame) {
        window.clearInterval(id)
        onComplete?.()
        return
      }
      onFrame(frame, i)
      i++
    }, intervalMs)

    return () => window.clearInterval(id)
  }
}
