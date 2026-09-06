import http from './http'

export function toApiAddressType(type) {
  return type === 'Work' ? 'Office' : type
}

export function fromApiAddressType(type) {
  return type === 'Office' ? 'Work' : type
}

export const customerDetails = {
  update({ addressType, fullAddress, city, state }) {
    const payload = {
      addressType: toApiAddressType(addressType),
      fullAddress,
      city,
      state,
    }
    return http.put('/edit_user', payload).then((r) => ({
      ...r.data,
      addressType: fromApiAddressType(r.data.addressType) ?? r.data.addressType,
    }))
  },
}
