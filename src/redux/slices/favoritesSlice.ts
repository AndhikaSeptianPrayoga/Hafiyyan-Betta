import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

export interface FavoritesState {
  items: number[] // Array of product IDs
}

const loadFromLocalStorage = (): number[] => {
  try {
    const stored = localStorage.getItem('hafiyyan-favorites')
    if (stored) {
      const parsed = JSON.parse(stored)
      return Array.isArray(parsed) ? parsed : []
    }
  } catch (error) {
    console.warn('Error loading favorites from localStorage:', error)
  }
  return []
}

// FUNGSI untuk save ke localStorage
const saveToLocalStorage = (items: number[]) => {
  try {
    localStorage.setItem('hafiyyan-favorites', JSON.stringify(items))
  } catch (error) {
    console.warn('Error saving favorites to localStorage:', error)
  }
}

const initialState: FavoritesState = {
  items: loadFromLocalStorage(),
}

export const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<number>) => {
      const productId = action.payload
      const existingIndex = state.items.indexOf(productId)

      if (existingIndex >= 0) {
        state.items.splice(existingIndex, 1)
      } else {
        state.items.push(productId)
      }

      // SAVE ke localStorage setiap kali ada perubahan
      saveToLocalStorage(state.items)
    },

    addFavorite: (state, action: PayloadAction<number>) => {
      const productId = action.payload

      // Hanya tambahkan kalau belum ada
      if (!state.items.includes(productId)) {
        state.items.push(productId)
        saveToLocalStorage(state.items)
      }
    },

    removeFavorite: (state, action: PayloadAction<number>) => {
      const productId = action.payload
      state.items = state.items.filter((id) => id !== productId)
      saveToLocalStorage(state.items)
    },

    clearFavorites: (state) => {
      state.items = []
      saveToLocalStorage(state.items)
    },

    bulkAddFavorites: (state, action: PayloadAction<number[]>) => {
      const newIds = action.payload

      const merged = [...new Set([...state.items, ...newIds])]
      state.items = merged
      saveToLocalStorage(state.items)
    },
  },
})

export const { toggleFavorite, addFavorite, removeFavorite, clearFavorites, bulkAddFavorites } =
  favoritesSlice.actions

// SELECTOR FUNCTIONS

export const selectAllFavorites = (state: RootState) => (state as any).favorites.items

export const selectFavoritesCount = (state: RootState) => (state as any).favorites.items.length

export const selectIsFavorite = (productId: number) => (state: RootState) =>
  (state as any).favorites.items.includes(productId)

export const selectMultipleFavorites = (productIds: number[]) => (state: RootState) => {
  const favorites = (state as any).favorites.items
  return productIds.reduce(
    (acc, id) => {
      acc[id] = favorites.includes(id)
      return acc
    },
    {} as Record<number, boolean>
  )
}

export const selectFavoritesMetadata = (state: RootState) => ({
  count: (state as any).favorites.items.length,
  ids: (state as any).favorites.items,
  lastModified: new Date().toISOString(),
})

export default favoritesSlice.reducer
