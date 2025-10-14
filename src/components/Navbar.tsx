// Navbar component dengan Tailwind CSS
import { useCallback, useState } from 'react'
import { NavLink } from 'react-router-dom'

interface NavbarProps {
  cartCount: number
  onToggleCart: () => void
}

export default function Navbar({ cartCount, onToggleCart }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = useCallback(
    () => [
      { to: '/', label: 'Home' },
      { to: '/profil', label: 'Profil' },
      { to: '/artikel', label: 'Artikel' },
      { to: '/kebutuhan', label: 'Kebutuhan Cupang' },
      { to: '/ikan', label: 'Ikan Cupang' },
    ],
    []
  )

  const handleCartToggle = useCallback(() => {
    onToggleCart()
  }, [onToggleCart])

  const handleToggleMenu = useCallback(() => {
    setIsMenuOpen(!isMenuOpen)
  }, [isMenuOpen])

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50" aria-label="Main navigation">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink
            to="/"
            className="flex items-center gap-2 font-bold text-primary-main text-xl hover:text-primary-dark transition-colors"
          >
            <img src="/img/logo.png" alt="Hafiyyan Betta" className="h-8 w-auto rounded" />
            <span>Hafiyyan Betta</span>
          </NavLink>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-6">
            {navItems().map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className="text-primary-main hover:text-primary-dark font-medium transition-colors"
              >
                {item.label}
              </NavLink>
            ))}

            {/* Cart Button */}
            <button
              onClick={handleCartToggle}
              className="inline-flex items-center gap-2 text-primary-main hover:text-primary-dark font-medium transition-colors relative px-3 py-2 rounded border border-gray-200"
              aria-label="Open shopping cart"
            >
              {/* Professional cart icon */}
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h3l3.6 7.59a2 2 0 001.8 1.16H19a2 2 0 001.92-1.44L23 6H6" />
              </svg>
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={handleToggleMenu}
            className="lg:hidden flex items-center px-3 py-2 border rounded text-primary-main border-primary-main hover:text-primary-dark hover:bg-secondary-light"
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            <svg className="fill-current h-3 w-3" viewBox="0 0 20 20">
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden" id="mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              {navItems().map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className="block px-3 py-2 text-primary-main hover:text-primary-dark hover:bg-secondary-light rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </NavLink>
              ))}

              {/* Mobile Cart Button */}
              <button
                onClick={() => {
                  handleCartToggle()
                  setIsMenuOpen(false)
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-primary-main hover:text-primary-dark hover:bg-secondary-light rounded-md text-base font-medium"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042.997.997 0 01.458.458c.012.05.015.108.012.163l-.315 2.692a1 1 0 01-.719.863a1 1 0 000 1.861a1 1 0 01.719.864l.315 2.692c.003.055.0.113-.012.163a.997.997 0 01-.458.458c-.012.05-.015-.108-.012-.163l-.315-2.692c-.003-.055.0-.113-.012-.163a.997.997 0 01-.458-.458c-.012-.05-.015-.108-.012-.163a.997.997 0 00-.01-.042a.997.997 0 01-.458-.458a.997.997 0 00-.01-.042L4.22 3H3z"></path>
                </svg>
                Cart
                {cartCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
