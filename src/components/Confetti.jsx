import { useEffect, useRef } from 'react'

const COLORS = ['#0C447C', '#FFD700', '#fb27e8', '#feb5d0', '#ffffff']

// Generate pieces once per mount so each burst looks different.
function makePieces() {
  return Array.from({ length: 60 }, (_, i) => {
    const startR = Math.random() * 360
    // Spin between 180° and 540°, randomly clockwise or counter-clockwise
    const spin = (Math.random() * 360 + 180) * (Math.random() < 0.5 ? 1 : -1)
    return {
      left: 2 + Math.random() * 96,           // 2–98% across viewport
      startR,
      endR: startR + spin,
      duration: 2.5 + Math.random() * 1.5,    // 2.5–4.0s
      delay: Math.random() * 1.0,             // 0–1.0s stagger
      color: COLORS[i % COLORS.length],
      // Alternate between portrait and landscape rectangles for variety
      wide: i % 4 === 0,
    }
  })
}

export default function Confetti({ onDone }) {
  // Stable for this mount; regenerated on next mount (new burst)
  const pieces = useRef(makePieces()).current

  useEffect(() => {
    // max delay (1s) + max duration (4s) + fade-out buffer (500ms)
    const t = setTimeout(onDone, 5500)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <>
      {pieces.map((p, i) => (
        <div
          key={i}
          style={{
            position: 'fixed',
            top: 0,
            left: `${p.left}%`,
            width: p.wide ? '10px' : '6px',
            height: p.wide ? '6px' : '12px',
            backgroundColor: p.color,
            borderRadius: '1px',
            pointerEvents: 'none',
            zIndex: 9999,
            willChange: 'transform, opacity',
            // CSS custom props consumed by the @keyframes in index.css
            '--r0': `${p.startR}deg`,
            '--r1': `${p.endR}deg`,
            animation: `confettiFall ${p.duration}s ease-in ${p.delay}s both`,
          }}
        />
      ))}
    </>
  )
}
