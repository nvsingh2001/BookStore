import http from './http'

export function mapReview(raw) {
  return {
    feedbackId: raw.feedbackId,
    fullName: raw.fullName,
    comment: raw.comment,
    rating: raw.rating,
    createdAt: raw.createdAt,
  }
}

export const feedback = {
  add(productId, { comment, rating }) {
    return http.post(`/Feedback/${productId}`, { comment, rating }).then((r) => r.data)
  },

  async list(productId) {
    const { data } = await http.get(`/Feedback/${productId}`)
    return data.map(mapReview)
  },
}
