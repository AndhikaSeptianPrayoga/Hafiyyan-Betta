import { Router, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { query } from '../db'

const router = Router()

// Ensure customers table exists on startup
const ensureCustomersTable = async () => {
  await query(`
    CREATE TABLE IF NOT EXISTS customers (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL DEFAULT 'customer',
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `)
}
ensureCustomersTable().catch((err) => console.error('Failed to ensure customers table:', err))

function signToken(user: { id: number; email: string; role: string }) {
  return jwt.sign(user, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '12h' })
}

// Register customer
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = (req.body || {}) as {
      name?: string
      email?: string
      password?: string
    }
    if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' })
    const exists = await query('SELECT id FROM customers WHERE email=$1', [email])
    if (exists.rowCount) return res.status(409).json({ error: 'Email already used' })
    const hash = await bcrypt.hash(String(password), 10)
    const { rows } = await query(
      'INSERT INTO customers(name,email,password_hash,role) VALUES($1,$2,$3,$4) RETURNING id,name,email,role,created_at,updated_at',
      [name, email, hash, 'customer']
    )
    const user = rows[0]
    const token = signToken({ id: user.id, email: user.email, role: user.role })
    return res.status(201).json({ token, user })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Server error' })
  }
})

// Login customer
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = (req.body || {}) as { email?: string; password?: string }
    if (!email || !password) return res.status(400).json({ error: 'Missing email or password' })
    const { rows } = await query('SELECT * FROM customers WHERE email=$1', [email])
    if (!rows.length) return res.status(401).json({ error: 'Invalid credentials' })
    const user = rows[0]
    const ok = await bcrypt.compare(String(password), user.password_hash)
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' })
    const safe = { id: user.id, name: user.name, email: user.email, role: user.role }
    const token = signToken({ id: safe.id, email: safe.email, role: safe.role })
    return res.json({ token, user: safe })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Server error' })
  }
})

// Get current customer
router.get('/me', async (req: Request, res: Response) => {
  try {
    const header = req.headers.authorization || ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : null
    if (!token) return res.status(401).json({ error: 'Unauthorized' })
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret') as {
      id: number
      email: string
      role: string
    }
    const { rows } = await query(
      'SELECT id,name,email,role,created_at,updated_at FROM customers WHERE id=$1',
      [payload.id]
    )
    if (!rows.length) return res.status(404).json({ error: 'Not found' })
    return res.json(rows[0])
  } catch (err) {
    console.error(err)
    return res.status(401).json({ error: 'Invalid token' })
  }
})

export default router