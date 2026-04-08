import type { Position } from '../types'

export class Snake {
  segments: Position[]

  constructor(segments: Position[]) {
    this.segments = segments
  }

  get head(): Position {
    return this.segments[0]
  }

  cloneSegments(): Position[] {
    return this.segments.map((s) => ({ ...s }))
  }
}
