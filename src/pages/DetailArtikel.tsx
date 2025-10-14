// DetailArtikel component dengan Tailwind CSS
import { useParams, Link } from 'react-router-dom'

// Mock data artikel
const artikelData = {
  1: {
    id: 1,
    title: 'Panduan Lengkap Perawatan Ikan Cupang untuk Pemula',
    author: 'Hafiyyan',
    date: '15 Desember 2024',
    readTime: '8 menit',
    category: 'Perawatan',
    image: '/img/betta-img/cupang (5).jpg',
    content: `
      <p class="mb-4">Memelihara ikan cupang bisa menjadi hobi yang sangat menyenangkan dan menenangkan. Namun, untuk pemula, ada beberapa hal penting yang perlu dipahami agar ikan cupang Anda bisa hidup sehat dan bahagia.</p>
      
      <h3 class="text-xl font-bold text-primary-main mb-3 mt-6">1. Persiapan Akuarium</h3>
      <p class="mb-4">Ukuran akuarium yang ideal untuk ikan cupang adalah minimal 20 liter. Akuarium yang terlalu kecil akan membuat ikan stres dan mudah sakit. Pastikan akuarium memiliki tutup untuk mencegah ikan melompat keluar.</p>
      
      <h3 class="text-xl font-bold text-primary-main mb-3 mt-6">2. Parameter Air</h3>
      <ul class="list-disc pl-5 mb-4 space-y-2">
        <li>Suhu air: 24-28°C</li>
        <li>pH: 6.5-7.5</li>
        <li>Ammonia: 0 ppm</li>
        <li>Nitrit: 0 ppm</li>
        <li>Nitrat: < 20 ppm</li>
      </ul>
      
      <h3 class="text-xl font-bold text-primary-main mb-3 mt-6">3. Pakan yang Tepat</h3>
      <p class="mb-4">Berikan pakan berkualitas tinggi 2-3 kali sehari dalam jumlah yang bisa dihabiskan dalam 2-3 menit. Variasikan pakan antara pelet, cacing darah, dan artemia untuk nutrisi yang seimbang.</p>
      
      <h3 class="text-xl font-bold text-primary-main mb-3 mt-6">4. Perawatan Rutin</h3>
      <p class="mb-4">Lakukan penggantian air 25-30% setiap minggu. Bersihkan filter dan siphon substrat secara teratur. Pantau kesehatan ikan dan segera isolasi jika terlihat sakit.</p>
    `,
    tags: ['Perawatan', 'Pemula', 'Akuarium', 'Pakan'],
  },
}

export default function DetailArtikel() {
  const { id } = useParams<{ id: string }>()
  const artikel = artikelData[parseInt(id || '1') as keyof typeof artikelData]

  if (!artikel) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Artikel Tidak Ditemukan</h1>
        <Link to="/artikel" className="btn-primary">
          Kembali ke Artikel
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
        <Link to="/" className="hover:text-primary-main">
          Beranda
        </Link>
        <span>/</span>
        <Link to="/artikel" className="hover:text-primary-main">
          Artikel
        </Link>
        <span>/</span>
        <span className="text-gray-900">{artikel.title}</span>
      </nav>

      {/* Hero Section */}
      <div className="mb-12">
        <div className="aspect-video rounded-2xl overflow-hidden mb-6">
          <img src={artikel.image} alt={artikel.title} className="w-full h-full object-cover" />
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <span className="px-3 py-1 bg-primary-main text-white text-sm rounded-full">
              {artikel.category}
            </span>
            <span className="text-gray-600">{artikel.date}</span>
            <span className="text-gray-600">•</span>
            <span className="text-gray-600">{artikel.readTime}</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{artikel.title}</h1>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 bg-primary-main rounded-full flex items-center justify-center text-white font-bold">
              {artikel.author.charAt(0)}
            </div>
            <div>
              <p className="font-semibold">{artikel.author}</p>
              <p className="text-sm text-gray-600">Penulis</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto">
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: artikel.content }}
        />

        {/* Tags */}
        <div className="mt-12 pt-8 border-t">
          <h4 className="text-lg font-semibold mb-4">Tags</h4>
          <div className="flex flex-wrap gap-2">
            {artikel.tags.map((tag: string, index: number) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-primary-main hover:text-white transition-colors cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Share Buttons */}
        <div className="mt-8 pt-8 border-t">
          <h4 className="text-lg font-semibold mb-4">Bagikan Artikel</h4>
          <div className="flex gap-3">
            <button className="btn-primary">WhatsApp</button>
            <button className="btn-secondary">Facebook</button>
            <button className="btn-secondary">Twitter</button>
            <button className="btn-secondary">Copy Link</button>
          </div>
        </div>

        {/* Related Articles */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Artikel Terkait</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card">
              <img
                src="/img/betta-img/cupang (6).jpg"
                alt="Artikel Terkait"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h4 className="font-bold text-gray-900 mb-2">Tips Breeding Ikan Cupang</h4>
              <p className="text-gray-600 text-sm">
                Pelajari teknik breeding yang tepat untuk menghasilkan anakan berkualitas.
              </p>
            </div>
            <div className="card">
              <img
                src="/img/betta-img/cupang (7).jpg"
                alt="Artikel Terkait"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h4 className="font-bold text-gray-900 mb-2">Mengatasi Penyakit Ikan Cupang</h4>
              <p className="text-gray-600 text-sm">
                Kenali gejala dan cara mengatasi penyakit umum pada ikan cupang.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
