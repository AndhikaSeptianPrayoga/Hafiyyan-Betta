// Redux types untuk menghindari circular dependency
import type { CartState } from './slices/cartSlice'
import type { FavoritesState } from './slices/favoritesSlice'
import type { UIState } from './slices/uiSlice'

export interface RootState {
  cart: CartState
  favorites: FavoritesState
  ui: UIState
}
