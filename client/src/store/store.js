import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import auctionReducer from './auctionSlice'
import uiReducer from './uiSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    auction: auctionReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Socket instances are not serializable — ignore them
        ignoredActions: ['auction/updateCurrentBid'],
      },
    }),
  devTools: import.meta.env.DEV,
})
