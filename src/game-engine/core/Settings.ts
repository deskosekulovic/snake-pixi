import type { Settings } from '../types'

export function defaultSettings(): Settings {
  return {
    gridSize: 30,
    speed: 120,
    walls: false,
    bonusFoodChance: 0.2,
  }
}

export function settingsKey(settings: Settings): string {
  return `${settings.gridSize}-${settings.speed}-${settings.walls}-${settings.bonusFoodChance}`
}

export function mergeAndClampSettings(
  base: Settings,
  partial: Partial<Settings>,
): Settings {
  return {
    gridSize: (partial.gridSize ?? base.gridSize) as Settings['gridSize'],
    walls: partial.walls ?? base.walls,
    speed: Math.min(500, Math.max(40, Math.round(partial.speed ?? base.speed))),
    bonusFoodChance: Math.min(
      1,
      Math.max(0, partial.bonusFoodChance ?? base.bonusFoodChance),
    ),
  }
}
