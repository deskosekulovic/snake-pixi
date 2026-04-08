import { useRef, useState } from 'react'
import { GameSettingsPanel } from './app/GameSettingsPanel'
import { GameWrapper, type GameHandle } from './app/GameWrapper'
import { defaultSettings } from './game-engine/core/Settings'
import type { Settings } from './game-engine/types'

function App() {
  const gameRef = useRef<GameHandle>(null)
  const [rules, setRules] = useState<Settings>(() => defaultSettings())

  const handleApplyRules = () => {
    gameRef.current?.applySettings(rules)
  }

  return (
    <div className="min-h-dvh bg-zinc-950 text-zinc-100">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-10">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">Snake</h1>
        </header>

        <main className="grid gap-6 lg:grid-cols-[1fr_minmax(280px,340px)] lg:items-start">
          <section className="flex flex-col items-start">
            <GameWrapper ref={gameRef} />
          </section>

          <aside className="flex flex-col gap-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 text-left">
            <GameSettingsPanel
              settings={rules}
              onSettingsChange={setRules}
              onApply={handleApplyRules}
            />
          </aside>
        </main>
      </div>
    </div>
  )
}

export default App
