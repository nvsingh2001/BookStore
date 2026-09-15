import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate } from 'react-router'
import { adminLogin } from '../../features/admin/adminSlice'
import Button from '../../components/Button'

export default function AdminLogin() {
  const dispatch = useDispatch()
  const token = useSelector((state) => state.admin.token)
  const status = useSelector((state) => state.admin.status)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (token) return <Navigate to="/admin/products" replace />

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      await dispatch(adminLogin({ email, password })).unwrap()
    } catch (err) {
      setError(err.message ?? 'Login failed. Check your credentials.')
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow-sm" style={{ maxWidth: '380px', width: '100%' }}>
        <div className="card-body p-4">
          <h1 className="h4 fw-bold text-center mb-4">BookStore Admin</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="admin-email" className="form-label">
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="admin-password" className="form-label">
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <div className="text-danger small mb-3">{error}</div>}
            <Button type="submit" className="w-100" disabled={status === 'loading'}>
              {status === 'loading' ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
