import { useSelector } from 'react-redux'
import PleaseLogin from '../components/PleaseLogin'

export default function RequireAuth({ children }) {
  const token = useSelector((state) => state.auth.token)
  if (!token) return <PleaseLogin />
  return children
}
