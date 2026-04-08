import type { Food, Position, Settings } from '../types'

export function isOutOfBounds(pos: Position, gridSize: number): boolean {
  return pos.x < 0 || pos.y < 0 || pos.x >= gridSize || pos.y >= gridSize
}

/** Body without tail — avoids false positive when tail vacates a cell. */
export function hitsSelf(snake: Position[], newHead: Position): boolean {
  return snake.slice(0, -1).some((s) => s.x === newHead.x && s.y === newHead.y)
}

export function hitsFood(food: Food, pos: Position): boolean {
  return pos.x === food.position.x && pos.y === food.position.y
}

export function hitsWall(pos: Position, settings: Settings): boolean {
  if (!settings.walls) return false
  return isOutOfBounds(pos, settings.gridSize)
}
