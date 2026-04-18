import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary] Caught rendering error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          onClick={() => window.location.reload()}
          className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4 px-6 cursor-pointer"
        >
          <div className="w-16 h-16 rounded-full bg-[#0C447C]/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-[#0C447C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <p className="text-[#0C447C] font-semibold text-base">Something went wrong</p>
          <p className="text-gray-500 text-sm">Tap to reload</p>
        </div>
      )
    }
    return this.props.children
  }
}
