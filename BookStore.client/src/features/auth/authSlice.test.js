import authReducer, { login, logout, setUser } from './authSlice'

describe('authSlice reducers', () => {
  it('returns the initial stage', () => {
    const state = authReducer(undefined, { type: 'unknown' })
    expect(state).toEqual({ user: null, token: null, status: 'idle', error: null })
  })

  it('sets the user on setUser', () => {
    const state = authReducer(undefined, setUser({ email: 'a@b.com' }))
    expect(state.user).toEqual({ email: 'a@b.com' })
  })

  it('clear user and token on logout', () => {
    const loggedIn = { user: { email: 'a@b.com' }, token: 'abc', status: 'sucess', error: null }
    const state = authReducer(loggedIn, logout())
    expect(state.user).toBeNull()
    expect(state.token).toBeNull()
  })
})

describe('authSlice login thunk reducers', () => {
  it('sets status to loading on pending', () => {
    const state = authReducer(undefined, { type: login.pending.type })
    expect(state.status).toBe('loading')
  })

  it('stores the token and user on fullfilled', () => {
    const action = {
      type: login.fulfilled.type,
      payload: { token: 'jwt123', user: { fullName: 'Jane' } },
      meta: { arg: { email: 'a@b.com', password: 'x' } },
    }
    const state = authReducer(undefined, action)
    expect(state.status).toBe('success')
    expect(state.token).toBe('jwt123')
    expect(state.user).toEqual({ fullName: 'Jane' })
  })

  it('sets status to error on rejected', () => {
    const action = { type: login.rejected.type, error: { message: 'Request failed' } }
    const state = authReducer(undefined, action)
    expect(state.status).toBe('error')
    expect(state.error).toBe('Request failed')
  })
})
