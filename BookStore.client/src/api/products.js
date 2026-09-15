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

  async create(fields) {
    const { data } = await http.post('/Product', fields)
    return mapBook(data)
  },

  async update(id, fields) {
    const { data } = await http.put(`/Product/${id}`, fields)
    return mapBook(data)
  },

  remove(id) {
    return http.delete(`/Product/${id}`).then((r) => r.data)
  },

  async uploadImage(id, file) {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await http.post(`/Product/${id}/image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return mapBook(data)
  },
}
