import { useEffect, useMemo, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, addItem } from '../redux'
import type { CartItem } from '../types'
import { listFish, listNeeds } from '../admin/services/api'

type Fish = {
  id: number
  name: string
  price: number
  discountPercent?: number
  mainImage?: string | null
  images?: string[] | null
  stock?: number
}

type Need = {
  id: number
  name: string
  price: number
  discountPercent?: number
  mainImage?: string | null
  images?: string[] | null
  stock?: number
}

type ShopItem = {
  id: number
  name: string
  price: number
  discountPercent?: number
  image: string
  stock: number
  kind: 'ikan' | 'kebutuhan'
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'

function resolveImageUrl(url?: string | null): string {
  const fallback = '/img/logo.png'
  if (!url) return fallback
  if (url.startsWith('/uploads/')) return `${API_BASE}${url}`
  return url
}

export default function ShopPage() {
  const dispatch = useAppDispatch()
  const [fishes, setFishes] = useState<Fish[]>([])
  const [needs, setNeeds] = useState<Need[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'semua' | 'ikan' | 'kebutuhan'>('semua')

  useEffect(() => {
    let mounted = true
    Promise.all([listFish(), listNeeds()])
      .then(([fishData, needData]) => {
        if (!mounted) return
        setFishes(Array.isArray(fishData) ? fishData : [])
        setNeeds(Array.isArray(needData) ? needData : [])
      })
      .catch((e) => setError(e.message || 'Gagal memuat produk'))
      .finally(() => setLoading(false))
    return () => {
      mounted = false
    }
  }, [])

  const items: ShopItem[] = useMemo(() => {
    const fishItems: ShopItem[] = fishes.map((f) => {
      const img = f.mainImage || (Array.isArray(f.images) && f.images[0]) || ''
      return {
        id: f.id,
        name: f.name,
        price: f.price,
        discountPercent: f.discountPercent,
        image: resolveImageUrl(img),
        stock: typeof f.stock === 'number' ? f.stock : 0,
        kind: 'ikan',
      }
    })
    const needItems: ShopItem[] = needs.map((n) => {
      const img = n.mainImage || (Array.isArray(n.images) && n.images[0]) || ''
      return {
        id: n.id,
        name: n.name,
        price: n.price,
        discountPercent: n.discountPercent,
        image: resolveImageUrl(img),
        stock: typeof n.stock === 'number' ? n.stock : 0,
        kind: 'kebutuhan',
      }
    })
    return [...fishItems, ...needItems]
  }, [fishes, needs])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return items
      .filter((it) => (filter === 'semua' ? true : it.kind === filter))
      .filter((it) => (q ? it.name.toLowerCase().includes(q) : true))
  }, [items, filter, query])

  const onAdd = useCallback(
    (it: ShopItem) => {
      // Gunakan harga final dari API apa adanya untuk konsistensi.
      const finalPrice = it.price
      const cartItem: Omit<CartItem, 'quantity'> = {
        id: it.id,
        name: it.name,
        price: `Rp ${finalPrice.toLocaleString('id-ID')}`,
        img: it.image,
        category: it.kind === 'ikan' ? 'fish' : 'supplies',
      }
      dispatch(addItem(cartItem))
      alert(`${it.name} berhasil ditambahkan ke keranjang!`)
    },
    [dispatch]
  )

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Shop Hafiyyan Betta</h1>
        <p className="text-gray-600 mt-2">Belanja Ikan Cupang dan perlengkapannya dalam satu tempat</p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border p-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          {/* Segmented filter */}
          <div className="inline-flex rounded-lg border overflow-hidden">
            {[
              { key: 'semua', label: 'Semua' },
              { key: 'ikan', label: 'Ikan Cupang' },
              { key: 'kebutuhan', label: 'Kebutuhan Cupang' },
            ].map((opt) => (
              <button
                key={opt.key}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  filter === (opt.key as any)
                    ? 'bg-primary-main text-white'
                    : 'bg-white text-primary-main hover:bg-primary-light'
                }`}
                onClick={() => setFilter(opt.key as any)}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex-1 md:max-w-md">
            <input
              className="form-input w-full"
              placeholder="Cari produk..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {filtered.map((it) => {
          const hasDiscount = typeof it.discountPercent === 'number' && it.discountPercent > 0
          // Harga `it.price` dari API adalah harga final.
          const finalPrice = it.price
          const originalPrice = hasDiscount
            ? Math.round(finalPrice / (1 - (it.discountPercent || 0) / 100))
            : null
          return (
            <div key={`${it.kind}-${it.id}`} className="card p-4 hover:shadow-lg transition-shadow">
              <div className="w-full aspect-square overflow-hidden rounded-lg mb-4 bg-gray-100">
                <img src={it.image} alt={it.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-bold text-gray-900 line-clamp-2">{it.name}</h4>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    it.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {it.stock > 0 ? `Stok: ${it.stock}` : 'Stok Habis'}
                </span>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xl font-bold text-primary-main">Rp {finalPrice.toLocaleString('id-ID')}</span>
                {hasDiscount && originalPrice !== null && (
                  <span className="text-gray-500 line-through">Rp {originalPrice.toLocaleString('id-ID')}</span>
                )}
                {hasDiscount && (
                  <span className="px-2 py-1 rounded text-xs bg-red-100 text-red-700">Diskon {it.discountPercent}%</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Link
                  to={it.kind === 'ikan' ? `/ikan/${it.id}` : `/kebutuhan/${it.id}`}
                  className="px-6 py-3 border border-primary-main text-primary-main rounded-lg hover:bg-primary-main hover:text-white transition-colors"
                >
                  Lihat Detail
                </Link>
                <button
                  onClick={() => onAdd(it)}
                  disabled={!it.stock || it.stock <= 0}
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Tambah ke Keranjang
                </button>
              </div>
              <div className="mt-3 text-xs text-gray-500">Kategori: {it.kind === 'ikan' ? 'Ikan Cupang' : 'Kebutuhan Cupang'}</div>
            </div>
          )
        })}
      </div>

      {!loading && !error && filtered.length === 0 && (
        <p className="text-gray-600 mt-6">Produk tidak ditemukan.</p>
      )}
      {loading && <p className="text-gray-600 mt-6">Memuat...</p>}
      {error && <p className="text-red-600 mt-6">{error}</p>}
    </div>
  )
}