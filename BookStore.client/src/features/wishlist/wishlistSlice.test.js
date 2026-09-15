import wishlistReducer, { fetchWishlist, selectIsInWishlist } from './wishlistSlice'

describe('wishlistSlice reducer', () => {
  it('returns the initial state', () => {
    const state = wishlistReducer(undefined, { type: 'unknown' })
    expect(state).toEqual({ items: [], status: 'idle', error: null })
  })

  it('sets status to loading on any wishlist/ thunk pending', () => {
    const state = wishlistReducer(undefined, { type: fetchWishlist.pending.type })
    expect(state.status).toBe('loading')
  })

  it('stores the refetched items on any wishlist/ thunk fulfilled', () => {
    const items = [{ wishlistItemId: '1', book: { id: 'b1' } }]
    const state = wishlistReducer(undefined, { type: fetchWishlist.fulfilled.type, payload: items })
    expect(state.status).toBe('success')
    expect(state.items).toEqual(items)
  })

  it('sets status to error on any wishlist/ thunk rejected', () => {
    const state = wishlistReducer(undefined, {
      type: fetchWishlist.rejected.type,
      error: { message: 'Request failed' },
    })
    expect(state.status).toBe('error')
    expect(state.error).toBe('Request failed')
  })

  it('clears the wishlist on auth/logout', () => {
    const loggedIn = { items: [{ wishlistItemId: '1', book: { id: 'b1' } }], status: 'success', error: null }
    const state = wishlistReducer(loggedIn, { type: 'auth/logout' })
    expect(state.items).toEqual([])
    expect(state.status).toBe('idle')
  })
})

describe('selectIsInWishlist', () => {
  const state = {
    wishlist: { items: [{ wishlistItemId: '1', book: { id: 'b1' } }] },
  }

  it('returns true when the product is in the wishlist', () => {
    expect(selectIsInWishlist('b1')(state)).toBe(true)
  })

  it('returns false when the product is not in the wishlist', () => {
    expect(selectIsInWishlist('b2')(state)).toBe(false)
  })
})
