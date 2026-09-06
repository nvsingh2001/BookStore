import http from './http'

export const wishlist = {
  add(productId) {
    return http.post(`/add_wish_list/${productId}`).then((r) => r.data)
  },

  remove(productId) {
    return http.delete(`/remove_wishlist_item/${productId}`).then((r) => r.data)
  },

  list() {
    return http.get('/get_wishlist_items').then((r) => r.data)
  },
}
