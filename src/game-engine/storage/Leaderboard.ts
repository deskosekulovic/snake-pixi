import { settingsKey } from '../core/Settings'
import type { Settings } from '../types'
import { getItem, setItem } from './LocalStorage'

export type LeaderboardEntry = {
  score: number
  at: string
}

const MAX_ENTRIES = 10

function storageKey(settings: Settings): string {
  return `snake-leaderboard-${settingsKey(settings)}`
}

export function loadLeaderboard(settings: Settings): LeaderboardEntry[] {
  const raw = getItem(storageKey(settings))
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as LeaderboardEntry[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveScore(settings: Settings, score: number): LeaderboardEntry[] {
  const entries = [...loadLeaderboard(settings), { score, at: new Date().toISOString() }]
  entries.sort((a, b) => b.score - a.score)
  const top = entries.slice(0, MAX_ENTRIES)
  setItem(storageKey(settings), JSON.stringify(top))
  return top
}
