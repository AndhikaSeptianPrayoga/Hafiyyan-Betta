import { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, addItem } from '../redux'
import type { CartItem } from '../types'

interface Product {
  id: number
  name: string
  price: string
  img: string
}

export default function KebutuhanPage() {
  const dispatch = useAppDispatch()

  const onAdd = useCallback(
    (p: Product) => {
      const cartItem: Omit<CartItem, 'quantity'> = {
        id: p.id,
        name: p.name,
        price: p.price,
        img: p.img,
        category: 'supplies',
      }
      dispatch(addItem(cartItem))
    },
    [dispatch]
  )
  const products: Product[] = [
    { id: 1, name: 'Garam Ikan 250g', price: 'Rp 10.000', img: '../img/kebutuhan-img/1.png' },
    { id: 2, name: 'Daun Ketapang', price: 'Rp 8.000', img: '../img/kebutuhan-img/2.png' },
    { id: 3, name: 'Pelet Betta 50g', price: 'Rp 25.000', img: '../img/kebutuhan-img/3.png' },
    { id: 4, name: 'Pelet Betta 50g', price: 'Rp 25.000', img: '../img/kebutuhan-img/4.png' },
    { id: 5, name: 'Pelet Betta 50g', price: 'Rp 25.000', img: '../img/kebutuhan-img/5.png' },
  ]

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl md:text-4xl font-bold text-primary-main mb-8">Kebutuhan Cupang</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
          >
            <div className="relative">
              <img src={product.img} alt={product.name} className="w-full h-48 object-cover" />
            </div>
            <div className="p-6">
              <Link to={`/kebutuhan/${product.id}`}>
                <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-primary-main transition">
                  {product.name}
                </h3>
              </Link>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-primary-main">{product.price}</span>
                <div className="flex gap-2">
                  <Link
                    to={`/kebutuhan/${product.id}`}
                    className="px-3 py-2 rounded border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                  >
                    Detail
                  </Link>
                  <button
                    onClick={() => onAdd(product)}
                    className="px-3 py-2 rounded border border-gray-200 text-primary-main hover:bg-primary-main hover:text-white transition"
                  >
                    Tambah
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
