import { configureStore } from '@reduxjs/toolkit'
import cartSlice from './slices/cartSlice'
import favoritesSlice from './slices/favoritesSlice'
import uiSlice from './slices/uiSlice'

// Determine dev mode based on Node/Jest environment to avoid TypeScript issues with import.meta in tests
const isDev =
  typeof (globalThis as any).process !== 'undefined' &&
  (globalThis as any).process.env?.NODE_ENV !== 'production'

export const store = configureStore({
  reducer: {
    cart: cartSlice,

    favorites: favoritesSlice,

    ui: uiSlice,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        warnAfter: 128,
      },
    }),

  devTools: isDev,
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
