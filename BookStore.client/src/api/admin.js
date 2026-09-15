import http from './http'

export const admin = {
  login(payload) {
    return http.post('/Admin/login', payload).then((r) => r.data)
  },

  register(payload) {
    return http.post('/Admin', payload).then((r) => r.data)
  },
}
