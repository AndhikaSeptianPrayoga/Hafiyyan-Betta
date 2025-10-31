import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { userRegister, saveAuth } from '../services/auth'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const validate = () => {
    if (!name || !email || !password || !confirmPassword) {
      setError('Semua field wajib diisi')
      return false
    }
    if (name.trim().length < 3) {
      setError('Nama minimal 3 karakter')
      return false
    }
    if (!emailRegex.test(email)) {
      setError('Format email tidak valid')
      return false
    }
    if (password.length < 8) {
      setError('Password minimal 8 karakter')
      return false
    }
    if (password !== confirmPassword) {
      setError('Konfirmasi password tidak cocok')
      return false
    }
    return true
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!validate()) return
    setLoading(true)
    try {
      const auth = await userRegister(name, email, password)
      saveAuth(auth)
      navigate('/account', { replace: true })
    } catch (err: any) {
      setError(err?.message || 'Registrasi gagal')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white shadow rounded-xl p-6">
        <h1 className="text-xl font-semibold text-gray-900 mb-2">Registrasi</h1>
        <p className="text-sm text-gray-500 mb-4">Buat akun untuk melanjutkan checkout</p>
        {error && <div className="mb-3 text-sm text-red-600">{error}</div>}
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nama</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-primary-main"
              placeholder="Nama lengkap"
              required
            />
          </div>
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
              placeholder="Minimal 8 karakter"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Konfirmasi Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-primary-main"
              placeholder="Ulangi password"
              required
            />
          </div>
          <button type="submit" className="w-full px-4 py-2 rounded-lg bg-primary-main text-white hover:bg-primary-dark" disabled={loading}>
            {loading ? 'Memproses...' : 'Daftar'}
          </button>
        </form>
        <p className="text-sm text-gray-600 mt-3">
          Sudah punya akun?{' '}
          <Link to="/login" className="text-primary-main hover:text-primary-dark">
            Masuk
          </Link>
        </p>
      </div>
    </div>
  )
}