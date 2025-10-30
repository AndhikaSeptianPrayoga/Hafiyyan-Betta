import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, addItem } from '../redux'
import type { CartItem } from '../types'
import { listFish } from '../admin/services/api'

type Fish = {
  id: number
  name: string
  price: number
  discountPercent?: number
  mainImage?: string | null
  images?: string[] | null
  stock: number
}

export default function IkanPage() {
  const dispatch = useAppDispatch()
  const [fishes, setFishes] = useState<Fish[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    listFish()
      .then((data) => setFishes(data))
      .catch((err) => setError(err?.message || 'Gagal memuat ikan'))
      .finally(() => setLoading(false))
  }, [])

  const onAdd = useCallback(
    (fish: Fish) => {
      const img = fish.mainImage || (fish.images && fish.images[0]) || ''
      const item: CartItem = {
        id: fish.id,
        name: fish.name,
        price: `Rp ${fish.price.toLocaleString('id-ID')}`,
        img,
        category: 'fish',
        quantity: 1,
      }
      dispatch(addItem(item))
      alert(`${fish.name} berhasil ditambahkan ke keranjang!`)
    },
    [dispatch]
  )

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <p className="text-gray-600">Memuat...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Gagal memuat ikan</h1>
        <p className="text-gray-600">{error}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900">Katalog Ikan Cupang</h1>
        <p className="text-gray-600 mt-2">Jelajahi koleksi ikan cupang pilihan</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {fishes.map((fish) => {
          const img = fish.mainImage || (fish.images && fish.images[0]) || ''
          const hasDiscount = typeof fish.discountPercent === 'number' && fish.discountPercent > 0
          const original = hasDiscount
            ? Math.round(fish.price / (1 - (fish.discountPercent || 0) / 100))
            : null
          return (
            <div key={fish.id} className="card p-4">
              <img
                src={img}
                alt={fish.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-gray-900">{fish.name}</h4>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    fish.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {fish.stock > 0 ? `Stok: ${fish.stock}` : 'Stok Habis'}
                </span>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <p className="text-primary-main font-semibold">
                  Rp {fish.price.toLocaleString('id-ID')}
                </p>
                {hasDiscount && original && (
                  <span className="text-sm text-gray-500 line-through">
                    Rp {original.toLocaleString('id-ID')}
                  </span>
                )}
              </div>
              <div className="flex gap-3">
                <Link
                  to={`/ikan/${fish.id}`}
                  className="px-6 py-3 border border-primary-main text-primary-main rounded-lg hover:bg-primary-main hover:text-white transition-colors"
                >
                  Lihat Detail
                </Link>
                <button
                  onClick={() => onAdd(fish)}
                  disabled={!fish.stock || fish.stock <= 0}
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Tambah ke Keranjang
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}