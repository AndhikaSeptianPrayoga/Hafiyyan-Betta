import { useEffect } from 'react'
import type { ReactNode } from 'react'
import {
  useAppSelector,
  useAppDispatch,
  selectCartItems,
  selectCartOpen,
  removeItem,
  toggleCart,
} from '../redux'
import Navbar from './Navbar'
import Footer from './Footer'
import CartModal from './CartModal'

export default function Layout({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch()
  const cartItems = useAppSelector(selectCartItems)
  const cartOpen = useAppSelector(selectCartOpen)

  const handleToggleCart = () => {
    dispatch(toggleCart())
  }

  const handleRemoveFromCart = (id: number) => {
    dispatch(removeItem(id))
  }

  useEffect(() => {
    // Tandai halaman yang menggunakan navbar global
    document.body.classList.add('has-navbar')
    document.body.classList.remove('admin-page')
    return () => {
      document.body.classList.remove('has-navbar')
    }
  }, [])

  return (
    <div className="min-h-screen bg-secondary-light flex flex-col" data-page="with-navbar">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Navbar cartCount={cartItems.length} onToggleCart={handleToggleCart} />
      <main id="main-content" className="flex-1" role="main" aria-label="Main content">{children}</main>
      <Footer />

      <CartModal
        isOpen={cartOpen}
        cart={cartItems}
        onClose={handleToggleCart}
        onRemoveItem={handleRemoveFromCart}
      />
    </div>
  )
}
