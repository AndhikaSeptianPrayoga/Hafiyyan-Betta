import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAuth } from '../services/auth'
import { useAppSelector, selectCartItems, selectCartTotal } from '../redux'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const cart = useAppSelector(selectCartItems)
  const total = useAppSelector(selectCartTotal)

  useEffect(() => {
    const { token } = getAuth()
    if (!token) navigate('/login', { replace: true, state: { redirectTo: '/checkout' } })
  }, [navigate])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      {cart.length === 0 ? (
        <p className="text-gray-600">Keranjang kosong. Silakan tambah produk terlebih dahulu.</p>
      ) : (
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <ul className="divide-y">
            {cart.map((item) => (
              <li key={item.id} className="py-3 flex justify-between">
                <span className="text-sm text-gray-900">{item.name} x {item.quantity}</span>
                <span className="text-sm font-medium text-primary-main">{item.price}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between border-t pt-4">
            <span className="font-semibold">Total</span>
            <span className="font-semibold">{total}</span>
          </div>
          <button className="w-full bg-primary-main text-white py-2 px-4 rounded-md hover:bg-primary-dark">Konfirmasi & Bayar (placeholder)</button>
        </div>
      )}
    </div>
  )
}