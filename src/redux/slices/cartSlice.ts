import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { CartItem } from '../../types'
import type { RootState } from '../types'

export interface CartState {
  items: CartItem[]
  total: number
  totalItems: number
}

const initialState: CartState = {
  items: [],
  total: 0,
  totalItems: 0,
}

const parseRupiah = (v: string): number => {
  // Ambil hanya digit dari string seperti "Rp 200.000" -> 200000
  const digits = v.replace(/[^0-9]/g, '')
  return digits ? Number(digits) : 0
}

const calculateTotals = (items: CartItem[]): { total: number; totalItems: number } => {
  const total = items.reduce((sum, item) => sum + parseRupiah(item.price) * item.quantity, 0)
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  return { total, totalItems }
}

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<Omit<CartItem, 'quantity'>>) => {
      const existingItem = state.items.find((item) => item.id === action.payload.id)

      if (existingItem) {
        existingItem.quantity += 1
      } else {
        state.items.push({
          ...action.payload,
          quantity: 1,
        })
      }

      const { total, totalItems } = calculateTotals(state.items)
      state.total = total
      state.totalItems = totalItems
    },

    removeItem: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload)

      const { total, totalItems } = calculateTotals(state.items)
      state.total = total
      state.totalItems = totalItems
    },

    updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const item = state.items.find((item) => item.id === action.payload.id)

      if (item) {
        if (action.payload.quantity <= 0) {
          state.items = state.items.filter((i) => i.id !== action.payload.id)
        } else {
          item.quantity = action.payload.quantity
        }

        const { total, totalItems } = calculateTotals(state.items)
        state.total = total
        state.totalItems = totalItems
      }
    },

    clearCart: (state) => {
      state.items = []
      state.total = 0
      state.totalItems = 0
    },

    decrementItem: (state, action: PayloadAction<number>) => {
      const item = state.items.find((item) => item.id === action.payload)

      if (item) {
        if (item.quantity <= 1) {
          state.items = state.items.filter((i) => i.id !== action.payload)
        } else {
          item.quantity -= 1
        }

        const { total, totalItems } = calculateTotals(state.items)
        state.total = total
        state.totalItems = totalItems
      }
    },
  },
})

export const { addItem, removeItem, updateQuantity, clearCart, decrementItem } = cartSlice.actions

export const selectCartItems = (state: RootState) => state.cart.items
export const selectCartTotal = (state: RootState) => state.cart.total
export const selectCartTotalItems = (state: RootState) => state.cart.totalItems
export const selectCartItemById = (id: number) => (state: RootState) =>
  state.cart.items.find((item) => item.id === id)

export default cartSlice.reducer
