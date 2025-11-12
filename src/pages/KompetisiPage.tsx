import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listOpenCompetitions } from '../admin/services/api'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'

function resolveImageUrl(url?: string | null): string {
  const fallback = '/img/logo.png'
  if (!url) return fallback
  // If relative upload path, prefix with API_BASE
  if (url.startsWith('/uploads/')) return `${API_BASE}${url}`
  return url
}

function isDjvu(url?: string | null): boolean {
  if (!url) return false
  try {
    const u = url.toLowerCase()
    return u.endsWith('.djvu') || u.endsWith('.djv') || u.startsWith('data:image/vnd.djvu') || u.startsWith('data:image/x-djvu')
  } catch {
    return false
  }
}

type Competition = {
  id: number
  title: string
  description?: string
  status: 'draft' | 'open' | 'closed'
  start_at?: string | null
  end_at?: string | null
  poster_image?: string | null
}

export default function KompetisiPage() {
  const [items, setItems] = useState<Competition[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    listOpenCompetitions()
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch((err) => setError(err?.message || 'Gagal memuat kompetisi'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <p className="text-gray-600">Memuat...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Gagal memuat kompetisi</h1>
        <p className="text-gray-600">{error}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900">Kompetisi Cupang</h1>
        <p className="text-gray-600 mt-2">Ikuti lomba dan raih juara</p>
      </div>

      {items.length === 0 ? (
        <p className="text-gray-600 text-center">Belum ada kompetisi yang dibuka.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((c) => (
            <div key={c.id} className="bg-white rounded-xl shadow overflow-hidden">
              <div className="w-full aspect-square overflow-hidden bg-gray-100">
                {isDjvu(c.poster_image) ? (
                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-600">
                    Poster DJVU tidak bisa ditampilkan. <a href={resolveImageUrl(c.poster_image)} target="_blank" rel="noreferrer" className="ml-1 text-primary-main">Buka</a>
                  </div>
                ) : (
                  <img src={resolveImageUrl(c.poster_image)} alt={c.title} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold">{c.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2 mt-1">{c.description}</p>
                <p className="text-xs text-gray-500 mt-1">Mulai: {c.start_at || '-'} {c.end_at ? `• Selesai: ${c.end_at}` : ''}</p>
                <div className="mt-3 flex justify-end">
                  <Link to={`/lomba/${c.id}`} className="px-3 py-2 rounded-lg bg-primary-main text-white hover:bg-primary-dark text-sm">Detail & Daftar</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}