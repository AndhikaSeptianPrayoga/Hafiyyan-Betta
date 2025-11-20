// HomePage component dengan Tailwind CSS
import { NavLink } from 'react-router-dom'
import Seo from '../components/Seo'
import TiktokChart from '../components/TiktokChart'

export default function HomePage() {
  return (
    <>
      <Seo
        title="Hafiyyan Betta — Ikan Cupang Berkualitas"
        description="Belanja ikan cupang, kebutuhan perawatan, dan baca artikel tips breeding & care."
        ogTitle="Hafiyyan Betta"
        ogDescription="Koleksi ikan cupang beragam dan perlengkapan perawatan lengkap."
        ogImage="/img/logo.png"
        canonicalUrl="https://example.com/"
        twitterCard="summary_large_image"
        twitterTitle="Hafiyyan Betta — Ikan Cupang Berkualitas"
        twitterDescription="Belanja ikan cupang dan perlengkapan perawatan berkualitas."
        twitterImage="/img/logo.png"
      />
      {/* Hero Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl font-bold leading-tight text-gray-900">
                Warna-Warni Ikan Cupang Siap Hiasi Harimu
              </h1>
              <p className="text-sm font-semibold tracking-wide text-primary-dark uppercase">
                HAFIYYAN BETTA — Segala Jenis Ikan Cupang Ada di Sini
              </p>
              <p className="text-gray-700 leading-relaxed max-w-xl">
                Dapatkan segala jenis ikan cupang pilihan dengan harga terjangkau. Temukan yang
                paling sesuai dengan selera Anda.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <NavLink
                  to="/shop"
                  className="px-6 py-3 rounded-lg font-semibold text-white bg-primary-main hover:bg-primary-dark transition-colors text-center"
                >
                  Belanja Sekarang
                </NavLink>
              </div>
            </div>
            <div className="relative">
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
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-secondary-light">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary-main rounded-full flex items-center justify-center shadow ring-1 ring-black/10">
                <svg
                  className="w-8 h-8 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 3.1c-.2.3-6 7-6 11.1A6 6 0 0018 14.2c0-4.1-5.8-10.8-6-11.1z" />
                </svg>
              </div>
              <p className="font-semibold text-gray-900">Air & Treatment</p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary-main rounded-full flex items-center justify-center shadow ring-1 ring-black/10">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.645 20.91l-.01-.01C7.19 17.303 4.5 14.86 4.5 11.75 4.5 9.5 6.31 7.75 8.55 7.75c1.19 0 2.31.52 3.05 1.35a4.2 4.2 0 013.05-1.35c2.24 0 4.05 1.75 4.05 4 0 3.11-2.69 5.55-7.13 9.15l-.01.01c-.26.21-.64.21-.9 0z" />
                </svg>
              </div>
              <p className="font-semibold text-gray-900">Breeding & Care</p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary-main rounded-full flex items-center justify-center shadow ring-1 ring-black/10">
                <svg
                  className="w-8 h-8 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 8l-9-5-9 5 9 5 9-5z" />
                  <path d="M3 8v8l9 5 9-5V8" />
                </svg>
              </div>
              <p className="font-semibold text-gray-900">Perlengkapan</p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary-main rounded-full flex items-center justify-center shadow ring-1 ring-black/10">
                <svg
                  className="w-8 h-8 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 12s3-5 9-5c4 0 6 2 9 2-2 2-2 6 0 8-3 0-5 2-9 2-6 0-9-5-9-5z" />
                  <circle cx="14" cy="12" r="1" fill="currentColor" />
                </svg>
              </div>
              <p className="font-semibold text-gray-900">Ikan Pilihan</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Mengapa Harus Beli Ikan Cupang dari HAFIYYAN BETTA?
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
              <div className="w-20 h-20 mx-auto bg-primary-main rounded-full flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.313 1.007 2.15 1.007.815 0 1.551-.324 2.098-.931A4.47 4.47 0 0011 13H9a4.47 4.47 0 01-.098-.931C9.449 10.676 10.185 11 11 11h2c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.313 1.007 2.15 1.007.815 0 1.551-.324 2.098-.931A4.47 4.47 0 0015 13h-2a4.47 4.47 0 01-.098-.931C12.551 10.676 13.287 11 14 11h2.098C15.449 10.676 14.713 11 14 11h-2c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.313 1.007 2.15 1.007.815 0 1.551-.324 2.098-.931A4.47 4.47 0 0020 13h-2.098C17.551 12.324 16.785 11 15 11h2c.391.127.68.317.843.504a1 1 0 101.51-1.31C17.793 9.551 17.042 9.193 16.205 9.193c-.815 0-1.551.324-2.098.931A4.47 4.47 0 0015 11h2c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.313 1.007 2.15 1.007z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Berkualitas</h3>
              <p className="text-gray-600">
                Ikan diseleksi ketat: warna cerah, sirip rapi, dan kondisi prima.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
              <div className="w-20 h-20 mx-auto bg-primary-main rounded-full flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-
A h2 2 0 100 14h-2z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Terjangkau</h3>
              <p className="text-gray-600">
                Pilihan harga ramah kantong, cocok untuk pemula hingga kolektor.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
              <div className="w-20 h-20 mx-auto bg-primary-main rounded-full flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Banyak Pilihan</h3>
              <p className="text-gray-600">
                Varian jenis, warna, dan pola beragam untuk semua selera.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TikTok Section */}
      <TiktokChart />

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Konsultasi Ikan Cupang dengan Mudah!
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Butuh bantuan memilih ikan cupang yang sehat, cocok untuk breeding, atau ingin konsultasi perawatan?
Hubungi kami untuk konsultasi gratis seputar ikan cupang sebelum membeli.
            </p>
            <a
              href="https://wa.me/6287823451095"
              className="inline-flex items-center gap-3 bg-green-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-600 transition-colors"
              target="_blank"
              rel="noreferrer"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.570-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
              </svg>
              Konsultasi Sekarang
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
