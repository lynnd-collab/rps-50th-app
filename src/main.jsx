import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

console.log('[env] VITE_SUPABASE_URL prefix:', import.meta.env.VITE_SUPABASE_URL?.slice(0, 10) ?? 'MISSING')

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
