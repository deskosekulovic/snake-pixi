import type { Food, FoodType, Position, Settings } from '../types'

export function createFood(position: Position, type: FoodType): Food {
  return { position: { ...position }, type }
}

/**
 * @returns New food, or `null` if the board has no free cell (snake fills grid — win / end).
 */
export function spawnFoodRandom(
  settings: Settings,
  snake: Position[],
  bonusChance: number,
): Food | null {
  const size = settings.gridSize
  const occupied = new Set(snake.map((p) => `${p.x},${p.y}`))
  const free: Position[] = []
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (!occupied.has(`${x},${y}`)) free.push({ x, y })
    }
  }
  if (free.length === 0) {
    return null
  }
  const pick = free[Math.floor(Math.random() * free.length)]!
  const type = Math.random() < bonusChance ? 'bonus' : 'normal'
  return createFood(pick, type)
}
