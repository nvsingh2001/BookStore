import { isInWishlist } from './useWishlist'

describe('isInWishlist', () => {
  const items = [{ wishlistItemId: '1', book: { id: 'b1' } }]

  it('returns true when the product is in the wishlist', () => {
    expect(isInWishlist(items, 'b1')).toBe(true)
  })

  it('returns false when the product is not in the wishlist', () => {
    expect(isInWishlist(items, 'b2')).toBe(false)
  })

  it('returns false for an empty wishlist', () => {
    expect(isInWishlist([], 'b1')).toBe(false)
  })
})
