import { useEffect, useImperativeHandle, useRef, useState } from 'react'
import type { Ref } from 'react'
import { Game, type GameOverPayload } from '../game-engine/core/Game'
import { defaultSettings } from '../game-engine/core/Settings'
import type { Settings } from '../game-engine/types'

export type GameHandle = Readonly<{
  applySettings: (next: Settings) => void
}>

type GameWrapperProps = {
  ref?: Ref<GameHandle | null>
  onGameOver?: (payload: GameOverPayload) => void
  /** When true, keyboard shortcuts do not affect the game (e.g. leaderboard modal open). */
  inputBlocked?: boolean
}

export function GameWrapper({ ref, onGameOver, inputBlocked = false }: GameWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const gameRef = useRef<Game | null>(null)
  const inputBlockedRef = useRef(inputBlocked)
  const [score, setScore] = useState(0)

  useEffect(() => {
    inputBlockedRef.current = inputBlocked
  }, [inputBlocked])

  useImperativeHandle(ref, () => ({
    applySettings: (next: Settings) => {
      gameRef.current?.applySettings(next)
    },
  }))

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    let cancelled = false
    void Game.create(el, defaultSettings(), {
      onScoreChange: setScore,
      onGameOver,
      getInputBlocked: () => inputBlockedRef.current,
    }).then((g) => {
      if (cancelled) {
        g.destroy()
        return
      }
      gameRef.current = g
    })

    return () => {
      cancelled = true
      const g = gameRef.current
      gameRef.current = null
      g?.destroy()
    }
  }, [onGameOver])

  return (
    <div className="flex w-full max-w-[640px] flex-col gap-3">
      <div className="text-xl text-zinc-300">
        Score: <span className="font-mono text-zinc-100">{score}</span>
      </div>
      <div
        ref={containerRef}
        className="aspect-square w-full border border-zinc-800 bg-black"
      />
      <p className="text-xs text-zinc-500">
        Enter restart · Arrows · R replay (after moves)
      </p>
    </div>
  )
}
