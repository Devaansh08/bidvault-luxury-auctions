import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    initialized: false, // whether initial auth check has run
    error: null,
  },
  reducers: {
    setUser(state, action) {
      state.user = action.payload
      state.isAuthenticated = !!action.payload
      state.initialized = true
      state.error = null
      if (typeof window !== 'undefined' && action.payload) {
        localStorage.setItem('user_profile', JSON.stringify(action.payload))
      }
    },
    clearUser(state) {
      state.user = null
      state.isAuthenticated = false
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user_profile')
      }
    },
    setLoading(state, action) {
      state.loading = action.payload
    },
    setInitialized(state) {
      state.initialized = true
    },
    setError(state, action) {
      state.error = action.payload
      state.loading = false
    },
  },
})

export const { setUser, clearUser, setLoading, setInitialized, setError } = authSlice.actions
export default authSlice.reducer

// Selectors
export const selectUser = (state) => state.auth.user
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated
export const selectIsAdmin = (state) => state.auth.user?.role === 'admin'
export const selectAuthLoading = (state) => state.auth.loading
export const selectAuthInitialized = (state) => state.auth.initialized
