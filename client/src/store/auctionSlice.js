import { createSlice } from '@reduxjs/toolkit'

const auctionSlice = createSlice({
  name: 'auction',
  initialState: {
    auctions: [],
    currentAuction: null,
    totalCount: 0,
    currentPage: 1,
    filters: {
      category: '',
      sort: 'endDate:asc',
      search: '',
    },
    recentBids: [], // live bids pushed via socket
    loading: false,
    error: null,
  },
  reducers: {
    setAuctions(state, action) {
      state.auctions = action.payload.auctions
      state.totalCount = action.payload.total ?? 0
    },
    setCurrentAuction(state, action) {
      state.currentAuction = action.payload
    },
    updateCurrentBid(state, action) {
      const { auctionId, bid } = action.payload
      if (state.currentAuction?._id === auctionId) {
        state.currentAuction.currentBid = bid.amount
        state.currentAuction.totalBids = (state.currentAuction.totalBids ?? 0) + 1
      }
      // Update in list too
      const idx = state.auctions.findIndex((a) => a._id === auctionId)
      if (idx !== -1) {
        state.auctions[idx].currentBid = bid.amount
        state.auctions[idx].totalBids = (state.auctions[idx].totalBids ?? 0) + 1
      }
      state.recentBids = [bid, ...state.recentBids].slice(0, 50)
    },
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload }
      state.currentPage = 1
    },
    setPage(state, action) {
      state.currentPage = action.payload
    },
    setLoading(state, action) {
      state.loading = action.payload
    },
    setError(state, action) {
      state.error = action.payload
      state.loading = false
    },
    clearCurrentAuction(state) {
      state.currentAuction = null
      state.recentBids = []
    },
  },
})

export const {
  setAuctions,
  setCurrentAuction,
  updateCurrentBid,
  setFilters,
  setPage,
  setLoading,
  setError,
  clearCurrentAuction,
} = auctionSlice.actions
export default auctionSlice.reducer

// Selectors
export const selectAuctions = (state) => state.auction.auctions
export const selectCurrentAuction = (state) => state.auction.currentAuction
export const selectAuctionFilters = (state) => state.auction.filters
export const selectAuctionPage = (state) => state.auction.currentPage
export const selectRecentBids = (state) => state.auction.recentBids
export const selectAuctionTotal = (state) => state.auction.totalCount
