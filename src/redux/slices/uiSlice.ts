import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface UIState {
  cartOpen: boolean
  theme: 'light' | 'dark'
  loading: boolean
  sidebarOpen: boolean
  activeModal: string | null
  notifications: Array<{
    id: string
    message: string
    type: 'success' | 'error' | 'warning' | 'info'
    timestamp: number
  }>
}

const loadThemeFromStorage = (): 'light' | 'dark' => {
  try {
    const stored = localStorage.getItem('hafiyyan-theme')
    if (stored === 'light' || stored === 'dark') {
      return stored
    }
  } catch (error) {
    console.warn('Error loading theme from localStorage:', error)
  }
  return 'light'
}

const saveThemeToStorage = (theme: 'light' | 'dark') => {
  try {
    localStorage.setItem('hafiyyan-theme', theme)
  } catch (error) {
    console.warn('Error saving theme to localStorage:', error)
  }
}

const applyThemeToDOM = (theme: 'light' | 'dark') => {
  try {
    document.documentElement.setAttribute('data-theme', theme)
    document.body.className = theme === 'dark' ? 'dark-theme' : 'light-theme'
  } catch (error) {
    console.warn('Error applying theme to DOM:', error)
  }
}

const initialState: UIState = {
  cartOpen: false,
  theme: loadThemeFromStorage(),
  loading: false,
  sidebarOpen: false,
  activeModal: null,
  notifications: [],
}

applyThemeToDOM(initialState.theme)

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleCart: (state) => {
      state.cartOpen = !state.cartOpen

      if (state.cartOpen) {
        state.activeModal = null
      }
    },

    setCartOpen: (state, action: PayloadAction<boolean>) => {
      state.cartOpen = action.payload

      if (state.cartOpen) {
        state.activeModal = null
      }
    },

    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light'
      saveThemeToStorage(state.theme)
      applyThemeToDOM(state.theme)
    },

    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload
      saveThemeToStorage(state.theme)
      applyThemeToDOM(state.theme)
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },

    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },

    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload
    },

    setActiveModal: (state, action: PayloadAction<string | null>) => {
      state.activeModal = action.payload

      if (action.payload && action.payload !== 'cart') {
        state.cartOpen = false
      }
    },

    closeAllModals: (state) => {
      state.cartOpen = false
      state.activeModal = null
    },

    addNotification: (
      state,
      action: PayloadAction<{
        message: string
        type: 'success' | 'error' | 'warning' | 'info'
      }>
    ) => {
      const notification = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        ...action.payload,
      }

      state.notifications.push(notification)

      if (state.notifications.length > 5) {
        state.notifications.shift()
      }
    },

    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter((n) => n.id !== action.payload)
    },

    clearAllNotifications: (state) => {
      state.notifications = []
    },
  },
})

export const {
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
} = uiSlice.actions

export const selectCartOpen = (state: { ui: UIState }) => state.ui.cartOpen
export const selectTheme = (state: { ui: UIState }) => state.ui.theme
export const selectLoading = (state: { ui: UIState }) => state.ui.loading
export const selectSidebarOpen = (state: { ui: UIState }) => state.ui.sidebarOpen
export const selectActiveModal = (state: { ui: UIState }) => state.ui.activeModal
export const selectNotifications = (state: { ui: UIState }) => state.ui.notifications
export const selectHasActiveModal = (state: { ui: UIState }) => !!state.ui.activeModal
export const selectHasNotifications = (state: { ui: UIState }) => state.ui.notifications.length > 0
export const selectUnreadNotificationsCount = (state: { ui: UIState }) =>
  state.ui.notifications.length
export const selectUIState = (state: { ui: UIState }) => ({
  cartOpen: state.ui.cartOpen,
  theme: state.ui.theme,
  loading: state.ui.loading,
  sidebarOpen: state.ui.sidebarOpen,
  activeModal: state.ui.activeModal,
  notificationsCount: state.ui.notifications.length,
})
export const selectIsModalOpen = (modalId: string) => (state: { ui: UIState }) =>
  state.ui.activeModal === modalId
export const selectAnyModalOpen = (state: { ui: UIState }) =>
  !!(state.ui.cartOpen || state.ui.activeModal)

export default uiSlice.reducer
