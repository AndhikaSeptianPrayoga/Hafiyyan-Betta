import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAppDispatch, addItem } from '../redux'
import { getFish } from '../admin/services/api'

type Fish = {
  id: number
  name: string
  price: number
  discountPercent?: number
  variety?: string
  description?: string
  typeText?: string
  sizeCm?: string
  color?: string
  gender?: string
  condition?: string
  age?: string
  origin?: string
  stock: number
  advantages?: string[]
  careGuide?: string[]
  mainImage?: string | null
  images?: string[] | null
}

// Data diambil dari API; mock lokal dihapus

export default function DetailIkan() {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [ikan, setIkan] = useState<Fish | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fishId = Number(id)
    if (!fishId) {
      setError('Ikan tidak ditemukan')
      setLoading(false)
      return
    }
    getFish(fishId)
      .then((data) => setIkan(data))
      .catch((e) => setError(e.message || 'Ikan tidak ditemukan'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <p className="text-gray-600">Memuat...</p>
      </div>
    )
  }

  if (error || !ikan) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Ikan Tidak Ditemukan</h1>
        <Link to="/ikan" className="btn-primary">
          Kembali ke Katalog Ikan
        </Link>
      </div>
    )
  }

  const handleAddToCartClick = () => {
    const img = ikan.mainImage || (ikan.images && ikan.images[0]) || ''
    const cartItem = {
      id: ikan.id,
      name: ikan.name,
      price: `Rp ${ikan.price.toLocaleString('id-ID')}`,
      img,
      category: 'fish' as const,
    }
    dispatch(addItem(cartItem))
    alert(`${ikan.name} berhasil ditambahkan ke keranjang!`)
  }

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
        <Link to="/" className="hover:text-primary-main">
          Beranda
        </Link>
        <span>/</span>
        <Link to="/ikan" className="hover:text-primary-main">
          Ikan
        </Link>
        <span>/</span>
        <span className="text-gray-900">{ikan.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Gallery */}
        <div>
          <div className="aspect-square rounded-2xl overflow-hidden mb-4">
            <img
              src={ikan.images ? ikan.images[selectedImage] : ikan.mainImage || ''}
              alt={ikan.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="grid grid-cols-4 gap-2">
            {(ikan.images || [ikan.mainImage || '']).map((image: string, index: number) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-square rounded-lg overflow-hidden border-2 ${
                  selectedImage === index ? 'border-primary-main' : 'border-gray-200'
                }`}
              >
                <img
                  src={image}
                  alt={`${ikan.name} ${index + 1}`}
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
              Ikan Cupang
            </span>
            <span
              className={`px-3 py-1 text-sm rounded-full ${
                ikan.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              {ikan.stock > 0 ? `Stok: ${ikan.stock}` : 'Stok Habis'}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">{ikan.name}</h1>

          {/* Info sederhana tanpa rating */}

          <div className="flex items-center gap-4 mb-6">
            <span className="text-3xl font-bold text-primary-main">
              Rp {ikan.price.toLocaleString('id-ID')}
            </span>
            {typeof ikan.discountPercent === 'number' && ikan.discountPercent > 0 && (
              <span className="text-xl text-gray-500 line-through">
                Rp {Math.round(ikan.price / (1 - ikan.discountPercent / 100)).toLocaleString('id-ID')}
              </span>
            )}
          </div>

          <p className="text-gray-700 mb-6">{ikan.description}</p>

          {/* Spesifikasi */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Spesifikasi</h3>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  { label: 'Jenis', value: ikan.variety || ikan.typeText },
                  { label: 'Ukuran', value: ikan.sizeCm },
                  { label: 'Warna', value: ikan.color },
                  { label: 'Jenis Kelamin', value: ikan.gender },
                  { label: 'Asal', value: ikan.origin },
                  { label: 'Kondisi', value: ikan.condition },
                  { label: 'Umur', value: ikan.age },
                ] as { label: string; value?: string | null }[]
              )
                .filter((s) => s.value && String(s.value).trim().length > 0)
                .map((s) => (
                  <div key={s.label} className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">{s.label}</span>
                    <span className="font-medium">{s.value}</span>
                  </div>
                ))}
            </div>
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
                  onClick={() => setQuantity(Math.min(ikan.stock, quantity + 1))}
                  className="px-3 py-2 text-gray-600 hover:text-gray-800"
                >
                  +
                </button>
              </div>
              <span className="text-sm text-gray-600">Tersedia: {ikan.stock}</span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAddToCartClick}
                disabled={!ikan.stock || ikan.stock <= 0}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {ikan.stock > 0 ? 'Tambah ke Keranjang' : 'Stok Habis'}
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

          {/* Keunggulan */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Keunggulan</h3>
            {Array.isArray(ikan.advantages) && ikan.advantages.length > 0 ? (
              <ul className="space-y-2">
                {ikan.advantages.map((feature: string, index: number) => (
                  <li key={index} className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
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

          {/* Panduan Perawatan */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Panduan Perawatan</h3>
            {Array.isArray(ikan.careGuide) && ikan.careGuide.length > 0 ? (
              <ul className="space-y-2">
                {ikan.careGuide.map((instruction: string, index: number) => (
                  <li key={index} className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{instruction}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">Tidak ada panduan perawatan.</p>
            )}
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-16">
        <h3 className="text-2xl font-bold text-gray-900 mb-8">Ikan Terkait</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card">
            <img
              src="/img/betta-img/cupang (10).jpg"
              alt="Ikan Terkait"
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h4 className="font-bold text-gray-900 mb-2">Cupang Crown Tail</h4>
            <p className="text-primary-main font-semibold">Rp 120.000</p>
          </div>
          <div className="card">
            <img
              src="/img/betta-img/cupang (11).jpg"
              alt="Ikan Terkait"
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h4 className="font-bold text-gray-900 mb-2">Cupang Double Tail</h4>
            <p className="text-primary-main font-semibold">Rp 180.000</p>
          </div>
          <div className="card">
            <img
              src="/img/betta-img/cupang (12).jpg"
              alt="Ikan Terkait"
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h4 className="font-bold text-gray-900 mb-2">Cupang Plakat</h4>
            <p className="text-primary-main font-semibold">Rp 100.000</p>
          </div>
        </div>
      </div>
    </div>
  )
}
