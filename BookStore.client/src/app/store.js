import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice.js'
import cartReducer from '../features/cart/cartSlice.js'
import wishlistReducer from '../features/wishlist/wishlistSlice.js'
import { attachStore } from '../api/http.js'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
  },
})

attachStore(store)
