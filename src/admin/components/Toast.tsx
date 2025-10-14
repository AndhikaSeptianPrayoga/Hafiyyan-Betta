import { useEffect } from 'react'

interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'info'
  onClose: () => void
  duration?: number
}

export default function Toast({ message, type = 'success', onClose, duration = 2000 }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, duration)
    return () => clearTimeout(t)
  }, [onClose, duration])

  const color = type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-sky-600'

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`text-white ${color} rounded-lg shadow px-4 py-2 text-sm`}>{message}</div>
    </div>
  )
}
