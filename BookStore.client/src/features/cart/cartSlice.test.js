import cartReducer, {
  fetchCart,
  selectCartCount,
  selectCartTotal,
} from './cartSlice'

describe('cartSlice reducer', () => {
  it('returns the initial state', () => {
    const state = cartReducer(undefined, { type: 'unknown' })
    expect(state).toEqual({ items: [], status: 'idle', error: null })
  })

  it('sets status to loading on any cart/ thunk pending', () => {
    const state = cartReducer(undefined, { type: fetchCart.pending.type })
    expect(state.status).toBe('loading')
  })

  it('stores the refetched items on any cart/ thunk fulfilled', () => {
    const items = [{ cartItemId: '1', quantity: 2, book: { id: 'b1', displayPrice: 100 } }]
    const state = cartReducer(undefined, { type: fetchCart.fulfilled.type, payload: items })
    expect(state.status).toBe('success')
    expect(state.items).toEqual(items)
  })

  it('sets status to error on any cart/ thunk rejected', () => {
    const state = cartReducer(undefined, {
      type: fetchCart.rejected.type,
      error: { message: 'Request failed' },
    })
    expect(state.status).toBe('error')
    expect(state.error).toBe('Request failed')
  })

  it('clears the cart on auth/logout', () => {
    const loggedIn = {
      items: [{ cartItemId: '1', quantity: 1, book: { id: 'b1', displayPrice: 50 } }],
      status: 'success',
      error: null,
    }
    const state = cartReducer(loggedIn, { type: 'auth/logout' })
    expect(state.items).toEqual([])
    expect(state.status).toBe('idle')
  })
})

describe('cart selectors', () => {
  const state = {
    cart: {
      items: [
        { cartItemId: '1', quantity: 2, book: { id: 'b1', displayPrice: 100 } },
        { cartItemId: '2', quantity: 1, book: { id: 'b2', displayPrice: 50 } },
      ],
    },
  }

  it('sums item quantities for the cart count', () => {
    expect(selectCartCount(state)).toBe(3)
  })

  it('sums price * quantity for the cart total', () => {
    expect(selectCartTotal(state)).toBe(250)
  })
})
