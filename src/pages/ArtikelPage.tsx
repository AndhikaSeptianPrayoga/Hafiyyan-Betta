// ArtikelPage component dengan Tailwind CSS
import { Link } from 'react-router-dom'

export default function ArtikelPage() {
  const articles = [
    {
      id: 1,
      title: 'Panduan Dasar Merawat Cupang',
      excerpt: 'Air, pakan, dan setting tank untuk pemula.',
      date: '2025-01-01',
    },
    {
      id: 2,
      title: 'Mengenal Varietas Betta',
      excerpt: 'Halfmoon, Plakat, Giant, dan lain-lain.',
      date: '2025-01-05',
    },
    {
      id: 3,
      title: 'Tips Breeding Sukses',
      excerpt: 'Kondisioning indukan hingga perawatan burayak.',
      date: '2025-01-10',
    },
  ]
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex items-end justify-between mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary-main">Artikel Terbaru</h1>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((a) => (
          <article key={a.id} className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{a.title}</h3>
            <p className="text-sm text-gray-500 mb-3">
              {new Date(a.date).toLocaleDateString('id-ID')}
            </p>
            <p className="text-gray-600 text-sm mb-4">{a.excerpt}</p>
            <Link to={`/artikel/${a.id}`} className="btn-secondary">
              Baca
            </Link>
          </article>
        ))}
      </div>
    </div>
  )
}
