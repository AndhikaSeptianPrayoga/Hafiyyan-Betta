import { Router, Request, Response } from 'express'
import { query } from '../db'
import auth from '../middleware/auth'

const router = Router()

async function ensureTableAndSeed() {
  await query(`
    CREATE TABLE IF NOT EXISTS needs (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      price INTEGER NOT NULL,
      discount_percent INTEGER NOT NULL DEFAULT 0,
      specs JSONB NOT NULL DEFAULT '[]'::jsonb,
      includes JSONB NOT NULL DEFAULT '[]'::jsonb,
      features JSONB NOT NULL DEFAULT '[]'::jsonb,
      stock INTEGER NOT NULL DEFAULT 0,
      main_image TEXT,
      images JSONB NOT NULL DEFAULT '[]'::jsonb,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `)
  const { rows } = await query('SELECT COUNT(*)::int AS count FROM needs')
  const count = rows?.[0]?.count ?? 0
  if (count === 0) {
    await query(
      `INSERT INTO needs (name, description, price, discount_percent, specs, includes, features, stock, main_image, images)
       VALUES 
       ($1,$2,$3,$4,$5::jsonb,$6::jsonb,$7::jsonb,$8,$9,$10::jsonb),
       ($11,$12,$13,$14,$15::jsonb,$16::jsonb,$17::jsonb,$18,$19,$20::jsonb)
      `,
      [
        'Daun Ketapang Premium',
        'Daun ketapang pilihan untuk menjaga kualitas air dan kesehatan ikan cupang.',
        8000,
        0,
        JSON.stringify(['Berat 50g', 'Dikeringkan alami', 'Daun utuh pilihan']),
        JSON.stringify(['10 lembar daun ketapang']),
        JSON.stringify(['Meningkatkan kualitas air', 'Membantu pemulihan ikan']),
        25,
        '/img/kebutuhan-img/2.png',
        JSON.stringify(['/img/kebutuhan-img/2.png']),
        'Garam Ikan 100gr',
        'Garam khusus ikan untuk perawatan harian dan karantina.',
        10000,
        0,
        JSON.stringify(['Berat 100g', 'Kemasan ziplock']),
        JSON.stringify(['1 pouch garam 100g']),
        JSON.stringify(['Meningkatkan daya tahan', 'Membantu proses penyembuhan']),
        40,
        '/img/kebutuhan-img/1.png',
        JSON.stringify(['/img/kebutuhan-img/1.png']),
      ]
    )
  }
}
ensureTableAndSeed().catch((e) => console.error('Ensure needs failed:', e))

// List
router.get('/', async (req: Request, res: Response) => {
  try {
    const { rows } = await query(
      `SELECT id, name, description, price, discount_percent as "discountPercent", specs, includes, features, stock, main_image as "mainImage", images
       FROM needs ORDER BY id DESC`
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
      `SELECT id, name, description, price, discount_percent as "discountPercent", specs, includes, features, stock, main_image as "mainImage", images
       FROM needs WHERE id=$1`,
      [id]
    )
    if (!rows.length) return res.status(404).json({ error: 'Not found' })
    res.json(rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// Create
router.post('/', auth, async (req: Request, res: Response) => {
  try {
    const body = req.body || {}
    const { name, description, price, discountPercent, specs, includes, features, stock, mainImage, images } = body
    if (!name || price === undefined) return res.status(400).json({ error: 'Missing name/price' })
    const { rows } = await query(
      `INSERT INTO needs (name, description, price, discount_percent, specs, includes, features, stock, main_image, images)
       VALUES ($1,$2,$3,$4,$5::jsonb,$6::jsonb,$7::jsonb,$8,$9,$10::jsonb)
       RETURNING id, name, description, price, discount_percent as "discountPercent", specs, includes, features, stock, main_image as "mainImage", images, created_at, updated_at`,
      [
        name,
        description || null,
        Number(price),
        Number(discountPercent || 0),
        JSON.stringify(specs || []),
        JSON.stringify(includes || []),
        JSON.stringify(features || []),
        Number(stock || 0),
        mainImage || null,
        JSON.stringify(images || []),
      ]
    )
    res.status(201).json(rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// Update
router.put('/:id', auth, async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)
    const body = req.body || {}
    const fields: string[] = []
    const values: any[] = []
    let i = 1
    const map: Record<string, { col: string; transform?: (v: any) => any; json?: boolean }> = {
      name: { col: 'name' },
      description: { col: 'description' },
      price: { col: 'price', transform: Number },
      discountPercent: { col: 'discount_percent', transform: Number },
      specs: { col: 'specs', json: true },
      includes: { col: 'includes', json: true },
      features: { col: 'features', json: true },
      stock: { col: 'stock', transform: Number },
      mainImage: { col: 'main_image' },
      images: { col: 'images', json: true },
    }
    for (const key of Object.keys(map)) {
      if (body[key] !== undefined) {
        const { col, transform, json } = map[key]
        if (json) {
          fields.push(`${col}=$${i++}::jsonb`)
          values.push(JSON.stringify(body[key]))
        } else {
          fields.push(`${col}=$${i++}`)
          values.push(transform ? transform(body[key]) : body[key])
        }
      }
    }
    if (!fields.length) return res.status(400).json({ error: 'No fields to update' })
    values.push(id)
    const { rows } = await query(
      `UPDATE needs SET ${fields.join(', ')} WHERE id=$${i}
       RETURNING id, name, description, price, discount_percent as "discountPercent", specs, includes, features, stock, main_image as "mainImage", images, created_at, updated_at`,
      values
    )
    if (!rows.length) return res.status(404).json({ error: 'Not found' })
    res.json(rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// Delete
router.delete('/:id', auth, async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)
    const result = await query('DELETE FROM needs WHERE id=$1', [id])
    if (!result.rowCount) return res.status(404).json({ error: 'Not found' })
    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router