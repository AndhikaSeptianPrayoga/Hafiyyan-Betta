import { Router, Request, Response } from 'express'
import { query } from '../db'
import auth from '../middleware/auth'

const router = Router()

// Ensure table and seed initial data
async function ensureTableAndSeed() {
  await query(`
    CREATE TABLE IF NOT EXISTS articles (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      date DATE NOT NULL,
      excerpt TEXT,
      image TEXT,
      author TEXT,
      content TEXT,
      tags JSONB NOT NULL DEFAULT '[]'::jsonb,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `)
  // seed if empty
  const { rows } = await query('SELECT COUNT(*)::int AS count FROM articles')
  const count = rows?.[0]?.count ?? 0
  if (count === 0) {
    await query(
      `INSERT INTO articles (title, date, excerpt, image, author, content, tags)
       VALUES 
       ($1, $2, $3, $4, $5, $6, $7::jsonb),
       ($8, $9, $10, $11, $12, $13, $14::jsonb)
      `,
      [
        'Panduan Dasar Merawat Cupang',
        '2025-01-01',
        'Air, pakan, dan setting tank untuk pemula.',
        '/img/betta-img/cupang (6).jpg',
        'Admin',
        '<p>Ringkasan perawatan dasar untuk pemula.</p>',
        JSON.stringify(['perawatan']),
        'Mengenal Varietas Betta',
        '2025-01-05',
        'Halfmoon, Plakat, Giant, dan lain-lain.',
        '/img/betta-img/cupang (7).jpg',
        'Admin',
        '<p>Pengantar berbagai varietas betta populer.</p>',
        JSON.stringify(['varietas']),
      ]
    )
  }
}
ensureTableAndSeed().catch((e) => console.error('Ensure articles failed:', e))

// List
router.get('/', async (req: Request, res: Response) => {
  try {
    const { rows } = await query(
      `SELECT id, title, TO_CHAR(date, 'YYYY-MM-DD') as date, excerpt, image, author, content, tags
       FROM articles ORDER BY id DESC`
    )
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// Get by id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)
    const { rows } = await query(
      `SELECT id, title, TO_CHAR(date, 'YYYY-MM-DD') as date, excerpt, image, author, content, tags
       FROM articles WHERE id=$1`,
      [id]
    )
    if (!rows.length) return res.status(404).json({ error: 'Not found' })
    res.json(rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// Create (protected)
router.post('/', auth, async (req: Request, res: Response) => {
  try {
    const { title, date, excerpt, image, author, content, tags } = req.body || {}
    if (!title || !date) return res.status(400).json({ error: 'Missing title/date' })
    const { rows } = await query(
      `INSERT INTO articles (title, date, excerpt, image, author, content, tags)
       VALUES ($1,$2,$3,$4,$5,$6,$7::jsonb)
       RETURNING id, title, TO_CHAR(date, 'YYYY-MM-DD') as date, excerpt, image, author, content, tags, created_at, updated_at`,
      [title, date, excerpt || null, image || null, author || null, content || null, JSON.stringify(tags || [])]
    )
    res.status(201).json(rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// Update (protected)
router.put('/:id', auth, async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)
    const { title, date, excerpt, image, author, content, tags } = req.body || {}
    const fields: string[] = []
    const values: any[] = []
    let i = 1
    if (title !== undefined) { fields.push(`title=$${i++}`); values.push(title) }
    if (date !== undefined) { fields.push(`date=$${i++}`); values.push(date) }
    if (excerpt !== undefined) { fields.push(`excerpt=$${i++}`); values.push(excerpt) }
    if (image !== undefined) { fields.push(`image=$${i++}`); values.push(image) }
    if (author !== undefined) { fields.push(`author=$${i++}`); values.push(author) }
    if (content !== undefined) { fields.push(`content=$${i++}`); values.push(content) }
    if (tags !== undefined) { fields.push(`tags=$${i++}::jsonb`); values.push(JSON.stringify(tags)) }
    if (!fields.length) return res.status(400).json({ error: 'No fields to update' })
    values.push(id)
    const { rows } = await query(
      `UPDATE articles SET ${fields.join(', ')} WHERE id=$${i} 
       RETURNING id, title, TO_CHAR(date, 'YYYY-MM-DD') as date, excerpt, image, author, content, tags, created_at, updated_at`,
      values
    )
    if (!rows.length) return res.status(404).json({ error: 'Not found' })
    res.json(rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// Delete (protected)
router.delete('/:id', auth, async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)
    const result = await query('DELETE FROM articles WHERE id=$1', [id])
    if (!result.rowCount) return res.status(404).json({ error: 'Not found' })
    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router