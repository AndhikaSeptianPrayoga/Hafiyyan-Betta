import { useEffect, useState } from 'react'

type TiktokItem = {
  id: string
  desc: string
  cover: string
  url: string
  createTime: number
  stats: {
    diggCount: number
    commentCount: number
    shareCount: number
    playCount: number
  }
}

const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000'

export default function TiktokChart() {
  const [items, setItems] = useState<TiktokItem[]>([])
  const [loading, setLoading] = useState(true)
  const [profileUrl, setProfileUrl] = useState<string>('https://www.tiktok.com/@hafiyyan.betta')
  const [error, setError] = useState<string | null>(null)
  const username = 'hafiyyan.betta'

  function formatCount(n: number) {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
    return String(n || 0)
  }

  function formatMonthDay(ts: number) {
    if (!ts) return ''
    const d = new Date(ts * 1000)
    const m = d.getMonth() + 1
    const day = d.getDate()
    return `${m}-${day}`
  }

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        // Coba ambil langsung dari TikWM terlebih dulu (lebih stabil)
        let incoming: TiktokItem[] = []
        try {
          const alt = await fetch(
            `https://www.tikwm.com/api/user/posts?unique_id=${username}&count=8`
            , {
              headers: {
                Accept: 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
              },
            }
          )
          const txt = await alt.text()
          const j = JSON.parse(txt)
          const posts = (j?.data?.posts || j?.data?.videos || j?.data?.aweme_list || []) as any[]
          incoming = posts
            .map((p: any) => {
              const id = p?.video_id || p?.aweme_id || p?.id || p?.awemeId
              const desc = p?.title || p?.desc || p?.description || ''
              const createTime = Number(p?.create_time || p?.createTime || p?.time || 0)
              const statsObj = p?.statistics || p?.stats || {}
              const video = p?.video || {}
              const cover =
                p?.cover || video?.cover || video?.origin_cover || p?.thumbnail?.url_list?.[0] || ''
              const shareUrl = p?.share_url || `https://www.tiktok.com/@${username}/video/${id}`
              return {
                id: String(id || ''),
                desc,
                cover,
                url: shareUrl,
                createTime,
                stats: {
                  diggCount: Number(
                    p?.digg_count ?? statsObj?.digg_count ?? statsObj?.diggCount ?? 0
                  ),
                  commentCount: Number(
                    p?.comment_count ?? statsObj?.comment_count ?? statsObj?.commentCount ?? 0
                  ),
                  shareCount: Number(
                    p?.share_count ?? statsObj?.share_count ?? statsObj?.shareCount ?? 0
                  ),
                  playCount: Number(
                    p?.play_count ?? statsObj?.play_count ?? statsObj?.playCount ?? 0
                  ),
                },
              } as TiktokItem
            })
            .filter((x) => x.id)
            .slice(0, 8)
        } catch {}

        // Jika TikWM gagal, baru coba backend
        if (!incoming.length) {
          const res = await fetch(`${API_BASE}/api/social/tiktok/${username}?limit=8`)
          const json = await res.json()
          incoming = Array.isArray(json?.items) ? json.items : []
          setProfileUrl(json?.profileUrl || `https://www.tiktok.com/@${username}`)
        } else {
          setProfileUrl(`https://www.tiktok.com/@${username}`)
        }

        setItems(incoming)
      } catch (e: any) {
        setError('Gagal memuat konten TikTok')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Konten TikTok Terbaru</h2>
            <p className="text-gray-600">Dari akun <a className="text-primary-main hover:underline" href={profileUrl} target="_blank" rel="noopener noreferrer">@hafiyyan.betta</a></p>
          </div>
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M12 3c5 0 9 4 9 9s-4 9-9 9-9-4-9-9 4-9 9-9m3.9 4.7c-.3 3.1-2.1 5.4-4.4 5.9v2.5c-2.4.5-4.4-.7-5-3 .7.4 1.6.5 2.5.3v-6.3h2.3v4.1c1.2-.4 2.1-1.7 2.2-3.5h2.4z"/></svg>
            Lihat Profil
          </a>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-black/5 overflow-hidden">
                <div className="relative w-full pb-[177%] bg-gray-200 animate-pulse" />
                <div className="p-3">
                  <div className="h-4 w-3/4 bg-gray-100 rounded" />
                  <div className="mt-2 h-3 w-1/2 bg-gray-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((it) => (
              <a
                key={it.id}
                href={it.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-2xl overflow-hidden bg-black text-white shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="relative w-full pb-[177%]">
                  <img src={it.cover} alt={it.desc || 'TikTok'} className="absolute inset-0 w-full h-full object-cover" />
                </div>
                <div className="p-3">
                  <p className="text-[13px] md:text-sm font-medium line-clamp-2">{it.desc || 'Video TikTok'}</p>
                  <p className="mt-1 text-[12px] text-white/70">{username}</p>
                  <div className="mt-2 flex items-center gap-3 text-[12px]">
                    <span className="inline-flex items-center gap-1"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5a5.5 5.5 0 0111 0c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>{formatCount(it.stats.diggCount)}</span>
                    <span className="inline-flex items-center gap-1"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4a2 2 0 00-2 2v16l4-4h14a2 2 0 002-2V4a2 2 0 00-2-2z"/></svg>{formatCount(it.stats.commentCount)}</span>
                    <span className="opacity-70">{formatMonthDay(it.createTime)}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Belum bisa memuat konten TikTok saat ini.</p>
            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800"
            >
              Buka TikTok @hafiyyan.betta
            </a>
            {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
          </div>
        )}
      </div>
    </section>
  )
}