import confetti from 'canvas-confetti'

const DEFAULT_ORIGIN_Y = 0.7
const CANVAS_ID = 'upload-success-confetti-canvas'

const getFullscreenCanvas = () => {
  let canvas = document.getElementById(CANVAS_ID) as HTMLCanvasElement | null

  if (!canvas) {
    canvas = document.createElement('canvas')
    canvas.id = CANVAS_ID
    canvas.style.position = 'fixed'
    canvas.style.inset = '0'
    canvas.style.width = '100vw'
    canvas.style.height = '100vh'
    canvas.style.pointerEvents = 'none'
    canvas.style.zIndex = '9999'
    document.body.appendChild(canvas)
  }

  return canvas
}

// Keep the celebration short and lightweight so it feels responsive on mobile.
export const triggerUploadSuccessConfetti = () => {
  if (typeof window === 'undefined') return

  const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion) return

  const canvas = getFullscreenCanvas()
  const fullscreenConfetti = confetti.create(canvas, {
    resize: true,
    useWorker: true,
  })

  void fullscreenConfetti({
    particleCount: 200,
    spread: 100,
    startVelocity: 50,
    ticks: 220,
    colors: ['#3b82f6', '#2563eb', '#1d4ed8', '#1e40af', '#1e3a8a'],
    origin: { x: 0.5, y: 0.8 },
  })
}
