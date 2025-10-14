import { useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'
import type { RootState, AppDispatch } from './store'

export const useAppDispatch = () => useDispatch<AppDispatch>()

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const useCartItems = () => useAppSelector((state) => state.cart.items)
export const useCartTotal = () => useAppSelector((state) => state.cart.total)
export const useFavoritesCount = () =>
  useAppSelector((state) => (state as any).favorites.items.length)
export const useTheme = () => useAppSelector((state) => (state as any).ui.theme)

export const useUnoptimalCartSelector = () => {
  return useAppSelector((state) => ({
    items: state.cart.items,
    total: state.cart.total,
  }))
}

export const useOptimalCartSelector = () => {
  const items = useAppSelector((state) => state.cart.items)
  const total = useAppSelector((state) => state.cart.total)

  return { items, total }
}

export const useCartOperations = () => {
  const dispatch = useAppDispatch()
  const items = useAppSelector((state) => state.cart.items)
  const cartOpen = useAppSelector((state) => (state as any).ui.cartOpen)

  return {
    items,
    cartOpen,
    addItem: (item: Omit<CartItem, 'quantity'>) => dispatch(addItem(item)),
    removeItem: (id: number) => dispatch(removeItem(id)),
    toggleCart: () => dispatch(toggleCart()),
    clearCart: () => dispatch(clearCart()),
  }
}

export const useFavoritesOperations = () => {
  const dispatch = useAppDispatch()
  const favorites = useAppSelector((state) => (state as any).favorites.items)

  return {
    favorites,
    count: favorites.length,
    toggleFavorite: (id: number) => dispatch(toggleFavorite(id)),
    isFavorite: (id: number) => favorites.includes(id),
  }
}

export const useUIOperations = () => {
  const dispatch = useAppDispatch()
  const theme = useAppSelector((state) => (state as any).ui.theme)
  const loading = useAppSelector((state) => (state as any).ui.loading)
  const notifications = useAppSelector((state) => (state as any).ui.notifications)

  return {
    theme,
    loading,
    notifications,
    toggleTheme: () => dispatch(toggleTheme()),
    setLoading: (loading: boolean) => dispatch(setLoading(loading)),
    addNotification: (notification: any) => dispatch(addNotification(notification)),
  }
}

import type { CartItem } from '../types'
import { addItem, removeItem, clearCart } from './slices/cartSlice'
import { toggleCart } from './slices/uiSlice'
import { toggleFavorite } from './slices/favoritesSlice'
import { toggleTheme, setLoading, addNotification } from './slices/uiSlice'

export default {
  useAppDispatch,
  useAppSelector,
  useCartItems,
  useCartTotal,
  useFavoritesCount,
  useTheme,
  useCartOperations,
  useFavoritesOperations,
  useUIOperations,
}
