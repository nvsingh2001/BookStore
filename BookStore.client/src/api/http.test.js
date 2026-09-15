import { logout } from '../features/auth/authSlice'
import { logout as adminLogout } from '../features/admin/adminSlice'
import http, { attachStore } from './http'

describe('http request interceptor', () => {
  const store = { getState: jest.fn(), dispatch: jest.fn() }
  beforeAll(() => {
    attachStore(store)
  })
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
  const store = { getState: jest.fn(), dispatch: jest.fn() }
  beforeAll(() => {
    attachStore(store)
  })
  beforeEach(() => {
    store.getState.mockReturnValue({ auth: { token: null }, admin: { token: null } })
  })

  it('unwraps the {success, data} envelope on success', () => {
    const response = { data: { success: true, message: 'ok', data: { productId: '1' } } }
    const result = http.interceptors.response.handlers[1].fulfilled(response)
    expect(result.data).toEqual({ productId: '1' })
  })

  it('dispatches logout on a 401', async () => {
    const error = { response: { status: 401, data: { message: 'No token provided.' } } }
    await expect(http.interceptors.response.handlers[1].rejected(error)).rejects.toBe(error)
    expect(store.dispatch).toHaveBeenCalledWith(logout())
  })

  it('dispatches admin logout on a 401 when an admin session is active', async () => {
    store.dispatch.mockClear()
    store.getState.mockReturnValue({ auth: { token: null }, admin: { token: 'admin-jwt' } })
    const error = { response: { status: 401, data: { message: 'No token provided.' } } }
    await expect(http.interceptors.response.handlers[1].rejected(error)).rejects.toBe(error)
    expect(store.dispatch).toHaveBeenCalledWith(adminLogout())
  })

  it('does not dispatch logout on other errors', async () => {
    store.dispatch.mockClear()
    const error = { response: { status: 500, data: { message: 'Server error' } } }
    await expect(http.interceptors.response.handlers[1].rejected(error)).rejects.toBe(error)
    expect(store.dispatch).not.toHaveBeenCalled()
  })

  it('normalizes the error message and field errors from the envelope', async () => {
    const error = { response: { status: 400, data: { message: 'Invalid Password', errors: [] } } }
    await expect(http.interceptors.response.handlers[1].rejected(error)).rejects.toBe(error)
    expect(error.message).toBe('Invalid Password')
    expect(error.fieldErrors).toEqual([])
  })
})
