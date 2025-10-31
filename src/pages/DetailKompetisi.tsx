import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getAuth } from '../services/auth'
import { getCompetition, registerCompetition, type CompetitionField } from '../admin/services/api'

type Competition = {
  id: number
  title: string
  description?: string
  requirements?: string[]
  form_fields?: CompetitionField[]
  status: 'draft' | 'open' | 'closed'
}

export default function DetailKompetisi() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [comp, setComp] = useState<Competition | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [message, setMessage] = useState('')

  useEffect(() => {
    const cid = Number(id)
    if (!cid) {
      setError('Kompetisi tidak ditemukan')
      setLoading(false)
      return
    }
    getCompetition(cid)
      .then((data) => {
        setComp(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err?.message || 'Gagal memuat kompetisi')
        setLoading(false)
      })
  }, [id])

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const auth = getAuth()
    if (!auth.token) {
      navigate('/login', { replace: true, state: { redirectTo: `/lomba/${id}` } })
      return
    }
    if (!comp) return
    registerCompetition(comp.id, answers)
      .then(() => setMessage('Pendaftaran berhasil dikirim. Anda dapat memantau status di halaman Account.'))
      .catch((err) => setMessage(err?.message || 'Gagal mendaftar'))
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <p className="text-gray-600">Memuat...</p>
      </div>
    )
  }

  if (error || !comp) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Gagal memuat kompetisi</h1>
        <p className="text-gray-600">{error || 'Kompetisi tidak ditemukan'}</p>
        <div className="mt-4"><Link to="/lomba" className="text-primary-main hover:underline">Kembali ke daftar kompetisi</Link></div>
      </div>
    )
  }

  const fields = Array.isArray(comp.form_fields) ? comp.form_fields : []
  const isOpen = comp.status === 'open'

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-6">
        <Link to="/lomba" className="text-primary-main hover:underline text-sm">&larr; Kembali</Link>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          { (comp as any).poster_image ? (
            <div className="w-full aspect-square bg-gray-100 overflow-hidden rounded mb-4">
              <img src={(comp as any).poster_image} alt={comp.title} className="w-full h-full object-cover" />
            </div>
          ) : null }
          <h1 className="text-3xl font-bold text-gray-900">{comp.title}</h1>
          <p className="text-gray-700 mt-2">{comp.description}</p>
          <div className="mt-6">
            <h2 className="text-xl font-semibold">Requirement Lomba</h2>
            {Array.isArray(comp.requirements) && comp.requirements.length > 0 ? (
              <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-700">
                {comp.requirements.map((r, idx) => (
                  <li key={idx}>{r}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">Belum ada requirement khusus.</p>
            )}
          </div>
        </div>
        <div>
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold">Form Pendaftaran</h3>
            {!isOpen ? (
              <p className="text-sm text-gray-600 mt-2">Pendaftaran belum dibuka.</p>
            ) : (
              <form onSubmit={onSubmit} className="mt-3 space-y-3">
                {fields.map((fld) => (
                  <div key={fld.name}>
                    <label className="form-label">{fld.label}{fld.required ? ' *' : ''}</label>
                    {fld.type === 'number' ? (
                      <input
                        type="number"
                        className="form-input"
                        required={!!fld.required}
                        onChange={(e) => setAnswers((a) => ({ ...a, [fld.name]: e.target.value ? Number(e.target.value) : '' }))}
                      />
                    ) : (
                      <input
                        className="form-input"
                        required={!!fld.required}
                        onChange={(e) => setAnswers((a) => ({ ...a, [fld.name]: e.target.value }))}
                      />
                    )}
                  </div>
                ))}
                <div className="flex justify-end">
                  <button type="submit" className="btn-primary">Kirim Pendaftaran</button>
                </div>
                {message && <p className="text-sm text-gray-700">{message}</p>}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}