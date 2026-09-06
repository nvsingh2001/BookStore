import http from './http'

export const cart = {
  add(productId) {
    return http.post(`/add_cart_item/${productId}`).then((r) => r.data)
  },

  updateQuantity(cartItemId, quantity) {
    return http
      .put(`/cart_item_quantity/${cartItemId}`, { quantityToBuy: quantity })
      .then((r) => r.data)
  },

  remove(cartItemId) {
    return http.delete(`/remove_cart_item/${cartItemId}`).then((r) => r.data)
  },

  list() {
    return http.get('/get_cart_items').then((r) => r.data)
  },
}
