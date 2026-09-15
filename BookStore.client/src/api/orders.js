import http from './http'
import { fromApiAddressType } from './customerDetails'

export const ORDER_STATUSES = [
  'Placed',
  'Processing',
  'Shipped',
  'OutForDelivery',
  'Delivered',
  'Cancelled',
  'Returned',
]

export function mapOrder(raw) {
  return {
    orderId: raw.orderId,
    status: ORDER_STATUSES[raw.status] ?? raw.status,
    createdAt: raw.createdAt,
    shippingAddress: raw.shippingAddress && {
      ...raw.shippingAddress,
      addressType: fromApiAddressType(raw.shippingAddress.addressType),
    },
    items: raw.items.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      quantity: item.productQuantity,
      price: item.productPrice,
    })),
  }
}

export const orders = {
  async place(items, addressId) {
    const payload = {
      addressId,
      orders: items.map((item) => ({
        productId: item.id,
        productQuantity: item.quantity,
      })),
    }
    const { data } = await http.post('/Order', payload)
    return mapOrder(data)
  },

  async list() {
    const { data } = await http.get('/Order')
    return data.map(mapOrder)
  },

  async getById(orderId) {
    const { data } = await http.get(`/Order/${orderId}`)
    return mapOrder(data)
  },
}
