export type Position = { x: number; y: number }

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'

export type FoodType = 'normal' | 'bonus'

export type Food = {
  position: Position
  type: FoodType
}

export type Settings = {
  gridSize: 20 | 30 | 40
  /** Milliseconds between snake moves (lower = faster). */
  speed: number
  walls: boolean
  /** Chance (0–1) that bonus food spawns after eating normal food. */
  bonusFoodChance: number
}
