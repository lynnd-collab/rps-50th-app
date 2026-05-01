import { useState, useEffect, useCallback } from 'react'

const WORDS = [
  'GLOMS','EDEMA','LYMPH','LUPUS','MUCIN','CASTS','NODAL',
  'SCARS','HILUM','HILAR','CRESC','SPIKE','URINE','HILUS',
  'JONES','CHURG','RENAL','TOXIC','ACUTE','STENT','GRAFT',
  'SERUM','ORGAN','BLOOD','COLIC','RENIN','HENLE','BANFF',
  'DONOR','TACRO','TCELL','BCELL','KDIGO','CALYX','FABRY',
  'HIVAN','DENSE','FOCAL','LIGHT','CHAIN','CYSTS','ADPKD',
  'ADTKD','RECTA','BRUSH','SINUS','DENSA','STONE','LOOPS',
  'DUCTS',
]

const KEYBOARD_ROWS = [
  ['Q','W','E','R','T','Y','U','I','O','P'],
  ['A','S','D','F','G','H','J','K','L'],
  ['ENTER','Z','X','C','V','B','N','M','⌫'],
]

function getTodayKey() {
  return new Date().toISOString().slice(0, 10)
}

function getDailyWord() {
  const epoch = Math.floor(Date.now() / 86400000)
  return WORDS[epoch % WORDS.length]
}

function colorGuess(guess, target) {
  const result = Array(5).fill('gray')
  const used = Array(5).fill(false)
  for (let i = 0; i < 5; i++) {
    if (guess[i] === target[i]) { result[i] = 'green'; used[i] = true }
  }
  for (let i = 0; i < 5; i++) {
    if (result[i] === 'green') continue
    for (let j = 0; j < 5; j++) {
      if (!used[j] && guess[i] === target[j]) { result[i] = 'yellow'; used[j] = true; break }
    }
  }
  return result
}

function getKeyColors(guesses, target) {
  const priority = { green: 3, yellow: 2, gray: 1 }
  const colors = {}
  for (const guess of guesses) {
    const result = colorGuess(guess, target)
    guess.split('').forEach((letter, i) => {
      const next = result[i]
      if (!colors[letter] || priority[next] > priority[colors[letter]]) colors[letter] = next
    })
  }
  return colors
}

const SESSION_PREFIX = 'nephrowordle_'

function loadState() {
  try {
    const raw = sessionStorage.getItem(SESSION_PREFIX + getTodayKey())
    if (raw) return JSON.parse(raw)
  } catch {}
  return null
}

function saveState(state) {
  try { sessionStorage.setItem(SESSION_PREFIX + getTodayKey(), JSON.stringify(state)) } catch {}
}

const TILE_COLORS = {
  green:  { background: '#16a34a', borderColor: '#16a34a', color: '#fff' },
  yellow: { background: '#ca8a04', borderColor: '#ca8a04', color: '#fff' },
  gray:   { background: '#6b7280', borderColor: '#6b7280', color: '#fff' },
}

const KEY_COLORS = {
  green:  { background: '#16a34a', color: '#fff' },
  yellow: { background: '#ca8a04', color: '#fff' },
  gray:   { background: '#9ca3af', color: '#fff' },
  default:{ background: '#e5e7eb', color: '#111827' },
}

export default function NephroWordle() {
  const target = getDailyWord()
  const saved = loadState()

  const [guesses, setGuesses] = useState(saved?.guesses ?? [])
  const [current, setCurrent] = useState(saved?.current ?? '')
  const [status, setStatus] = useState(saved?.status ?? 'playing')
  const [message, setMessage] = useState('')
  const [shake, setShake] = useState(false)

  useEffect(() => { saveState({ guesses, current, status }) }, [guesses, current, status])

  useEffect(() => {
    if (!message) return
    const t = setTimeout(() => setMessage(''), 1800)
    return () => clearTimeout(t)
  }, [message])

  const flash = (msg) => {
    setMessage(msg)
    setShake(true)
    setTimeout(() => setShake(false), 400)
  }

  const submitGuess = useCallback(() => {
    if (current.length < 5) { flash('Not enough letters'); return }
    const newGuesses = [...guesses, current]
    setGuesses(newGuesses)
    setCurrent('')
    if (current === target) {
      setStatus('won')
    } else if (newGuesses.length >= 6) {
      setStatus('lost')
    }
  }, [current, guesses, target])

  const handleKey = useCallback((key) => {
    if (status !== 'playing') return
    if (key === 'ENTER') { submitGuess(); return }
    if (key === '⌫' || key === 'BACKSPACE') { setCurrent(g => g.slice(0, -1)); return }
    if (/^[A-Z]$/.test(key) && current.length < 5) setCurrent(g => g + key)
  }, [status, current.length, submitGuess])

  useEffect(() => {
    function onKey(e) {
      const k = e.key.toUpperCase()
      if (k === 'ENTER') handleKey('ENTER')
      else if (k === 'BACKSPACE') handleKey('⌫')
      else if (/^[A-Z]$/.test(k)) handleKey(k)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleKey])

  const keyColors = getKeyColors(guesses, target)

  function getTileLetter(row, col) {
    if (row < guesses.length) return guesses[row][col] ?? ''
    if (row === guesses.length && status === 'playing') return current[col] ?? ''
    return ''
  }

  function getTileStyle(row, col) {
    if (row < guesses.length) return TILE_COLORS[colorGuess(guesses[row], target)[col]]
    const letter = getTileLetter(row, col)
    return { borderColor: letter ? '#0C447C' : '#d1d5db', background: '#fff', color: '#111827' }
  }

  function getKeyStyle(key) {
    if (key === 'ENTER' || key === '⌫') return KEY_COLORS.default
    return KEY_COLORS[keyColors[key]] ?? KEY_COLORS.default
  }

  const activeRow = guesses.length

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-[#0C447C] px-4 py-3">
        <h2 className="text-white font-bold text-base leading-tight">NephroWordle</h2>
        <p className="text-white/60 text-xs mt-0.5">A new renal pathology word every day</p>
      </div>

      <div className="p-4 space-y-4">
        {/* Hint */}
        <p className="text-xs text-center text-gray-400 italic">Today's word is a renal pathology term</p>

        {/* Toast message */}
        <div className="h-6 flex items-center justify-center">
          {message && (
            <span className="bg-gray-800 text-white text-xs font-semibold px-3 py-1 rounded-lg">
              {message}
            </span>
          )}
        </div>

        {/* Grid */}
        <div className="flex flex-col items-center gap-1.5">
          {Array.from({ length: 6 }).map((_, row) => (
            <div
              key={row}
              className="flex gap-1.5"
              style={shake && row === activeRow ? { animation: 'shake 0.4s ease' } : {}}
            >
              {Array.from({ length: 5 }).map((_, col) => (
                <div
                  key={col}
                  className="w-11 h-11 border-2 flex items-center justify-center text-sm font-bold uppercase rounded transition-colors"
                  style={getTileStyle(row, col)}
                >
                  {getTileLetter(row, col)}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Status */}
        {status === 'won' && (
          <div className="text-center py-1 space-y-0.5">
            <p className="font-bold text-green-700">Correct! 🎉</p>
            <p className="text-xs text-gray-500">
              Solved in {guesses.length} {guesses.length === 1 ? 'attempt' : 'attempts'}
            </p>
          </div>
        )}
        {status === 'lost' && (
          <div className="text-center py-1 space-y-0.5">
            <p className="font-bold text-red-600">Better luck tomorrow!</p>
            <p className="text-xs text-gray-500">
              The word was <span className="font-bold text-[#0C447C]">{target}</span>
            </p>
          </div>
        )}

        {/* Keyboard */}
        <div className="space-y-1.5 pt-1">
          {KEYBOARD_ROWS.map((row, ri) => (
            <div key={ri} className="flex justify-center gap-1">
              {row.map((key) => (
                <button
                  key={key}
                  onPointerDown={(e) => { e.preventDefault(); handleKey(key) }}
                  className="h-10 rounded text-xs font-bold flex items-center justify-center select-none transition-colors active:opacity-70"
                  style={{
                    ...getKeyStyle(key),
                    minWidth: key === 'ENTER' ? '48px' : key === '⌫' ? '40px' : '30px',
                  }}
                >
                  {key}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%,100% { transform: translateX(0) }
          20%      { transform: translateX(-6px) }
          40%      { transform: translateX(6px) }
          60%      { transform: translateX(-4px) }
          80%      { transform: translateX(4px) }
        }
      `}</style>
    </div>
  )
}
