import { useEffect, useRef } from 'react'
import { timeline, publications } from '../data'

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
        <h2 className="text-[#0C447C] text-lg font-bold mb-1">Landmark Publications</h2>
        <p className="text-xs text-gray-500 mb-4">
          Selected publications with significant RPS involvement that have shaped the field.
        </p>
        <div className="space-y-4">
          {publications.map((pub, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <span className="text-xs font-semibold text-[#0C447C] bg-[#0C447C]/10 px-2 py-0.5 rounded-full">
                {pub.year}
              </span>
              <p className="mt-2 text-sm font-semibold text-gray-900 leading-snug">{pub.title}</p>
              <p className="text-xs text-gray-500 italic mt-0.5">{pub.journal}</p>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">{pub.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
