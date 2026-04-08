import { Application, extend } from '@pixi/react'
import { Graphics as PixiGraphics } from 'pixi.js'

extend({ Graphics: PixiGraphics })

export function PixiStage() {
  return (
    <div className="aspect-square w-full max-w-[640px] overflow-hidden rounded-2xl border border-zinc-800 bg-black">
      <Application
        backgroundAlpha={0}
        antialias
        autoDensity
        resizeTo={undefined}
        width={640}
        height={640}
      >
        <pixiGraphics
          draw={(g: PixiGraphics) => {
            g.clear()
            g.rect(0, 0, 640, 640).fill(0x0a0a0a)
            g
              .rect(24, 24, 592, 592)
              .stroke({ color: 0x2a2a2a, width: 2, alignment: 0.5 })
            g.circle(320, 320, 6).fill(0x22c55e) // placeholder "food"
          }}
        />
      </Application>
    </div>
  )
}

