import { Router, Request, Response } from 'express'
import { query } from '../db'
import auth from '../middleware/auth'

const router = Router()

async function ensureTableAndSeed() {
  await query(`
    CREATE TABLE IF NOT EXISTS fish (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      price INTEGER NOT NULL,
      discount_percent INTEGER NOT NULL DEFAULT 0,
      variety TEXT,
      description TEXT,
      type_text TEXT,
      size_cm TEXT,
      body_size_text TEXT,
      tail_size_text TEXT,
      color TEXT,
      gender TEXT,
      condition TEXT,
      age TEXT,
      origin TEXT,
      stock INTEGER NOT NULL DEFAULT 0,
      advantages JSONB NOT NULL DEFAULT '[]'::jsonb,
      care_guide JSONB NOT NULL DEFAULT '[]'::jsonb,
      main_image TEXT,
      images JSONB NOT NULL DEFAULT '[]'::jsonb,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `)
  // Ensure new columns exist for deployments with an older schema
  await query(`ALTER TABLE fish ADD COLUMN IF NOT EXISTS body_size_text TEXT;`).catch(() => {})
  await query(`ALTER TABLE fish ADD COLUMN IF NOT EXISTS tail_size_text TEXT;`).catch(() => {})
  const { rows } = await query('SELECT COUNT(*)::int AS count FROM fish')
  const count = rows?.[0]?.count ?? 0
  if (count === 0) {
    await query(
      `INSERT INTO fish (name, price, discount_percent, variety, description, type_text, size_cm, color, gender, condition, age, origin, stock, advantages, care_guide, main_image, images)
       VALUES 
       ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14::jsonb, $15::jsonb, $16, $17::jsonb),
       ($18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31::jsonb, $32::jsonb, $33, $34::jsonb)
      `,
      [
        'Halfmoon Red',
        200000,
        25,
        'Halfmoon',
        'Ikan cupang halfmoon premium dengan sirip lebar dan simetris.',
        'Halfmoon',
        '5-6 cm',
        'Merah Metalik',
        'Jantan',
        'Sehat & Aktif',
        '3-4 bulan',
        'Breeding Lokal',
        5,
        JSON.stringify(['Sirip lebar dan simetris', 'Warna metalik yang mencolok']),
        JSON.stringify(['Ganti air 25% setiap minggu', 'Berikan pakan 2x sehari']),
        '/img/betta-img/cupang (1).jpeg',
        JSON.stringify(['/img/betta-img/cupang (1).jpeg', '/img/betta-img/cupang (2).jpeg']),
        'Plakat Marble',
        150000,
        0,
        'Plakat',
        'Cupang plakat dengan corak marble unik.',
        'Plakat',
        '4-5 cm',
        'Marble',
        'Jantan',
        'Sehat',
        '3 bulan',
        'Breeding Lokal',
        3,
        JSON.stringify(['Kondisi fisik prima']),
        JSON.stringify(['Suhu air 24-28°C']),
        '/img/betta-img/cupang (3).jpg',
        JSON.stringify(['/img/betta-img/cupang (3).jpg', '/img/betta-img/cupang (4).jpg']),
      ]
    )
  }
}
ensureTableAndSeed().catch((e) => console.error('Ensure fish failed:', e))

// List fish
router.get('/', async (req: Request, res: Response) => {
  try {
    const { rows } = await query(
      `SELECT id, name, price, discount_percent as "discountPercent", variety, description, type_text as "typeText", size_cm as "sizeCm", body_size_text as "bodySize", tail_size_text as "tailSize", color, gender, condition, age, origin, stock, advantages, care_guide as "careGuide", main_image as "mainImage", images
       FROM fish ORDER BY id DESC`
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
      `SELECT id, name, price, discount_percent as "discountPercent", variety, description, type_text as "typeText", size_cm as "sizeCm", body_size_text as "bodySize", tail_size_text as "tailSize", color, gender, condition, age, origin, stock, advantages, care_guide as "careGuide", main_image as "mainImage", images
       FROM fish WHERE id=$1`,
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
    const {
      name,
      price,
      discountPercent,
      variety,
      description,
      typeText,
      sizeCm,
      bodySize,
      tailSize,
      color,
      gender,
      condition,
      age,
      origin,
      stock,
      advantages,
      careGuide,
      mainImage,
      images,
    } = body
    if (!name || price === undefined) return res.status(400).json({ error: 'Missing name/price' })
    const { rows } = await query(
      `INSERT INTO fish (name, price, discount_percent, variety, description, type_text, size_cm, body_size_text, tail_size_text, color, gender, condition, age, origin, stock, advantages, care_guide, main_image, images)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16::jsonb,$17::jsonb,$18,$19::jsonb)
       RETURNING id, name, price, discount_percent as "discountPercent", variety, description, type_text as "typeText", size_cm as "sizeCm", body_size_text as "bodySize", tail_size_text as "tailSize", color, gender, condition, age, origin, stock, advantages, care_guide as "careGuide", main_image as "mainImage", images, created_at, updated_at`,
      [
        name,
        Number(price),
        Number(discountPercent || 0),
        variety || null,
        description || null,
        typeText || null,
        sizeCm || null,
        bodySize || null,
        tailSize || null,
        color || null,
        gender || null,
        condition || null,
        age || null,
        origin || null,
        Number(stock || 0),
        JSON.stringify(advantages || []),
        JSON.stringify(careGuide || []),
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
      price: { col: 'price', transform: Number },
      discountPercent: { col: 'discount_percent', transform: Number },
      variety: { col: 'variety' },
      description: { col: 'description' },
      typeText: { col: 'type_text' },
      sizeCm: { col: 'size_cm' },
      bodySize: { col: 'body_size_text' },
      tailSize: { col: 'tail_size_text' },
      color: { col: 'color' },
      gender: { col: 'gender' },
      condition: { col: 'condition' },
      age: { col: 'age' },
      origin: { col: 'origin' },
      stock: { col: 'stock', transform: Number },
      advantages: { col: 'advantages', json: true },
      careGuide: { col: 'care_guide', json: true },
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
      `UPDATE fish SET ${fields.join(', ')} WHERE id=$${i}
       RETURNING id, name, price, discount_percent as "discountPercent", variety, description, type_text as "typeText", size_cm as "sizeCm", body_size_text as "bodySize", tail_size_text as "tailSize", color, gender, condition, age, origin, stock, advantages, care_guide as "careGuide", main_image as "mainImage", images, created_at, updated_at`,
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
    const result = await query('DELETE FROM fish WHERE id=$1', [id])
    if (!result.rowCount) return res.status(404).json({ error: 'Not found' })
    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router