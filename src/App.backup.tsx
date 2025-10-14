import React from 'react'
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { useReducer, useCallback } from 'react'
import './App.css'

// 🎣 HOOKS DEEP DIVE: useReducer untuk state management yang kompleks
// State structure untuk aplikasi
interface AppState {
  cart: CartItem[]
  cartOpen: boolean
  favorites: number[]
  theme: 'light' | 'dark'
  loading: boolean
}

interface CartItem {
  id: number
  name: string
  price: string
  img: string
  quantity: number
  category: 'fish' | 'supplies'
}

// Actions untuk useReducer
type AppAction =
  | { type: 'ADD_TO_CART'; payload: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_FROM_CART'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'TOGGLE_CART' }
  | { type: 'TOGGLE_FAVORITE'; payload: number }
  | { type: 'SET_LOADING'; payload: boolean }

// Reducer function untuk mengelola state secara terpusat
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.cart.find((item) => item.id === action.payload.id)
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map((item) =>
            item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        }
      }
      return {
        ...state,
        cart: [...state.cart, { ...action.payload, quantity: 1 }],
      }

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter((item) => item.id !== action.payload),
      }

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item
        ),
      }

    case 'TOGGLE_CART':
      return {
        ...state,
        cartOpen: !state.cartOpen,
      }

    case 'TOGGLE_FAVORITE':
      return {
        ...state,
        favorites: state.favorites.includes(action.payload)
          ? state.favorites.filter((id) => id !== action.payload)
          : [...state.favorites, action.payload],
      }

    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      }

    default:
      return state
  }
}

// Initial state
const initialState: AppState = {
  cart: [],
  cartOpen: false,
  favorites: [],
  theme: 'light',
  loading: false,
}

// Context untuk sharing state
const AppContext = React.createContext<{
  state: AppState
  dispatch: React.Dispatch<AppAction>
  handleAddToCart: (product: Omit<CartItem, 'quantity'>) => void
  handleRemoveFromCart: (id: number) => void
  handleToggleCart: () => void
  handleToggleFavorite: (id: number) => void
} | null>(null)

// 🎣 HOOKS DEEP DIVE: useCallback untuk optimasi performa navbar
function Navbar({ cartCount, onToggleCart }: { cartCount: number; onToggleCart: () => void }) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  // Memoized navigation items untuk mencegah re-render yang tidak perlu
  const navItems = useCallback(
    () => [
      { to: '/profil', label: 'Profil' },
      { to: '/artikel', label: 'Artikel' },
      { to: '/kebutuhan', label: 'Kebutuhan Cupang' },
      { to: '/ikan', label: 'Ikan Cupang' },
    ],
    []
  )

  // Memoized cart toggle handler
  const handleCartToggle = useCallback(() => {
    onToggleCart()
  }, [onToggleCart])

  // Toggle menu handler untuk mobile
  const handleToggleMenu = useCallback(() => {
    setIsMenuOpen(!isMenuOpen)
  }, [isMenuOpen])

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top">
      <div className="container">
        <NavLink
          className="navbar-brand d-flex align-items-center gap-2 fw-bold text-primary-custom"
          to="/"
        >
          <img src="/img/logo.png" alt="Hafiyyan Betta" height={32} className="rounded" />
          <span>Hafiyyan Betta</span>
        </NavLink>
        <button
          className="navbar-toggler border-0"
          type="button"
          onClick={handleToggleMenu}
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation"
        >
          <span
            className={`navbar-toggler-icon ${isMenuOpen ? 'navbar-toggler-icon-open' : ''}`}
          ></span>
        </button>
        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {navItems().map((item) => (
              <li key={item.to} className="nav-item">
                <NavLink
                  className="nav-link text-primary-custom"
                  to={item.to}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
            <li className="nav-item">
              <button
                className="nav-link text-primary-custom border-0 bg-transparent px-3 py-2 w-100 w-lg-auto d-flex align-items-center justify-content-center gap-2 position-relative"
                onClick={(e) => {
                  e.preventDefault()
                  handleCartToggle()
                  setIsMenuOpen(false)
                }}
              >
                <i className="bi bi-cart"></i>
                Cart
                {cartCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger small">
                    {cartCount}
                  </span>
                )}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

function Footer() {
  return (
    <footer className="bg-dark text-white py-4 mt-auto">
      <div className="container d-flex flex-column flex-md-row align-items-center justify-content-between gap-2">
        <div className="d-flex align-items-center gap-2">
          <span className="fw-semibold">Hafiyyan Betta</span>
          <span className="text-white-50">© {new Date().getFullYear()}</span>
        </div>
        <div className="d-flex gap-3">
          <a className="text-white-50" href="#" aria-label="Instagram">
            <i className="bi bi-instagram"></i>
          </a>
          <a className="text-white-50" href="#" aria-label="Facebook">
            <i className="bi bi-facebook"></i>
          </a>
          <a className="text-white-50" href="#" aria-label="Whatsapp">
            <i className="bi bi-whatsapp"></i>
          </a>
        </div>
      </div>
    </footer>
  )
}

function HomePage() {
  return (
    <>
      <section className="bg-gradient-primary text-on-dark py-5" style={{ marginTop: '50px' }}>
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-md-6">
              <h1 className="display-5 fw-bold mb-2">Warna-Warni Ikan Cupang Siap Hiasi Harimu</h1>
              <p className="lead mb-1 text-on-dark">
                <span className="fw-bold">HAFIYYAN BETTA</span> — Segala Jenis Ikan Cupang Ada di
                Sini
              </p>
              <p className="mb-4 text-on-dark">
                Dapatkan segala jenis ikan cupang pilihan dengan harga terjangkau. Temukan yang
                paling sesuai dengan selera Anda.
              </p>
              <div className="d-flex gap-2">
                <NavLink to="/ikan" className="btn btn-light text-primary-custom fw-semibold">
                  Belanja Ikan
                </NavLink>
                <NavLink
                  to="/kebutuhan"
                  className="btn btn-outline-light border-light text-on-dark"
                >
                  Kebutuhan Cupang
                </NavLink>
              </div>
            </div>
            <div className="col-md-6">
              <div className="ratio ratio-16x9 rounded-3 shadow overflow-hidden bg-dark-subtle">
                <iframe
                  src="https://www.youtube.com/embed/1AL2xXoJ6tk"
                  title="Betta Fish"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="row text-center g-4">
            <div className="col-6 col-md-3">
              <i className="bi bi-droplet text-primary-custom fs-1"></i>
              <p className="mt-2 mb-0 fw-semibold">Air & Treatment</p>
            </div>
            <div className="col-6 col-md-3">
              <i className="bi bi-heart text-primary-custom fs-1"></i>
              <p className="mt-2 mb-0 fw-semibold">Breeding & Care</p>
            </div>
            <div className="col-6 col-md-3">
              <i className="bi bi-box-seam text-primary-custom fs-1"></i>
              <p className="mt-2 mb-0 fw-semibold">Perlengkapan</p>
            </div>
            <div className="col-6 col-md-3">
              <i className="bi bi-person text-primary-custom fs-1"></i>
              <p className="mt-2 mb-0 fw-semibold">Ikan Pilihan</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 section-muted border-top">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <h2 className="fw-bold text-primary-custom mb-4">
                Mengapa Harus Beli Ikan Cupang dari HAFIYYAN BETTA?
              </h2>
            </div>
          </div>
          <div className="row g-4">
            <div className="col-12 col-md-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <i className="bi bi-award text-primary-custom fs-3"></i>
                    <h5 className="mb-0 text-primary-custom">Berkualitas</h5>
                  </div>
                  <p className="text-body-secondary mb-0">
                    Ikan diseleksi ketat: warna cerah, sirip rapi, dan kondisi prima.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <i className="bi bi-cash-coin text-primary-custom fs-3"></i>
                    <h5 className="mb-0 text-primary-custom">Terjangkau</h5>
                  </div>
                  <p className="text-body-secondary mb-0">
                    Pilihan harga ramah kantong, cocok untuk pemula hingga kolektor.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <i className="bi bi-grid text-primary-custom fs-3"></i>
                    <h5 className="mb-0 text-primary-custom">Banyak Pilihan</h5>
                  </div>
                  <p className="text-body-secondary mb-0">
                    Varian jenis, warna, dan pola beragam untuk semua selera.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 border-top">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-8">
              <h3 className="fw-bold mb-2 text-primary-custom">Pesan Ikan Cupang dengan Mudah!</h3>
              <p className="mb-0 text-body-secondary">
                Hubungi kami untuk ketersediaan stok terbaru dan rekomendasi terbaik.
              </p>
            </div>
            <div className="col-lg-4 text-lg-end">
              <a
                className="btn btn-primary"
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noreferrer"
              >
                <i className="bi bi-whatsapp me-2"></i>Pesan Sekarang
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

function ProfilPage() {
  return (
    <div className="container py-5">
      <div className="row align-items-center g-4">
        <div className="col-md-5" style={{ marginTop: '50px' }}>
          <img
            className="img-fluid rounded-4 shadow"
            src="../img/betta-img/cupang (1).jpeg"
            alt="Betta"
            style={{ width: '100%', height: '100%', marginBottom: '20px' }}
          />
        </div>
        <div className="col-md-7" style={{ marginTop: '50px' }}>
          <h1 className="fw-bold text-primary-custom mb-3">Tentang Hafiyyan Betta</h1>
          <p className="lead mb-3">
            Komunitas dan toko hobi yang berfokus pada perawatan, edukasi, dan pengembangan kualitas
            ikan cupang berkualitas premium.
          </p>
          <p className="mb-4">
            Dengan pengalaman lebih dari 5 tahun dalam dunia ikan cupang, kami menghadirkan koleksi
            terbaik dari berbagai jenis dan variant cupang berkualitas tinggi dengan harga yang
            kompetitif.
          </p>
        </div>
      </div>

      {/* Visi Misi */}
      <div className="row g-4 mb-5">
        <div className="col-md-6">
          <div className="card h-100 shadow-sm">
            <div className="card-body p-4">
              <div className="d-flex align-items-center gap-3 mb-3">
                <i className="bi bi-eye text-primary-custom fs-2"></i>
                <h4 className="mb-0 text-primary-custom">Visi</h4>
              </div>
              <p className="mb-0">
                Menjadi pusat terdepan dalam industri ikan cupang Indonesia dengan menghadirkan ikan
                berkualitas premium dan layanan terbaik bagi pecinta cupang di seluruh nusantara.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card h-100 shadow-sm">
            <div className="card-body p-4">
              <div className="d-flex align-items-center gap-3 mb-3">
                <i className="bi bi-bullseye text-primary-custom fs-2"></i>
                <h4 className="mb-0 text-primary-custom">Misi</h4>
              </div>
              <ul className="mb-0">
                <li>Menyediakan ikan cupang berkualitas tinggi</li>
                <li>Edukasi perawtan cupang yang tepat</li>
                <li>Membangun komunitas pecinta cupang</li>
                <li>Inovasi dalam breeding dan seleksi</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Nilai & Keunggulan */}
      <div className="row g-4 mb-5">
        <div className="col-12">
          <h3 className="fw-bold text-primary-custom mb-4 text-center">Nilai & Keunggulan Kami</h3>
        </div>
        <div className="col-md-3">
          <div className="text-center">
            <div
              className="bg-primary-custom text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
              style={{ width: '80px', height: '80px' }}
            >
              <i className="bi bi-award fs-2 text-primary-custom"></i>
            </div>
            <h5 className="text-primary-custom ">Kualitas Premium</h5>
            <p className="small text-body-secondary">
              Seleksi ketat dari breeder berpengalaman dengan standar internasional
            </p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="text-center">
            <div
              className="bg-primary-custom text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
              style={{ width: '80px', height: '80px' }}
            >
              <i className="bi bi-shield-check fs-2 text-primary-custom"></i>
            </div>
            <h5 className="text-primary-custom">Garansi Mutu</h5>
            <p className="small text-body-secondary">
              Garansi kesehatan 7 hari dan replacement jika tidak sesuai standar
            </p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="text-center">
            <div
              className="bg-primary-custom text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
              style={{ width: '80px', height: '80px' }}
            >
              <i className="bi bi-truck fs-2 text-primary-custom"></i>
            </div>
            <h5 className="text-primary-custom">Pengiriman Aman</h5>
            <p className="small text-body-secondary">
              Packaging khusus dengan sistem aerasi untuk menjaga kondisi ikan
            </p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="text-center">
            <div
              className="bg-primary-custom text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
              style={{ width: '80px', height: '80px' }}
            >
              <i className="bi bi-headset fs-2 text-primary-custom"></i>
            </div>
            <h5 className="text-primary-custom">Support 24/7</h5>
            <p className="small text-body-secondary">
              Layanan konsultasi gratis untuk perawatan dan troubleshooting
            </p>
          </div>
        </div>
      </div>

      {/* Tim & Pengalaman */}
      <div className="row g-4 mb-5">
        <div className="col-md-6">
          <h3 className="fw-bold text-primary-custom mb-4">Tim Kami</h3>
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div
                  className="bg-primary-custom text-white rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: '60px', height: '60px' }}
                >
                  <i className="bi bi-person-fill fs-4 text-primary-custom"></i>
                </div>
                <div>
                  <h5 className="mb-1">Hafiyyan</h5>
                  <p className="text-primary-custom mb-1">Founder & Lead Breeder</p>
                  <small className="text-body-secondary">
                    5+ tahun pengalaman dalam breeding dan seleksi ikan cupang
                  </small>
                </div>
              </div>
              <p className="mb-0">
                Ahli dalam breeding varietas baru dan teknik perawatan premium dengan fokus pada
                kesehatan dan kecantikan ikan cupang.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <h3 className="fw-bold text-primary-custom mb-4">Pengalaman Kami</h3>
          <div className="row g-3">
            <div className="col-6">
              <div className="text-center p-3 bg-light rounded">
                <h4 className="text-primary-custom mb-1">500+</h4>
                <small className="text-body-secondary">Pelanggan Puas</small>
              </div>
            </div>
            <div className="col-6">
              <div className="text-center p-3 bg-light rounded">
                <h4 className="text-primary-custom mb-1">50+</h4>
                <small className="text-body-secondary">Jenis Varietas</small>
              </div>
            </div>
            <div className="col-6">
              <div className="text-center p-3 bg-light rounded">
                <h4 className="text-primary-custom mb-1">5</h4>
                <small className="text-body-secondary">Tahun Pengalaman</small>
              </div>
            </div>
            <div className="col-6">
              <div className="text-center p-3 bg-light rounded">
                <h4 className="text-primary-custom mb-1">100%</h4>
                <small className="text-body-secondary">Kepuasan</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Kontak & Lokasi */}
      <div className="row g-4 mb-5">
        <div className="col-12">
          <h3 className="fw-bold text-primary-custom mb-4 text-center">Kontak & Lokasi</h3>
        </div>
        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body p-4 text-center">
              <i className="bi bi-geo-alt text-primary-custom fs-1 mb-3"></i>
              <h5>Alamat</h5>
              <p className="mb-0">
                Jl. Alfatih I No. 5B, RT 5 RW 5<br />
                Desa/Kelurahan Cihanjuang
                <br />
                Kec. Parongpong
                <br />
                Kab. Bandung Barat, Jawa Barat
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body p-4 text-center">
              <i className="bi bi-clock text-primary-custom fs-1 mb-3"></i>
              <h5>Jam Operasional</h5>
              <p className="mb-0">
                Senin - Minggu
                <br />
                08:00 - 20:00 WIB
                <br />
                <small className="text-body-secondary">*Tetap melayani pesanan online 24/7</small>
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body p-4 text-center">
              <i className="bi bi-telephone text-primary-custom fs-1 mb-3"></i>
              <h5>Hubungi Kami</h5>
              <div className="d-flex flex-column gap-2">
                <a
                  href="https://wa.me/6281234567890"
                  className="btn btn-success btn-sm"
                  target="_blank"
                  rel="noreferrer"
                >
                  <i className="bi bi-whatsapp me-2"></i>WhatsApp
                </a>
                <a
                  href="https://instagram.com/hafiyyanbetta"
                  className="btn btn-outline-danger btn-sm"
                  target="_blank"
                  rel="noreferrer"
                >
                  <i className="bi bi-instagram me-2"></i>Instagram
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimoni */}
      <div className="row g-4">
        <div className="col-12">
          <h3 className="fw-bold text-primary-custom mb-4 text-center">Testimoni Pelanggan</h3>
        </div>
        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body p-4">
              <div className="d-flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className="bi bi-star-fill text-warning text-primary-custom"></i>
                ))}
              </div>
              <p className="mb-3">
                "Ikan cupang berkualitas tinggi dan pengiriman sangat aman. Hafiyyan Betta memang
                terpercaya!"
              </p>
              <div className="d-flex align-items-center gap-2">
                <div
                  className="bg-primary-custom text-white rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: '40px', height: '40px' }}
                >
                  <i className="bi bi-person-fill text-primary-custom"></i>
                </div>
                <div>
                  <h6 className="mb-0">Ahmad Rifai</h6>
                  <small className="text-body-secondary">Pelanggan dari Jakarta</small>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body p-4">
              <div className="d-flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className="bi bi-star-fill text-warning text-primary-custom"></i>
                ))}
              </div>
              <p className="mb-3">
                "Service excellent dan ikan yang diterima sesuai foto. Recommended banget untuk
                kolektor!"
              </p>
              <div className="d-flex align-items-center gap-2">
                <div
                  className="bg-primary-custom text-white rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: '40px', height: '40px' }}
                >
                  <i className="bi bi-person-fill text-primary-custom"></i>
                </div>
                <div>
                  <h6 className="mb-0">Sari Dewi</h6>
                  <small className="text-body-secondary">Breeder dari Bandung</small>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body p-4">
              <div className="d-flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className="bi bi-star-fill text-warning text-primary-custom"></i>
                ))}
              </div>
              <p className="mb-3">
                "Paketan lengkap dengan kebutuhan cupang. Customer service responsif dan membantu
                sekali!"
              </p>
              <div className="d-flex align-items-center gap-2">
                <div
                  className="bg-primary-custom text-white rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: '40px', height: '40px' }}
                >
                  <i className="bi bi-person-fill text-primary-custom"></i>
                </div>
                <div>
                  <h6 className="mb-0">Budi Santoso</h6>
                  <small className="text-body-secondary">Hobbyist dari Surabaya</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ArtikelPage() {
  const articles = [
    {
      id: 1,
      title: 'Panduan Dasar Merawat Cupang',
      excerpt: 'Air, pakan, dan setting tank untuk pemula.',
    },
    { id: 2, title: 'Mengenal Varietas Betta', excerpt: 'Halfmoon, Plakat, Giant, dan lain-lain.' },
    {
      id: 3,
      title: 'Tips Breeding Sukses',
      excerpt: 'Kondisioning indukan hingga perawatan burayak.',
    },
  ]
  return (
    <div className="container py-5" style={{ marginTop: '50px' }}>
      <h2 className="fw-bold mb-4 text-primary-custom">Artikel Terbaru</h2>
      <div className="row g-4">
        {articles.map((a) => (
          <div className="col-12 col-md-6 col-lg-4" key={a.id}>
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{a.title}</h5>
                <p className="card-text text-body-secondary">{a.excerpt}</p>
                <button className="btn btn-primary btn-sm">Baca</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

type Product = { id: number; name: string; price: string; img: string }

// 🎣 HOOKS DEEP DIVE: useCallback untuk optimasi produk page
function KebutuhanPage({
  onAddToCart,
}: {
  onAddToCart?: (product: Omit<CartItem, 'quantity'>) => void
}) {
  const products: Product[] = [
    {
      id: 1,
      name: 'Garam Ikan 250g',
      price: 'Rp 10.000',
      img: 'https://images.unsplash.com/photo-1604881991720-f91add269bed?q=80&w=1200&auto=format&fit=crop',
    },
    {
      id: 2,
      name: 'Daun Ketapang',
      price: 'Rp 8.000',
      img: 'https://images.unsplash.com/photo-1621368432206-9730f516a1b9?q=80&w=1200&auto=format&fit=crop',
    },
    {
      id: 3,
      name: 'Pelet Betta 50g',
      price: 'Rp 25.000',
      img: 'https://images.unsplash.com/photo-1544551763-7ef4200b78d8?q=80&w=1200&auto=format&fit=crop',
    },
  ]
  return (
    <div className="container py-5" style={{ marginTop: '50px' }}>
      <h2 className="fw-bold mb-4 text-primary-custom">Kebutuhan Cupang</h2>
      <div className="row g-4">
        {products.map((product) => (
          <div className="col-6 col-md-4 col-lg-3" key={product.id}>
            <div className="card h-100 shadow-sm">
              <img src={product.img} className="card-img-top" alt={product.name} />
              <div className="card-body">
                <h6 className="card-title mb-1">{product.name}</h6>
                <div className="d-flex align-items-center justify-content-between">
                  <span className="fw-semibold text-primary-custom">{product.price}</span>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() =>
                      onAddToCart &&
                      onAddToCart({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        img: product.img,
                        category: 'supplies',
                      })
                    }
                  >
                    <i className="bi bi-cart-plus"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// 🎣 HOOKS DEEP DIVE: useCallback untuk optimasi ikan page
function IkanPage({
  onAddToCart,
}: {
  onAddToCart?: (product: Omit<CartItem, 'quantity'>) => void
}) {
  const fishes: Product[] = [
    {
      id: 1,
      name: 'Betta Halfmoon Blue',
      price: 'Rp 120.000',
      img: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?q=80&w=1200&auto=format&fit=crop',
    },
    {
      id: 2,
      name: 'Betta Plakat Galaxy',
      price: 'Rp 200.000',
      img: 'https://images.unsplash.com/photo-1591758734035-1c58b61a7d1f?q=80&w=1200&auto=format&fit=crop',
    },
    {
      id: 3,
      name: 'Betta Koi Nemo',
      price: 'Rp 180.000',
      img: 'https://images.unsplash.com/photo-1614987666631-e81140a38f0d?q=80&w=1200&auto=format&fit=crop',
    },
  ]
  return (
    <div className="container py-5" style={{ marginTop: '50px' }}>
      <h2 className="fw-bold mb-4 text-primary-custom">Ikan Cupang</h2>
      <div className="row g-4">
        {fishes.map((p) => (
          <div className="col-6 col-md-4 col-lg-3" key={p.id}>
            <div className="card h-100 shadow-sm">
              <img src={p.img} className="card-img-top" alt={p.name} />
              <div className="card-body">
                <h6 className="card-title mb-1">{p.name}</h6>
                <div className="d-flex align-items-center justify-content-between">
                  <span className="fw-semibold text-primary-custom">{p.price}</span>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() =>
                      onAddToCart &&
                      onAddToCart({
                        id: p.id,
                        name: p.name,
                        price: p.price,
                        img: p.img,
                        category: 'fish',
                      })
                    }
                  >
                    <i className="bi bi-cart-plus"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// 🎣 HOOKS DEEP DIVE: Provider component untuk sharing state dengan useReducer
function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // Memoized cart handlers untuk optimasi performa
  const handleAddToCart = useCallback((product: Omit<CartItem, 'quantity'>) => {
    dispatch({ type: 'ADD_TO_CART', payload: product })
  }, [])

  const handleRemoveFromCart = useCallback((id: number) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id })
  }, [])

  const handleToggleCart = useCallback(() => {
    dispatch({ type: 'TOGGLE_CART' })
  }, [])

  const handleToggleFavorite = useCallback((id: number) => {
    dispatch({ type: 'TOGGLE_FAVORITE', payload: id })
  }, [])

  const contextValue = {
    state,
    dispatch,
    handleAddToCart,
    handleRemoveFromCart,
    handleToggleCart,
    handleToggleFavorite,
  }

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
}

function Layout({ children }: { children: React.ReactNode }) {
  const context = React.useContext(AppContext)
  if (!context) throw new Error('Layout must be used within AppProvider')

  const { state, handleToggleCart } = context

  return (
    <div className="d-flex flex-column min-vh-100 bg-body-tertiary">
      <Navbar cartCount={state.cart.length} onToggleCart={handleToggleCart} />
      <main className="flex-fill">{children}</main>
      <Footer />

      {/* Simple Cart Modal */}
      {state.cartOpen && (
        <div className="position-fixed top-0 end-0 p-3" style={{ marginTop: '80px', zIndex: 1050 }}>
          <div className="card shadow-lg" style={{ minWidth: '300px' }}>
            <div className="card-header d-flex justify-content-between align-items-center">
              <h6 className="mb-0">Shopping Cart</h6>
              <button className="btn btn-sm btn-outline-secondary" onClick={handleToggleCart}>
                <i className="bi bi-x"></i>
              </button>
            </div>
            <div className="card-body">
              {state.cart.length === 0 ? (
                <p className="text-muted">Cart is empty</p>
              ) : (
                <ul className="list-unstyled">
                  {state.cart.map((item) => (
                    <li
                      key={item.id}
                      className="d-flex justify-content-between align-items-center py-2"
                    >
                      <div>
                        <small className="fw-semibold">{item.name}</small>
                        <br />
                        <small className="text-muted">Qty: {item.quantity}</small>
                      </div>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => context.handleRemoveFromCart(item.id)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/profil" element={<ProfilPage />} />
            <Route path="/artikel" element={<ArtikelPage />} />
            <Route path="/kebutuhan" element={<KebutuhanPageWrapper />} />
            <Route path="/ikan" element={<IkanPageWrapper />} />
          </Routes>
        </Layout>
      </AppProvider>
    </BrowserRouter>
  )
}

// 🎣 HOOKS DEEP DIVE: Wrapper komponen untuk mengakses context
function KebutuhanPageWrapper() {
  const context = React.useContext(AppContext)
  if (!context) throw new Error('KebutuhanPageWrapper must be used within AppProvider')

  return <KebutuhanPage onAddToCart={context.handleAddToCart} />
}

function IkanPageWrapper() {
  const context = React.useContext(AppContext)
  if (!context) throw new Error('IkanPageWrapper must be used within AppProvider')

  return <IkanPage onAddToCart={context.handleAddToCart} />
}
