import API from './api'

export const userService = {
  getProfile: () => API.get('/user'),
  updateProfile: (data) => API.patch('/user', data),
  getLoginHistory: () => API.get('/user/login-history'),
  removeLoginHistoryItem: (id) => API.delete(`/user/login-history/${id}`),
  clearAllOtherSessions: () => API.delete('/user/login-history/all-others'),
  getAllUsers: ({ page = 1, search = '' } = {}) =>
    API.get('/admin/users', { params: { page, search } }),
  updateUserRole: (id, role) => API.patch(`/admin/users/${id}/role`, { role }),
  deleteUser: (id) => API.delete(`/admin/users/${id}`),
  getUserActivities: () => API.get('/admin/activities'),
}
