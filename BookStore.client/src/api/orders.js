import http from './http'

export const orders = {
  place(items) {
    const payload = {
      orders: items.map((item) => ({
        product_id: item.id,
        product_name: item.name,
        product_quantity: item.quantity,
        product_price: item.price,
      })),
    }
    return http.post('/add/order', payload).then((r) => r.data)
  },
}
