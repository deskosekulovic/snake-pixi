import { useCallback, useRef, useState } from 'react'
import type { GameHandle } from '../GameWrapper'
import type { GameOverPayload } from '../../game-engine/core/Game'
import { defaultSettings } from '../../game-engine/core/Settings'
import type { Settings } from '../../game-engine/types'
import { useLeaderboardForRules } from './useLeaderboardForRules'

export function useSnakeApp() {
  const gameRef = useRef<GameHandle>(null)
  const [rules, setRules] = useState<Settings>(() => defaultSettings())
  const { topScores, saveScoreForSettings } = useLeaderboardForRules(rules)

  const [leaderboardOpen, setLeaderboardOpen] = useState(false)
  const [pendingGameOver, setPendingGameOver] = useState<GameOverPayload | null>(null)

  const applyRules = useCallback(() => {
    gameRef.current?.applySettings(rules)
  }, [rules])

  const onGameOver = useCallback((payload: GameOverPayload) => {
    setPendingGameOver(payload)
    setLeaderboardOpen(true)
  }, [])

  const onSaveName = useCallback(
    (name: string) => {
      if (!pendingGameOver) return
      saveScoreForSettings(pendingGameOver.settings, pendingGameOver.score, name)
      setPendingGameOver(null)
    },
    [pendingGameOver, saveScoreForSettings],
  )

  const onSkipName = useCallback(() => {
    setPendingGameOver(null)
  }, [])

  const closeLeaderboard = useCallback(() => {
    setLeaderboardOpen(false)
    setPendingGameOver(null)
  }, [])

  const openLeaderboardBrowse = useCallback(() => {
    setPendingGameOver(null)
    setLeaderboardOpen(true)
  }, [])

  return {
    gameRef,
    rules,
    setRules,
    applyRules,
    topScores,
    leaderboardOpen,
    pendingGameOver,
    onGameOver,
    onSaveName,
    onSkipName,
    closeLeaderboard,
    openLeaderboardBrowse,
  }
}
