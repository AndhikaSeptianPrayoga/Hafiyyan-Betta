import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, addItem } from '../redux'
import type { CartItem } from '../types'
import { listNeeds } from '../admin/services/api'

type Need = {
  id: number
  name: string
  price: number
  mainImage?: string | null
  images?: string[]
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
      const cartItem: Omit<CartItem, 'quantity'> = {
        id: n.id,
        name: n.name,
        price: `Rp ${n.price.toLocaleString('id-ID')}`,
        img,
        category: 'supplies',
      }
      dispatch(addItem(cartItem))
    },
    [dispatch]
  )

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl md:text-4xl font-bold text-primary-main mb-8">Kebutuhan Cupang</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {needs.map((n) => (
          <div
            key={n.id}
            className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
          >
            <div className="relative">
              <img
                src={n.mainImage || (n.images && n.images[0]) || '../img/kebutuhan-img/1.png'}
                alt={n.name}
                className="w-full h-48 object-cover"
              />
            </div>
            <div className="p-6">
              <Link to={`/kebutuhan/${n.id}`}>
                <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-primary-main transition">
                  {n.name}
                </h3>
              </Link>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-primary-main">{`Rp ${n.price.toLocaleString('id-ID')}`}</span>
                <div className="flex gap-2">
                  <Link
                    to={`/kebutuhan/${n.id}`}
                    className="px-3 py-2 rounded border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                  >
                    Detail
                  </Link>
                  <button
                    onClick={() => onAdd(n)}
                    className="px-3 py-2 rounded border border-gray-200 text-primary-main hover:bg-primary-main hover:text-white transition"
                  >
                    Tambah
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {!loading && !error && needs.length === 0 && (
          <p className="text-gray-600">Belum ada produk kebutuhan.</p>
        )}
      </div>
      {loading && <p className="text-gray-600 mt-4">Memuat...</p>}
      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  )
}
