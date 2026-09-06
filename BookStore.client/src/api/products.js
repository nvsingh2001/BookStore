import http from './http'

export function mapBook(raw) {
  const discount = raw.discountPrice ?? 0
  return {
    id: raw._id,
    name: raw.bookName,
    author: raw.author,
    description: raw.description,
    quantity: raw.quantity,
    price: raw.price,
    discount,
    displayPrice: raw.price - discount,
    inStock: raw.quantity > 0,
  }
}

export const products = {
  async list() {
    const { data } = await http.get('/get/book')
    return data.map(mapBook)
  },

  async getById(id) {
    const all = await products.list()
    return all.find((book) => book.id === id)
  },
}
