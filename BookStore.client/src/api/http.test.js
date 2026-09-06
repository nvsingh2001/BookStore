jest.mock('../app/store', () => ({
  store: { getState: jest.fn(), dispatch: jest.fn() },
}))

import { store } from '../app/store'
import { logout } from '../features/auth/authSlice'
import http from './http'

describe('http request interceptor', () => {
  it('attaches Authorization header when a token exists', () => {
    store.getState.mockReturnValue({ auth: { token: 'abc123' } })
    const config = http.interceptors.request.handlers[0].fulfilled({ headers: {} })
    expect(config.headers.Authorization).toBe('Bearer abc123')
  })

  it('leaves headers untouched when there is no token', () => {
    store.getState.mockReturnValue({ auth: { token: null } })
    const config = http.interceptors.request.handlers[0].fulfilled({ headers: {} })
    expect(config.headers.Authorization).toBeUndefined()
  })
})

describe('http response interceptors', () => {
  it('dispatches logout on a 401', async () => {
    const error = { response: { status: 401 } }
    await expect(http.interceptors.response.handlers[0].rejected(error)).rejects.toBe(error)
    expect(store.dispatch).toHaveBeenCalledWith(logout())
  })

  it('does not dispatch logout on other errors', async () => {
    const error = { response: { status: 500 } }
    await expect(http.interceptors.response.handlers[0].rejected(error)).rejects.toBe(error)
    expect(store.dispatch).not.toHaveBeenCalledWith()
  })
})
