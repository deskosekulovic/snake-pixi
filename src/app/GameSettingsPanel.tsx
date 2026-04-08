import type { Settings } from '../game-engine/types'
import { mergeAndClampSettings } from '../game-engine/core/Settings'

type Props = Readonly<{
  settings: Settings
  onSettingsChange: (next: Settings) => void
  onApply: () => void
}>

const GRID_OPTIONS: Settings['gridSize'][] = [20, 30, 40]

export function GameSettingsPanel({ settings, onSettingsChange, onApply }: Props) {
  const patch = (partial: Partial<Settings>) => {
    onSettingsChange(mergeAndClampSettings(settings, partial))
  }

  return (
    <div className="flex flex-col gap-4 text-left">
      <div className="text-sm font-medium text-zinc-200">Rules</div>

      <label className="flex flex-col gap-1 text-xs text-zinc-400">
        Grid size
        <select
          className="rounded border border-zinc-700 bg-zinc-950 px-2 py-1.5 text-sm text-zinc-100"
          value={settings.gridSize}
          onChange={(e) =>
            patch({ gridSize: Number(e.target.value) as Settings['gridSize'] })
          }
        >
          {GRID_OPTIONS.map((n) => (
            <option key={n} value={n}>
              {n} × {n}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-xs text-zinc-400">
        Speed (ms per move — lower = faster)
        <input
          type="range"
          min={40}
          max={500}
          step={10}
          value={settings.speed}
          onChange={(e) => patch({ speed: Number(e.target.value) })}
          className="w-full accent-violet-500"
        />
        <span className="font-mono text-zinc-300">{settings.speed} ms</span>
      </label>

      <label className="flex cursor-pointer items-center gap-2 text-xs text-zinc-300">
        <input
          type="checkbox"
          checked={settings.walls}
          onChange={(e) => patch({ walls: e.target.checked })}
          className="rounded border-zinc-600"
        />
        Solid walls (no wrap)
      </label>

      <label className="flex flex-col gap-1 text-xs text-zinc-400">
        Bonus food chance
        <input
          type="range"
          min={0}
          max={100}
          step={5}
          value={Math.round(settings.bonusFoodChance * 100)}
          onChange={(e) => patch({ bonusFoodChance: Number(e.target.value) / 100 })}
          className="w-full accent-violet-500"
        />
        <span className="font-mono text-zinc-300">
          {Math.round(settings.bonusFoodChance * 100)}%
        </span>
      </label>

      <button
        type="button"
        onClick={onApply}
        className="rounded-lg bg-violet-600 px-3 py-2 text-sm font-medium text-white hover:bg-violet-500"
      >
        Apply rules & restart
      </button>

      <p className="text-[11px] leading-relaxed text-zinc-500">
        Changing rules resets the snake, score, and replay buffer for the current session.
      </p>
    </div>
  )
}
