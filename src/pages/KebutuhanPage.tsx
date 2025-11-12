import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, addItem } from '../redux'
import type { CartItem } from '../types'
import { listNeeds } from '../admin/services/api'

type Need = {
  id: number
  name: string
  price: number
  discountPercent?: number
  mainImage?: string | null
  images?: string[]
  stock?: number
}

export default function KebutuhanPage() {
  const dispatch = useAppDispatch()
  const [needs, setNeeds] = useState<Need[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    listNeeds()
      .then((data) => {
        if (!mounted) return
        setNeeds(Array.isArray(data) ? data : [])
      })
      .catch((e) => setError(e.message || 'Gagal memuat kebutuhan'))
      .finally(() => setLoading(false))
    return () => {
      mounted = false
    }
  }, [])

  const onAdd = useCallback(
    (n: Need) => {
      const img = n.mainImage || (n.images && n.images[0]) || ''
      const hasDiscount = typeof n.discountPercent === 'number' && n.discountPercent > 0
      const discounted = hasDiscount
        ? Math.round(n.price * (1 - (n.discountPercent || 0) / 100))
        : n.price
      const cartItem: Omit<CartItem, 'quantity'> = {
        id: n.id,
        name: n.name,
        price: `Rp ${discounted.toLocaleString('id-ID')}`,
        img,
        category: 'supplies',
      }
      dispatch(addItem(cartItem))
      alert(`${n.name} berhasil ditambahkan ke keranjang!`)
    },
    [dispatch]
  )

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900">Katalog Kebutuhan Cupang</h1>
        <p className="text-gray-600 mt-2">Temukan perlengkapan dan kebutuhan terbaik untuk merawat ikan cupang kesayangan Anda</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {needs.map((n) => {
          const img = n.mainImage || (n.images && n.images[0]) || ''
          const hasDiscount = typeof n.discountPercent === 'number' && n.discountPercent > 0
          const discounted = hasDiscount
            ? Math.round(n.price * (1 - (n.discountPercent || 0) / 100))
            : n.price
          const stock = typeof n.stock === 'number' ? n.stock : 0
          return (
            <div key={n.id} className="card p-4">
              <div className="w-full aspect-square overflow-hidden rounded-lg mb-4 bg-gray-100">
                <img
                  src={img}
                  alt={n.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-gray-900 line-clamp-2">{n.name}</h4>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {stock > 0 ? `Stok: ${stock}` : 'Stok Habis'}
                </span>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xl font-bold text-primary-main">Rp {discounted.toLocaleString('id-ID')}</span>
                {hasDiscount && (
                  <span className="text-gray-500 line-through">Rp {n.price.toLocaleString('id-ID')}</span>
                )}
                {hasDiscount && (
                  <span className="px-2 py-1 rounded text-xs bg-red-100 text-red-700">Diskon {n.discountPercent}%</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Link
                  to={`/kebutuhan/${n.id}`}
                  className="px-6 py-3 border border-primary-main text-primary-main rounded-lg hover:bg-primary-main hover:text-white transition-colors"
                >
                  Lihat Detail
                </Link>
                <button
                  onClick={() => onAdd(n)}
                  disabled={!stock || stock <= 0}
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Tambah ke Keranjang
                </button>
              </div>
            </div>
          )
        })}
        {!loading && !error && needs.length === 0 && (
          <p className="text-gray-600">Belum ada produk kebutuhan.</p>
        )}
      </div>
      {loading && <p className="text-gray-600 mt-4">Memuat...</p>}
      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  )
}
