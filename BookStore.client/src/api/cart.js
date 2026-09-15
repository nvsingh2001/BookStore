import http from './http'
import { mapBook } from './products'

export function mapCartItem(raw) {
  return {
    cartItemId: raw.cartItemId,
    quantity: raw.quantityToBuy,
    book: mapBook(raw.product),
  }
}

export const cart = {
  async add(productId, quantity = 1) {
    const { data } = await http.post(`/CartItem/${productId}`, { quantityToBuy: quantity })
    return mapCartItem(data)
  },

  async updateQuantity(cartItemId, quantity) {
    const { data } = await http.put(`/CartItem/${cartItemId}`, { quantityToBuy: quantity })
    return mapCartItem(data)
  },

  remove(cartItemId) {
    return http.delete(`/CartItem/${cartItemId}`).then((r) => r.data)
  },

  async list() {
    const { data } = await http.get('/CartItem')
    return data.map(mapCartItem)
  },
}
