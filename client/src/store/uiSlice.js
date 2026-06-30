import { createSlice } from '@reduxjs/toolkit'

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    theme: 'light', // 'light' | 'dark'
    sidebarOpen: false,
    mobileMenuOpen: false,
    searchOpen: false,
    notificationsOpen: false,
  },
  reducers: {
    setTheme(state, action) {
      state.theme = action.payload
      if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('dark', action.payload === 'dark')
      }
    },
    toggleTheme(state) {
      state.theme = state.theme === 'dark' ? 'light' : 'dark'
      if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('dark', state.theme === 'dark')
      }
    },
    setSidebarOpen(state, action) {
      state.sidebarOpen = action.payload
    },
    setMobileMenuOpen(state, action) {
      state.mobileMenuOpen = action.payload
    },
    setSearchOpen(state, action) {
      state.searchOpen = action.payload
    },
    setNotificationsOpen(state, action) {
      state.notificationsOpen = action.payload
    },
  },
})

export const {
  setTheme,
  toggleTheme,
  setSidebarOpen,
  setMobileMenuOpen,
  setSearchOpen,
  setNotificationsOpen,
} = uiSlice.actions
export default uiSlice.reducer

export const selectTheme = (state) => state.ui.theme
export const selectSidebarOpen = (state) => state.ui.sidebarOpen
export const selectMobileMenuOpen = (state) => state.ui.mobileMenuOpen
