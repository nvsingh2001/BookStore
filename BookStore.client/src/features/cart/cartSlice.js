import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { cart as cartApi } from '../../api/cart'

export const fetchCart = createAsyncThunk('cart/fetch', () => cartApi.list())

export const addToCart = createAsyncThunk('cart/add', async ({ productId, quantity }) => {
  await cartApi.add(productId, quantity)
  return cartApi.list()
})

export const updateCartItemQuantity = createAsyncThunk(
  'cart/updateQuantity',
  async ({ cartItemId, quantity }) => {
    await cartApi.updateQuantity(cartItemId, quantity)
    return cartApi.list()
  },
)

export const removeFromCart = createAsyncThunk('cart/remove', async (cartItemId) => {
  await cartApi.remove(cartItemId)
  return cartApi.list()
})

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [], status: 'idle', error: null },
  reducers: {
    setCartItems(state, action) {
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
        (action) => action.type.startsWith('cart/') && action.type.endsWith('/pending'),
        (state) => {
          state.status = 'loading'
          state.error = null
        },
      )
      .addMatcher(
        (action) => action.type.startsWith('cart/') && action.type.endsWith('/fulfilled'),
        (state, action) => {
          state.status = 'success'
          state.items = action.payload
        },
      )
      .addMatcher(
        (action) => action.type.startsWith('cart/') && action.type.endsWith('/rejected'),
        (state, action) => {
          state.status = 'error'
          state.error = action.error.message
        },
      )
  },
})

export const { setCartItems } = cartSlice.actions
export default cartSlice.reducer

export const selectCartItems = (state) => state.cart.items
export const selectCartStatus = (state) => state.cart.status
export const selectCartCount = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0)
export const selectCartTotal = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.book.displayPrice * item.quantity, 0)
