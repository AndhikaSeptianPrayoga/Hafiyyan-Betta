// ArtikelPage component dengan Tailwind CSS
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listArticles } from '../admin/services/api'

type Article = {
  id: number
  title: string
  excerpt: string | null
  date: string
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
      <div className="flex items-end justify-between mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary-main">Artikel Terbaru</h1>
      </div>

      {loading && <p className="text-gray-600">Memuat...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((a) => (
          <article key={a.id} className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{a.title}</h3>
            <p className="text-sm text-gray-500 mb-3">
              {new Date(a.date).toLocaleDateString('id-ID')}
            </p>
            {a.excerpt && <p className="text-gray-600 text-sm mb-4">{a.excerpt}</p>}
            <Link to={`/artikel/${a.id}`} className="btn-secondary">
              Baca
            </Link>
          </article>
        ))}
        {!loading && !error && articles.length === 0 && (
          <p className="text-gray-600">Belum ada artikel.</p>
        )}
      </div>
    </div>
  )
}
