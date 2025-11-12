import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { userLogin, saveAuth, getAuth } from '../services/auth'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = (location.state as any)?.redirectTo || '/account'
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  useEffect(() => {
    const { token } = getAuth()
    if (token) navigate(redirectTo, { replace: true })
  }, [navigate])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Basic format validation
    if (!emailRegex.test(email)) {
      setError('Format email tidak valid')
      return
    }
    if (password.length < 8) {
      setError('Password minimal 8 karakter')
      return
    }
    setLoading(true)
    setError('')
    try {
      const auth = await userLogin(email, password)
      saveAuth(auth)
      navigate(redirectTo, { replace: true })
    } catch (err: any) {
      setError(err?.message || 'Login gagal')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white shadow rounded-xl p-6">
        <h1 className="text-xl font-semibold text-gray-900 mb-2">Login</h1>
        <p className="text-sm text-gray-500 mb-4">Masuk untuk melanjutkan</p>
        {error && <div className="mb-3 text-sm text-red-600">{error}</div>}
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-primary-main"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-primary-main"
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" className="w-full px-4 py-2 rounded-lg bg-primary-main text-white hover:bg-primary-dark" disabled={loading}>
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>
        <p className="text-sm text-gray-600 mt-3">
          Belum punya akun?{' '}
          <Link to="/register" className="text-primary-main hover:text-primary-dark">
            Daftar
          </Link>
        </p>
      </div>
    </div>
  )
}