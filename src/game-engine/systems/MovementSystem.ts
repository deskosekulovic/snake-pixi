import type { Direction, Position, Settings } from '../types'

export function isOppositeDirection(a: Direction, b: Direction): boolean {
  return (
    (a === 'UP' && b === 'DOWN') ||
    (a === 'DOWN' && b === 'UP') ||
    (a === 'LEFT' && b === 'RIGHT') ||
    (a === 'RIGHT' && b === 'LEFT')
  )
}

export function getNextHead(
  head: Position,
  direction: Direction,
  settings: Settings,
): Position {
  let x = head.x
  let y = head.y

  switch (direction) {
    case 'UP':
      y -= 1
      break
    case 'DOWN':
      y += 1
      break
    case 'LEFT':
      x -= 1
      break
    case 'RIGHT':
      x += 1
      break
  }

  if (!settings.walls) {
    const g = settings.gridSize
    return {
      x: (x + g) % g,
      y: (y + g) % g,
    }
  }

  return { x, y }
}
