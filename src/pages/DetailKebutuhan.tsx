/**
 * DETAIL KEBUTUHAN COMPONENT - REDUX INTEGRATION
 * ==============================================
 *
 * PENJELASAN UNTUK MENTOR:
 * DetailKebutuhan component sudah dimigrasi ke Redux Toolkit.
 * Menggunakan Redux hooks untuk cart operations.
 */

import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAppDispatch, addItem } from '../redux'

// Mock data kebutuhan
const kebutuhanData = {
  1: {
    id: 1,
    name: 'Paket Akuarium Starter 30L',
    price: 450000,
    originalPrice: 600000,
    category: 'Akuarium',
    brand: 'AquaTech',
    weight: '2.5 kg',
    dimensions: '40 x 25 x 30 cm',
    material: 'Kaca Tempered',
    images: [
      '/img/kebutuhan-img/1.png',
      '/img/kebutuhan-img/2.png',
      '/img/kebutuhan-img/3.png',
      '/img/kebutuhan-img/4.png',
    ],
    description:
      'Paket lengkap akuarium 30 liter untuk pemula. Dilengkapi dengan filter, heater, lampu LED, dan aksesoris lengkap. Sempurna untuk memelihara ikan cupang dengan kenyamanan maksimal.',
    specifications: {
      Kapasitas: '30 Liter',
      Dimensi: '40 x 25 x 30 cm',
      Material: 'Kaca Tempered 5mm',
      Berat: '2.5 kg',
      Merek: 'AquaTech',
      Garansi: '1 Tahun',
      Sertifikasi: 'SNI & CE',
    },
    included: [
      'Akuarium kaca 30L',
      'Filter internal 200L/jam',
      'Heater 50W dengan termostat',
      'Lampu LED 12W',
      'Tutup akuarium',
      'Termometer digital',
      'Jaring ikan',
      'Pembersih kaca',
      'Panduan penggunaan',
    ],
    features: [
      'Kaca tempered anti pecah',
      'Filter dengan media biologis',
      'Heater otomatis dengan indikator LED',
      'Lampu LED hemat energi',
      'Tutup rapat anti debu',
      'Termometer digital akurat',
    ],
    inStock: true,
    stock: 8,
    rating: 4.9,
    reviews: 156,
    warranty: '1 Tahun',
  },
  2: {
    id: 2,
    name: 'Pakan Premium Cupang Pro',
    price: 75000,
    originalPrice: 95000,
    category: 'Pakan',
    brand: 'BettaPro',
    weight: '250 gram',
    dimensions: '15 x 10 x 5 cm',
    material: 'Pelet Premium',
    images: [
      'https://images.unsplash.com/photo-1600250395176-c1f3fd3f878b?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600250395176-c1f3fd3f878b?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600250395176-c1f3fd3f878b?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600250395176-c1f3fd3f878b?q=80&w=800&auto=format&fit=crop',
    ],
    description:
      'Pakan premium khusus ikan cupang dengan kandungan protein tinggi dan vitamin lengkap. Meningkatkan warna, kesehatan, dan pertumbuhan ikan cupang dengan optimal.',
    specifications: {
      Berat: '250 gram',
      Protein: '42% minimum',
      Lemak: '8% minimum',
      Serat: '3% maksimum',
      Merek: 'BettaPro',
      Kadaluarsa: '18 bulan',
      Sertifikasi: 'BPOM & Halal',
    },
    included: [
      'Pakan pelet premium 250g',
      'Sendok takar',
      'Panduan pemberian pakan',
      'Kupon diskon pembelian berikutnya',
    ],
    features: [
      'Kandungan protein tinggi 42%',
      'Vitamin A, D, E untuk warna cerah',
      'Asam amino esensial lengkap',
      'Mudah dicerna dan tidak mengotori air',
      'Kemasan kedap udara',
      'Cocok untuk semua jenis cupang',
    ],
    inStock: true,
    stock: 25,
    rating: 4.7,
    reviews: 89,
    warranty: '18 Bulan',
  },
}

export default function DetailKebutuhan() {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)

  const kebutuhan = kebutuhanData[parseInt(id || '1') as keyof typeof kebutuhanData]

  if (!kebutuhan) {
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
    const cartItem = {
      id: kebutuhan.id,
      name: kebutuhan.name,
      price: kebutuhan.price.toString(),
      img: kebutuhan.images[0],
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
              src={kebutuhan.images[selectedImage]}
              alt={kebutuhan.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="grid grid-cols-4 gap-2">
            {kebutuhan.images.map((image: string, index: number) => (
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
              {kebutuhan.category}
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
              {kebutuhan.brand}
            </span>
            <span
              className={`px-3 py-1 text-sm rounded-full ${
                kebutuhan.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              {kebutuhan.inStock ? `Stok: ${kebutuhan.stock}` : 'Stok Habis'}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">{kebutuhan.name}</h1>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(kebutuhan.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="text-sm text-gray-600 ml-2">
                {kebutuhan.rating} ({kebutuhan.reviews} ulasan)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-3xl font-bold text-primary-main">
              Rp {kebutuhan.price.toLocaleString('id-ID')}
            </span>
            <span className="text-xl text-gray-500 line-through">
              Rp {kebutuhan.originalPrice.toLocaleString('id-ID')}
            </span>
            <span className="px-2 py-1 bg-red-100 text-red-800 text-sm rounded">
              Hemat{' '}
              {(
                ((kebutuhan.originalPrice - kebutuhan.price) / kebutuhan.originalPrice) *
                100
              ).toFixed(0)}
              %
            </span>
          </div>

          <p className="text-gray-700 mb-6">{kebutuhan.description}</p>

          {/* Specifications */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Spesifikasi Produk</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              {Object.entries(kebutuhan.specifications).map(([key, value]: [string, string]) => (
                <div
                  key={key}
                  className="flex justify-between py-2 border-b border-gray-200 last:border-b-0"
                >
                  <span className="text-gray-600">{key}</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* What's Included */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Yang Termasuk</h3>
            <ul className="space-y-2">
              {kebutuhan.included.map((item: string, index: number) => (
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
                disabled={!kebutuhan.inStock}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {kebutuhan.inStock ? 'Tambah ke Keranjang' : 'Stok Habis'}
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
            <h3 className="text-lg font-semibold mb-3">Keunggulan Produk</h3>
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
          </div>

          {/* Warranty */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-semibold text-blue-900">Garansi Resmi</span>
            </div>
            <p className="text-blue-800">{kebutuhan.warranty}</p>
          </div>
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
