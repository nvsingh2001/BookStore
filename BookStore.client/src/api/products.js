import http from './http'

export function mapBook(raw) {
  const discount = raw.discountPrice ?? 0
  return {
    id: raw.productId,
    name: raw.bookName,
    author: raw.author,
    description: raw.description,
    quantity: raw.quantity,
    price: raw.price,
    discount,
    displayPrice: raw.price - discount,
    inStock: raw.quantity > 0,
    imageUrl: raw.imageUrl,
  }
}

export const products = {
  async list() {
    const { data } = await http.get('/Product')
    return data.map(mapBook)
  },

  async getById(id) {
    const { data } = await http.get(`/Product/${id}`)
    return mapBook(data)
  },
}
