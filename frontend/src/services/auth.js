// services/authService.js
import api from './api'

export default {
  login(email, password) {
    return api.post('/auth/login', {email, password})
  },
  logout() {
    return api.post('/auth/logout')
  },
  refresh(refreshToken) {
    return api.post('/auth/refresh',{ refreshToken })
  }
}
