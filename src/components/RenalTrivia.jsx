import { useState, useEffect, useCallback } from 'react'

const QUESTIONS = [
  {
    // correct: A
    text: "In the early 1950s, Conrad Pirani's department chairman at the University of Illinois apologised for assigning him kidney biopsies. Why?",
    options: [
      { letter: 'A', text: 'He thought renal pathology had no future' },
      { letter: 'B', text: 'The specimens were too small to interpret' },
      { letter: 'C', text: 'Pirani had no experience with microscopy' },
      { letter: 'D', text: 'Kidney biopsies were considered too dangerous' },
    ],
    correct: 'A',
  },
  {
    // correct: D
    text: 'Robert Heptinstall began his medical career as what, before becoming a pathologist?',
    options: [
      { letter: 'A', text: 'A nephrologist' },
      { letter: 'B', text: 'A radiologist' },
      { letter: 'C', text: 'A general practitioner' },
      { letter: 'D', text: 'A surgeon' },
    ],
    correct: 'D',
  },
  {
    // correct: C
    text: 'The 1961 CIBA Symposium in London was famously fuelled by what?',
    options: [
      { letter: 'A', text: 'Late night debates over dinner' },
      { letter: 'B', text: 'A heated argument between Pirani and Heptinstall' },
      { letter: 'C', text: 'Midmorning sherry and afternoon tea' },
      { letter: 'D', text: 'A challenge from nephrologists to pathologists' },
    ],
    correct: 'C',
  },
  {
    // correct: B
    text: 'David Jones developed his famous methenamine silver stain, first published in 1953, at which institution?',
    options: [
      { letter: 'A', text: 'Johns Hopkins' },
      { letter: 'B', text: 'State University of New York at Buffalo' },
      { letter: 'C', text: 'Columbia University' },
      { letter: 'D', text: 'University of Chicago' },
    ],
    correct: 'B',
  },
  {
    // correct: A
    text: 'The first Banff Conference on Allograft Pathology was booked on which holiday?',
    options: [
      { letter: 'A', text: 'Easter Sunday' },
      { letter: 'B', text: 'Christmas Day' },
      { letter: 'C', text: "New Year's Day" },
      { letter: 'D', text: 'Thanksgiving' },
    ],
    correct: 'A',
  },
  {
    // correct: D
    text: 'Which renal pathologist served as President of the American Society of Nephrology?',
    options: [
      { letter: 'A', text: 'Conrad Pirani' },
      { letter: 'B', text: 'Jacob Churg' },
      { letter: 'C', text: 'Gloria Gallo' },
      { letter: 'D', text: 'Robert Heptinstall' },
    ],
    correct: 'D',
  },
  {
    // correct: C
    text: 'Marcello Malpighi first described the microanatomy of the renal glomerulus in which century?',
    hideLetters: true,
    options: [
      { letter: 'A', text: '15th century' },
      { letter: 'B', text: '16th century' },
      { letter: 'C', text: '17th century' },
      { letter: 'D', text: '18th century' },
    ],
    correct: 'C',
  },
  {
    // correct: C
    text: 'The ISN/RPS classification of lupus nephritis published in 2004 was based on an original WHO classification from which year?',
    hideLetters: true,
    options: [
      { letter: 'A', text: '1966' },
      { letter: 'B', text: '1970' },
      { letter: 'C', text: '1974' },
      { letter: 'D', text: '1982' },
    ],
    correct: 'C',
  },
  {
    // correct: D
    text: "Who coined the term 'nephrology' and when?",
    options: [
      { letter: 'A', text: 'Richard Bright, 1827' },
      { letter: 'B', text: 'Conrad Pirani, 1951' },
      { letter: 'C', text: 'Robert Heptinstall, 1966' },
      { letter: 'D', text: 'Jean Hamburger, 1960' },
    ],
    correct: 'D',
  },
  {
    // correct: A
    text: 'The Lancet initially rejected a landmark 1957 paper by Pirani and colleagues. What was the editors\' objection?',
    options: [
      { letter: 'A', text: 'Too few glomeruli were studied by electron microscopy' },
      { letter: 'B', text: 'The patients were too young' },
      { letter: 'C', text: 'The diagnosis was considered incorrect' },
      { letter: 'D', text: 'The paper was too long' },
    ],
    correct: 'A',
  },
  {
    // correct: B
    text: 'Renée Habib received the Légion d\'Honneur from the President of France. She also received which award from the ASN in 1989?',
    options: [
      { letter: 'A', text: 'The Heptinstall Award' },
      { letter: 'B', text: 'The John Peters Award' },
      { letter: 'C', text: 'The Churg Award' },
      { letter: 'D', text: 'The Young Investigator Award' },
    ],
    correct: 'B',
  },
  {
    // correct: C
    text: 'The prone position for kidney biopsy, introduced in 1954, was pioneered by whom?',
    options: [
      { letter: 'A', text: 'Iversen and Brun' },
      { letter: 'B', text: 'Pirani and Pollak' },
      { letter: 'C', text: 'Kark and Muehrcke' },
      { letter: 'D', text: 'Churg and Grishman' },
    ],
    correct: 'C',
  },
  {
    // correct: D
    text: "Jean Hamburger's famous 1975 quote described the history of nephrology as 'The Decline and Fall of Bright's Disease and the Birth of Individual Renal Diseases from its Ashes.' Where did he deliver it?",
    options: [
      { letter: 'A', text: 'The first ISN Congress, Evian' },
      { letter: 'B', text: 'The CIBA Symposium, London' },
      { letter: 'C', text: 'The first Banff Conference, Alberta' },
      { letter: 'D', text: 'The 6th ISN Congress, Florence' },
    ],
    correct: 'D',
  },
  {
    // correct: C
    text: "'Glomerulus' comes from the Latin glomus meaning what?",
    options: [
      { letter: 'A', text: 'Little filter' },
      { letter: 'B', text: 'Tiny grape' },
      { letter: 'C', text: 'Ball of yarn' },
      { letter: 'D', text: 'Small vessel' },
    ],
    correct: 'C',
  },
  {
    // correct: A
    text: "'Podocyte' comes from the Greek πούς/ποδός (pous/podos) meaning what?",
    options: [
      { letter: 'A', text: 'Foot' },
      { letter: 'B', text: 'Filter' },
      { letter: 'C', text: 'Star' },
      { letter: 'D', text: 'Branch' },
    ],
    correct: 'A',
  },
  {
    // correct: B
    text: "The renal 'cortex' comes from the Latin meaning what?",
    options: [
      { letter: 'A', text: 'Filter' },
      { letter: 'B', text: 'Bark or rind' },
      { letter: 'C', text: 'Outer layer' },
      { letter: 'D', text: 'Crown' },
    ],
    correct: 'B',
  },
  {
    // correct: D
    text: 'In which year did the Renal Pathology Society have its first all-female Board of Directors?',
    hideLetters: true,
    options: [
      { letter: 'A', text: '2005' },
      { letter: 'B', text: '2018' },
      { letter: 'C', text: '2020' },
      { letter: 'D', text: '2025' },
    ],
    correct: 'D',
  },
  {
    // correct: C
    text: 'Robert Heptinstall wrote the first edition of his landmark textbook every evening until well past midnight. Where did he do this writing?',
    options: [
      { letter: 'A', text: 'In his office at Johns Hopkins' },
      { letter: 'B', text: 'During sabbatical in England' },
      { letter: 'C', text: 'In an attic room at home' },
      { letter: 'D', text: 'In the hospital library' },
    ],
    correct: 'C',
  },
  {
    // correct: D
    text: "'Nephritis' combines νεφρός (nephros) with the Greek suffix -ῖτις (-itis) meaning what?",
    options: [
      { letter: 'A', text: 'Disease' },
      { letter: 'B', text: 'Destruction' },
      { letter: 'C', text: 'Enlargement' },
      { letter: 'D', text: 'Inflammation' },
    ],
    correct: 'D',
  },
  {
    // correct: C
    text: 'The stain eosin gets its name from the Greek word for what?',
    options: [
      { letter: 'A', text: 'Red' },
      { letter: 'B', text: 'Pink' },
      { letter: 'C', text: 'Dawn' },
      { letter: 'D', text: 'Light' },
    ],
    correct: 'C',
  },
]

const SESSION_KEY = 'renaltrivia_state'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function loadSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (raw) {
      const saved = JSON.parse(raw)
      if (saved.deck?.length === QUESTIONS.length) return saved
      sessionStorage.removeItem(SESSION_KEY)
    }
  } catch {}
  return null
}

function saveSession(state) {
  try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(state)) } catch {}
}

function clearSession() {
  try { sessionStorage.removeItem(SESSION_KEY) } catch {}
}

export default function RenalTrivia() {
  const [deck, setDeck] = useState(() => loadSession()?.deck ?? shuffle(QUESTIONS))
  const [qIndex, setQIndex] = useState(() => loadSession()?.qIndex ?? 0)
  const [selected, setSelected] = useState(() => loadSession()?.selected ?? null)

  const question = deck[qIndex]
  const answered = selected !== null
  const isCorrect = selected === question.correct

  useEffect(() => {
    saveSession({ deck, qIndex, selected })
  }, [deck, qIndex, selected])

  const nextQuestion = useCallback(() => {
    const next = qIndex + 1
    if (next >= deck.length) {
      clearSession()
      setDeck(shuffle(QUESTIONS))
      setQIndex(0)
    } else {
      setQIndex(next)
    }
    setSelected(null)
  }, [qIndex, deck.length])

  function optionStyle(letter) {
    if (!answered) return {}
    if (letter === question.correct) return { borderColor: '#16a34a', backgroundColor: '#f0fdf4' }
    if (letter === selected) return { borderColor: '#dc2626', backgroundColor: '#fef2f2' }
    return {}
  }

  function optionTextColor(letter) {
    if (!answered) return 'text-gray-700'
    if (letter === question.correct) return 'text-green-700 font-semibold'
    if (letter === selected) return 'text-red-600'
    return 'text-gray-400'
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-[#0C447C] px-4 py-3">
        <h2 className="text-white font-bold text-base leading-tight">Renal Path Trivia</h2>
        <p className="text-white/60 text-xs mt-0.5">Test your knowledge of renal pathology history and trivia</p>
      </div>

      <div className="p-4 space-y-3">
        {/* Question */}
        <p className="text-sm font-semibold text-gray-800 leading-relaxed">{question.text}</p>

        {/* Options */}
        <div className="space-y-2">
          {question.options.map(({ letter, text }) => (
            <button
              key={letter}
              disabled={answered}
              onClick={() => setSelected(letter)}
              className={`w-full text-left flex items-center gap-2.5 px-3 py-2.5 rounded-lg border-2 transition-colors disabled:cursor-default ${question.hideLetters ? 'justify-center' : ''}`}
              style={answered
                ? { ...optionStyle(letter), borderColor: optionStyle(letter).borderColor ?? '#e5e7eb' }
                : { borderColor: '#e5e7eb' }
              }
            >
              {!question.hideLetters && (
                <span
                  className="flex-shrink-0 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center"
                  style={{ background: answered && letter === question.correct ? '#16a34a' : answered && letter === selected ? '#dc2626' : '#fb27e8', color: '#fff' }}
                >
                  {letter}
                </span>
              )}
              <span className={`text-sm leading-snug ${optionTextColor(letter)}`}>{text}</span>
            </button>
          ))}
        </div>

        {/* Feedback */}
        {answered && (
          <p className={`text-sm font-semibold ${isCorrect ? 'text-green-700' : 'text-red-600'}`}>
            {isCorrect ? 'Correct!' : `Not quite — the answer is ${question.options.find(o => o.letter === question.correct)?.text ?? question.correct}.`}
          </p>
        )}

        {/* Next button */}
        {answered && (
          <button
            onClick={nextQuestion}
            className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-colors"
            style={{ background: '#0C447C' }}
          >
            Next question →
          </button>
        )}

        {/* Progress */}
        <p className="text-center text-[11px] text-gray-400">
          {qIndex + 1} of {deck.length}
        </p>
      </div>
    </div>
  )
}
