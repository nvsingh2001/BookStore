import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { admin as adminApi } from '../../api/admin'

export const adminLogin = createAsyncThunk('admin/login', async (credentials) => {
  return adminApi.login(credentials)
})

const adminSlice = createSlice({
  name: 'admin',
  initialState: { admin: null, token: null, status: 'idle', error: null },
  reducers: {
    logout(state) {
      state.admin = null
      state.token = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.status = 'success'
        state.token = action.payload.token
        state.admin = action.payload.admin
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.status = 'error'
        state.error = action.error.message
      })
  },
})

export const { logout } = adminSlice.actions
export default adminSlice.reducer
