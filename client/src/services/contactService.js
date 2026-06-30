import API from './api'

export const contactService = {
  sendMessage: (data) => API.post('/contact', data),
}
