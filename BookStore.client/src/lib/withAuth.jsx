import { useSelector } from 'react-redux'
import { Navigate } from 'react-router'

export function withAuth(Components) {
  return function AuthenticatedComponent(props) {
    const token = useSelector((state) => state.auth.token)
    if (!token) return <Navigate to="/" replace />
    return <Components {...props} />
  }
}
