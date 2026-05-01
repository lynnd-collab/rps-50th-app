const tabs = ['History', 'Celebrate', 'Awards', 'Games', 'About']

export default function TabBar({ active, onChange }) {
  return (
    <nav className="bg-[#0C447C] border-t border-white/10 sticky top-0 z-10">
      <div className="flex max-w-2xl mx-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            className={`tab-btn ${active === tab ? 'tab-btn-active' : 'tab-btn-inactive'}`}
          >
            {tab}
          </button>
        ))}
      </div>
    </nav>
  )
}
