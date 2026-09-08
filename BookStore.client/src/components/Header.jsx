import { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router'
import { logout } from '../features/auth/authSlice'
import AuthModal from './AuthModal'

export default function Header() {
  const searchRef = useRef(null)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

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
          <Link to="/cart" className="text-white">
            <img src="/assets/supermarket.svg" alt="Cart" width="24" height="24" />
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
