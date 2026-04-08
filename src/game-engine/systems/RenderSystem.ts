import { Graphics } from 'pixi.js'
import type { Food, Position, Settings } from '../types'

const VIEWPORT = 640

export function getViewport(): number {
  return VIEWPORT
}

function cellRect(gridX: number, gridY: number, gridSize: number) {
  const cell = VIEWPORT / gridSize
  const x0 = Math.floor(gridX * cell)
  const y0 = Math.floor(gridY * cell)
  const x1 = Math.floor((gridX + 1) * cell)
  const y1 = Math.floor((gridY + 1) * cell)
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 }
}

export function renderFrame(
  snakeGraphics: Graphics,
  foodGraphics: Graphics,
  snake: Position[],
  food: Food,
  settings: Settings,
) {
  const g = settings.gridSize

  snakeGraphics.clear()
  foodGraphics.clear()

  snakeGraphics.rect(0, 0, VIEWPORT, VIEWPORT).fill(0x0a0a0a)
  snakeGraphics
    .rect(0.5, 0.5, VIEWPORT - 1, VIEWPORT - 1)
    .stroke({ color: 0x2a2a2a, width: 1, alignment: 0.5 })

  snake.forEach((s, i) => {
    const { x, y, w, h } = cellRect(s.x, s.y, g)
    const color = i === 0 ? 0xfbbf24 : 0xf59e0b
    snakeGraphics.rect(x, y, w, h).fill(color)
  })

  const foodColor = food.type === 'bonus' ? 0x60a5fa : 0x22c55e
  const fr = cellRect(food.position.x, food.position.y, g)
  foodGraphics.rect(fr.x, fr.y, fr.w, fr.h).fill(foodColor)
}
