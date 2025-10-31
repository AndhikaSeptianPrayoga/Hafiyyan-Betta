import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAuth, clearAuth, userMe } from '../services/auth'
import { myCompetitions } from '../admin/services/api'

export default function AccountPage() {
  const navigate = useNavigate()
  const [{ user }, setState] = useState<{ user: any; token: string | null }>({ user: null, token: null })

  useEffect(() => {
    const auth = getAuth()
    if (!auth.token) {
      navigate('/login', { replace: true, state: { redirectTo: '/account' } })
      return
    }
    userMe(auth.token)
      .then((u) => setState({ user: u, token: auth.token }))
      .catch(() => setState({ user: auth.user, token: auth.token }))
  }, [navigate])

  const logout = () => {
    clearAuth()
    navigate('/', { replace: true })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Profil</h1>
      {!user ? (
        <p className="text-gray-600">Memuat data profil...</p>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow p-6 space-y-2">
            <p><span className="font-semibold">Nama:</span> {user.name}</p>
            <p><span className="font-semibold">Email:</span> {user.email}</p>
            <p><span className="font-semibold">Role:</span> {user.role}</p>
            <button onClick={logout} className="mt-4 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600">Keluar</button>
          </div>

          <KompetisiSaya />
        </div>
      )}
    </div>
  )
}

function KompetisiSaya() {
  const [items, setItems] = useState<any[]>([])
  const [error, setError] = useState('')
  useEffect(() => {
    myCompetitions()
      .then((rows) => setItems(Array.isArray(rows) ? rows : []))
      .catch((err) => setError(err?.message || 'Gagal memuat status kompetisi'))
  }, [])
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold">Kompetisi Saya</h2>
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
      {items.length === 0 ? (
        <p className="text-sm text-gray-600 mt-2">Belum ada pendaftaran kompetisi.</p>
      ) : (
        <table className="min-w-full mt-3">
          <thead>
            <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500">
              <th className="px-3 py-2">Kompetisi</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Peringkat</th>
              <th className="px-3 py-2">Komentar Admin</th>
            </tr>
          </thead>
          <tbody>
            {items.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="px-3 py-2">{r.competition_title}</td>
                <td className="px-3 py-2 text-sm">{r.status}</td>
                <td className="px-3 py-2 text-sm">{r.final_position || (typeof r.ranking === 'number' ? `Peringkat ${r.ranking}` : '-')}</td>
                <td className="px-3 py-2 text-sm">{r.last_score?.comment || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}