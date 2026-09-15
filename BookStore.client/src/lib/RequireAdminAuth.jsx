import { useSelector } from 'react-redux'
import { Navigate } from 'react-router'

export default function RequireAdminAuth({ children }) {
  const token = useSelector((state) => state.admin.token)
  if (!token) return <Navigate to="/admin/login" replace />
  return children
}
