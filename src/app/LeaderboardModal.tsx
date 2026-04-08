import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import type { GameOverPayload } from '../game-engine/core/Game'
import type { LeaderboardEntry } from '../game-engine/storage/Leaderboard'
import { getLastPlayerName } from '../game-engine/storage/Leaderboard'

type Props = Readonly<{
  open: boolean
  onClose: () => void
  entries: LeaderboardEntry[]
  pendingGameOver: GameOverPayload | null
  onSaveName: (name: string) => void
  onSkipName: () => void
}>

function formatWhen(iso: string): string {
  try {
    const d = new Date(iso)
    return d.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

export function LeaderboardModal({
  open,
  onClose,
  entries,
  pendingGameOver,
  onSaveName,
  onSkipName,
}: Props) {
  const titleId = useId()

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!open) return null

  const nameForm = pendingGameOver && (
    <NameForm
      key={pendingGameOver.seq}
      score={pendingGameOver.score}
      onSave={onSaveName}
      onSkip={onSkipName}
    />
  )

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"
        aria-label="Close"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 flex max-h-[min(90dvh,640px)] w-full max-w-md flex-col gap-4 overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-900 p-6 shadow-xl"
      >
        <div className="flex items-start justify-between gap-3">
          <h2 id={titleId} className="text-lg font-semibold text-zinc-100">
            {pendingGameOver ? 'Game over' : 'Leaderboard'}
          </h2>
          <button
            type="button"
            className="rounded-lg px-2 py-1 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        {nameForm}

        {!pendingGameOver && (
          <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
            <p className="text-xs text-zinc-500">
              Up to 10 best scores for the current rules (from the panel). Stored in your browser.
            </p>
            {entries.length === 0 ? (
              <p className="text-sm text-zinc-500">No scores yet for these rules.</p>
            ) : (
              <ol className="space-y-2 text-sm">
                {entries.map((e, i) => (
                  <li
                    key={`${e.at}-${i}-${e.name}`}
                    className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-zinc-800/80 pb-2 last:border-0"
                  >
                    <span className="w-6 shrink-0 text-zinc-500">{i + 1}.</span>
                    <span className="min-w-0 flex-1 truncate font-medium text-zinc-200">{e.name}</span>
                    <span className="shrink-0 font-mono text-zinc-100">{e.score}</span>
                    <span className="shrink-0 text-[11px] text-zinc-500">{formatWhen(e.at)}</span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function NameForm({
  score,
  onSave,
  onSkip,
}: Readonly<{
  score: number
  onSave: (name: string) => void
  onSkip: () => void
}>) {
  const [name, setName] = useState(() => getLastPlayerName())
  const inputRef = useRef<HTMLInputElement>(null)

  useLayoutEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault()
        onSave(name)
      }}
    >
      <p className="text-sm text-zinc-400">
        Score: <span className="font-mono text-zinc-100">{score}</span>
      </p>
      <label className="flex flex-col gap-1.5 text-left text-sm text-zinc-300">
        Name
        <input
          ref={inputRef}
          type="text"
          autoComplete="nickname"
          maxLength={32}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 outline-none ring-zinc-500 focus:ring-2"
          placeholder="Your name"
        />
      </label>
      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
        >
          Save to leaderboard
        </button>
        <button
          type="button"
          className="rounded-lg border border-zinc-600 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
          onClick={onSkip}
        >
          Skip
        </button>
      </div>
    </form>
  )
}
