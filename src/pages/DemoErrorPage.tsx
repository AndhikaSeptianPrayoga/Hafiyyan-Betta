import { useState } from 'react'

export default function DemoErrorPage() {
  const [explode, setExplode] = useState(false)

  if (explode) {
    // Simulate render-time error
    throw new Error('Demo error triggered!')
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold mb-4">Demo ErrorBoundary</h1>
      <p className="text-gray-700 mb-6">
        Klik tombol di bawah untuk memicu error dan melihat tampilan fallback dari ErrorBoundary.
      </p>
      <button
        className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
        onClick={() => setExplode(true)}
      >
        Trigger Error
      </button>
    </div>
  )
}