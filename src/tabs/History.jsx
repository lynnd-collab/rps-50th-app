import { useEffect, useRef } from 'react'
import { timeline } from '../data'

export default function History() {
  const listRef = useRef(null)

  useEffect(() => {
    if (!listRef.current) return
    const dots = listRef.current.querySelectorAll('.timeline-dot')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('dot-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.5, rootMargin: '0px 0px -20px 0px' }
    )
    dots.forEach((dot) => observer.observe(dot))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-10">
      <blockquote className="border-l-4 border-[#0C447C]/30 pl-4 pr-2 py-1">
        <p className="text-sm italic text-gray-500 leading-relaxed">
          Renal pathology and nephrology grew up together. The kidney biopsy, introduced in the
          early 1950s, gave pathologists living patient tissue to study and gave nephrologists a
          diagnostic tool that would transform the understanding and management of kidney disease.
          In the decades that followed, pathologists and nephrologists worked side by side, defining
          patterns of injury, developing classification systems, and establishing diagnoses of specific
          diseases through communication and clinicopathologic correlation.
        </p>
      </blockquote>

      <section>
        <h2 className="text-[#0C447C] text-lg font-bold mb-4">Timeline</h2>
        <ol ref={listRef} className="relative border-l-2 border-[#0C447C]/20 space-y-0">
          {timeline.map((item, i) => (
            <li key={i} className="ml-6 pb-6 last:pb-0">
              <span
                className={`timeline-dot absolute -left-[9px] flex items-center justify-center w-4 h-4 rounded-full ring-2 ring-white ${
                  item.milestone ? 'bg-[#0C447C]' : 'bg-[#0C447C]/30'
                }`}
              />
              <div className={`${item.milestone ? '' : 'opacity-90'}`}>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded mr-2 ${
                    item.milestone
                      ? 'bg-[#0C447C] text-white'
                      : 'bg-[#0C447C]/10 text-[#0C447C]'
                  }`}
                >
                  {item.year}
                </span>
                <p className="inline text-sm text-gray-700 leading-relaxed">{item.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2 className="text-[#0C447C] text-lg font-bold mb-3">Our Beginning</h2>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-4 text-sm text-gray-700 leading-relaxed">
          <p>
            The society was initiated by a group of renal pathologists (Jay Bernstein, P. Burkholder,
            J. Churg, R. Cotran, F. Cuppage, D. Jones, M. Kashgarian, J. Kissane, K. Mostofi, and
            G. Striker), acting in large measure at the instigation of Conrad Pirani who served as
            acting chairman. They met on November 20, 1977, during the American Society of Nephrology
            meeting at the Washington Hilton Hotel, to consider the creation of a renal pathologists'
            organisation. Fred Silva assisted as secretary. The Renal Pathology Club was then born
            which organised conferences for over 10 years at the annual American Society of Nephrology
            (ASN), the National Kidney Foundation (NKF), and the United States and Canadian Academy
            of Pathology (USCAP) meetings.
          </p>
          <p>
            Some years later, a steering committee was appointed to oversee the transition from club
            to society. Jay Bernstein, Frank A. Carone, Arthur H. Cohen, Robert B. Colvin, Ramzi
            Cotran, Vivette D'Agati, Gloria R. Gallo, Gary S. Hill, J. Charles Jennette, Michael
            Kashgarian, Vivian Pinn-Wiggins, H.G. Rennke, Seymour Rosen, Benjamin Spargo, Liliane
            M. Striker, and M.A. Venkatachalam participated in the transition and the Renal Pathology
            Club became the Renal Pathology Society in March 1993. Members of the Renal Pathology
            Club automatically became charter members of the new Renal Pathology Society.
          </p>
          <p>
            The first RPS President was Gloria Gallo and the first Secretary was J. Charles Jennette.
            RPS has over 400 registered members from over 30 countries and all continents: Australia,
            Austria, Belgium, Brazil, Bulgaria, Canada, Chile, Colombia, Croatia, Denmark, France,
            Germany, Greece, Iceland, India, Iran, Italy, Japan, Korea, Malaysia, Mexico, Nigeria,
            Norway, Russia, Saudi Arabia, Scotland, Singapore, Slovenia, Spain, Sweden, Switzerland,
            Thailand, The Netherlands, Turkey, United Kingdom, United States of America, and Venezuela.
          </p>
        </div>
      </section>

      <section className="border-t border-gray-200 pt-4">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Further Reading</h2>
        <ul className="space-y-2">
          <li className="text-[11px] text-gray-400 leading-relaxed">
            Weening JJ, Jennette JC. Historical milestones in renal pathology. <span className="italic">Virchows Arch.</span> 2012 Jul;461(1):3–11.
          </li>
          <li className="text-[11px] text-gray-400 leading-relaxed">
            D'Agati VD, Mengel M. The rise of renal pathology in nephrology: structure illuminates function. <span className="italic">Am J Kidney Dis.</span> 2013 Jun;61(6):1016–25.
          </li>
        </ul>
      </section>
    </div>
  )
}
