import { Router, Request, Response } from 'express'

// Endpoint sederhana untuk mengambil konten TikTok terbaru dari halaman user
// Teknik: fetch halaman profil, ekstrak JSON SIGI_STATE, ambil ItemModule
// Catatan: TikTok dapat membatasi akses; jika gagal, kita kembalikan array kosong

const router = Router()

router.get('/tiktok/:username', async (req: Request, res: Response) => {
  const username = (req.params.username || '').replace(/^@/, '')
  if (!username) return res.status(400).json({ error: 'Username diperlukan' })
  const url = `https://www.tiktok.com/@${username}`
  const limit = Math.max(1, Math.min(50, Number((req.query.limit as string) || 12)))
  try {
    // 1) Utamakan TikWM (lebih stabil)
    let items: any[] = []
    try {
      const apiUrl = `https://www.tikwm.com/api/user/posts?unique_id=${encodeURIComponent(
        username
      )}&count=${limit}`
      const alt = await fetch(apiUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36',
          Referer: 'https://www.tikwm.com/',
          Origin: 'https://www.tikwm.com',
          Accept: 'application/json',
          'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
          'X-Requested-With': 'XMLHttpRequest',
        },
      })
      const txt = await alt.text()
      let j: any = null
      try {
        j = JSON.parse(txt)
      } catch {}
      const posts = (j?.data?.posts || j?.data?.videos || j?.data?.aweme_list || []) as any[]
      items = posts
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
            id,
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
          }
        })
        .filter((x: any) => x?.id)
        .sort((a: any, b: any) => b.createTime - a.createTime)
    } catch {}

    // 2) Jika TikWM gagal/kosong, baru coba scraping halaman TikTok
    if (!items.length) {
      try {
        const resp = await fetch(url, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36',
            'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
            Accept: 'text/html',
          },
        })
        const html = await resp.text()
        const match = html.match(
          /<script id="SIGI_STATE" type="application\/json">([\s\S]+?)<\/script>/
        )
        if (match) {
          const sigi = JSON.parse(match[1])
          const itemModule = sigi?.ItemModule || {}
          items = Object.values(itemModule)
            .map((it: any) => {
              const id = it?.id
              const desc = it?.desc || ''
              const createTime = Number(it?.createTime || 0)
              const stats = it?.stats || {}
              const video = it?.video || {}
              const cover =
                video?.originCover || video?.cover || it?.cover || video?.dynamicCover || ''
              const shareUrl = `https://www.tiktok.com/@${username}/video/${id}`
              return {
                id,
                desc,
                cover,
                url: shareUrl,
                createTime,
                stats: {
                  diggCount: Number(stats?.diggCount || 0),
                  commentCount: Number(stats?.commentCount || 0),
                  shareCount: Number(stats?.shareCount || 0),
                  playCount: Number(stats?.playCount || 0),
                },
              }
            })
            .filter((x: any) => x?.id)
            .sort((a: any, b: any) => b.createTime - a.createTime)
        }
      } catch {}
    }

    return res.json({ items: items.slice(0, limit), profileUrl: url })
  } catch (err) {
    console.error('Fetch TikTok failed:', err)
    return res.json({ items: [], profileUrl: url })
  }
})

export default router