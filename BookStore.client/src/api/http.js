import axios from 'axios'
import { API_BASE_URL } from './config'

const http = axios.create({ baseURL: API_BASE_URL })

export function attachStore(store) {
  http.interceptors.request.use((config) => {
    const { auth, admin } = store.getState()
    const token = admin?.token ?? auth.token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  http.interceptors.response.use(
    (response) => {
      response.data = response.data.data
      return response
    },
    (error) => {
      if (error.response?.status === 401) {
        const { admin } = store.getState()
        store.dispatch({ type: admin?.token ? 'admin/logout' : 'auth/logout' })
      }
      if (error.response?.data) {
        error.message = error.response.data.message ?? error.message
        error.fieldErrors = error.response.data.errors ?? []
      }
      return Promise.reject(error)
    },
  )
}

export default http
