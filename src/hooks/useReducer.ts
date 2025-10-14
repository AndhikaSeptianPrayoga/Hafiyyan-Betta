// Custom hooks untuk state management
import type { AppState, AppAction } from '../types'

// Reducer function untuk mengelola state secara terpusat
export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.cart.find((item) => item.id === action.payload.id)
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map((item) =>
            item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        }
      }
      return {
        ...state,
        cart: [...state.cart, { ...action.payload, quantity: 1 }],
      }

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter((item) => item.id !== action.payload),
      }

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item
        ),
      }

    case 'TOGGLE_CART':
      return {
        ...state,
        cartOpen: !state.cartOpen,
      }

    case 'TOGGLE_FAVORITE':
      return {
        ...state,
        favorites: state.favorites.includes(action.payload)
          ? state.favorites.filter((id) => id !== action.payload)
          : [...state.favorites, action.payload],
      }

    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      }

    default:
      return state
  }
}

// Initial state
export const initialState: AppState = {
  cart: [],
  cartOpen: false,
  favorites: [],
  theme: 'light',
  loading: false,
}
