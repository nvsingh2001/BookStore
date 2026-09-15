import http from './http'

export const auth = {
  register(payload) {
    return http.post('/User', payload).then((r) => r.data)
  },
  verify(token) {
    return http.get('/User/verify-email', { params: { token } }).then((r) => r.data)
  },
  login(payload) {
    return http.post('/User/login', payload).then((r) => r.data)
  },
  logout() {
    return http.post('/User/logout').then((r) => r.data)
  },
  me() {
    return http.get('/User/me').then((r) => r.data)
  },
  requestPasswordReset(email) {
    return http.post('/User/password-reset-request', { email }).then((r) => r.data)
  },
  resetPassword({ token, newPassword }) {
    return http.post('/User/password-reset', { token, newPassword }).then((r) => r.data)
  },
}
