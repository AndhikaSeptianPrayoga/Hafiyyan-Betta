// Type definitions untuk aplikasi Hafiyyan Betta

export interface CartItem {
  id: number
  name: string
  price: string
  img: string
  quantity: number
  category: 'fish' | 'supplies'
}

export interface Product {
  id: number
  name: string
  price: string
  img: string
}

export interface AppState {
  cart: CartItem[]
  cartOpen: boolean
  favorites: number[]
  theme: 'light' | 'dark'
  loading: boolean
}

export type AppAction =
  | { type: 'ADD_TO_CART'; payload: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_FROM_CART'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'TOGGLE_CART' }
  | { type: 'TOGGLE_FAVORITE'; payload: number }
  | { type: 'SET_LOADING'; payload: boolean }

export interface Article {
  id: number
  title: string
  excerpt: string
  content?: string
  publishedAt: string
  category: string
}

export interface Testimonial {
  id: number
  name: string
  location: string
  rating: number
  content: string
  avatar?: string
}
