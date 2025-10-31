import 'dotenv/config'
import express, { Request, Response } from 'express'
import path from 'path'
import cors from 'cors'
import morgan from 'morgan'
import adminRoutes from './routes/admin'
import authRoutes from './routes/auth'
import articlesRoutes from './routes/articles'
import fishRoutes from './routes/fish'
import needsRoutes from './routes/needs'
import competitionsRoutes from './routes/competitions'

const app = express()
const PORT = Number(process.env.PORT) || 4000

app.use(cors({ origin: '*' }))
// Increase body size limit to support rich content and images (base64)
app.use(express.json({ limit: '5mb' }))
app.use(express.urlencoded({ extended: true, limit: '5mb' }))
app.use(morgan('dev'))

// Serve static uploaded files
const uploadsDir = path.join(__dirname, '..', 'uploads')
app.use('/uploads', express.static(uploadsDir))

app.get('/api/health', (req: Request, res: Response) => res.json({ status: 'ok' }))

app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/articles', articlesRoutes)
app.use('/api/fish', fishRoutes)
app.use('/api/needs', needsRoutes)
app.use('/api/competitions', competitionsRoutes)

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found' })
})

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})