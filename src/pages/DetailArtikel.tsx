// DetailArtikel component dengan Tailwind CSS
import { useParams, Link } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { getArticle } from '../admin/services/api'
import RelatedSection from '../components/RelatedSection'

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
  const [copied, setCopied] = useState(false)

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

        {/* Share */}
        <div className="mt-8 pt-8 border-t">
          <h4 className="text-lg font-semibold mb-4">Bagikan Artikel</h4>
          <div className="flex flex-wrap items-center gap-3">
            {(() => {
              const url = typeof window !== 'undefined' ? window.location.href : ''
              const title = artikel.title
              const open = (href: string) => window.open(href, '_blank', 'noopener,noreferrer')
              const onWhatsApp = () => {
                const href = `https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`
                open(href)
              }
              const onFacebook = () => {
                const href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`
                open(href)
              }
              const onTwitter = () => {
                const href = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
                open(href)
              }
              const onCopy = async () => {
                try {
                  await navigator.clipboard.writeText(url)
                  setCopied(true)
                  setTimeout(() => setCopied(false), 2000)
                } catch (_) {
                  setCopied(false)
                }
              }
              const onNativeShare = async () => {
                if (navigator.share) {
                  try {
                    await navigator.share({ title, text: title, url })
                  } catch (_) {}
                } else {
                  onCopy()
                }
              }
              return (
                <>
                  <button onClick={onNativeShare} className="px-4 py-2 rounded-lg bg-black text-white font-semibold flex items-center gap-2 hover:opacity-90 transition">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7"/><path d="M16 6l-4-4-4 4"/><path d="M12 2v14"/></svg>
                    Bagikan
                  </button>
                  <button onClick={onWhatsApp} className="px-4 py-2 rounded-lg bg-[#25D366] text-white font-semibold flex items-center gap-2 hover:brightness-95 transition">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.031-.967-.273-.099-.472-.148-.671.149-.198.297-.767.967-.94 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.477-.883-.787-1.48-1.758-1.653-2.055-.173-.297-.019-.458.13-.607.134-.133.297-.347.446-.52.149-.173.198-.297.297-.496.099-.198.05-.372-.025-.521-.075-.148-.671-1.616-.919-2.215-.243-.583-.487-.503-.671-.512-.173-.009-.372-.011-.571-.011-.198 0-.521.074-.794.372-.273.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.097 3.2 5.08 4.487.709.306 1.262.489 1.693.626.711.226 1.358.194 1.871.118.571-.085 1.758-.718 2.006-1.412.248-.694.248-1.288.173-1.412-.074-.124-.272-.198-.569-.347z"/></svg>
                    WhatsApp
                  </button>
                  <button onClick={onFacebook} className="px-4 py-2 rounded-lg bg-[#1877F2] text-white font-semibold flex items-center gap-2 hover:brightness-95 transition">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M22.675 0h-21.35C.597 0 0 .597 0 1.326v21.348C0 23.403.597 24 1.326 24h11.49v-9.294H9.691V11.01h3.125V8.414c0-3.1 1.894-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.796.716-1.796 1.765v2.314h3.587l-.467 3.696h-3.12V24h6.116C23.403 24 24 23.403 24 22.674V1.326C24 .597 23.403 0 22.675 0z"/></svg>
                    Facebook
                  </button>
                  <button onClick={onTwitter} className="px-4 py-2 rounded-lg bg-[#1DA1F2] text-white font-semibold flex items-center gap-2 hover:brightness-95 transition">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M23.954 4.569c-.885.392-1.83.656-2.825.775 1.014-.611 1.794-1.574 2.163-2.724-.949.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-2.723 0-4.932 2.208-4.932 4.932 0 .386.045.762.127 1.124-4.094-.205-7.719-2.165-10.148-5.144-.424.729-.666 1.577-.666 2.476 0 1.708.87 3.216 2.188 4.099-.807-.026-1.566-.247-2.228-.616v.062c0 2.385 1.694 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.317 0-.626-.03-.928-.086.631 1.969 2.463 3.401 4.632 3.442-1.698 1.33-3.832 2.121-6.159 2.121-.401 0-.799-.024-1.192-.07 2.197 1.41 4.807 2.235 7.614 2.235 9.142 0 14.307-7.721 14.307-14.414 0-.22-.005-.439-.015-.657.983-.711 1.834-1.6 2.511-2.614z"/></svg>
                    Twitter
                  </button>
                  <button onClick={onCopy} className="px-4 py-2 rounded-lg border border-primary-main text-primary-main font-semibold flex items-center gap-2 hover:bg-primary-main hover:text-white transition">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                    {copied ? 'Tautan Disalin' : 'Copy Link'}
                  </button>
                </>
              )
            })()}
          </div>
        </div>

        <RelatedSection kind="artikel" currentId={artikel.id} currentTags={artikel.tags || []} />
      </div>
    </div>
  )
}
