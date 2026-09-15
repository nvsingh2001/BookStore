import { useSelector } from 'react-redux'
import PleaseLogin from '../components/PleaseLogin'

export function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    const token = useSelector((state) => state.auth.token)
    if (!token) return <PleaseLogin />
    return <Component {...props} />
  }
}
