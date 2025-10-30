import { Pool } from 'pg'

const connectionString = process.env.DATABASE_URL || ''
const pool = new Pool({
  connectionString,
  ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : undefined,
})

pool.on('error', (err: Error) => {
  console.error('Unexpected PG client error', err)
})

export const query = (text: string, params?: any[]) => pool.query(text, params)
export { pool }