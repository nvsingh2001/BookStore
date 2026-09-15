import adminReducer, { adminLogin, logout } from './adminSlice'

describe('adminSlice reducer', () => {
  it('returns the initial state', () => {
    const state = adminReducer(undefined, { type: 'unknown' })
    expect(state).toEqual({ admin: null, token: null, status: 'idle', error: null })
  })

  it('sets status to loading on pending', () => {
    const state = adminReducer(undefined, { type: adminLogin.pending.type })
    expect(state.status).toBe('loading')
  })

  it('stores the token and admin on fulfilled', () => {
    const action = {
      type: adminLogin.fulfilled.type,
      payload: { token: 'jwt123', admin: { fullName: 'Bootstrap Admin' } },
    }
    const state = adminReducer(undefined, action)
    expect(state.status).toBe('success')
    expect(state.token).toBe('jwt123')
    expect(state.admin).toEqual({ fullName: 'Bootstrap Admin' })
  })

  it('sets status to error on rejected', () => {
    const action = { type: adminLogin.rejected.type, error: { message: 'Request failed' } }
    const state = adminReducer(undefined, action)
    expect(state.status).toBe('error')
    expect(state.error).toBe('Request failed')
  })

  it('clears admin and token on logout', () => {
    const loggedIn = {
      admin: { fullName: 'Bootstrap Admin' },
      token: 'abc',
      status: 'success',
      error: null,
    }
    const state = adminReducer(loggedIn, logout())
    expect(state.admin).toBeNull()
    expect(state.token).toBeNull()
  })
})
