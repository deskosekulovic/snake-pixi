export class Input {
  private keys = new Set<string>()

  private onKeyDown = (e: KeyboardEvent) => {
    this.keys.add(e.key)
  }

  private onKeyUp = (e: KeyboardEvent) => {
    this.keys.delete(e.key)
  }

  constructor() {
    window.addEventListener('keydown', this.onKeyDown)
    window.addEventListener('keyup', this.onKeyUp)
  }

  isPressed(key: string) {
    return this.keys.has(key)
  }

  destroy() {
    window.removeEventListener('keydown', this.onKeyDown)
    window.removeEventListener('keyup', this.onKeyUp)
    this.keys.clear()
  }
}
