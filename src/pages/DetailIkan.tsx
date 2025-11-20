import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAppDispatch, addItem } from '../redux'
import { getFish } from '../admin/services/api'
import RelatedSection from '../components/RelatedSection'

type Fish = {
  id: number
  name: string
  price: number
  discountPercent?: number
  variety?: string
  description?: string
  typeText?: string
  sizeCm?: string
  bodySize?: string
  tailSize?: string
  color?: string
  gender?: string
  age?: string
  stock: number
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
    // Interpretasi baru: backend menyimpan harga final setelah diskon
    const finalPrice = ikan.price
    const cartItem = {
      id: ikan.id,
      name: ikan.name,
      price: `Rp ${finalPrice.toLocaleString('id-ID')}`,
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
            {(() => {
              const hasDiscount = typeof ikan.discountPercent === 'number' && ikan.discountPercent > 0
              // Harga final datang dari backend; jika ada diskon, hitung harga asli untuk ditampilkan coret
              const finalPrice = ikan.price
              const originalPrice = hasDiscount
                ? Math.round(finalPrice / (1 - (ikan.discountPercent || 0) / 100))
                : null
              return (
                <>
                  <span className="text-3xl font-bold text-primary-main">Rp {finalPrice.toLocaleString('id-ID')}</span>
                  {hasDiscount && originalPrice !== null && (
                    <span className="text-xl text-gray-500 line-through">Rp {originalPrice.toLocaleString('id-ID')}</span>
                  )}
                </>
              )
            })()}
          </div>

          <p className="text-gray-700 mb-6">{ikan.description}</p>

          {/* Spesifikasi */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Spesifikasi</h3>
            {(() => {
              const clean = (v?: string | null) => (v && String(v).trim().length > 0 ? v : null)
              // Susun berpasangan agar lebih mudah dibaca (tidak atas-bawah)
              const rows: Array<
                [
                  { label: string; value: string | null },
                  { label: string; value: string | null }
                ]
              > = [
                [
                  { label: 'Ukuran Body', value: clean(ikan.bodySize) },
                  { label: 'Ukuran Ekor', value: clean(ikan.tailSize) },
                ],
                [
                  { label: 'Jenis', value: clean(ikan.variety || ikan.typeText) },
                  { label: 'Warna', value: clean(ikan.color) },
                ],
                [
                  { label: 'Jenis Kelamin', value: clean(ikan.gender) },
                  { label: 'Umur', value: clean(ikan.age) },
                ],
              ]

              return (
                <div className="space-y-2">
                  {rows
                    .filter(([a, b]) => a.value || b.value)
                    .map((pair, idx) => (
                      <div key={idx} className="grid grid-cols-2 gap-2">
                        {pair.map((item, i) => (
                          <div key={i} className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">{item.label}</span>
                            <span className="font-medium">{item.value ?? '-'}</span>
                          </div>
                        ))}
                      </div>
                    ))}
                </div>
              )
            })()}
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

          {/* Bagian Keunggulan & Panduan Perawatan dihapus sesuai permintaan */}
        </div>
      </div>

      <RelatedSection kind="ikan" currentId={ikan.id} />
    </div>
  )
}
