import { useState, useCallback } from 'react'

const PATHOLOGISTS = [
  {
    clues: [
      'My chairman apologised for burdening me with kidney biopsies, doubting they had a future.',
      'I sent the founding letter to 13 colleagues in October 1977.',
      'I pioneered semiquantitative scoring of renal biopsy lesions.',
      'I received the ASN John Peters Award in 1987.',
    ],
    answer: 'Conrad Pirani',
  },
  {
    clues: [
      'I introduced thin sections (2–3 microns) to renal pathology.',
      'I worked at Mount Sinai School of Medicine in New York.',
      'The most prestigious mid-career RPS award bears my name.',
      'I received the ASN John Peters Award in 1987.',
    ],
    answer: 'Jacob Churg',
  },
  {
    clues: [
      'I began my medical career as a surgeon before training as a pathologist after World War II.',
      'I collaborated with George Pickering on clinicopathologic studies of hypertensive nephropathy.',
      'I wrote the field\'s foundational textbook, first published in 1966.',
      'RPS members travelled to my home in Baltimore to present me with my award.',
    ],
    answer: 'Robert Heptinstall',
  },
  {
    clues: [
      'I was a pioneer in applying immunofluorescence to human kidney biopsies at NYU.',
      'I was the first President of the Renal Pathology Society in 1993.',
      'A research award bearing my name recognises mid-career investigators.',
      'I also received the Lifetime Achievement Award bearing my colleague\'s name.',
    ],
    answer: 'Gloria Gallo',
  },
  {
    clues: [
      'I served as secretary at the very first Renal Pathology Club meeting in 1977.',
      'I observed that "the kidney has a limited number of ways to respond to an innumerable number of injuries."',
      'I was a founding co-editor of a major diagnostic renal pathology textbook bearing my name.',
      'I served as Executive Vice President and Secretary-Treasurer of the USCAP for 12 years.',
    ],
    answer: 'Fred Silva',
  },
  {
    clues: [
      'I am Professor of Pathology and Director of the Renal Pathology Laboratory at Columbia University.',
      'I co-led the 2004 ISN/RPS classification of lupus nephritis.',
      'I received both the RPS Heptinstall Award and served as RPS President.',
      'I co-authored "The Rise of Renal Pathology in Nephrology: Structure Illuminates Function."',
    ],
    answer: 'Vivette D\'Agati',
  },
  {
    clues: [
      'I launched the annual ASN Renal Pathology precourse in 1998.',
      'I have made major contributions to the understanding of FSGS pathogenesis.',
      'I received both the Churg and Heptinstall Awards from the RPS.',
      'I am based at Vanderbilt University.',
    ],
    answer: 'Agnes Fogo',
  },
  {
    clues: [
      'I trained at MGH and Harvard and spent my career at Massachusetts General Hospital.',
      'I was a key figure in developing criteria for transplant rejection diagnosis.',
      'At a Banff meeting I famously said "let\'s not codify our ignorance."',
      'I received the Jacob Churg Award in 1998.',
    ],
    answer: 'Robert Colvin',
  },
  {
    clues: [
      'I co-led the first Banff meeting in August 1991 with Kim Solez.',
      'I said the Banff project was "the most interesting project" Solez had ever suggested to me.',
      'I served as RPS President in 2005.',
      'I received the Heptinstall Lifetime Achievement Award in 2021.',
    ],
    answer: 'Lorraine Racusen',
  },
  {
    clues: [
      'I was the first recipient of the Jacob Churg Award in 1997.',
      'I served as RPS President in 2004.',
      'I co-authored the seminal paper on ANCA-associated vasculitis with Ronald Falk.',
      'I co-authored "Historical Milestones in Renal Pathology" with Jan Weening.',
    ],
    answer: 'J. Charles Jennette',
  },
]

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function WhoAmI() {
  const [deck, setDeck] = useState(() => shuffle(PATHOLOGISTS))
  const [cardIndex, setCardIndex] = useState(0)
  const [cluesShown, setCluesShown] = useState(1)
  const [showAnswer, setShowAnswer] = useState(false)

  const card = deck[cardIndex]
  const allCluesShown = cluesShown >= card.clues.length

  const nextPathologist = useCallback(() => {
    const next = cardIndex + 1
    if (next >= deck.length) {
      setDeck(shuffle(PATHOLOGISTS))
      setCardIndex(0)
    } else {
      setCardIndex(next)
    }
    setCluesShown(1)
    setShowAnswer(false)
  }, [cardIndex, deck.length])

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-[#0C447C] px-4 py-3">
        <h2 className="text-white font-bold text-base leading-tight">Who am I?</h2>
        <p className="text-white/60 text-xs mt-0.5">A renal pathology guessing game</p>
      </div>

      <div className="p-4 space-y-3">
        {/* Clues */}
        <ol className="space-y-2">
          {card.clues.slice(0, cluesShown).map((clue, i) => (
            <li key={i} className="flex gap-2.5">
              <span
                className="flex-shrink-0 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center mt-0.5"
                style={{ background: '#fb27e8', color: '#fff' }}
              >
                {i + 1}
              </span>
              <p className="text-sm text-gray-700 leading-relaxed">{clue}</p>
            </li>
          ))}
        </ol>

        {/* Answer reveal */}
        {showAnswer && (
          <div
            className="rounded-lg px-4 py-3 text-center"
            style={{ background: 'linear-gradient(135deg, #0C447C 0%, #1a5a9e 100%)' }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-white/60 mb-0.5">Answer</p>
            <p className="text-white font-bold text-lg">{card.answer}</p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2 pt-1">
          {!allCluesShown && !showAnswer && (
            <button
              onClick={() => setCluesShown(n => n + 1)}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold border-2 transition-colors"
              style={{ borderColor: '#fb27e8', color: '#fb27e8' }}
            >
              Next clue
            </button>
          )}
          {allCluesShown && !showAnswer && (
            <button
              onClick={() => setShowAnswer(true)}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors"
              style={{ background: '#fb27e8' }}
            >
              Show answer
            </button>
          )}
          {showAnswer && (
            <button
              onClick={nextPathologist}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors"
              style={{ background: '#0C447C' }}
            >
              Next pathologist →
            </button>
          )}
        </div>

        {/* Progress */}
        <p className="text-center text-[11px] text-gray-400">
          {cardIndex + 1} of {deck.length}
        </p>
      </div>
    </div>
  )
}
