import { useState } from 'react'
import { awards } from '../data'

const subTabs = [
  { key: 'heptinstall', label: 'Heptinstall' },
  { key: 'churg', label: 'Jacob Churg' },
  { key: 'gallo', label: 'Gloria Gallo' },
  { key: 'striker', label: 'Striker' },
]

export default function Awards() {
  const [active, setActive] = useState('heptinstall')
  const award = awards[active]

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h2 className="text-[#0C447C] text-lg font-bold mb-3">Awards</h2>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
        {subTabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            className={`sub-tab-btn flex-shrink-0 ${active === t.key ? 'sub-tab-active' : 'sub-tab-inactive'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-4">
        <h3 className="text-[#0C447C] font-bold text-base mb-2">{award.name}</h3>
        <p className="text-sm text-gray-700 leading-relaxed">{award.description}</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="bg-[#0C447C]/5 px-4 py-2 border-b border-gray-100">
          <span className="text-xs font-semibold text-[#0C447C] uppercase tracking-wider">Recipients</span>
        </div>
        {/* key on ul forces remount (and animation replay) when sub-tab changes */}
        <ul key={active} className="divide-y divide-gray-50">
          {award.recipients.map((r, i) => (
            <li
              key={i}
              className="animate-row-slide flex items-center justify-between px-4 py-2.5"
              style={{ animationDelay: `${i * 35}ms` }}
            >
              <span className="text-sm font-medium text-gray-900">{r.name}</span>
              <span className="text-xs font-semibold text-[#0C447C] bg-[#0C447C]/10 px-2 py-0.5 rounded-full ml-2 flex-shrink-0">
                {r.year}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
