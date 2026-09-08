import axios from 'axios'
import { API_BASE_URL } from './config'

const http = axios.create({ baseURL: API_BASE_URL })

export function attachStore(store) {
  http.interceptors.request.use((config) => {
    const token = store.getState().auth.token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  http.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        store.dispatch({ type: 'auth/logout' })
      }
      return Promise.reject(error)
    },
  )
}

export default http
