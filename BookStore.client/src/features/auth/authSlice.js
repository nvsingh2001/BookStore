import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { auth as authApi } from '../../api/auth'

export const login = createAsyncThunk('auth/login', async (credentials) => {
  return authApi.login(credentials)
})

export const register = createAsyncThunk('auth/register', async (payload) => {
  return authApi.register(payload)
})

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, token: null, status: 'idle', error: null },
  reducers: {
    setUser(state, action) {
      state.user = action.payload
    },
    logout(state) {
      state.user = null
      state.token = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'success'
        state.token = action.payload.token
        state.user = action.payload.user
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'error'
        state.error = action.error.message
      })
      .addCase(register.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(register.fulfilled, (state) => {
        state.status = 'idle'
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'error'
        state.error = action.error.message
      })
  },
})

export const { setUser, logout } = authSlice.actions
export default authSlice.reducer
