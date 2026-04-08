import { useCallback, useEffect, useState } from 'react'
import type { LeaderboardEntry } from '../../game-engine/storage/Leaderboard'
import { loadLeaderboard, saveScore } from '../../game-engine/storage/Leaderboard'
import type { Settings } from '../../game-engine/types'

/**
 * Leaderboard rows for the given rules; reloads from storage when `rules` changes.
 */
export function useLeaderboardForRules(rules: Settings) {
  const [topScores, setTopScores] = useState<LeaderboardEntry[]>(() =>
    loadLeaderboard(rules),
  )

  useEffect(() => {
    setTopScores(loadLeaderboard(rules))
  }, [rules])

  const saveScoreForSettings = useCallback(
    (settings: Settings, score: number, name: string) => {
      setTopScores(saveScore(settings, score, name))
    },
    [],
  )

  return { topScores, saveScoreForSettings }
}
