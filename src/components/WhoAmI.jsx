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
      'I received the Jacob Churg Award and the Heptinstall Lifetime Achievement Award from the RPS.',
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
      'After majoring in Humanities (course 21B) at MIT, I trained at Harvard Medical School and Massachusetts General Hospital, where I spent my career.',
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
      'I trained at Indiana University and later held faculty positions at the University of Iowa, UAMS, and LSU Health Sciences Center in Shreveport.',
      'My work has bridged renal pathology and genitourinary pathology, including major contributions to renal cystic and developmental diseases.',
      'I authored the Atlas of Medical Renal Pathology, combining renal anatomy, gross pathology, histology, and diagnostic renal pathology.',
      'Outside of work, I draw detailed scenes of landscapes, historic log cabins, and old barns.',
      'My career has included academic leadership and diagnostic consultation, including later work with Arkana Laboratories.',
    ],
    answer: 'Stephen M. Bonsib',
  },
  {
    clues: [
      'I was born in Brooklyn and did not so much plan a career in renal pathology as stumble into it, then turned it into a lifelong passion.',
      'I was largely self-taught in kidney pathology, with important help from masters such as Jacob Churg, Robert Heptinstall, and Conrad Pirani.',
      'In the early 1970s at Harbor-UCLA, I built one of the country\'s first comprehensive renal biopsy services, combining light microscopy, immunofluorescence, electron microscopy, and the patient\'s clinical story.',
      'I was so committed to kidney biopsies that my personalized license plate read: "LM IF EM."',
      'I was president of the Renal Pathology Society, received the Jacob Churg Award, and made contributions to HIV-associated nephropathy, membranous nephropathy mechanisms, and renal fibrosis.',
    ],
    answer: 'Arthur Cohen',
  },
  {
    clues: [
      'I trained first in pathology at Hammersmith Hospital in London, but after three years decided I preferred clinical medicine.',
      'My habit of visiting the autopsy room helped me notice unusual renal papillary necrosis, a finding that helped lead me toward the study of analgesic nephropathy.',
      'I became a leading nephrologist in Melbourne, where I helped establish the renal transplant programme at the Royal Melbourne Hospital.',
      'My work helped establish the link between compound analgesics and kidney damage, leading to major public health changes in Australia.',
      'I became professor of medicine at the University of Melbourne and was a pioneer for women in medicine in Australia, where married female doctors were initially barred from hospital and university employment.',
    ],
    answer: 'Priscilla Kincaid-Smith',
  },
  {
    clues: [
      'I trained with pathologist Deborah Doniach in London specifically to learn how to apply fluorescent techniques to the kidney.',
      'My first public report of my findings was an oral presentation to the Société de Néphrologie in Paris in the winter of 1968, followed by a published summary less than one page long.',
      'I worked in the Department of Nephrology headed by Jean Hamburger at the Necker-Enfants Malades Hospital in Paris.',
      'A disease bears my name, though I was always rather embarrassed about the eponym.',
      'I first described the most common form of glomerulonephritis worldwide.',
    ],
    answer: 'Jean Berger',
  },
  {
    clues: [
      'I grew up in Texas, but my French improved dramatically in college after I acquired a persuasive reason to learn the language: a French girlfriend.',
      'As a young pathologist, I was named "best new investigator" in pathology and honeymooned in Cambridge, England after being invited there.',
      'By 1978, only ten years after graduating from Johns Hopkins School of Medicine, I had become Chief of Pathology at Johns Hopkins Bayview Medical Center.',
      'My fluency in French eventually took me to Paris in the late 1990s, where I worked at l\'UFR Broussais Hôtel-Dieu, Université de Paris.',
      'I was directly mentored by Robert Heptinstall, and my publications ranged from a renal pathology textbook to a French-English medical dictionary.',
    ],
    answer: 'Gary Hill',
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
  {
    clues: [
      'I proposed a histologic classification system for IgA nephropathy in 1997.',
      'My work has focused on glomerular diseases, particularly IgA nephropathy, as well as kidney transplant pathology.',
      'I have been deeply involved in the Banff classification and kidney transplant pathology consensus efforts.',
      'I am a renal pathologist at Cedars-Sinai Medical Center.',
      'I served as President of the Renal Pathology Society and received both the Jacob Churg Award and the Robert H. Heptinstall Lifetime Achievement Award.',
    ],
    answer: 'Mark Haas',
  },
  {
    clues: [
      'In my office, I have an image of a zebra composed of electron microscopy "zebra bodies."',
      'I am the Deputy Editor of the journal Glomerular Diseases.',
      'I am a renal pathologist at Cedars-Sinai Medical Center.',
      'My work includes tubulointerstitial nephritis, including chronic interstitial nephritis in agricultural communities.',
      'I have contributed to large renal biopsy studies from Cedars-Sinai, including long-term trends in biopsy-proven kidney disease diagnoses.',
    ],
    answer: 'Cynthia Nast',
  },
  {
    clues: [
      'Many of my past trainees affectionately refer to me as "Papá."',
      'I am known for a Socratic, microscope-based approach to teaching renal pathology.',
      'I co-authored Renal Pathophysiology: The Essentials.',
      'Originally from Chile, I spent much of my career at Brigham and Women\'s Hospital/Harvard Medical School.',
      'I received the Robert H. Heptinstall Lifetime Achievement Award from the Renal Pathology Society.',
    ],
    answer: 'Helmut Rennke',
  },
  {
    clues: [
      'I am an accomplished orchid grower.',
      'My work has included lupus nephritis, thrombotic microangiopathy, and kidney transplant pathology.',
      'I have contributed to Banff working groups and renal allograft pathology consensus efforts.',
      'I trained in renal pathology with Dr. Jacob Churg.',
      'I am the Chief of Renal Pathology at Weill Cornell Medicine/New York-Presbyterian.',
    ],
    answer: 'Surya Seshan',
  },
  {
    clues: [
      'A photograph I took of a lilac-breasted roller appears on the cover of National Geographic\'s Secret Life of Birds (2025).',
      'I was Dr. Robert McCluskey\'s last renal pathology fellow.',
      'My work focuses on kidney transplant pathology, IgG4-related disease, and tubulointerstitial nephritis.',
      'I founded and directed an ACGME-accredited renal pathology fellowship program for 13 years at Mayo Clinic.',
      'I created this anniversary app, including the quizzes you are using now.',
    ],
    answer: 'Lynn Cornell',
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
  // Per-card history so Back restores the exact clue state
  const [cardHistory, setCardHistory] = useState(() => loadSession()?.cardHistory ?? [])

  const card = deck[cardIndex]
  const allCluesShown = cluesShown >= card.clues.length

  useEffect(() => {
    saveSession({ deck, cardIndex, cluesShown, showAnswer, cardHistory })
  }, [deck, cardIndex, cluesShown, showAnswer, cardHistory])

  const nextPathologist = useCallback(() => {
    setCardHistory(h => [...h, { cluesShown, showAnswer }])
    const next = cardIndex + 1
    if (next >= deck.length) {
      clearSession()
      setDeck(shuffle(PATHOLOGISTS))
      setCardIndex(0)
      setCardHistory([])
    } else {
      setCardIndex(next)
    }
    setCluesShown(1)
    setShowAnswer(false)
  }, [cardIndex, deck.length, cluesShown, showAnswer])

  const prevPathologist = useCallback(() => {
    if (cardIndex === 0) return
    const prev = cardHistory[cardHistory.length - 1] ?? { cluesShown: 1, showAnswer: false }
    setCardHistory(h => h.slice(0, -1))
    setCardIndex(cardIndex - 1)
    setCluesShown(prev.cluesShown)
    setShowAnswer(prev.showAnswer)
  }, [cardIndex, cardHistory])

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
          {/* Back button — left side, hidden on first card */}
          {cardIndex > 0 ? (
            <button
              onClick={prevPathologist}
              className="py-2.5 px-3 rounded-lg text-xs font-medium border border-gray-300 text-gray-400 hover:text-gray-500 hover:border-gray-400 transition-colors"
            >
              ← Back
            </button>
          ) : (
            <div className="py-2.5 px-3" aria-hidden="true" />
          )}

          {/* Centre action */}
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

          {/* Skip button — right side */}
          {!showAnswer && (
            <button
              onClick={nextPathologist}
              className="py-2.5 px-3 rounded-lg text-xs font-medium border border-gray-300 text-gray-400 hover:text-gray-500 hover:border-gray-400 transition-colors"
            >
              Skip
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
