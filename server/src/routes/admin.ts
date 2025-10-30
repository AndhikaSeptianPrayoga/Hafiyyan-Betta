import { Router, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { query } from '../db'
import auth, { AuthPayload } from '../middleware/auth'

const router = Router()

// Ensure admins table exists on startup (simple guard)
const ensureTable = async () => {
  await query(`
    CREATE TABLE IF NOT EXISTS admins (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL DEFAULT 'admin',
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `)
}
ensureTable().catch((err) => console.error('Failed to ensure admins table:', err))

function signToken(user: { id: number; email: string; role: string }) {
  return jwt.sign(user, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '12h' })
}

// Register admin (first admin or manual)
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = (req.body || {}) as {
      name?: string
      email?: string
      password?: string
    }
    if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' })
    const exists = await query('SELECT id FROM admins WHERE email=$1', [email])
    if (exists.rowCount) return res.status(409).json({ error: 'Email already used' })
    const hash = await bcrypt.hash(String(password), 10)
    const { rows } = await query(
      'INSERT INTO admins(name,email,password_hash,role) VALUES($1,$2,$3,$4) RETURNING id,name,email,role,created_at,updated_at',
      [name, email, hash, 'admin']
    )
    const user = rows[0]
    const token = signToken({ id: user.id, email: user.email, role: user.role })
    return res.status(201).json({ token, user })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Server error' })
  }
})

// Login admin
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = (req.body || {}) as { email?: string; password?: string }
    if (!email || !password) return res.status(400).json({ error: 'Missing email or password' })
    const { rows } = await query('SELECT * FROM admins WHERE email=$1', [email])
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

// Get current admin
router.get('/me', auth, async (req: Request & { user?: AuthPayload }, res: Response) => {
  try {
    const { rows } = await query(
      'SELECT id,name,email,role,created_at,updated_at FROM admins WHERE id=$1',
      [req.user?.id]
    )
    if (!rows.length) return res.status(404).json({ error: 'Not found' })
    return res.json(rows[0])
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Server error' })
  }
})

// List admins (protected)
router.get('/users', auth, async (req: Request, res: Response) => {
  try {
    const { rows } = await query(
      'SELECT id,name,email,role,created_at,updated_at FROM admins ORDER BY id DESC'
    )
    return res.json(rows)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Server error' })
  }
})

// Get admin by id
router.get('/users/:id', auth, async (req: Request, res: Response) => {
  try {
    const { rows } = await query(
      'SELECT id,name,email,role,created_at,updated_at FROM admins WHERE id=$1',
      [Number(req.params.id)]
    )
    if (!rows.length) return res.status(404).json({ error: 'Not found' })
    return res.json(rows[0])
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Server error' })
  }
})

// Update admin
router.put('/users/:id', auth, async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = (req.body || {}) as {
      name?: string
      email?: string
      password?: string
      role?: string
    }
    const id = Number(req.params.id)
    const current = await query('SELECT * FROM admins WHERE id=$1', [id])
    if (!current.rowCount) return res.status(404).json({ error: 'Not found' })

    const sets: string[] = []
    const values: any[] = []
    let idx = 1
    if (name) {
      sets.push(`name=$${idx++}`)
      values.push(name)
    }
    if (email) {
      sets.push(`email=$${idx++}`)
      values.push(email)
    }
    if (role) {
      sets.push(`role=$${idx++}`)
      values.push(role)
    }
    if (password) {
      const hash = await bcrypt.hash(String(password), 10)
      sets.push(`password_hash=$${idx++}`)
      values.push(hash)
    }
    if (!sets.length) return res.status(400).json({ error: 'No fields to update' })

    values.push(id)
    const sql = `UPDATE admins SET ${sets.join(', ')} WHERE id=$${idx} RETURNING id,name,email,role,created_at,updated_at`
    const { rows } = await query(sql, values)
    return res.json(rows[0])
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Server error' })
  }
})

// Delete admin
router.delete('/users/:id', auth, async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)
    const result = await query('DELETE FROM admins WHERE id=$1', [id])
    if (!result.rowCount) return res.status(404).json({ error: 'Not found' })
    return res.json({ success: true })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Server error' })
  }
})

export default router