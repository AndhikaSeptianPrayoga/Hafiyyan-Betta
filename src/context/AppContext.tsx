// Context untuk sharing state di seluruh aplikasi
import React, { createContext, useContext, useReducer, useCallback } from 'react'
import { appReducer, initialState } from '../hooks/useReducer'
import type { AppState, AppAction, CartItem } from '../types'

interface AppContextType {
  state: AppState
  dispatch: React.Dispatch<AppAction>
  handleAddToCart: (product: Omit<CartItem, 'quantity'>) => void
  handleRemoveFromCart: (id: number) => void
  handleToggleCart: () => void
  handleToggleFavorite: (id: number) => void
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // Memoized cart handlers untuk optimasi performa
  const handleAddToCart = useCallback((product: Omit<CartItem, 'quantity'>) => {
    dispatch({ type: 'ADD_TO_CART', payload: product })
  }, [])

  const handleRemoveFromCart = useCallback((id: number) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id })
  }, [])

  const handleToggleCart = useCallback(() => {
    dispatch({ type: 'TOGGLE_CART' })
  }, [])

  const handleToggleFavorite = useCallback((id: number) => {
    dispatch({ type: 'TOGGLE_FAVORITE', payload: id })
  }, [])

  const contextValue: AppContextType = {
    state,
    dispatch,
    handleAddToCart,
    handleRemoveFromCart,
    handleToggleCart,
    handleToggleFavorite,
  }

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider')
  }
  return context
}
