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
  confetti({
    particleCount: 140,
    spread: 90,
    colors: CONFETTI_COLORS,
    origin: { y: 0.25 },
    disableForReducedMotion: true,
  })
}

export default function App() {
  const [activeTab, setActiveTab] = useState('History')

  // Confetti on initial load
  useEffect(() => {
    const t = setTimeout(fireConfetti, 400)
    return () => clearTimeout(t)
  }, [])

  function handleTabChange(tab) {
    setActiveTab(tab)
    if (tab === 'Celebrate' || tab === 'Awards') {
      setTimeout(fireConfetti, 100)
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
