import { GameSettingsPanel } from './app/GameSettingsPanel'
import { GameWrapper } from './app/GameWrapper'
import { LeaderboardModal } from './app/LeaderboardModal'
import { useSnakeApp } from './app/hooks/useSnakeApp'

function App() {
  const {
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
  } = useSnakeApp()

  return (
    <div className="min-h-dvh bg-zinc-950 text-zinc-100">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-10">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-semibold tracking-tight">Snake</h1>
          <button
            type="button"
            className="self-start rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
            onClick={openLeaderboardBrowse}
          >
            Leaderboard
          </button>
        </header>

        <main className="grid gap-6 lg:grid-cols-[1fr_minmax(280px,340px)] lg:items-start">
          <section className="flex flex-col items-start">
            <GameWrapper
              ref={gameRef}
              onGameOver={onGameOver}
              inputBlocked={leaderboardOpen}
            />
          </section>

          <aside className="mt-10 flex max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 text-left">
            <GameSettingsPanel
              settings={rules}
              onSettingsChange={setRules}
              onApply={applyRules}
            />
          </aside>
        </main>
      </div>

      <LeaderboardModal
        open={leaderboardOpen}
        onClose={closeLeaderboard}
        entries={topScores}
        pendingGameOver={pendingGameOver}
        onSaveName={onSaveName}
        onSkipName={onSkipName}
      />
    </div>
  )
}

export default App
