import { useState, useEffect, useCallback } from 'react'
import Header from './components/Header'
import TabBar from './components/TabBar'
import Confetti from './components/Confetti'
import History from './tabs/History'
import Celebrate from './tabs/Celebrate'
import Awards from './tabs/Awards'
import Quiz from './tabs/Quiz'
import About from './tabs/About'

export default function App() {
  const [activeTab, setActiveTab] = useState('History')
  // Incrementing key mounts a fresh Confetti instance (new burst).
  // null = no confetti rendered.
  const [confettiKey, setConfettiKey] = useState(null)

  const triggerConfetti = useCallback(() => {
    setConfettiKey(Date.now())
  }, [])

  // Confetti on initial load — 500ms lets the browser finish first paint.
  useEffect(() => {
    const t = setTimeout(triggerConfetti, 500)
    return () => clearTimeout(t)
  }, [triggerConfetti])

  function handleTabChange(tab) {
    setActiveTab(tab)
    if (tab === 'Celebrate' || tab === 'Awards' || tab === 'History' || tab === 'Quizzes' || tab === 'About') {
      setTimeout(triggerConfetti, 500)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {confettiKey && (
        <Confetti key={confettiKey} onDone={() => setConfettiKey(null)} />
      )}
      <Header />
      <TabBar active={activeTab} onChange={handleTabChange} />
      <main key={activeTab} className="flex-1 pb-8 animate-fade-up">
        {activeTab === 'History' && <History />}
        {activeTab === 'Celebrate' && <Celebrate />}
        {activeTab === 'Awards' && <Awards />}
        {activeTab === 'Quizzes' && <Quiz />}
        {activeTab === 'About' && <About />}
      </main>
    </div>
  )
}
