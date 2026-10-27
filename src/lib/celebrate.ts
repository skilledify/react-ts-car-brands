import confetti from 'canvas-confetti'

const palette = ['#00d2be', '#2ef2d6', '#c9d1d3', '#ffffff', '#ffd166', '#ff5ca8', '#8a5cff']

export function celebrate(big = true) {
  if (typeof window === 'undefined') return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  confetti({
    particleCount: big ? 140 : 55,
    spread: big ? 100 : 65,
    startVelocity: big ? 45 : 30,
    origin: { y: big ? 0.62 : 0.7 },
    colors: palette,
    ticks: 220,
    scalar: big ? 1.05 : 0.8,
    disableForReducedMotion: true,
  })

  if (!big) return

  window.setTimeout(() => {
    confetti({
      particleCount: 70,
      angle: 60,
      spread: 70,
      origin: { x: 0, y: 0.7 },
      colors: palette,
      disableForReducedMotion: true,
    })
    confetti({
      particleCount: 70,
      angle: 120,
      spread: 70,
      origin: { x: 1, y: 0.7 },
      colors: palette,
      disableForReducedMotion: true,
    })
  }, 180)
}
