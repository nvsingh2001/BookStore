import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { wishlist as wishlistApi } from '../../api/wishlist'

export const fetchWishlist = createAsyncThunk('wishlist/fetch', () => wishlistApi.list())

export const addToWishlist = createAsyncThunk('wishlist/add', async (productId) => {
  await wishlistApi.add(productId)
  return wishlistApi.list()
})

export const removeFromWishlist = createAsyncThunk('wishlist/remove', async (productId) => {
  await wishlistApi.remove(productId)
  return wishlistApi.list()
})

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: { items: [], status: 'idle', error: null },
  reducers: {
    setWishlistItems(state, action) {
      state.items = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase('auth/logout', (state) => {
        state.items = []
        state.status = 'idle'
        state.error = null
      })
      .addMatcher(
        (action) => action.type.startsWith('wishlist/') && action.type.endsWith('/pending'),
        (state) => {
          state.status = 'loading'
          state.error = null
        },
      )
      .addMatcher(
        (action) => action.type.startsWith('wishlist/') && action.type.endsWith('/fulfilled'),
        (state, action) => {
          state.status = 'success'
          state.items = action.payload
        },
      )
      .addMatcher(
        (action) => action.type.startsWith('wishlist/') && action.type.endsWith('/rejected'),
        (state, action) => {
          state.status = 'error'
          state.error = action.error.message
        },
      )
  },
})

export const { setWishlistItems } = wishlistSlice.actions
export default wishlistSlice.reducer

export const selectWishlistItems = (state) => state.wishlist.items
export const selectWishlistStatus = (state) => state.wishlist.status
export const selectIsInWishlist = (productId) => (state) =>
  state.wishlist.items.some((item) => item.book.id === productId)
