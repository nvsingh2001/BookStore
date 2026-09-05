import { createSlice } from '@reduxjs/toolkit'

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: { items: [], status: 'idle' },
  reducers: {
    setWishlistItems(state, action) {
      state.items = action.payload
    },
  },
})

export const { setWishlistItems } = wishlistSlice.actions
export default wishlistSlice.reducer
