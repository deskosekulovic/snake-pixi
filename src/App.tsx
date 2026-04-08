import { PixiStage } from './pixi/PixiStage'

function App() {
  return (
    <div className="min-h-dvh bg-zinc-950 text-zinc-100">
      <div className="mx-auto flex max-w-4xl flex-col gap-6 px-6 py-10">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">Snake</h1>
          <p className="text-sm text-zinc-400">
            Vite + React + Tailwind + PixiJS (next).
          </p>
        </header>

        <main className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <section className="flex flex-col items-center gap-4">
            <PixiStage />
            <div className="text-xs text-zinc-500">
              Pixi placeholder render (sledeće: grid + snake + input).
            </div>
          </section>

          <aside className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 text-left">
            <div className="flex flex-col gap-3">
              <div className="text-sm font-medium text-zinc-200">Setup status</div>
              <ul className="space-y-2 text-sm text-zinc-300">
                <li>React + TS + Vite</li>
                <li>Tailwind v4 (Vite plugin)</li>
                <li>PixiJS + @pixi/react</li>
              </ul>
              <div className="pt-2 text-xs text-zinc-500">
                HMR check: edituj{' '}
                <code className="rounded bg-zinc-950/60 px-1.5 py-0.5">
                  src/App.tsx
                </code>
                .
              </div>
            </div>
          </aside>
        </main>
      </div>
    </div>
  )
}

export default App
