// DetailArtikel component dengan Tailwind CSS
import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getArticle } from '../admin/services/api'

type Article = {
  id: number
  title: string
  author: string | null
  date: string
  image: string | null
  content: string | null
  tags?: string[]
}

export default function DetailArtikel() {
  const { id } = useParams<{ id: string }>()
  const [artikel, setArtikel] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const articleId = Number(id)
    if (!articleId) {
      setError('Artikel tidak ditemukan')
      setLoading(false)
      return
    }
    getArticle(articleId)
      .then((data) => setArtikel(data))
      .catch((e) => setError(e.message || 'Artikel tidak ditemukan'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <p className="text-gray-600">Memuat...</p>
      </div>
    )
  }

  if (error || !artikel) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Artikel Tidak Ditemukan</h1>
        <Link to="/artikel" className="btn-primary">
          Kembali ke Artikel
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
        <Link to="/" className="hover:text-primary-main">
          Beranda
        </Link>
        <span>/</span>
        <Link to="/artikel" className="hover:text-primary-main">
          Artikel
        </Link>
        <span>/</span>
        <span className="text-gray-900">{artikel.title}</span>
      </nav>

      {/* Hero Section */}
      <div className="mb-12">
        <div className="aspect-video rounded-2xl overflow-hidden mb-6">
          {artikel.image && (
            <img src={artikel.image} alt={artikel.title} className="w-full h-full object-cover" />
          )}
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <span className="px-3 py-1 bg-primary-main text-white text-sm rounded-full">
              Artikel
            </span>
            <span className="text-gray-600">{new Date(artikel.date).toLocaleDateString('id-ID')}</span>
            <span className="text-gray-600">•</span>
            <span className="text-gray-600">{artikel.author || 'Admin'}</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{artikel.title}</h1>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 bg-primary-main rounded-full flex items-center justify-center text-white font-bold">
              {(artikel.author || 'A').charAt(0)}
            </div>
            <div>
              <p className="font-semibold">{artikel.author || 'Admin'}</p>
              <p className="text-sm text-gray-600">Penulis</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto">
        {artikel.content && (
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: artikel.content }}
          />
        )}

        {/* Tags */}
        <div className="mt-12 pt-8 border-t">
          <h4 className="text-lg font-semibold mb-4">Tags</h4>
          <div className="flex flex-wrap gap-2">
            {(artikel.tags || []).map((tag: string, index: number) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-primary-main hover:text-white transition-colors cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Share Buttons */}
        <div className="mt-8 pt-8 border-t">
          <h4 className="text-lg font-semibold mb-4">Bagikan Artikel</h4>
          <div className="flex gap-3">
            <button className="btn-primary">WhatsApp</button>
            <button className="btn-secondary">Facebook</button>
            <button className="btn-secondary">Twitter</button>
            <button className="btn-secondary">Copy Link</button>
          </div>
        </div>

        {/* Related Articles */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Artikel Terkait</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card">
              <img
                src="/img/betta-img/cupang (6).jpg"
                alt="Artikel Terkait"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h4 className="font-bold text-gray-900 mb-2">Tips Breeding Ikan Cupang</h4>
              <p className="text-gray-600 text-sm">
                Pelajari teknik breeding yang tepat untuk menghasilkan anakan berkualitas.
              </p>
            </div>
            <div className="card">
              <img
                src="/img/betta-img/cupang (7).jpg"
                alt="Artikel Terkait"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h4 className="font-bold text-gray-900 mb-2">Mengatasi Penyakit Ikan Cupang</h4>
              <p className="text-gray-600 text-sm">
                Kenali gejala dan cara mengatasi penyakit umum pada ikan cupang.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
