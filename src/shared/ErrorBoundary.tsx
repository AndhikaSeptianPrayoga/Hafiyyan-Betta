import React from 'react'

type ErrorBoundaryProps = {
  fallback?: React.ReactNode
  onReset?: () => void
  children: React.ReactNode
}

type ErrorBoundaryState = {
  hasError: boolean
  error?: Error
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // You can send this to monitoring service
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined })
    this.props.onReset?.()
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="container mx-auto px-4 py-16">
            <div className="bg-white rounded-xl shadow p-6 text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Terjadi Kesalahan</h2>
              <p className="text-sm text-gray-600 mb-4">
                Mohon maaf, ada masalah saat memuat konten. Silakan coba lagi.
              </p>
              <div className="flex items-center justify-center gap-2">
                <button onClick={this.handleReset} className="px-4 py-2 rounded-lg border">
                  Coba Lagi
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 rounded-lg bg-primary-main text-white"
                >
                  Muat Ulang
                </button>
              </div>
            </div>
          </div>
        )
      )
    }
    return this.props.children
  }
}
