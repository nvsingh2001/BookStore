import http from './http'

export const ADDRESS_TYPES = ['Home', 'Office', 'Other']

export function toApiAddressType(type) {
  const value = ADDRESS_TYPES.indexOf(type)
  if (value === -1) {
    throw new Error(`Unknown address type: ${type}`)
  }
  return value
}

export function fromApiAddressType(value) {
  return ADDRESS_TYPES[value]
}

export const customerDetails = {
  update({ addressType, fullAddress, city, state, isDefault = true }) {
    const payload = {
      addressType: toApiAddressType(addressType),
      fullAddress,
      city,
      state,
      isDefault,
    }
    return http.post('/CustomerAddress', payload).then((r) => ({
      ...r.data,
      addressType: fromApiAddressType(r.data.addressType),
    }))
  },
}
