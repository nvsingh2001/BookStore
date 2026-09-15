import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice.js'
import adminReducer from '../features/admin/adminSlice.js'
import cartReducer from '../features/cart/cartSlice.js'
import wishlistReducer from '../features/wishlist/wishlistSlice.js'
import { attachStore } from '../api/http.js'
import { loadPersistedState, persistAuthState } from '../lib/persist.js'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
  },
  preloadedState: loadPersistedState(),
})

attachStore(store)
persistAuthState(store)
