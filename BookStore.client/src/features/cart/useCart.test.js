import { cartCount, cartTotal } from './useCart'

describe('cartCount', () => {
  it('sums item quantities', () => {
    const items = [
      { cartItemId: '1', quantity: 2, book: { id: 'b1', displayPrice: 100 } },
      { cartItemId: '2', quantity: 1, book: { id: 'b2', displayPrice: 50 } },
    ]
    expect(cartCount(items)).toBe(3)
  })

  it('returns 0 for an empty cart', () => {
    expect(cartCount([])).toBe(0)
  })
})

describe('cartTotal', () => {
  it('sums price * quantity across items', () => {
    const items = [
      { cartItemId: '1', quantity: 2, book: { id: 'b1', displayPrice: 100 } },
      { cartItemId: '2', quantity: 1, book: { id: 'b2', displayPrice: 50 } },
    ]
    expect(cartTotal(items)).toBe(250)
  })

  it('returns 0 for an empty cart', () => {
    expect(cartTotal([])).toBe(0)
  })
})
