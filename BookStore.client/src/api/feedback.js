import http from './http'

export const feedback = {
  add(productId, { comment, rating }) {
    return http.post(`/add/feedback/${productId}`, { comment, rating }).then((r) => r.data)
  },

  list(productId) {
    return http.get(`/get/feedback/${productId}`).then((r) => r.data)
  },
}
