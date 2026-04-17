// Circles are fixed so the pattern is stable across renders.
// Positions, sizes, and colours were chosen to spread evenly without clustering.
const CIRCLES = [
  { cx: 8,   cy: 12,  r: 5,  fill: '#ffffff' },
  { cx: 28,  cy: 38,  r: 8,  fill: '#FFD700' },
  { cx: 55,  cy: 8,   r: 4,  fill: '#fb27e8' },
  { cx: 72,  cy: 52,  r: 11, fill: '#feb5d0' },
  { cx: 98,  cy: 22,  r: 6,  fill: '#FFD700' },
  { cx: 118, cy: 48,  r: 4,  fill: '#ffffff' },
  { cx: 140, cy: 10,  r: 9,  fill: '#fb27e8' },
  { cx: 160, cy: 40,  r: 5,  fill: '#feb5d0' },
  { cx: 185, cy: 18,  r: 12, fill: '#FFD700' },
  { cx: 205, cy: 55,  r: 4,  fill: '#ffffff' },
  { cx: 225, cy: 8,   r: 7,  fill: '#feb5d0' },
  { cx: 248, cy: 44,  r: 5,  fill: '#fb27e8' },
  { cx: 268, cy: 20,  r: 10, fill: '#ffffff' },
  { cx: 290, cy: 50,  r: 4,  fill: '#FFD700' },
  { cx: 310, cy: 12,  r: 6,  fill: '#feb5d0' },
  { cx: 332, cy: 38,  r: 8,  fill: '#ffffff' },
  { cx: 355, cy: 6,   r: 4,  fill: '#FFD700' },
  { cx: 372, cy: 46,  r: 11, fill: '#fb27e8' },
  { cx: 395, cy: 22,  r: 5,  fill: '#feb5d0' },
  { cx: 415, cy: 52,  r: 7,  fill: '#ffffff' },
  { cx: 18,  cy: 62,  r: 7,  fill: '#fb27e8' },
  { cx: 42,  cy: 20,  r: 4,  fill: '#feb5d0' },
  { cx: 88,  cy: 58,  r: 6,  fill: '#FFD700' },
  { cx: 128, cy: 30,  r: 4,  fill: '#fb27e8' },
  { cx: 175, cy: 62,  r: 5,  fill: '#FFD700' },
  { cx: 215, cy: 30,  r: 9,  fill: '#ffffff' },
  { cx: 258, cy: 62,  r: 4,  fill: '#feb5d0' },
  { cx: 345, cy: 58,  r: 6,  fill: '#fb27e8' },
  { cx: 385, cy: 38,  r: 4,  fill: '#FFD700' },
]

export default function Header() {
  return (
    <header className="relative bg-[#0C447C] text-white px-4 pt-6 pb-4 overflow-hidden">
      {/* Decorative circle pattern watermark */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none select-none"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 420 72"
        opacity="0.50"
      >
        {CIRCLES.map((c, i) => (
          <circle key={i} cx={c.cx} cy={c.cy} r={c.r} fill={c.fill} />
        ))}
      </svg>

      <div className="relative flex items-center gap-4 max-w-2xl mx-auto">
        {/* TODO: Replace with RPS logo PNG -- import rpsLogo from '../assets/rps_logo.png'
            Then use: <img src={rpsLogo} alt="RPS Logo" className="h-16 w-16 object-contain flex-shrink-0" /> */}
        <img
          src="/rps-logo.png"
          alt="RPS Logo"
          className="h-16 w-16 object-contain flex-shrink-0"
          onError={(e) => { e.target.style.display = 'none' }}
        />
        <div>
          <span className="inline-block text-xs font-semibold bg-white/20 text-white px-2 py-0.5 rounded-full mb-1 tracking-wide">
            1977 – 2027
          </span>
          <h1 className="text-xl font-bold leading-tight">Renal Pathology Society</h1>
          <p className="text-blue-200 text-sm font-medium tracking-wide">50th Anniversary</p>
        </div>
      </div>
    </header>
  )
}
