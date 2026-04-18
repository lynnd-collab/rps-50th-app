import { useState, useEffect } from 'react'
import { events } from '../data'
import Gallery from '../components/Gallery'
import WhoAmI from '../components/WhoAmI'

// March 14 2027 19:00:00 PDT = March 15 2027 02:00:00 UTC
const PARTY_DATE = new Date('2027-03-15T02:00:00.000Z')

function getTimeLeft() {
  const diff = PARTY_DATE - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1_000),
  }
}

function CountdownUnit({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <span
        className="text-4xl font-black tabular-nums leading-none"
        style={{ color: '#fb27e8', textShadow: '0 0 20px rgba(251,39,232,0.35)' }}
      >
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-[10px] font-semibold uppercase tracking-widest mt-1 text-white/70">
        {label}
      </span>
    </div>
  )
}

function Countdown() {
  const [time, setTime] = useState(getTimeLeft)

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="rounded-2xl overflow-hidden shadow-lg mb-6">
      <div className="bg-[#0C447C] px-4 pt-4 pb-3 text-center">
        <p className="text-xs font-semibold tracking-widest uppercase text-white/60 mb-0.5">
          Countdown to
        </p>
        <p className="font-bold text-white leading-tight" style={{ fontSize: '22px' }}>
          🎂 RPS 50th Birthday Party 🎂
        </p>
        <p className="text-sm text-white/60 mt-0.5">March 14, 2027 · 7:00 PM PDT · Vancouver</p>
      </div>
      <div
        className="px-4 py-5 flex items-center justify-center gap-4"
        style={{ background: 'linear-gradient(135deg, #083460 0%, #0C447C 60%, #1a2a4a 100%)' }}
      >
        <CountdownUnit value={time.days} label="Days" />
        <Separator />
        <CountdownUnit value={time.hours} label="Hours" />
        <Separator />
        <CountdownUnit value={time.minutes} label="Mins" />
        <Separator />
        <CountdownUnit value={time.seconds} label="Secs" />
      </div>
    </div>
  )
}

function Separator() {
  return (
    <span
      className="text-2xl font-black self-start mt-1 animate-pulse-50"
      style={{ color: '#fb27e8' }}
    >
      :
    </span>
  )
}

const CalendarIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)

const PinIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

export default function Celebrate() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <Countdown />

      <h2 className="text-[#0C447C] text-lg font-bold mb-4">Upcoming Events</h2>
      <div className="space-y-4 mb-8">
        {events.map((ev, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-[#0C447C] px-4 py-3">
              <h3 className="text-white font-bold text-base leading-tight">{ev.name}</h3>
            </div>
            <div className="px-4 py-3 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CalendarIcon />
                <span>{ev.dates}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <PinIcon />
                <span>{ev.location}</span>
              </div>
              {ev.description && (
                <p className="text-sm text-gray-700 leading-relaxed pt-1">{ev.description}</p>
              )}
              {ev.link && (
                <a
                  href={ev.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-sm font-semibold text-[#0C447C] underline underline-offset-2 hover:text-[#1a5a9e]"
                >
                  Learn more →
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      <Gallery />

      <div className="mt-8">
        <WhoAmI />
      </div>
    </div>
  )
}
