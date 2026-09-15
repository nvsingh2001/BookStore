import { toApiAddressType, fromApiAddressType } from './customerDetails'

describe('address type enum encoding', () => {
  it('encodes address type names to their enum ordinal', () => {
    expect(toApiAddressType('Home')).toBe(0)
    expect(toApiAddressType('Office')).toBe(1)
    expect(toApiAddressType('Other')).toBe(2)
  })
  it('decodes enum ordinals back to address type names', () => {
    expect(fromApiAddressType(0)).toBe('Home')
    expect(fromApiAddressType(1)).toBe('Office')
    expect(fromApiAddressType(2)).toBe('Other')
  })

  it('throws on an unrecognized address type name instead of sending -1', () => {
    expect(() => toApiAddressType('Work')).toThrow('Unknown address type: Work')
  })
})
