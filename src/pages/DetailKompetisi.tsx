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
  const [submitting, setSubmitting] = useState(false)
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(null)
  const [now, setNow] = useState(Date.now())

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
    // Pulihkan jawaban yang tersimpan sementara
    try {
      const key = `comp_answers_${cid}`
      const raw = localStorage.getItem(key)
      if (raw) {
        const saved = JSON.parse(raw)
        if (saved && typeof saved === 'object') setAnswers(saved)
      }
    } catch {}
  }, [id])

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const auth = getAuth()
    if (!auth.token) {
      // Simpan jawaban sementara agar tidak hilang setelah login
      try {
        const cid = Number(id)
        if (cid) localStorage.setItem(`comp_answers_${cid}`, JSON.stringify(answers))
      } catch {}
      navigate('/login', { replace: true, state: { redirectTo: `/lomba/${id}` } })
      return
    }
    if (!comp) return
    if (cooldownUntil && Date.now() < cooldownUntil) {
      setMessage('Mohon tunggu beberapa detik sebelum mengirim lagi.')
      return
    }
    setSubmitting(true)
    registerCompetition(comp.id, answers)
      .then(() => {
        setMessage('Pendaftaran berhasil dikirim. Anda dapat memantau status di halaman Account.')
        // Hapus jawaban tersimpan
        try {
          localStorage.removeItem(`comp_answers_${comp.id}`)
        } catch {}
        // Terapkan cooldown 10 detik untuk menghindari spam
        setCooldownUntil(Date.now() + 10000)
        // Arahkan ke halaman Account agar status peserta terlihat segera
        setTimeout(() => {
          navigate('/account', { replace: true })
        }, 800)
      })
      .catch((err) => setMessage(err?.message || 'Gagal mendaftar'))
      .finally(() => setSubmitting(false))
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
  const stats: any = (comp as any).stats || {}
  const startAt = (comp as any).start_at ? new Date((comp as any).start_at).getTime() : null
  const endAt = (comp as any).end_at ? new Date((comp as any).end_at).getTime() : null

  const fmtDelta = (ms: number) => {
    const s = Math.max(0, Math.floor(ms / 1000))
    const d = Math.floor(s / 86400)
    const h = Math.floor((s % 86400) / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sec = s % 60
    const parts = [] as string[]
    if (d) parts.push(`${d} hari`)
    if (h || d) parts.push(`${h} jam`)
    if (m || h || d) parts.push(`${m} menit`)
    parts.push(`${sec} detik`)
    return parts.join(' ')
  }
  let countdownLabel = ''
  if (startAt && now < startAt) countdownLabel = `Dibuka dalam ${fmtDelta(startAt - now)}`
  else if (endAt && now < endAt) countdownLabel = `Ditutup dalam ${fmtDelta(endAt - now)}`
  else if (endAt && now >= endAt) countdownLabel = 'Kompetisi telah berakhir'
  else countdownLabel = ''

  const isUrl = (val: any) => typeof val === 'string' && /^https?:\/\//i.test(val)
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'
  const resolveImageUrl = (url?: string | null): string => {
    const fallback = '/img/logo.png'
    if (!url) return fallback
    if (url.startsWith('/uploads/')) return `${API_BASE}${url}`
    return url
  }
  const isDjvu = (url?: string | null): boolean => {
    if (!url) return false
    const u = url.toLowerCase()
    return u.endsWith('.djvu') || u.endsWith('.djv') || u.startsWith('data:image/vnd.djvu') || u.startsWith('data:image/x-djvu')
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-6">
        <Link to="/lomba" className="text-primary-main hover:underline text-sm">&larr; Kembali</Link>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="w-full aspect-square bg-gray-100 overflow-hidden rounded mb-4">
            {isDjvu((comp as any).poster_image) ? (
              <div className="w-full h-full flex items-center justify-center text-xs text-gray-600">
                Poster DJVU tidak bisa ditampilkan. <a href={resolveImageUrl((comp as any).poster_image)} target="_blank" rel="noreferrer" className="ml-1 text-primary-main">Buka</a>
              </div>
            ) : (
              <img src={resolveImageUrl((comp as any).poster_image)} alt={comp.title} className="w-full h-full object-cover" />
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{comp.title}</h1>
          <p className="text-gray-700 mt-2">{comp.description}</p>
          <div className="mt-2 text-sm text-gray-600">
            <span>Status: <span className="font-medium">{comp.status}</span></span>
            {typeof (comp as any).max_participants === 'number' && (
              <span className="ml-2">• Kuota: {stats.total ?? 0}/{(comp as any).max_participants}</span>
            )}
            {(startAt || endAt) && (
              <span className="ml-2">• {countdownLabel}</span>
            )}
          </div>
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
                      <>
                        <input
                          className="form-input"
                          required={!!fld.required}
                          placeholder={fld.name === 'foto_ikan' ? 'Tempel URL gambar (Google Drive - publik)' : ''}
                          onChange={(e) => setAnswers((a) => ({ ...a, [fld.name]: e.target.value }))}
                        />
                        {fld.name === 'foto_ikan' && (
                          <div className="mt-2 space-y-2">
                            <p className="text-xs text-gray-600">Masukkan tautan URL gambar (contoh dari Google Drive yang dibuka publik). Pastikan dapat diakses tanpa login.</p>
                            {isUrl(answers[fld.name]) ? (
                              <div className="flex items-center gap-2">
                                <a href={answers[fld.name]} target="_blank" rel="noreferrer" className="text-primary-main hover:underline break-all">Buka URL</a>
                                <button type="button" className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200" onClick={() => navigator.clipboard.writeText(String(answers[fld.name] || '')).then(() => setMessage('URL disalin'))}>Salin URL</button>
                              </div>
                            ) : null}
                            {answers[fld.name] ? (
                              <div className="mt-1 w-24 h-24 aspect-square bg-gray-100 rounded overflow-hidden">
                                <img src={answers[fld.name]} alt="Preview foto ikan" className="w-full h-full object-cover" />
                              </div>
                            ) : null}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
                <div className="flex items-center justify-end gap-3">
                  {cooldownUntil && now < cooldownUntil ? (
                    <span className="text-xs text-gray-500">Cooldown {Math.ceil((cooldownUntil - now) / 1000)} detik</span>
                  ) : null}
                  <button
                    type="submit"
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={submitting || (cooldownUntil != null && now < cooldownUntil)}
                  >
                    Kirim Pendaftaran
                  </button>
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