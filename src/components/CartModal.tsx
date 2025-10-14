// Cart Modal component dengan Tailwind CSS
import { useEffect, useRef } from 'react'
import type { CartItem } from '../types'

interface CartModalProps {
  isOpen: boolean
  cart: CartItem[]
  onClose: () => void
  onRemoveItem: (id: number) => void
}

export default function CartModal({ isOpen, cart, onClose, onRemoveItem }: CartModalProps) {
  const closeBtnRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    if (!isOpen) return
    // Fokus awal ke tombol close untuk akses cepat
    closeBtnRef.current?.focus()
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop (non-blocking so halaman belakang tetap bisa digunakan) */}
      <div
        className="fixed inset-0 z-40 pointer-events-none"
        style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
      />

      {/* Modal */}
      <div
        className="fixed top-20 right-4 z-50 bg-white rounded-lg shadow-xl max-w-sm w-full mx-4 animate-in slide-in-from-top-2 duration-300"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-modal-title"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 id="cart-modal-title" className="text-lg font-semibold text-gray-900">Shopping Cart</h3>
            <button
              ref={closeBtnRef}
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close cart"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Cart Items */}
          <div className="space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-8">
                {/* Icon state kosong */}
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="M8 11h8M8 15h5" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Keranjang Kosong</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Mulai berbelanja untuk menikmati ikan cupang berkualitas!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-3 py-2 border-b border-gray-100 last:border-b-0"
                  >
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      <p className="text-sm font-medium text-primary-main">{item.price}</p>
                    </div>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <span className="text-base font-medium text-gray-900">Total Items:</span>
                <span className="text-base font-medium text-gray-900">
                  {cart.reduce((total, item) => total + item.quantity, 0)}
                </span>
              </div>
              <button className="w-full bg-primary-main text-white py-2 px-4 rounded-md hover:bg-primary-dark transition-colors font-medium">
                Lanjut ke Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
