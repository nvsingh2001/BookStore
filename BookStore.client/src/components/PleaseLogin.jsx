import { useAuthModal } from '../context/AuthModalContext'

export default function PleaseLogin({ message = 'Please login to continue.' }) {
  const openAuthModal = useAuthModal()

  return (
    <div className="container py-5 text-center">
      <h1 className="h4 text-uppercase fw-bold mb-2">Please Log In</h1>
      <p className="text-secondary mb-4">{message}</p>
      <button type="button" className="btn btn-outline-danger text-uppercase" onClick={openAuthModal}>
        Login/Signup
      </button>
    </div>
  )
}
