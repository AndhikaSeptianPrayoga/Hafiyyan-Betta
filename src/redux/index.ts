import { store } from './store'
export type { RootState, AppDispatch } from './store'

import {
  useAppDispatch,
  useAppSelector,
  useCartItems,
  useCartTotal,
  useFavoritesCount,
  useTheme,
  useCartOperations,
  useFavoritesOperations,
  useUIOperations,
} from './hooks'

import {
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
  decrementItem,
  selectCartItems,
  selectCartTotal,
  selectCartTotalItems,
  selectCartItemById,
} from './slices/cartSlice'

export type { CartState } from './slices/cartSlice'

import {
  toggleFavorite,
  addFavorite,
  removeFavorite,
  clearFavorites,
  bulkAddFavorites,
  selectAllFavorites,
  selectFavoritesCount,
  selectIsFavorite,
  selectMultipleFavorites,
  selectFavoritesMetadata,
} from './slices/favoritesSlice'

export type { FavoritesState } from './slices/favoritesSlice'

import {
  toggleCart,
  setCartOpen,
  toggleTheme,
  setTheme,
  setLoading,
  toggleSidebar,
  setSidebarOpen,
  setActiveModal,
  closeAllModals,
  addNotification,
  removeNotification,
  clearAllNotifications,
  selectCartOpen,
  selectTheme,
  selectLoading,
  selectSidebarOpen,
  selectActiveModal,
  selectNotifications,
  selectHasActiveModal,
  selectHasNotifications,
  selectUnreadNotificationsCount,
  selectUIState,
  selectIsModalOpen,
  selectAnyModalOpen,
} from './slices/uiSlice'

export type { UIState } from './slices/uiSlice'

// Re-export all functions
export {
  store,
  useAppDispatch,
  useAppSelector,
  useCartItems,
  useCartTotal,
  useFavoritesCount,
  useTheme,
  useCartOperations,
  useFavoritesOperations,
  useUIOperations,
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
  decrementItem,
  selectCartItems,
  selectCartTotal,
  selectCartTotalItems,
  selectCartItemById,
  toggleFavorite,
  addFavorite,
  removeFavorite,
  clearFavorites,
  bulkAddFavorites,
  selectAllFavorites,
  selectFavoritesCount,
  selectIsFavorite,
  selectMultipleFavorites,
  selectFavoritesMetadata,
  toggleCart,
  setCartOpen,
  toggleTheme,
  setTheme,
  setLoading,
  toggleSidebar,
  setSidebarOpen,
  setActiveModal,
  closeAllModals,
  addNotification,
  removeNotification,
  clearAllNotifications,
  selectCartOpen,
  selectTheme,
  selectLoading,
  selectSidebarOpen,
  selectActiveModal,
  selectNotifications,
  selectHasActiveModal,
  selectHasNotifications,
  selectUnreadNotificationsCount,
  selectUIState,
  selectIsModalOpen,
  selectAnyModalOpen,
}

export const actions = {
  cart: {
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    decrementItem,
  },
  favorites: {
    toggleFavorite,
    addFavorite,
    removeFavorite,
    clearFavorites,
    bulkAddFavorites,
  },
  ui: {
    toggleCart,
    setCartOpen,
    toggleTheme,
    setTheme,
    setLoading,
    toggleSidebar,
    setSidebarOpen,
    setActiveModal,
    closeAllModals,
    addNotification,
    removeNotification,
    clearAllNotifications,
  },
}

export const selectors = {
  cart: {
    selectCartItems,
    selectCartTotal,
    selectCartTotalItems,
    selectCartItemById,
  },
  favorites: {
    selectAllFavorites,
    selectFavoritesCount,
    selectIsFavorite,
    selectMultipleFavorites,
    selectFavoritesMetadata,
  },
  ui: {
    selectCartOpen,
    selectTheme,
    selectLoading,
    selectSidebarOpen,
    selectActiveModal,
    selectNotifications,
    selectHasActiveModal,
    selectHasNotifications,
    selectUnreadNotificationsCount,
    selectUIState,
    selectIsModalOpen,
    selectAnyModalOpen,
  },
}

export const hooks = {
  store: {
    useAppDispatch,
    useAppSelector,
  },
  operations: {
    useCartOperations,
    useFavoritesOperations,
    useUIOperations,
  },
  selectors: {
    useCartItems,
    useCartTotal,
    useFavoritesCount,
    useTheme,
  },
}

export default {
  store,
  actions,
  selectors,
  hooks,
}
