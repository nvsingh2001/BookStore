import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router'
import { logout } from '../features/auth/authSlice'
import { fetchCart, selectCartCount } from '../features/cart/cartSlice'
import AuthModal from './AuthModal'

export default function Header() {
  const searchRef = useRef(null)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const token = useSelector((state) => state.auth.token)
  const cartCount = useSelector(selectCartCount)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  useEffect(() => {
    if (token) dispatch(fetchCart())
  }, [token, dispatch])

  function handleSearchSubmit(e) {
    e.preventDefault()
    const query = searchRef.current.value
    navigate(query ? `/?q=${encodeURIComponent(query)}` : '/')
  }

  return (
    <nav className="navbar navbar-dark bg-primary">
      <div className="container-fluid">
        <Link to={'/'} className="navbar-brand">
          <img src="/assets/education.svg" alt="Logo" className="d-inline-block align-text-top" />
          BookStore
        </Link>
        <form onSubmit={handleSearchSubmit} className="d-flex">
          <input ref={searchRef} type="search" className="form-control" placeholder="Search..." />
        </form>
        <div className="d-flex align-items-center gap-3">
          <Link to="/profile" className="text-white">
            <img src="/assets/profile.svg" alt="Profile" width="24" height="24" />
          </Link>
          <Link to="/cart" className="text-white position-relative">
            <img src="/assets/supermarket.svg" alt="Cart" width="24" height="24" />
            {cartCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill text-bg-danger">
                {cartCount}
              </span>
            )}
          </Link>
          {user ? (
            <div className="d-flex align-items-center gap-2 text-white">
              <span>Hi, {user.fullName ?? user.email}</span>
              <button className="btn btn-outline-light btn-sm" onClick={() => dispatch(logout())}>
                Logout
              </button>
            </div>
          ) : (
            <button
              className="btn btn-outline-light btn-sm"
              onClick={() => setIsAuthModalOpen(true)}
            >
              Login
            </button>
          )}
        </div>
      </div>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </nav>
  )
}
