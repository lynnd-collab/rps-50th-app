import { useRegisterSW } from 'virtual:pwa-register/react'

export default function UpdateBanner() {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW()

  if (!needRefresh) return null

  return (
    <button
      onClick={() => updateServiceWorker(true)}
      className="fixed bottom-0 left-0 right-0 z-50 bg-[#0C447C] text-white text-sm font-semibold py-3.5 px-4 text-center shadow-lg hover:bg-[#1a5a9e] active:bg-[#083460] transition-colors"
    >
      Update available — tap to refresh
    </button>
  )
}
