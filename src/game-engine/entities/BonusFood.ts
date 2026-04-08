import type { Food } from '../types'

export function isBonusFood(food: Food): boolean {
  return food.type === 'bonus'
}

export function bonusPoints(): number {
  return 2
}

export function normalPoints(): number {
  return 1
}
