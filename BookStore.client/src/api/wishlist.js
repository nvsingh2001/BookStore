import http from './http'
import { mapBook } from './products'

export function mapWishlistItem(raw) {
  return {
    wishlistItemId: raw.wishlistItemId,
    book: mapBook(raw.product),
  }
}

export const wishlist = {
  async add(productId) {
    const { data } = await http.post(`/WishlistItem/${productId}`)
    return mapWishlistItem(data)
  },

  remove(productId) {
    return http.delete(`/WishlistItem/${productId}`).then((r) => r.data)
  },

  async list() {
    const { data } = await http.get('/WishlistItem')
    return data.map(mapWishlistItem)
  },
}
