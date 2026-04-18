import { useState, useCallback, useEffect } from 'react'

const SESSION_KEY = 'whoami_state'

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
      'A prestigious RPS award, recognising major contributions to nephropathology, bears my name.',
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
      'As Secretary-Treasurer of the USCAP, I was known for hosting gatherings for RPS members in the executive suite at the annual meeting.',
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
      'After undergraduate studies at MIT, I trained at Harvard Medical School and Massachusetts General Hospital, where I spent my career.',
      'I was a key figure in developing criteria for transplant rejection diagnosis.',
      'At a Banff meeting I famously said, "Let\'s not codify our ignorance."',
      'I received the Jacob Churg Award in 1998 and the Heptinstall Lifetime Achievement Award in 2011.',
      'My enthusiastic exclamation became legendary among trainees — "GRREAATT!"',
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
      'I was a pioneering French pathologist who specialised in pediatric renal pathology, based at the Necker Hospital in Paris.',
      'By studying thousands of biopsy cases, I helped define minimal change disease, FSGS, and diffuse mesangial sclerosis in children with nephrotic syndrome.',
      'I provided the first full description of the renal pathology of hemolytic uremic syndrome.',
      'I received the ASN John Peters Award in 1989 and the Légion d\'Honneur from the President of France in 1988.',
    ],
    answer: 'Renée Habib',
  },
  {
    clues: [
      'I was one of the original founding members of the Renal Pathology Club in 1977.',
      'I chaired the very first RPS scientific symposium in New Orleans in 1978, on focal segmental glomerulosclerosis.',
      'I served as RPS President in 1994 and was based at Yale University School of Medicine.',
      'I received both the Jacob Churg Award and the Robert Heptinstall Lifetime Achievement Award.',
    ],
    answer: 'Michael Kashgarian',
  },
  {
    clues: [
      'I was a French pathologist who trained at Hôpital Tenon in Paris, working alongside pioneers including Renée Habib and Jean Berger.',
      'I was a principal figure in developing the initial WHO classification of lupus nephritis.',
      'I edited The Renal Biopsy, a widely used textbook in the Major Problems in Pathology series.',
      'The RPS Young Investigator Award was renamed in my honour in 2006.',
    ],
    answer: 'Liliane Striker',
  },
  {
    clues: [
      'I started my career at NYU, where together with Gloria Gallo I pioneered the application of immunofluorescence microscopy to human kidney biopsies.',
      'In 1974 I became pathologist-in-chief at Massachusetts General Hospital, and in 1982 became the first Benjamin Castleman Professor of Pathology at Harvard.',
      'I was a key instigator of the WHO classification of lupus glomerulonephritis and a founding member of the Renal Pathology Club in 1977.',
      'I was known for hosting Shakespeare readings on my porch, and colleagues said my dry wit could deflate the pompous with a choice remark.',
      'My friends and colleagues have always called me "Mac".',
    ],
    answer: 'Robert McCluskey',
  },
  {
    clues: [
      'My research spans developmental kidney disease, diabetic nephropathy, podocyte biology, and transplant pathology.',
      'I received my medical degree from the University of Athens in Greece.',
      'I edited the Pathology of Solid Organ Transplantation textbook.',
      'I received the Jacob Churg Award in 2011.',
      'I now serve as the historian of the Renal Pathology Society.',
    ],
    answer: 'Helen Liapis',
  },
  {
    clues: [
      'In 2002 I founded Canada\'s first annual Leonard Cohen Night in Edmonton, and Leonard Cohen himself once called me "a great master of the surreal."',
      'My office at the University of Alberta featured a Sony Aibo robotic dog and a robotic cat named Orange.',
      'On Easter Sunday 1991, I stopped by the Banff Centre on a whim and booked the venue for what would become one of the most influential meetings in transplant pathology.',
      'Together with Lorraine Racusen, I led the first Banff Conference on Allograft Pathology, establishing the first international consensus classification for renal allograft pathology.',
      'I consider myself a futurist and optimist, and am eagerly awaiting the technological singularity.',
    ],
    answer: 'Kim Solez',
  },
  {
    clues: [
      'I am a renal transplant pathologist who has made major contributions to molecular diagnostics in allograft pathology.',
      'I served as RPS President in 2020 and received the Jacob Churg Award in 2019.',
      'I have been a key figure in the Banff classification process and am deeply knowledgeable about its history and evolution.',
      'I am based at the University of Alberta in Edmonton, Canada.',
      'Colleagues know me for my sharp wit as well as my scientific knowledge.',
    ],
    answer: 'Michael Mengel',
  },
  {
    clues: [
      'I helped move pauci-immune necrotizing and crescentic GN from pattern recognition toward pathogenesis.',
      'UNC Chapel Hill is my academic home.',
      'In 1997, the Renal Pathology Society gave me the first Jacob Churg Award.',
      'I helped carry forward Heptinstall\'s textbook legacy.',
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

function loadSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (raw) {
      const saved = JSON.parse(raw)
      // Discard stale sessions from older versions of the quiz with fewer pathologists
      if (saved.deck?.length === PATHOLOGISTS.length) return saved
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

export default function WhoAmI() {
  const [deck, setDeck] = useState(() => {
    const saved = loadSession()
    return saved ? saved.deck : shuffle(PATHOLOGISTS)
  })
  const [cardIndex, setCardIndex] = useState(() => loadSession()?.cardIndex ?? 0)
  const [cluesShown, setCluesShown] = useState(() => loadSession()?.cluesShown ?? 1)
  const [showAnswer, setShowAnswer] = useState(() => loadSession()?.showAnswer ?? false)

  const card = deck[cardIndex]
  const allCluesShown = cluesShown >= card.clues.length

  useEffect(() => {
    saveSession({ deck, cardIndex, cluesShown, showAnswer })
  }, [deck, cardIndex, cluesShown, showAnswer])

  const nextPathologist = useCallback(() => {
    const next = cardIndex + 1
    if (next >= deck.length) {
      clearSession()
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
