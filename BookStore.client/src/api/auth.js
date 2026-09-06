import http from './http'

export const auth = {
  register(payload) {
    return http.post('/registration', payload).then((r) => r.data)
  },
  verify(token) {
    return http.post(`/verification/${token}`).then((r) => r.data)
  },
  login(payload) {
    return http.post('/login', payload).then((r) => r.data)
  },
}
