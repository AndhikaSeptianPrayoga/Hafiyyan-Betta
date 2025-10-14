// ProfilPage component dengan Tailwind CSS

export default function ProfilPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero */}
      <div className="grid md:grid-cols-2 gap-10 items-center mb-16">
        <div className="aspect-video rounded-2xl shadow-2xl overflow-hidden bg-gray-900 ring-1 ring-black/5 relative">
          <iframe
            src="https://www.youtube.com/embed/B30S0Vr9N9A?autoplay=1&mute=1&loop=1&playlist=B30S0Vr9N9A&controls=0&disablekb=1&modestbranding=1&rel=0&showinfo=0&enablejsapi=0&iv_load_policy=3&cc_load_policy=0&fs=0&start=0&end=0&theme=dark"
            title=""
            className="w-full h-full pointer-events-none"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen={false}
            style={{ pointerEvents: 'none', userSelect: 'none' }}
          />
          {/* Overlay untuk memastikan tidak ada interaksi */}
          <div
            className="absolute inset-0 bg-transparent pointer-events-auto"
            style={{ zIndex: 1 }}
          ></div>
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-primary-main mb-4">
            Tentang Hafiyyan Betta
          </h1>
          <p className="text-gray-700 leading-relaxed mb-4">
            Komunitas dan toko hobi yang berfokus pada perawatan, edukasi, dan pengembangan kualitas
            ikan cupang berkualitas premium. Dengan pengalaman lebih dari 5 tahun, kami menghadirkan
            koleksi terbaik dari berbagai jenis dan varian dengan harga kompetitif.
          </p>
          <ul className="text-sm text-gray-600 grid sm:grid-cols-2 gap-2">
            <li>• Breeder & Kurator Ikan Pilihan</li>
            <li>• Artikel kurasi dari pengalaman lapangan</li>
            <li>• Kebutuhan lengkap: pakan, obat, tank</li>
            <li>• Konsultasi perawatan gratis</li>
          </ul>
        </div>
      </div>

      {/* Visi Misi */}
      <div className="grid md:grid-cols-2 gap-6 mb-16">
        <div className="card">
          <h3 className="text-xl font-bold text-primary-main mb-2">Visi</h3>
          <p className="text-gray-600">
            Menjadi pusat terdepan dalam industri ikan cupang Indonesia dengan menghadirkan ikan
            berkualitas premium dan layanan terbaik.
          </p>
        </div>
        <div className="card">
          <h3 className="text-xl font-bold text-primary-main mb-2">Misi</h3>
          <ul className="text-gray-600 list-disc pl-5 space-y-1">
            <li>Menyediakan ikan cupang berkualitas tinggi</li>
            <li>Edukasi perawatan cupang yang tepat</li>
            <li>Membangun komunitas pecinta cupang</li>
            <li>Inovasi dalam breeding dan seleksi</li>
          </ul>
        </div>
      </div>

      {/* Tim & Statistik */}
      <div className="grid md:grid-cols-2 gap-6 mb-16">
        <div className="card">
          <h3 className="text-xl font-bold text-primary-main mb-4">Tim Kami</h3>
          <div className="flex items-center gap-4">
            <div className="bg-primary-main text-white rounded-full w-14 h-14 flex items-center justify-center">
              HB
            </div>
            <div>
              <p className="font-semibold">Hafiyyan · Founder & Lead Breeder</p>
              <p className="text-sm text-gray-600">
                5+ tahun pengalaman dalam breeding & seleksi ikan cupang
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="card text-center">
            <p className="text-2xl font-bold text-primary-main">500+</p>
            <p className="text-sm text-gray-600">Pelanggan Puas</p>
          </div>
          <div className="card text-center">
            <p className="text-2xl font-bold text-primary-main">50+</p>
            <p className="text-sm text-gray-600">Jenis Varietas</p>
          </div>
          <div className="card text-center">
            <p className="text-2xl font-bold text-primary-main">5</p>
            <p className="text-sm text-gray-600">Tahun Pengalaman</p>
          </div>
          <div className="card text-center">
            <p className="text-2xl font-bold text-primary-main">100%</p>
            <p className="text-sm text-gray-600">Kepuasan</p>
          </div>
        </div>
      </div>

      {/* Kontak */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="card text-center">
          <h4 className="font-semibold mb-2">Alamat</h4>
          <p className="text-sm text-gray-600">
            Jl. Alfatih I No. 5B, Cihanjuang, Parongpong, Bandung Barat
          </p>
        </div>
        <div className="card text-center">
          <h4 className="font-semibold mb-2">Jam Operasional</h4>
          <p className="text-sm text-gray-600">Senin - Minggu, 08:00 - 20:00 WIB</p>
        </div>
        <div className="card text-center">
          <h4 className="font-semibold mb-2">Hubungi Kami</h4>
          <div className="flex justify-center gap-3">
            <a
              className="btn-primary"
              href="https://wa.me/6287823451095"
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              title="WhatsApp"
            >
              WhatsApp
            </a>
            <a
              className="btn-secondary"
              href="https://instagram.com/hafiyyanbetta"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              title="Instagram"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
