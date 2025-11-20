// ArtikelPage component dengan Tailwind CSS
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listArticles } from '../admin/services/api'

type Article = {
  id: number
  title: string
  excerpt: string | null
  date: string
  image?: string | null
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'

function resolveImageUrl(url?: string | null): string {
  const fallback = '/img/logo.png'
  if (!url) return fallback
  if (url.startsWith('/uploads/')) return `${API_BASE}${url}`
  return url
}

export default function ArtikelPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    listArticles()
      .then((data) => {
        if (!mounted) return
        setArticles(Array.isArray(data) ? data : [])
      })
      .catch((e) => setError(e.message || 'Gagal memuat artikel'))
      .finally(() => setLoading(false))
    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900">Katalog Artikel</h1>
        <p className="text-gray-600 mt-2">Temukan artikel terbaru dan informasi menarik tentang ikan cupang</p>
      </div>

      {loading && <p className="text-gray-600">Memuat...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((a) => {
          const cover = resolveImageUrl(a.image)
          const dateLabel = new Date(a.date).toLocaleDateString('id-ID')
          return (
            <article key={a.id} className="bg-white rounded-2xl shadow hover:shadow-xl transition overflow-hidden">
              {/* Cover image with professional overlay */}
              <div className="relative aspect-video bg-gray-100">
                <img src={cover} alt={a.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
                  <h3 className="text-white text-lg font-semibold line-clamp-2 drop-shadow-sm">{a.title}</h3>
                  <span className="ml-3 px-2 py-1 rounded text-xs bg-white/80 text-gray-800 backdrop-blur">
                    {dateLabel}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                {a.excerpt && (
                  <p className="text-gray-700 text-sm mb-4 line-clamp-3">{a.excerpt}</p>
                )}
                <div className="flex items-center justify-between">
                  <Link
                    to={`/artikel/${a.id}`}
                    className="px-4 py-2 rounded-lg border border-primary-main text-primary-main hover:bg-primary-main hover:text-white transition-colors"
                  >
                    Baca
                  </Link>
                  <div className="text-xs text-gray-500">Artikel • {dateLabel}</div>
                </div>
              </div>
            </article>
          )
        })}
        {!loading && !error && articles.length === 0 && (
          <p className="text-gray-600">Belum ada artikel.</p>
        )}
      </div>
    </div>
  )
}
