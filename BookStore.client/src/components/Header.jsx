import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router'
import { logout } from '../features/auth/authSlice'
import { fetchCart, selectCartCount } from '../features/cart/cartSlice'
import { fetchWishlist } from '../features/wishlist/wishlistSlice'
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
    if (token) {
      dispatch(fetchCart())
      dispatch(fetchWishlist())
    }
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
          <Link to="/profile" className="text-white" title="Profile">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.42 0-8 2.24-8 5v1a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1c0-2.76-3.58-5-8-5Z" />
            </svg>
          </Link>
          <Link to="/wishlist" className="text-white" title="Wishlist">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 21s-6.7-4.35-9.33-8.2C.86 10.02 1.6 6.6 4.6 5.06 6.9 3.9 9.5 4.7 12 7.4c2.5-2.7 5.1-3.5 7.4-2.34 3 1.54 3.74 4.96 1.93 7.74C18.7 16.65 12 21 12 21Z" />
            </svg>
          </Link>
          <Link to="/cart" className="text-white position-relative" title="Cart">
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
