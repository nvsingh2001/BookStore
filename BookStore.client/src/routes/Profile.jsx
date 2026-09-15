import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router'
import { auth } from '../api/auth'
import { logout } from '../features/auth/authSlice'
import { useAsync } from '../hooks/useAsync'
import Spinner from '../components/Spinner'
import ErrorState from '../components/ErrorState'

export default function Profile() {
  const dispatch = useDispatch()
  const fetchMe = useCallback(() => auth.me(), [])
  const { status, data: user, retry } = useAsync(fetchMe)

  if (status === 'loading') return <Spinner />
  if (status === 'error')
    return <ErrorState message="Could not load your profile." onRetry={retry} />

  return (
    <div className="container py-4" style={{ maxWidth: '480px' }}>
      <h1 className="h3 mb-4">Profile</h1>
      <dl className="row">
        <dt className="col-4">Name</dt>
        <dd className="col-8">{user.fullName}</dd>
        <dt className="col-4">Email</dt>
        <dd className="col-8">{user.email}</dd>
        <dt className="col-4">Phone</dt>
        <dd className="col-8">{user.phone}</dd>
        <dt className="col-4">Verified</dt>
        <dd className="col-8">{user.isVerified ? 'Yes' : 'No'}</dd>
      </dl>
      <div className="d-flex gap-2">
        <Link to="/orders" className="btn btn-outline-primary">
          My Orders
        </Link>
        <Link to="/wishlist" className="btn btn-outline-primary">
          Wishlist
        </Link>
        <button type="button" className="btn btn-outline-secondary" onClick={() => dispatch(logout())}>
          Logout
        </button>
      </div>
    </div>
  )
}
