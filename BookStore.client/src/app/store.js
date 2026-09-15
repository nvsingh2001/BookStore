import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice.js'
import adminReducer from '../features/admin/adminSlice.js'
import { attachStore } from '../api/http.js'
import { loadPersistedState, persistAuthState } from '../lib/persist.js'
import { queryClient } from './queryClient.js'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
  },
  preloadedState: loadPersistedState(),
})

attachStore(store)
persistAuthState(store)

let prevAuthToken = store.getState().auth.token
store.subscribe(() => {
  const { auth } = store.getState()
  if (prevAuthToken && !auth.token) {
    queryClient.removeQueries({ queryKey: ['cart'] })
    queryClient.removeQueries({ queryKey: ['wishlist'] })
    queryClient.removeQueries({ queryKey: ['orders'] })
    queryClient.removeQueries({ queryKey: ['me'] })
  }
  prevAuthToken = auth.token
})
