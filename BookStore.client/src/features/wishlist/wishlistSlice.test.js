import wishlistReducer, { setWishlistItems } from './wishlistSlice'

describe('wishlistSlice', () => {
  it('returns the initial state', () => {
    const state = wishlistReducer(undefined, { type: 'unknown' })
    expect(state).toEqual({ items: [], status: 'idle' })
  })

  it('sets items on setWishlistItems', () => {
    const initialState = { items: [], status: 'idle' }
    const books = [{ id: '1' }, { id: '2' }]
    const state = wishlistReducer(initialState, setWishlistItems(books))
    expect(state.items).toEqual(books)
  })
})
