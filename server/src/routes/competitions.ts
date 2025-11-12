import { Router, Request, Response } from 'express'
import fs from 'fs'
import path from 'path'
import { query } from '../db'
import auth from '../middleware/auth'
import requireAdmin from '../middleware/requireAdmin'

const router = Router()

async function ensureTables() {
  await query(`
    CREATE TABLE IF NOT EXISTS competitions (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      requirements JSONB DEFAULT '[]'::jsonb,
      form_fields JSONB DEFAULT '[]'::jsonb,
      status TEXT NOT NULL DEFAULT 'draft',
      start_at TIMESTAMP NULL,
      end_at TIMESTAMP NULL,
      max_participants INTEGER NULL,
      poster_image TEXT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `)
  // Ensure new columns exist if table already created previously
  await query(`ALTER TABLE competitions ADD COLUMN IF NOT EXISTS max_participants INTEGER NULL;`)
  await query(`ALTER TABLE competitions ADD COLUMN IF NOT EXISTS poster_image TEXT NULL;`)
  await query(`
    CREATE TABLE IF NOT EXISTS competition_registrations (
      id SERIAL PRIMARY KEY,
      competition_id INTEGER NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
      customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
      answers JSONB NOT NULL DEFAULT '{}'::jsonb,
      status TEXT NOT NULL DEFAULT 'pending',
      ranking INTEGER NULL,
      final_position TEXT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      UNIQUE(competition_id, customer_id)
    );
  `)
  await query(`
    CREATE TABLE IF NOT EXISTS competition_scores (
      id SERIAL PRIMARY KEY,
      registration_id INTEGER NOT NULL REFERENCES competition_registrations(id) ON DELETE CASCADE,
      judge_id INTEGER NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
      scores JSONB NOT NULL DEFAULT '{}'::jsonb,
      total_score NUMERIC NULL,
      comment TEXT DEFAULT '',
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `)
}

ensureTables().catch((e) => console.error('Ensure competitions tables failed', e))

// Public: list competitions (all)
router.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await query('SELECT * FROM competitions ORDER BY created_at DESC')
    res.json(result.rows)
  } catch (e) {
    res.status(500).json({ error: 'Gagal memuat kompetisi' })
  }
})

// Public: list open competitions
router.get('/open', async (_req: Request, res: Response) => {
  try {
    const result = await query(
      'SELECT * FROM competitions WHERE status = $1 ORDER BY start_at NULLS LAST, created_at DESC',
      ['open']
    )
    res.json(result.rows)
  } catch (e) {
    res.status(500).json({ error: 'Gagal memuat kompetisi' })
  }
})

// Public: get competition detail
router.get('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  if (!id) return res.status(400).json({ error: 'ID tidak valid' })
  try {
    const comp = await query('SELECT * FROM competitions WHERE id = $1', [id])
    if (!comp.rows[0]) return res.status(404).json({ error: 'Kompetisi tidak ditemukan' })
    const stats = await query(
      'SELECT COUNT(*)::int AS total, COALESCE(MAX(ranking), NULL) AS max_rank FROM competition_registrations WHERE competition_id = $1',
      [id]
    )
    res.json({ ...comp.rows[0], stats: stats.rows[0] })
  } catch (e) {
    res.status(500).json({ error: 'Gagal memuat detail kompetisi' })
  }
})

// Admin: upload poster image (base64 data URL)
router.post('/poster', auth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { imageBase64 } = req.body || {}
    if (typeof imageBase64 !== 'string' || imageBase64.length < 20) {
      return res.status(400).json({ error: 'Gambar tidak valid' })
    }
  // Parse data URL (only allow jpeg/jpg, png, djvu)
  const match = imageBase64.match(/^data:(image\/(png|jpe?g|vnd\.djvu|x-djvu));base64,(.+)$/i)
  if (!match) return res.status(400).json({ error: 'Format gambar harus base64 data URL (jpeg, png, djvu)' })
  const mime = match[1]
  const ext = mime.includes('png') ? 'png' : mime.includes('djvu') ? 'djvu' : 'jpg'
  const data = match[3]
  const buffer = Buffer.from(data, 'base64')
    // Ensure dir exists
    const dir = path.join(__dirname, '..', 'uploads', 'competitions')
    fs.mkdirSync(dir, { recursive: true })
    const filename = `poster_${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
    const filepath = path.join(dir, filename)
    fs.writeFileSync(filepath, buffer)
    const publicUrl = `/uploads/competitions/${filename}`
    res.json({ url: publicUrl })
  } catch (e) {
    res.status(500).json({ error: 'Gagal mengunggah poster' })
  }
})

// User: upload fish photo (base64 data URL)
router.post('/upload-fish', auth, async (req: Request & { user?: any }, res: Response) => {
  try {
    const { imageBase64 } = req.body || {}
    if (typeof imageBase64 !== 'string' || imageBase64.length < 20) {
      return res.status(400).json({ error: 'Gambar tidak valid' })
    }
  const match = imageBase64.match(/^data:(image\/(png|jpe?g|vnd\.djvu|x-djvu));base64,(.+)$/i)
  if (!match) return res.status(400).json({ error: 'Format gambar harus base64 data URL (jpeg, png, djvu)' })
  const mime = match[1]
  const ext = mime.includes('png') ? 'png' : mime.includes('djvu') ? 'djvu' : 'jpg'
  const data = match[3]
  const buffer = Buffer.from(data, 'base64')
    const dir = path.join(__dirname, '..', 'uploads', 'competitions', 'fish')
    fs.mkdirSync(dir, { recursive: true })
    const filename = `fish_${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
    const filepath = path.join(dir, filename)
    fs.writeFileSync(filepath, buffer)
    const publicUrl = `/uploads/competitions/fish/${filename}`
    res.json({ url: publicUrl })
  } catch (e) {
    res.status(500).json({ error: 'Gagal mengunggah foto ikan' })
  }
})

// Admin: create competition
router.post('/', auth, requireAdmin, async (req: Request, res: Response) => {
  const { title, description = '', requirements = [], formFields = [], status = 'draft', startAt = null, endAt = null, maxParticipants = null, posterImage = null } = req.body || {}
  if (!title) return res.status(400).json({ error: 'Judul wajib diisi' })
  try {
    // Pastikan JSON dikirim sebagai string agar cast ::jsonb sukses
    const reqJson = JSON.stringify(Array.isArray(requirements) ? requirements : [])
    const fieldsJson = JSON.stringify(Array.isArray(formFields) ? formFields : [])
    const result = await query(
      `INSERT INTO competitions (title, description, requirements, form_fields, status, start_at, end_at, max_participants, poster_image)
       VALUES ($1, $2, $3::jsonb, $4::jsonb, $5, $6, $7, $8, $9)
       RETURNING *`,
      [title, description, reqJson, fieldsJson, status, startAt, endAt, maxParticipants, posterImage]
    )
    res.json(result.rows[0])
  } catch (e) {
    res.status(500).json({ error: 'Gagal membuat kompetisi' })
  }
})

// Admin: update competition
router.put('/:id', auth, requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const { title, description, requirements, formFields, status, startAt, endAt, maxParticipants, posterImage } = req.body || {}
  if (!id) return res.status(400).json({ error: 'ID tidak valid' })
  try {
    // Gunakan null jika tidak ada perubahan, atau stringify jika ada nilai baru
    const reqJson = requirements ? JSON.stringify(requirements) : null
    const fieldsJson = formFields ? JSON.stringify(formFields) : null
    const result = await query(
      `UPDATE competitions SET
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        requirements = COALESCE($3::jsonb, requirements),
        form_fields = COALESCE($4::jsonb, form_fields),
        status = COALESCE($5, status),
        start_at = COALESCE($6, start_at),
        end_at = COALESCE($7, end_at),
        max_participants = COALESCE($8, max_participants),
        poster_image = COALESCE($9, poster_image)
       WHERE id = $10 RETURNING *`,
      [title ?? null, description ?? null, reqJson, fieldsJson, status ?? null, startAt ?? null, endAt ?? null, maxParticipants ?? null, posterImage ?? null, id]
    )
    if (!result.rows[0]) return res.status(404).json({ error: 'Kompetisi tidak ditemukan' })
    res.json(result.rows[0])
  } catch (e) {
    res.status(500).json({ error: 'Gagal memperbarui kompetisi' })
  }
})

// Admin: delete competition
router.delete('/:id', auth, requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  if (!id) return res.status(400).json({ error: 'ID tidak valid' })
  try {
    const del = await query('DELETE FROM competitions WHERE id = $1 RETURNING id', [id])
    if (!del.rows[0]) return res.status(404).json({ error: 'Kompetisi tidak ditemukan' })
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: 'Gagal menghapus kompetisi' })
  }
})

// User: register to competition
router.post('/:id/register', auth, async (req: Request & { user?: any }, res: Response) => {
  const id = Number(req.params.id)
  const userId = req.user?.id
  const { answers = {} } = req.body || {}
  if (!id || !userId) return res.status(400).json({ error: 'Permintaan tidak valid' })
  try {
    const comp = await query('SELECT * FROM competitions WHERE id = $1', [id])
    const c = comp.rows[0]
    if (!c) return res.status(404).json({ error: 'Kompetisi tidak ditemukan' })
    if (c.status !== 'open') return res.status(400).json({ error: 'Kompetisi belum dibuka' })
    if (c.max_participants != null) {
      const { rows } = await query('SELECT COUNT(*)::int AS total FROM competition_registrations WHERE competition_id = $1', [id])
      const total = rows[0]?.total ?? 0
      if (total >= c.max_participants) {
        return res.status(400).json({ error: 'Kuota peserta sudah penuh' })
      }
    }
    // Validate required fields from form_fields
    try {
      const fields: Array<{ name: string; required?: boolean }> = Array.isArray(c.form_fields) ? c.form_fields : []
      const missing = fields.filter((f) => f && f.required && (answers == null || answers[f.name] == null || String(answers[f.name]).trim() === ''))
      if (missing.length > 0) {
        return res.status(400).json({ error: `Field wajib belum diisi: ${missing.map((m) => m.name).join(', ')}` })
      }
    } catch {}
    const inserted = await query(
      `INSERT INTO competition_registrations (competition_id, customer_id, answers)
       VALUES ($1, $2, $3::jsonb)
       ON CONFLICT (competition_id, customer_id) DO UPDATE SET answers = EXCLUDED.answers
       RETURNING *`,
      [id, userId, answers]
    )
    res.json(inserted.rows[0])
  } catch (e) {
    res.status(500).json({ error: 'Gagal mendaftar kompetisi' })
  }
})

// Admin: list registrations (with user and last score)
router.get('/:id/registrations', auth, requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  if (!id) return res.status(400).json({ error: 'ID tidak valid' })
  try {
    const result = await query(
      `SELECT r.*, c.name AS customer_name, c.email AS customer_email,
        (
          SELECT row_to_json(s) FROM (
            SELECT total_score, comment, created_at FROM competition_scores cs
            WHERE cs.registration_id = r.id
            ORDER BY created_at DESC LIMIT 1
          ) s
        ) AS last_score
       FROM competition_registrations r
       JOIN customers c ON c.id = r.customer_id
       WHERE r.competition_id = $1
       ORDER BY r.created_at DESC`,
      [id]
    )
    res.json(result.rows)
  } catch (e) {
    res.status(500).json({ error: 'Gagal memuat pendaftaran' })
  }
})

// Admin: update registration status
router.put('/:id/registrations/:regId/status', auth, requireAdmin, async (req: Request, res: Response) => {
  const regId = Number(req.params.regId)
  const { status } = req.body || {}
  if (!regId || !status) return res.status(400).json({ error: 'Data tidak valid' })
  try {
    const up = await query('UPDATE competition_registrations SET status = $1 WHERE id = $2 RETURNING *', [status, regId])
    if (!up.rows[0]) return res.status(404).json({ error: 'Pendaftaran tidak ditemukan' })
    res.json(up.rows[0])
  } catch (e) {
    res.status(500).json({ error: 'Gagal memperbarui status' })
  }
})

// Admin: set ranking/final position
router.put('/:id/registrations/:regId/rank', auth, requireAdmin, async (req: Request, res: Response) => {
  const regId = Number(req.params.regId)
  const { ranking = null, finalPosition = null } = req.body || {}
  if (!regId) return res.status(400).json({ error: 'Data tidak valid' })
  try {
    const up = await query('UPDATE competition_registrations SET ranking = $1, final_position = $2 WHERE id = $3 RETURNING *', [ranking, finalPosition, regId])
    if (!up.rows[0]) return res.status(404).json({ error: 'Pendaftaran tidak ditemukan' })
    res.json(up.rows[0])
  } catch (e) {
    res.status(500).json({ error: 'Gagal menyimpan peringkat' })
  }
})

// Admin: add score/comment
router.post('/:id/registrations/:regId/scores', auth, requireAdmin, async (req: Request & { user?: any }, res: Response) => {
  const regId = Number(req.params.regId)
  const judgeId = req.user?.id
  const { scores = {}, totalScore = null, comment = '' } = req.body || {}
  if (!regId || !judgeId) return res.status(400).json({ error: 'Data tidak valid' })
  try {
    const inserted = await query(
      `INSERT INTO competition_scores (registration_id, judge_id, scores, total_score, comment)
       VALUES ($1, $2, $3::jsonb, $4, $5)
       RETURNING *`,
      [regId, judgeId, scores, totalScore, comment]
    )
    res.json(inserted.rows[0])
  } catch (e) {
    res.status(500).json({ error: 'Gagal menyimpan penilaian' })
  }
})

// User: my competitions
router.get('/me', auth, async (req: Request & { user?: any }, res: Response) => {
  const userId = req.user?.id
  try {
    const result = await query(
      `SELECT r.*, comp.title AS competition_title,
        (
          SELECT row_to_json(s) FROM (
            SELECT total_score, comment, created_at FROM competition_scores cs
            WHERE cs.registration_id = r.id
            ORDER BY created_at DESC LIMIT 1
          ) s
        ) AS last_score
       FROM competition_registrations r
       JOIN competitions comp ON comp.id = r.competition_id
       WHERE r.customer_id = $1
       ORDER BY r.created_at DESC`,
      [userId]
    )
    res.json(result.rows)
  } catch (e) {
    res.status(500).json({ error: 'Gagal memuat kompetisi saya' })
  }
})

export default router