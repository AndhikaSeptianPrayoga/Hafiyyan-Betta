import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAppDispatch, addItem } from '../redux'

// Mock data ikan
const ikanData = {
  1: {
    id: 1,
    name: 'Cupang Halfmoon Premium',
    price: 150000,
    originalPrice: 200000,
    category: 'Halfmoon',
    color: 'Merah Metalik',
    size: '5-6 cm',
    age: '3-4 bulan',
    gender: 'Jantan',
    images: [
      '/img/betta-img/cupang (1).jpg',
      '/img/betta-img/cupang (2).jpg',
      '/img/betta-img/cupang (3).jpg',
      '/img/betta-img/cupang (4).jpg',
    ],
    description:
      'Ikan cupang halfmoon premium dengan warna merah metalik yang sangat menawan. Sirip ekor yang lebar dan simetris membuat ikan ini terlihat sangat elegan. Cocok untuk kolektor dan pemula.',
    specifications: {
      Jenis: 'Halfmoon',
      Warna: 'Merah Metalik',
      Ukuran: '5-6 cm',
      Umur: '3-4 bulan',
      'Jenis Kelamin': 'Jantan',
      Asal: 'Breeding Lokal',
      Kondisi: 'Sehat & Aktif',
    },
    features: [
      'Sirip ekor lebar dan simetris',
      'Warna metalik yang mengkilap',
      'Kondisi fisik prima',
      'Sudah siap breeding',
      'Tahan terhadap penyakit',
    ],
    care: [
      'Ganti air 25% setiap minggu',
      'Berikan pakan 2x sehari',
      'Suhu air 24-28°C',
      'pH air 6.5-7.5',
      'Hindari stress berlebihan',
    ],
    inStock: true,
    stock: 5,
    rating: 4.8,
    reviews: 24,
  },
}

export default function DetailIkan() {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)

  const ikan = ikanData[parseInt(id || '1') as keyof typeof ikanData]

  if (!ikan) {
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
    const cartItem = {
      id: ikan.id,
      name: ikan.name,
      price: ikan.price.toString(),
      img: ikan.images[0],
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
              src={ikan.images[selectedImage]}
              alt={ikan.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="grid grid-cols-4 gap-2">
            {ikan.images.map((image: string, index: number) => (
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
              {ikan.category}
            </span>
            <span
              className={`px-3 py-1 text-sm rounded-full ${
                ikan.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              {ikan.inStock ? `Stok: ${ikan.stock}` : 'Stok Habis'}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">{ikan.name}</h1>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(ikan.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="text-sm text-gray-600 ml-2">
                {ikan.rating} ({ikan.reviews} ulasan)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-3xl font-bold text-primary-main">
              Rp {ikan.price.toLocaleString('id-ID')}
            </span>
            <span className="text-xl text-gray-500 line-through">
              Rp {ikan.originalPrice.toLocaleString('id-ID')}
            </span>
            <span className="px-2 py-1 bg-red-100 text-red-800 text-sm rounded">
              Hemat {(((ikan.originalPrice - ikan.price) / ikan.originalPrice) * 100).toFixed(0)}%
            </span>
          </div>

          <p className="text-gray-700 mb-6">{ikan.description}</p>

          {/* Specifications */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Spesifikasi</h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(ikan.specifications).map(([key, value]: [string, string]) => (
                <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">{key}</span>
                  <span className="font-medium">{value}</span>
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
                disabled={!ikan.inStock}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {ikan.inStock ? 'Tambah ke Keranjang' : 'Stok Habis'}
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

          {/* Features */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Keunggulan</h3>
            <ul className="space-y-2">
              {ikan.features.map((feature: string, index: number) => (
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
          </div>

          {/* Care Instructions */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Panduan Perawatan</h3>
            <ul className="space-y-2">
              {ikan.care.map((instruction: string, index: number) => (
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
