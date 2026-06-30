import API from './api'

export const auctionService = {
  getAuctions: ({ page = 1, category = '', sort = 'endDate:asc', search = '' } = {}) =>
    API.get('/auction', { params: { page, category, sort, search } }),

  getAuction: (id) => API.get(`/auction/${id}`),

  createAuction: (data) => API.post('/auction', data),

  updateAuction: (id, data) => API.put(`/auction/${id}`, data),

  deleteAuction: (id) => API.delete(`/auction/${id}`),

  placeBid: (id, amount) => API.post(`/auction/${id}/bid`, { amount }),

  getMyAuctions: () => API.get('/auction/myauction'),

  getMyBids: () => API.get('/auction/mybids'),

  getAuctionBids: (id) => API.get(`/auction/${id}/bids`),

  getStats: () => API.get('/auction/stats'),

  getWinner: (id) => API.get(`/auction/${id}/winner`),
}
