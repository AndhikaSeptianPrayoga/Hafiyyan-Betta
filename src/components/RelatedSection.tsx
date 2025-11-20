import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { listArticles, listFish, listNeeds } from '../admin/services/api'

type Kind = 'artikel' | 'ikan' | 'kebutuhan'

type Article = { id: number; title: string; date: string; image?: string | null; tags?: string[]; excerpt?: string | null }
type Fish = { id: number; name: string; price: number; mainImage?: string | null; images?: string[] | null; stock?: number }
type Need = { id: number; name: string; price: number; mainImage?: string | null; images?: string[] | null; stock?: number }

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'
const resolveImageUrl = (url?: string | null) => {
  const fallback = '/img/logo.png'
  if (!url) return fallback
  if (url.startsWith('/uploads/')) return `${API_BASE}${url}`
  return url
}

export default function RelatedSection({ kind, currentId, currentTags = [] }: { kind: Kind; currentId: number; currentTags?: string[] }) {
  const [items, setItems] = useState<Array<any>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    const load = async () => {
      try {
        if (kind === 'artikel') {
          const data = await listArticles()
          setItems(Array.isArray(data) ? data : [])
        } else if (kind === 'ikan') {
          const data = await listFish()
          setItems(Array.isArray(data) ? data : [])
        } else {
          const data = await listNeeds()
          setItems(Array.isArray(data) ? data : [])
        }
      } catch (e: any) {
        setError(e?.message || 'Gagal memuat terkait')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [kind])

  const related = useMemo(() => {
    const pool = items.filter((it: any) => it && it.id !== currentId)
    if (kind === 'artikel') {
      // Prioritaskan berdasarkan kecocokan tags
      const scored = pool.map((a: Article) => {
        const tags = Array.isArray(a.tags) ? a.tags : []
        const score = tags.filter((t) => currentTags.includes(t)).length
        return { item: a, score }
      })
      scored.sort((a, b) => b.score - a.score || new Date(b.item.date).getTime() - new Date(a.item.date).getTime())
      return scored.slice(0, 3).map((s) => s.item)
    }
    // Untuk ikan/kebutuhan, ambil 3 item dengan stok > 0, fallback ke item lain
    const withStock = pool.filter((it: Fish | Need) => (typeof it.stock === 'number' ? it.stock > 0 : true))
    const pick = (withStock.length > 0 ? withStock : pool).slice(0, 3)
    return pick
  }, [items, currentId, currentTags, kind])

  if (loading || error || related.length === 0) return null

  return (
    <section className="mt-16">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">{kind === 'artikel' ? 'Artikel Terkait' : kind === 'ikan' ? 'Ikan Terkait' : 'Produk Terkait'}</h3>
      <div className="grid md:grid-cols-3 gap-6">
        {related.map((r: any) => {
          const image = resolveImageUrl(
            kind === 'artikel'
              ? r.image
              : r.mainImage || (Array.isArray(r.images) && r.images[0]) || ''
          )
          const title = kind === 'artikel' ? r.title : r.name
          const meta = kind === 'artikel' ? new Date(r.date).toLocaleDateString('id-ID') : `Rp ${r.price?.toLocaleString('id-ID')}`
          const to = kind === 'artikel' ? `/artikel/${r.id}` : kind === 'ikan' ? `/ikan/${r.id}` : `/kebutuhan/${r.id}`
          return (
            <Link key={`${kind}-${r.id}`} to={to} className="group block">
              <div className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden">
                <div className="relative aspect-[4/3] bg-gray-100">
                  <img src={image} alt={title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition" />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-gray-900 line-clamp-2">{title}</h4>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-3">{meta}</span>
                  </div>
                  {kind === 'artikel' && r.excerpt && (
                    <p className="text-sm text-gray-600 line-clamp-2">{r.excerpt}</p>
                  )}
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}