import { useState, useEffect } from 'react'
import confetti from 'canvas-confetti'
import Header from './components/Header'
import TabBar from './components/TabBar'
import History from './tabs/History'
import Celebrate from './tabs/Celebrate'
import Awards from './tabs/Awards'
import About from './tabs/About'

const CONFETTI_COLORS = ['#0C447C', '#FFD700', '#fb27e8', '#feb5d0']

function fireConfetti() {
  // Create our own canvas so we control sizing for mobile viewports.
  // Using position:fixed ensures it covers the full visual viewport on iOS
  // even when the address bar is partially visible.
  const canvas = document.createElement('canvas')
  Object.assign(canvas.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: '9999',
  })
  document.body.appendChild(canvas)

  // Manually size the canvas backing store to match the device pixel ratio
  // so particles are sharp on retina / high-DPI mobile screens.
  const dpr = window.devicePixelRatio || 1
  canvas.width = Math.floor(window.innerWidth * dpr)
  canvas.height = Math.floor(window.innerHeight * dpr)

  // useWorker:false avoids the OffscreenCanvas path that breaks on iOS Safari.
  // resize:false because we already sized the canvas correctly above.
  const shoot = confetti.create(canvas, { resize: false, useWorker: false })

  shoot({
    particleCount: 140,
    spread: 90,
    colors: CONFETTI_COLORS,
    origin: { y: 0.25 },
    disableForReducedMotion: true,
  }).then(() => canvas.remove())
}

export default function App() {
  const [activeTab, setActiveTab] = useState('History')

  // Confetti on initial load — 500ms gives the browser time to finish
  // layout and paint before we fire, which matters on slower mobile devices.
  useEffect(() => {
    const t = setTimeout(fireConfetti, 500)
    return () => clearTimeout(t)
  }, [])

  function handleTabChange(tab) {
    setActiveTab(tab)
    if (tab === 'Celebrate' || tab === 'Awards') {
      setTimeout(fireConfetti, 500)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <TabBar active={activeTab} onChange={handleTabChange} />
      <main key={activeTab} className="flex-1 pb-8 animate-fade-up">
        {activeTab === 'History' && <History />}
        {activeTab === 'Celebrate' && <Celebrate />}
        {activeTab === 'Awards' && <Awards />}
        {activeTab === 'About' && <About />}
      </main>
    </div>
  )
}
