import { foundingMembers, presidents } from '../data'

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
