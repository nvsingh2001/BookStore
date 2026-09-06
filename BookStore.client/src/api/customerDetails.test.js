import { toApiAddressType, fromApiAddressType } from './customerDetails'

describe('address type translation', () => {
  it('translates Work to Office outbound', () => {
    expect(toApiAddressType('Work')).toBe('Office')
  })
  it('translates Office to Work outbound', () => {
    expect(fromApiAddressType('Office')).toBe('Work')
  })
  it('leaves Home and Other unchanged in both directions', () => {
    expect(toApiAddressType('Home')).toBe('Home')
    expect(fromApiAddressType('Other')).toBe('Other')
  })
})
