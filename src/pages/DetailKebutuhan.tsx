/**
 * DETAIL KEBUTUHAN COMPONENT - REDUX INTEGRATION
 * ==============================================
 *
 * PENJELASAN UNTUK MENTOR:
 * DetailKebutuhan component sudah dimigrasi ke Redux Toolkit.
 * Menggunakan Redux hooks untuk cart operations.
 */

import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAppDispatch, addItem } from '../redux'
import { getNeed } from '../admin/services/api'

type Need = {
  id: number
  name: string
  description?: string
  price: number
  discountPercent?: number
  specs?: string[]
  includes?: string[]
  features?: string[]
  stock: number
  mainImage?: string | null
  images?: string[] | null
}

// Data diambil dari API; mock lokal dihapus

export default function DetailKebutuhan() {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [kebutuhan, setKebutuhan] = useState<Need | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const needId = Number(id)
    if (!needId) {
      setError('Produk tidak ditemukan')
      setLoading(false)
      return
    }
    getNeed(needId)
      .then((data) => setKebutuhan(data))
      .catch((e) => setError(e.message || 'Produk tidak ditemukan'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <p className="text-gray-600">Memuat...</p>
      </div>
    )
  }

  if (error || !kebutuhan) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Produk Tidak Ditemukan</h1>
        <Link to="/kebutuhan" className="btn-primary">
          Kembali ke Kebutuhan
        </Link>
      </div>
    )
  }

  const handleAddToCartClick = () => {
    const img = kebutuhan.mainImage || (kebutuhan.images && kebutuhan.images[0]) || ''
    const hasDiscount = typeof kebutuhan.discountPercent === 'number' && kebutuhan.discountPercent > 0
    const discounted = hasDiscount
      ? Math.round(kebutuhan.price * (1 - (kebutuhan.discountPercent || 0) / 100))
      : kebutuhan.price
    const cartItem = {
      id: kebutuhan.id,
      name: kebutuhan.name,
      price: `Rp ${discounted.toLocaleString('id-ID')}`,
      img,
      category: 'supplies' as const,
    }
    dispatch(addItem(cartItem))
    alert(`${kebutuhan.name} berhasil ditambahkan ke keranjang!`)
  }

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
        <Link to="/" className="hover:text-primary-main">
          Beranda
        </Link>
        <span>/</span>
        <Link to="/kebutuhan" className="hover:text-primary-main">
          Kebutuhan
        </Link>
        <span>/</span>
        <span className="text-gray-900">{kebutuhan.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Gallery */}
        <div>
          <div className="aspect-square rounded-2xl overflow-hidden mb-4">
            <img
              src={kebutuhan.images ? kebutuhan.images[selectedImage] : kebutuhan.mainImage || ''}
              alt={kebutuhan.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="grid grid-cols-4 gap-2">
            {(kebutuhan.images || [kebutuhan.mainImage || '']).map((image: string, index: number) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-square rounded-lg overflow-hidden border-2 ${
                  selectedImage === index ? 'border-primary-main' : 'border-gray-200'
                }`}
              >
                <img
                  src={image}
                  alt={`${kebutuhan.name} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-primary-main text-white text-sm rounded-full">
              Kebutuhan
            </span>
            {/* brand dihilangkan karena data API tidak memiliki brand */}
            <span
              className={`px-3 py-1 text-sm rounded-full ${
                kebutuhan.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              {kebutuhan.stock > 0 ? `Stok: ${kebutuhan.stock}` : 'Stok Habis'}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">{kebutuhan.name}</h1>

          {/* Info sederhana tanpa rating */}

          <div className="flex items-center gap-4 mb-6">
            {(() => {
              const hasDiscount = typeof kebutuhan.discountPercent === 'number' && kebutuhan.discountPercent > 0
              const discounted = hasDiscount
                ? Math.round(kebutuhan.price * (1 - (kebutuhan.discountPercent || 0) / 100))
                : kebutuhan.price
              return (
                <>
                  <span className="text-3xl font-bold text-primary-main">
                    Rp {discounted.toLocaleString('id-ID')}
                  </span>
                  {hasDiscount && (
                    <span className="text-xl text-gray-500 line-through">
                      Rp {kebutuhan.price.toLocaleString('id-ID')}
                    </span>
                  )}
                </>
              )
            })()}
          </div>

          <p className="text-gray-700 mb-6">{kebutuhan.description}</p>

          {/* Spesifikasi */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Spesifikasi Produk</h3>
            {Array.isArray(kebutuhan.specs) && kebutuhan.specs.length > 0 ? (
              <ul className="space-y-2 bg-gray-50 rounded-lg p-4">
                {kebutuhan.specs.map((s: string, idx: number) => (
                  <li key={idx} className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">Tidak ada spesifikasi.</p>
            )}
          </div>

          {/* Paket termasuk */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Yang Termasuk</h3>
            {Array.isArray(kebutuhan.includes) && kebutuhan.includes.length > 0 ? (
              <ul className="space-y-2">
                {kebutuhan.includes.map((item: string, index: number) => (
                  <li key={index} className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">Tidak ada paket termasuk.</p>
            )}
          </div>

          {/* Quantity & Add to Cart */}
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-gray-700">Jumlah:</span>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-gray-600 hover:text-gray-800"
                >
                  -
                </button>
                <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(kebutuhan.stock, quantity + 1))}
                  className="px-3 py-2 text-gray-600 hover:text-gray-800"
                >
                  +
                </button>
              </div>
              <span className="text-sm text-gray-600">Tersedia: {kebutuhan.stock}</span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAddToCartClick}
                disabled={!kebutuhan.stock || kebutuhan.stock <= 0}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {kebutuhan.stock > 0 ? 'Tambah ke Keranjang' : 'Stok Habis'}
              </button>
              <button className="px-6 py-3 border border-primary-main text-primary-main rounded-lg hover:bg-primary-main hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Fitur / Keunggulan */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Keunggulan Produk</h3>
            {Array.isArray(kebutuhan.features) && kebutuhan.features.length > 0 ? (
              <ul className="space-y-2">
                {kebutuhan.features.map((feature: string, index: number) => (
                  <li key={index} className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">Tidak ada keunggulan.</p>
            )}
          </div>
          {/* Tanpa garansi khusus */}
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-16">
        <h3 className="text-2xl font-bold text-gray-900 mb-8">Produk Terkait</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card">
            <img
              src="/img/kebutuhan-img/1.png"
              alt="Produk Terkait"
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h4 className="font-bold text-gray-900 mb-2">Filter Internal 300L</h4>
            <p className="text-primary-main font-semibold">Rp 85.000</p>
          </div>
          <div className="card">
            <img
              src="/img/kebutuhan-img/2.png"
              alt="Produk Terkait"
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h4 className="font-bold text-gray-900 mb-2">Heater 100W</h4>
            <p className="text-primary-main font-semibold">Rp 120.000</p>
          </div>
          <div className="card">
            <img
              src="/img/kebutuhan-img/3.png"
              alt="Produk Terkait"
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h4 className="font-bold text-gray-900 mb-2">Lampu LED 20W</h4>
            <p className="text-primary-main font-semibold">Rp 95.000</p>
          </div>
        </div>
      </div>
    </div>
  )
}
