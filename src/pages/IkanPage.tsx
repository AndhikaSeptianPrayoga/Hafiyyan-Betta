// IkanPage component dengan Tailwind CSS

interface Product {
  id: number
  name: string
  price: string
  img: string
}

import { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, addItem } from '../redux'
import type { CartItem } from '../types'

export default function IkanPage() {
  const dispatch = useAppDispatch()

  const onAdd = useCallback(
    (p: Product) => {
      const cartItem: Omit<CartItem, 'quantity'> = {
        id: p.id,
        name: p.name,
        price: p.price,
        img: p.img,
        category: 'fish',
      }
      dispatch(addItem(cartItem))
    },
    [dispatch]
  )
  const fishes: Product[] = [
    {
      id: 1,
      name: 'Betta Halfmoon Blue',
      price: 'Rp 120.000',
      img: '../img/betta-img/cupang (1).jpeg',
    },
    {
      id: 2,
      name: 'Betta Plakat Galaxy',
      price: 'Rp 200.000',
      img: '../img/betta-img/cupang (2).jpeg',
    },
    { id: 3, name: 'Betta Koi Nemo', price: 'Rp 180.000', img: '../img/betta-img/cupang (3).jpg' },
    { id: 4, name: 'Betta Koi Nemo', price: 'Rp 180.000', img: '../img/betta-img/cupang (4).jpg' },
    { id: 5, name: 'Betta Koi Nemo', price: 'Rp 180.000', img: '../img/betta-img/cupang (5).jpg' },
    { id: 6, name: 'Betta Koi Nemo', price: 'Rp 180.000', img: '../img/betta-img/cupang (6).jpg' },
    { id: 7, name: 'Betta Koi Nemo', price: 'Rp 180.000', img: '../img/betta-img/cupang (7).jpg' },
    { id: 8, name: 'Betta Koi Nemo', price: 'Rp 180.000', img: '../img/betta-img/cupang (8).jpg' },
    { id: 9, name: 'Betta Koi Nemo', price: 'Rp 180.000', img: '../img/betta-img/cupang (9).jpg' },
    {
      id: 10,
      name: 'Betta Koi Nemo',
      price: 'Rp 180.000',
      img: '../img/betta-img/cupang (10).jpg',
    },
    {
      id: 11,
      name: 'Betta Koi Nemo',
      price: 'Rp 180.000',
      img: '../img/betta-img/cupang (11).jpg',
    },
    {
      id: 12,
      name: 'Betta Koi Nemo',
      price: 'Rp 180.000',
      img: '../img/betta-img/cupang (12).jpg',
    },
    {
      id: 13,
      name: 'Betta Koi Nemo',
      price: 'Rp 180.000',
      img: '../img/betta-img/cupang (13).jpg',
    },
    {
      id: 14,
      name: 'Betta Koi Nemo',
      price: 'Rp 180.000',
      img: '../img/betta-img/cupang (14).jpg',
    },
    {
      id: 15,
      name: 'Betta Koi Nemo',
      price: 'Rp 180.000',
      img: '../img/betta-img/cupang (15).jpg',
    },
    {
      id: 16,
      name: 'Betta Koi Nemo',
      price: 'Rp 180.000',
      img: '../img/betta-img/cupang (16).jpg',
    },
    {
      id: 17,
      name: 'Betta Koi Nemo',
      price: 'Rp 180.000',
      img: '../img/betta-img/cupang (17).jpg',
    },
    {
      id: 18,
      name: 'Betta Koi Nemo',
      price: 'Rp 180.000',
      img: '../img/betta-img/cupang (18).jpg',
    },
  ]

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl md:text-4xl font-bold text-primary-main mb-8">Ikan Cupang</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {fishes.map((fish) => (
          <div
            key={fish.id}
            className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
          >
            <div className="relative">
              <img src={fish.img} alt={fish.name} className="w-full h-48 object-cover" />
            </div>
            <div className="p-6">
              <Link to={`/ikan/${fish.id}`}>
                <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-primary-main transition">
                  {fish.name}
                </h3>
              </Link>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-primary-main">{fish.price}</span>
                <div className="flex gap-2">
                  <Link
                    to={`/ikan/${fish.id}`}
                    className="px-3 py-2 rounded border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                  >
                    Detail
                  </Link>
                  <button
                    onClick={() => onAdd(fish)}
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
