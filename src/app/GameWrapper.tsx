import { useEffect, useImperativeHandle, useRef, useState } from 'react'
import type { Ref } from 'react'
import { Game } from '../game-engine/core/Game'
import { defaultSettings } from '../game-engine/core/Settings'
import type { Settings } from '../game-engine/types'

export type GameHandle = Readonly<{
  applySettings: (next: Settings) => void
}>

type GameWrapperProps = {
  ref?: Ref<GameHandle | null>
}

export function GameWrapper({ ref }: GameWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const gameRef = useRef<Game | null>(null)
  const [score, setScore] = useState(0)

  useImperativeHandle(ref, () => ({
    applySettings: (next: Settings) => {
      gameRef.current?.applySettings(next)
    },
  }))

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    let cancelled = false
    void Game.create(el, defaultSettings(), setScore).then((g) => {
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
  }, [])

  return (
    <div className="flex w-full max-w-[640px] flex-col gap-3">
      <div className="text-sm text-zinc-300">
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
