import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router'
import { fetchCart, selectCartCount } from '../features/cart/cartSlice'
import { fetchWishlist } from '../features/wishlist/wishlistSlice'
import { useAuthModal } from '../context/AuthModalContext'
import ProfileMenu from './ProfileMenu'

const profileIcon = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.42 0-8 2.24-8 5v1a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1c0-2.76-3.58-5-8-5Z" />
  </svg>
)

export default function Header() {
  const searchRef = useRef(null)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const token = useSelector((state) => state.auth.token)
  const cartCount = useSelector(selectCartCount)
  const openAuthModal = useAuthModal()

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
        <form onSubmit={handleSearchSubmit} className="d-flex flex-grow-1 mx-4" style={{ maxWidth: '640px' }}>
          <input ref={searchRef} type="search" className="form-control w-100" placeholder="Search..." />
        </form>
        <div className="d-flex align-items-center gap-3">
          {token ? (
            <ProfileMenu firstName={user?.fullName?.split(' ')[0] ?? 'Profile'} />
          ) : (
            <button
              type="button"
              className="btn btn-link text-white text-decoration-none d-flex flex-column align-items-center p-0 border-0"
              title="Profile"
              onClick={openAuthModal}
            >
              {profileIcon}
              <span className="small">Profile</span>
            </button>
          )}
          <Link
            to="/cart"
            className="text-white text-decoration-none position-relative d-flex flex-column align-items-center"
            title="Cart"
          >
            <img src="/assets/supermarket.svg" alt="" width="22" height="22" />
            {cartCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill text-bg-danger">
                {cartCount}
              </span>
            )}
            <span className="small">Cart</span>
          </Link>
        </div>
      </div>
    </nav>
  )
}
