import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { getMe } from './services/api'

export default function RequireAdmin({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<'checking' | 'ok' | 'no'>('checking')

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      setStatus('no')
      return
    }
    getMe(token)
      .then(() => setStatus('ok'))
      .catch(() => setStatus('no'))
  }, [])

  if (status === 'checking') {
    return <div className="p-6 text-sm text-gray-600">Memeriksa sesi admin...</div>
  }
  if (status === 'no') {
    return <Navigate to="/admin/login" replace />
  }
  return <>{children}</>
}