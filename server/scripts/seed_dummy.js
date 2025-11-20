// Simple DB seeder: insert 5 dummy rows for articles, fish, and needs
// Uses images from public/img so the frontend can display them directly

const path = require('path')
const dotenv = require('dotenv')
dotenv.config({ path: path.join(__dirname, '..', '.env') })
const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : undefined,
})

async function ensureTables() {
  // Articles
  await pool.query(`
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
  // Fish
  await pool.query(`
    CREATE TABLE IF NOT EXISTS fish (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      price INTEGER NOT NULL,
      discount_percent INTEGER NOT NULL DEFAULT 0,
      variety TEXT,
      description TEXT,
      type_text TEXT,
      size_cm TEXT,
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
  // Needs
  await pool.query(`
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
}

const articles = [
  {
    title: 'Panduan Dasar Merawat Cupang',
    date: '2025-01-01',
    excerpt: 'Air, pakan, dan setting tank untuk pemula.',
    image: '/img/betta-img/cupang (6).jpg',
    author: 'Admin',
    content: '<p>Ringkasan perawatan dasar untuk pemula.</p>',
    tags: ['perawatan'],
  },
  {
    title: 'Mengenal Varietas Betta',
    date: '2025-01-05',
    excerpt: 'Halfmoon, Plakat, Giant, dan lain-lain.',
    image: '/img/betta-img/cupang (7).jpg',
    author: 'Admin',
    content: '<p>Pengantar berbagai varietas betta populer.</p>',
    tags: ['varietas'],
  },
  {
    title: 'Tips Memilih Cupang Berkualitas',
    date: '2025-01-10',
    excerpt: 'Ciri fisik, warna, dan gerak yang perlu diperhatikan.',
    image: '/img/betta-img/cupang (5).jpg',
    author: 'Admin',
    content: '<p>Panduan memilih cupang berkualitas untuk koleksi.</p>',
    tags: ['tips', 'pemilihan'],
  },
  {
    title: 'Pakan Ideal untuk Pertumbuhan Cupang',
    date: '2025-01-15',
    excerpt: 'Jenis pakan dan frekuensi pemberian yang tepat.',
    image: '/img/betta-img/cupang (8).jpg',
    author: 'Admin',
    content: '<p>Ulasan pakan pelet dan hidup untuk pertumbuhan optimal.</p>',
    tags: ['pakan', 'pertumbuhan'],
  },
  {
    title: 'Setting Akuarium Cupang Estetik',
    date: '2025-01-20',
    excerpt: 'Dekorasi sederhana namun fungsional untuk cupang sehat.',
    image: '/img/betta-img/cupang (10).jpg',
    author: 'Admin',
    content: '<p>Ide dekorasi dan perlengkapan untuk akuarium cupang.</p>',
    tags: ['akuarium', 'dekorasi'],
  },
]

const fish = [
  {
    name: 'Halfmoon Red',
    price: 200000,
    discountPercent: 25,
    variety: 'Halfmoon',
    description: 'Ikan cupang halfmoon premium dengan sirip lebar dan simetris.',
    typeText: 'Halfmoon',
    sizeCm: '5-6 cm',
    color: 'Merah Metalik',
    gender: 'Jantan',
    condition: 'Sehat & Aktif',
    age: '3-4 bulan',
    origin: 'Breeding Lokal',
    stock: 5,
    advantages: ['Sirip lebar dan simetris', 'Warna metalik yang mencolok'],
    careGuide: ['Ganti air 25% setiap minggu', 'Berikan pakan 2x sehari'],
    mainImage: '/img/betta-img/cupang (1).jpeg',
    images: ['/img/betta-img/cupang (1).jpeg', '/img/betta-img/cupang (2).jpeg'],
  },
  {
    name: 'Plakat Marble',
    price: 150000,
    discountPercent: 0,
    variety: 'Plakat',
    description: 'Cupang plakat dengan corak marble unik.',
    typeText: 'Plakat',
    sizeCm: '4-5 cm',
    color: 'Marble',
    gender: 'Jantan',
    condition: 'Sehat',
    age: '3 bulan',
    origin: 'Breeding Lokal',
    stock: 3,
    advantages: ['Kondisi fisik prima'],
    careGuide: ['Suhu air 24-28°C'],
    mainImage: '/img/betta-img/cupang (3).jpg',
    images: ['/img/betta-img/cupang (3).jpg', '/img/betta-img/cupang (4).jpg'],
  },
  {
    name: 'Giant Blue',
    price: 250000,
    discountPercent: 10,
    variety: 'Giant',
    description: 'Cupang giant berwarna biru pekat, ukuran besar.',
    typeText: 'Giant',
    sizeCm: '7-8 cm',
    color: 'Biru',
    gender: 'Jantan',
    condition: 'Sehat',
    age: '5-6 bulan',
    origin: 'Breeding Lokal',
    stock: 4,
    advantages: ['Ukuran besar impresif', 'Gerak aktif'],
    careGuide: ['Pakan protein tinggi', 'Rutin cek kualitas air'],
    mainImage: '/img/betta-img/cupang (5).jpg',
    images: ['/img/betta-img/cupang (5).jpg'],
  },
  {
    name: 'Halfmoon Copper',
    price: 220000,
    discountPercent: 20,
    variety: 'Halfmoon',
    description: 'Cupang halfmoon dengan warna copper elegan.',
    typeText: 'Halfmoon',
    sizeCm: '5-6 cm',
    color: 'Copper',
    gender: 'Jantan',
    condition: 'Sehat & Aktif',
    age: '4 bulan',
    origin: 'Breeding Lokal',
    stock: 6,
    advantages: ['Warna langka', 'Sirip simetris'],
    careGuide: ['Ganti air terjadwal', 'Pakan seimbang'],
    mainImage: '/img/betta-img/cupang (8).jpg',
    images: ['/img/betta-img/cupang (8).jpg'],
  },
  {
    name: 'Plakat Black Samurai',
    price: 300000,
    discountPercent: 0,
    variety: 'Plakat',
    description: 'Cupang plakat dengan kontras hitam putih tegas.',
    typeText: 'Plakat',
    sizeCm: '4-5 cm',
    color: 'Hitam Putih',
    gender: 'Jantan',
    condition: 'Sehat',
    age: '3-4 bulan',
    origin: 'Breeding Lokal',
    stock: 2,
    advantages: ['Kontras warna menarik'],
    careGuide: ['Suhu stabil', 'Aerasi cukup'],
    mainImage: '/img/betta-img/cupang (10).jpg',
    images: ['/img/betta-img/cupang (10).jpg'],
  },
]

const needs = [
  {
    name: 'Daun Ketapang Premium',
    description: 'Daun ketapang pilihan untuk menjaga kualitas air dan kesehatan ikan cupang.',
    price: 8000,
    discountPercent: 0,
    specs: ['Berat 50g', 'Dikeringkan alami', 'Daun utuh pilihan'],
    includes: ['10 lembar daun ketapang'],
    features: ['Meningkatkan kualitas air', 'Membantu pemulihan ikan'],
    stock: 25,
    mainImage: '/img/kebutuhan-img/2.png',
    images: ['/img/kebutuhan-img/2.png'],
  },
  {
    name: 'Garam Ikan 100gr',
    description: 'Garam khusus ikan untuk perawatan harian dan karantina.',
    price: 10000,
    discountPercent: 0,
    specs: ['Berat 100g', 'Kemasan ziplock'],
    includes: ['1 pouch garam 100g'],
    features: ['Meningkatkan daya tahan', 'Membantu proses penyembuhan'],
    stock: 40,
    mainImage: '/img/kebutuhan-img/1.png',
    images: ['/img/kebutuhan-img/1.png'],
  },
  {
    name: 'Pelet Premium 50gr',
    description: 'Pakan pelet berkualitas untuk pertumbuhan optimal cupang.',
    price: 15000,
    discountPercent: 10,
    specs: ['Protein tinggi', 'Ukuran pelet kecil'],
    includes: ['1 bungkus pelet 50gr'],
    features: ['Meningkatkan warna', 'Mendukung pertumbuhan'],
    stock: 30,
    mainImage: '/img/kebutuhan-img/3.png',
    images: ['/img/kebutuhan-img/3.png'],
  },
  {
    name: 'Obat Antijamur 30ml',
    description: 'Solusi antijamur untuk perawatan saat karantina.',
    price: 20000,
    discountPercent: 0,
    specs: ['Kapasitas 30ml', 'Aman untuk cupang'],
    includes: ['Botol antijamur 30ml'],
    features: ['Mencegah infeksi jamur', 'Mempercepat pemulihan'],
    stock: 20,
    mainImage: '/img/kebutuhan-img/4.png',
    images: ['/img/kebutuhan-img/4.png'],
  },
  {
    name: 'Daun Ketapang Super Pack',
    description: 'Paket hemat daun ketapang untuk pemakaian rutin.',
    price: 14000,
    discountPercent: 0,
    specs: ['Berat 100g', 'Daun besar pilihan'],
    includes: ['20 lembar daun ketapang'],
    features: ['Menstabilkan pH', 'Menyehatkan ikan'],
    stock: 35,
    mainImage: '/img/kebutuhan-img/5.png',
    images: ['/img/kebutuhan-img/5.png'],
  },
]

async function seedTable({ table, countQuery, insertOne }) {
  const { rows } = await pool.query(countQuery)
  const count = rows?.[0]?.count ?? 0
  const need = Math.max(0, 5 - count)
  if (need <= 0) {
    console.log(`[${table}] sudah memiliki ${count} item, skip seeding.`)
    return 0
  }
  let inserted = 0
  for (let i = 0; i < Math.min(need, 5); i++) {
    await insertOne(i)
    inserted++
  }
  console.log(`[${table}] inserted ${inserted} item.`)
  return inserted
}

async function seedArticles() {
  return seedTable({
    table: 'articles',
    countQuery: 'SELECT COUNT(*)::int AS count FROM articles',
    insertOne: async (i) => {
      const a = articles[i % articles.length]
      await pool.query(
        `INSERT INTO articles (title, date, excerpt, image, author, content, tags)
         VALUES ($1,$2,$3,$4,$5,$6,$7::jsonb)`,
        [a.title, a.date, a.excerpt, a.image, a.author, a.content, JSON.stringify(a.tags)]
      )
    },
  })
}

async function seedFish() {
  return seedTable({
    table: 'fish',
    countQuery: 'SELECT COUNT(*)::int AS count FROM fish',
    insertOne: async (i) => {
      const f = fish[i % fish.length]
      await pool.query(
        `INSERT INTO fish (name, price, discount_percent, variety, description, type_text, size_cm, color, gender, condition, age, origin, stock, advantages, care_guide, main_image, images)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14::jsonb,$15::jsonb,$16,$17::jsonb)`,
        [
          f.name,
          Number(f.price),
          Number(f.discountPercent || 0),
          f.variety || null,
          f.description || null,
          f.typeText || null,
          f.sizeCm || null,
          f.color || null,
          f.gender || null,
          f.condition || null,
          f.age || null,
          f.origin || null,
          Number(f.stock || 0),
          JSON.stringify(f.advantages || []),
          JSON.stringify(f.careGuide || []),
          f.mainImage || null,
          JSON.stringify(f.images || []),
        ]
      )
    },
  })
}

async function seedNeeds() {
  return seedTable({
    table: 'needs',
    countQuery: 'SELECT COUNT(*)::int AS count FROM needs',
    insertOne: async (i) => {
      const n = needs[i % needs.length]
      await pool.query(
        `INSERT INTO needs (name, description, price, discount_percent, specs, includes, features, stock, main_image, images)
         VALUES ($1,$2,$3,$4,$5::jsonb,$6::jsonb,$7::jsonb,$8,$9,$10::jsonb)`,
        [
          n.name,
          n.description || null,
          Number(n.price),
          Number(n.discountPercent || 0),
          JSON.stringify(n.specs || []),
          JSON.stringify(n.includes || []),
          JSON.stringify(n.features || []),
          Number(n.stock || 0),
          n.mainImage || null,
          JSON.stringify(n.images || []),
        ]
      )
    },
  })
}

async function main() {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL tidak ditemukan di .env server')
    }
    await ensureTables()
    const a = await seedArticles()
    const f = await seedFish()
    const n = await seedNeeds()
    console.log('Seeding selesai:', { articlesInserted: a, fishInserted: f, needsInserted: n })
  } catch (err) {
    console.error('Seeder error:', err)
    process.exitCode = 1
  } finally {
    await pool.end()
  }
}

main()