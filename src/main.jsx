import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import ErrorBoundary from './components/ErrorBoundary'
import './index.css'

console.log('[env] VITE_SUPABASE_URL prefix:', import.meta.env.VITE_SUPABASE_URL?.slice(0, 10) ?? 'MISSING')

window.addEventListener('error', (e) => {
  console.error('[uncaught error]', e.message, e.filename, e.lineno, e.error)
})
window.addEventListener('unhandledrejection', (e) => {
  console.error('[unhandled promise rejection]', e.reason)
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
)
