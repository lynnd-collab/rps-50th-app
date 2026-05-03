import { useRef, useState, useCallback } from 'react'
import Crossword from '@jaredreisinger/react-crossword'

const data = {
  across: {
    '1':  { clue: 'Not flattery; activated in MPGN', answer: 'COMPLEMENT', row: 0, col: 0 },
    '8':  { clue: 'Pharma company behind early neph symposium', answer: 'CIBA', row: 1, col: 2 },
    '9':  { clue: 'Modus operandi, abbrev.', answer: 'MO', row: 1, col: 10 },
    '10': { clue: 'Title of renal pathologists', answer: 'DR', row: 2, col: 2 },
    '11': { clue: 'Congo __', answer: 'RED', row: 2, col: 5 },
    '12': { clue: 'Lactate-albumin ratio, abbrev.', answer: 'LAR', row: 2, col: 9 },
    '13': { clue: 'post__ day, how long after kidney transplant', answer: 'OP', row: 3, col: 0 },
    '15': { clue: 'Eureka moment, or amyloid type', answer: 'AH', row: 3, col: 3 },
    '17': { clue: 'Interstitial amorphous material, often', answer: 'ALECT', row: 3, col: 7 },
    '18': { clue: 'IF staining pattern', answer: 'GRANULAR', row: 4, col: 0 },
    '21': { clue: 'Late onset, abbrev.', answer: 'LO', row: 5, col: 0 },
    '22': { clue: 'Cells whose dysfunction can lead to diabetic nephropathy', answer: 'ISLET', row: 5, col: 3 },
    '23': { clue: 'Risk for symptoms in collagenopathies', answer: 'SEX', row: 5, col: 9 },
    '25': { clue: 'Expression around Banff', answer: 'EH', row: 6, col: 7 },
    '27': { clue: 'Mountain town, site of skiing and schema', answer: 'BANFF', row: 7, col: 0 },
    '32': { clue: 'Associated with IgA nephropathy and interstitial nephritis', answer: 'CROHNS', row: 7, col: 6 },
    '34': { clue: 'How sections are cut for EM', answer: 'ULTRATHIN', row: 8, col: 0 },
    '35': { clue: 'Status post, in clinical notes', answer: 'SP', row: 8, col: 10 },
    '36': { clue: '--nail, cells seen in chronic lithium toxicity', answer: 'HOB', row: 9, col: 2 },
    '37': { clue: 'Line on a synoptic report', answer: 'ITEM', row: 9, col: 6 },
    '39': { clue: 'Bright green tool used by renal pathologists', answer: 'IF', row: 10, col: 0 },
    '41': { clue: 'Recipient needs this post-transplant', answer: 'TLC', row: 10, col: 3 },
    '43': { clue: 'Exclamation upon receiving a difficult case', answer: 'ACK', row: 10, col: 9 },
    '45': { clue: 'Nomen nescio: unknown name, abbrev.', answer: 'NN', row: 11, col: 0 },
    '46': { clue: '-py, nickname for author of Pathology of the Kidney', answer: 'HEP', row: 11, col: 3 },
    '47': { clue: 'What we do down the microscope', answer: 'STARE', row: 11, col: 7 },
  },
  down: {
    '1':  { clue: 'Baby it\'s cold inside', answer: 'CRYOGLOBULIN', row: 0, col: 0 },
    '2':  { clue: 'Nephrotic syndrome cause, abbrev.', answer: 'MCD', row: 0, col: 2 },
    '3':  { clue: 'Early EM pioneer', answer: 'PIRANI', row: 0, col: 3 },
    '4':  { clue: 'Used in bacterial cultures, abbrev.', answer: 'LB', row: 0, col: 4 },
    '5':  { clue: 'Organ affected in Alport syndrome', answer: 'EAR', row: 0, col: 5 },
    '6':  { clue: 'v lesion', answer: 'ENDARTERITIS', row: 0, col: 7 },
    '7':  { clue: 'Where glomeruli live', answer: 'CORTEX', row: 0, col: 11 },
    '9':  { clue: 'Terminal complement & nickname of a legendary renal pathologist', answer: 'MAC', row: 1, col: 10 },
    '12': { clue: 'Microscope component', answer: 'LENS', row: 2, col: 9 },
    '14': { clue: 'What we become after many years of reviewing biopsies', answer: 'PRO', row: 3, col: 1 },
    '16': { clue: 'TMA clinical syndrome', answer: 'HUS', row: 3, col: 4 },
    '19': { clue: 'What clinicians think will replace pathologists', answer: 'LLM', row: 4, col: 5 },
    '20': { clue: 'Adverse event in clinical trials, abbrev.', answer: 'AE', row: 4, col: 6 },
    '24': { clue: 'How long we wait for EM results, it seems', answer: 'EONS', row: 5, col: 10 },
    '26': { clue: 'What we do with our skills', answer: 'HONE', row: 6, col: 8 },
    '28': { clue: 'Beta pleated sheets with lambda', answer: 'AL', row: 7, col: 1 },
    '29': { clue: 'To the __ degree, as in maximum diagnostic detail', answer: 'NTH', row: 7, col: 2 },
    '30': { clue: 'Nephrotic syndrome urine', answer: 'FROTH', row: 7, col: 3 },
    '31': { clue: 'Story passed down from renal path elders', answer: 'FABLE', row: 7, col: 4 },
    '32': { clue: '-- squared', answer: 'CHI', row: 7, col: 6 },
    '33': { clue: 'GBM feature best seen on Jones silver', answer: 'SPIKE', row: 7, col: 11 },
    '38': { clue: 'Macroaggregated albumin, abbrev.', answer: 'MAA', row: 9, col: 9 },
    '40': { clue: 'Rare autosomal dominant glomerulopathy with focal fibrillary deposits, abbrev.', answer: 'FN', row: 10, col: 1 },
    '42': { clue: 'Term for laboratory medicine training, abbrev.', answer: 'CP', row: 10, col: 5 },
    '44': { clue: 'Amyloid stain, abbrev.', answer: 'CR', row: 10, col: 10 },
  },
}

// Build a flat map of { "row-col": correctLetter } from puzzle data
function buildAnswerMap() {
  const map = {}
  for (const info of Object.values(data.across)) {
    for (let i = 0; i < info.answer.length; i++)
      map[`${info.row}-${info.col + i}`] = info.answer[i]
  }
  for (const info of Object.values(data.down)) {
    for (let i = 0; i < info.answer.length; i++)
      map[`${info.row + i}-${info.col}`] = info.answer[i]
  }
  return map
}

const ANSWER_MAP = buildAnswerMap()

export default function NephroCrossword() {
  const ref = useRef()
  const [solved, setSolved] = useState(false)
  const [checkMsg, setCheckMsg] = useState('')
  const [guesses, setGuesses] = useState({})

  const handleCellChange = useCallback((row, col, char) => {
    setGuesses(prev => ({ ...prev, [`${row}-${col}`]: char }))
  }, [])

  const checkAnswers = useCallback(() => {
    let hasIncorrect = false
    let hasEmpty = false
    for (const [key, correct] of Object.entries(ANSWER_MAP)) {
      const guess = guesses[key]
      if (!guess) hasEmpty = true
      else if (guess !== correct) hasIncorrect = true
    }
    let msg, style
    if (hasIncorrect) {
      msg = 'Some letters are incorrect'
      style = 'incorrect'
    } else if (hasEmpty) {
      msg = 'Looking good so far — keep going!'
      style = 'incomplete'
    } else {
      msg = 'All correct! 🎉'
      style = 'correct'
    }
    setCheckMsg({ text: msg, style })
    setTimeout(() => setCheckMsg(''), 3000)
  }, [guesses])

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="bg-[#0C447C] px-4 py-3">
        <h2 className="text-white font-bold text-base leading-tight">NephroCrossword</h2>
        <p className="text-white/60 text-xs mt-0.5">A renal pathology crossword puzzle</p>
      </div>

      <div className="p-4 space-y-3">
        {solved && (
          <div className="text-center py-2 rounded-lg bg-green-50 border border-green-200">
            <p className="text-green-700 font-bold text-sm">Solved! 🎉</p>
          </div>
        )}

        <Crossword
          ref={ref}
          data={data}
          useStorage
          storageKey="nephrocrossword_v1"
          onCrosswordCorrect={(correct) => { if (correct) setSolved(true) }}
          onCellChange={handleCellChange}
          theme={{
            gridBackground: '#f9fafb',
            cellBackground: '#ffffff',
            cellBorder: '#d1d5db',
            textColor: '#111827',
            numberColor: '#6b7280',
            focusBackground: '#dbeafe',
            highlightBackground: '#eff6ff',
          }}
        />

        {checkMsg && (
          <div className={`text-center py-2 rounded-lg text-sm font-semibold ${
            checkMsg.style === 'correct'    ? 'bg-green-50 border border-green-200 text-green-700' :
            checkMsg.style === 'incomplete' ? 'bg-blue-50 border border-blue-200 text-blue-700' :
                                             'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {checkMsg.text}
          </div>
        )}

        <div className="flex justify-between">
          <button
            onClick={checkAnswers}
            className="text-xs font-semibold border border-[#0C447C] text-[#0C447C] hover:bg-[#0C447C] hover:text-white rounded-lg px-3 py-1.5 transition-colors"
          >
            Check answers
          </button>
          <button
            onClick={() => { ref.current?.reset(); setSolved(false); setCheckMsg(''); setGuesses({}) }}
            className="text-xs text-gray-400 hover:text-gray-600 border border-gray-200 hover:border-gray-400 rounded-lg px-3 py-1.5 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  )
}
