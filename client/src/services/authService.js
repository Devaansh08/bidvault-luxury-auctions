import API from './api'

export const authService = {
  login: (credentials) => API.post('/auth/login', credentials),
  signup: (userData) => API.post('/auth/signup', userData),
  logout: () => API.post('/auth/logout'),
  getMe: () => API.get('/user'),
  changePassword: (data) => API.patch('/user/password', data),
  forgotPassword: (email) => API.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => API.post(`/auth/reset-password/${token}`, { password }),
}
