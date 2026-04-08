import { settingsKey } from '../core/Settings'
import type { Settings } from '../types'
import { getItem, setItem } from './LocalStorage'

export type LeaderboardEntry = {
  score: number
  at: string
  name: string
}

const MAX_ENTRIES = 10

const LAST_NAME_KEY = 'snake-last-player-name'

function storageKey(settings: Settings): string {
  return `snake-leaderboard-${settingsKey(settings)}`
}

function normalizeEntry(raw: unknown): LeaderboardEntry | null {
  if (!raw || typeof raw !== 'object') return null
  const o = raw as Record<string, unknown>
  const score = typeof o.score === 'number' ? o.score : Number(o.score)
  const at = typeof o.at === 'string' ? o.at : new Date().toISOString()
  const name =
    typeof o.name === 'string' && o.name.trim() !== ''
      ? o.name.trim()
      : '—'
  if (!Number.isFinite(score)) return null
  return { score, at, name }
}

export function loadLeaderboard(settings: Settings): LeaderboardEntry[] {
  const raw = getItem(storageKey(settings))
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed
      .map((e) => normalizeEntry(e))
      .filter((e): e is LeaderboardEntry => e !== null)
  } catch {
    return []
  }
}

export function saveScore(
  settings: Settings,
  score: number,
  name: string,
): LeaderboardEntry[] {
  const trimmed = name.trim()
  const entryName = trimmed === '' ? '—' : trimmed
  const entries = [
    ...loadLeaderboard(settings),
    {
      score,
      at: new Date().toISOString(),
      name: entryName,
    },
  ]
  entries.sort((a, b) => b.score - a.score)
  const top = entries.slice(0, MAX_ENTRIES)
  setItem(storageKey(settings), JSON.stringify(top))
  if (trimmed !== '') {
    setItem(LAST_NAME_KEY, trimmed)
  }
  return top
}

export function getLastPlayerName(): string {
  try {
    const v = getItem(LAST_NAME_KEY)
    return typeof v === 'string' ? v : ''
  } catch {
    return ''
  }
}
