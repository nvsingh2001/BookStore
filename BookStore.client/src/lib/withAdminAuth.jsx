import { useSelector } from 'react-redux'
import { Navigate } from 'react-router'

export function withAdminAuth(Component) {
  return function AdminAuthenticatedComponent(props) {
    const token = useSelector((state) => state.admin.token)
    if (!token) return <Navigate to="/admin/login" replace />
    return <Component {...props} />
  }
}
