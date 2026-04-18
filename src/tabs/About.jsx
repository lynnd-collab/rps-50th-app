import { useState, useEffect, useRef } from 'react'
import { foundingMembers, presidents } from '../data'

const QUOTES = [
  {
    quote: 'We would make a plea that so far as any conclusions are drawn as to the mechanism of human disease, the evidence derived from man should at least be considered.',
    attribution: 'George W. Pickering & Robert H. Heptinstall',
    context: 'Unofficial motto of the Renal Pathology Society',
  },
  {
    quote: 'It is more important to know what the kidney does than what it looks like.',
    attribution: 'Thomas Addis & Jean Oliver, 1931',
    context: 'The prevailing view that renal pathologists of the 1950s set out to change.',
  },
  {
    quote: 'The history of nephrology of the last 25 years could be entitled \u2018The Decline and Fall of Bright\u2019s Disease and the Birth of Individual Renal Diseases from its Ashes.\u2019',
    attribution: 'Jean Hamburger, 6th ISN Congress, Florence, 1975',
    context: null,
  },
  {
    quote: 'The stimulating effects of a midmorning glass of sherry and a leisurely afternoon cup of tea fostered a lively exchange of ideas.',
    attribution: 'Conrad Pirani, on the 1961 CIBA Symposium in London',
    context: null,
  },
  {
    quote: 'The kidney has a limited number of ways to respond to an innumerable number of injuries.',
    attribution: 'Fred G. Silva',
    context: 'Fred Silva was not only a major teacher in renal pathology, but also part of the Society\'s early leadership and historical memory. His observation that the kidney has only a limited repertoire of responses to injury captures one of the central interpretive challenges of nephropathology.',
  },
]

const INTERVAL = 15000
const FADE_MS = 200

function QuoteCarousel() {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)
  const timerRef = useRef(null)
  const touchStartX = useRef(null)
  const touchStartY = useRef(null)

  function startTimer() {
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => advance(1, false), INTERVAL)
  }

  useEffect(() => {
    startTimer()
    return () => clearInterval(timerRef.current)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function advance(dir, resetTimer = true) {
    setVisible(false)
    setTimeout(() => {
      setIndex(i => (i + dir + QUOTES.length) % QUOTES.length)
      setVisible(true)
    }, FADE_MS)
    if (resetTimer) startTimer() // manual nav resets the 5s countdown
  }

  function goTo(i) {
    if (i === index) return
    setVisible(false)
    setTimeout(() => {
      setIndex(i)
      setVisible(true)
    }, FADE_MS)
    startTimer()
  }

  function handleTouchStart(e) {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }

  function handleTouchEnd(e) {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    const dy = e.changedTouches[0].clientY - touchStartY.current
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      advance(dx < 0 ? 1 : -1)
    }
    touchStartX.current = null
    touchStartY.current = null
  }

  const q = QUOTES[index]

  return (
    <div className="select-none">
      {/* Quote card */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          opacity: visible ? 1 : 0,
          transition: `opacity ${FADE_MS}ms ease`,
          borderLeft: '3px solid #fb27e8',
        }}
        className="pl-4 pr-2 py-2 min-h-[120px]"
      >
        <p className="text-sm italic text-[#0C447C] leading-relaxed">
          &ldquo;{q.quote}&rdquo;
        </p>
        <footer className="mt-2">
          <p className="text-xs font-semibold text-gray-500">— {q.attribution}</p>
          {q.context && (
            <p className="text-xs text-gray-400 mt-0.5">{q.context}</p>
          )}
        </footer>
      </div>

      {/* Controls: prev · dots · next */}
      <div className="flex items-center justify-center gap-3 mt-4">
        <button
          onClick={() => advance(-1)}
          aria-label="Previous quote"
          className="w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:text-[#0C447C] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex gap-1.5">
          {QUOTES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to quote ${i + 1}`}
              className="w-2 h-2 rounded-full transition-colors duration-200"
              style={{ backgroundColor: i === index ? '#fb27e8' : '#d1d5db' }}
            />
          ))}
        </div>

        <button
          onClick={() => advance(1)}
          aria-label="Next quote"
          className="w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:text-[#0C447C] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default function About() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <section className="bg-[#0C447C] text-white rounded-xl p-5 shadow-sm">
        <h2 className="font-bold text-base mb-2">Our Mission</h2>
        <p className="text-sm text-blue-100 leading-relaxed">
          The Renal Pathology Society (RPS) is a nonprofit organization committed to improvement and dissemination of knowledge regarding the pathology and pathophysiology of renal disease.
        </p>
      </section>

      <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <h2 className="text-[#0C447C] font-bold text-base mb-4">Voices from the Field</h2>
        <QuoteCarousel />
      </section>

      <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <h2 className="text-[#0C447C] font-bold text-base mb-3">Founding Members (1977)</h2>
        <div className="flex flex-wrap gap-2">
          {foundingMembers.map((m, i) => (
            <span key={i} className="text-xs bg-[#0C447C]/10 text-[#0C447C] font-medium px-2.5 py-1 rounded-full">
              {m}
            </span>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="bg-[#0C447C]/5 px-4 py-2 border-b border-gray-100">
          <h2 className="text-[#0C447C] font-bold text-base">RPS Presidents</h2>
        </div>
        <ul className="divide-y divide-gray-50">
          {presidents.map((p, i) => (
            <li key={i} className="flex items-center justify-between px-4 py-2.5">
              <span className="text-sm font-medium text-gray-900">{p.name}</span>
              <span className="text-xs font-semibold text-[#0C447C] bg-[#0C447C]/10 px-2 py-0.5 rounded-full ml-2 flex-shrink-0">
                {p.year}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <h2 className="text-[#0C447C] font-bold text-base mb-3">Contact</h2>
        <div className="text-sm text-gray-700 space-y-1">
          <p>
            <span className="font-medium">Secretary:</span>{' '}
            Mei Lin Z. Bissonnette, MD, PhD
          </p>
          <p>
            <a
              href="mailto:secretary@renalpathsoc.org"
              className="text-[#0C447C] underline underline-offset-2 hover:text-[#1a5a9e]"
            >
              secretary@renalpathsoc.org
            </a>
          </p>
          <p>
            <a
              href="https://renalpathsoc.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0C447C] underline underline-offset-2 hover:text-[#1a5a9e]"
            >
              renalpathsoc.org
            </a>
          </p>
        </div>
      </section>
    </div>
  )
}
