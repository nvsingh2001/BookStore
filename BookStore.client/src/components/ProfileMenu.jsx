import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router'
import { logout } from '../features/auth/authSlice'

const profileIcon = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.42 0-8 2.24-8 5v1a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1c0-2.76-3.58-5-8-5Z" />
  </svg>
)

const profileIconSmall = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.42 0-8 2.24-8 5v1a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1c0-2.76-3.58-5-8-5Z" />
  </svg>
)

const ordersIconSmall = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M21 8v8l-9 5-9-5V8l9-5 9 5ZM12 5.16 5.5 8 12 11.84 18.5 8 12 5.16ZM5 9.68v6.85l6 3.43v-6.85L5 9.68Zm14 0-6 3.43v6.85l6-3.43V9.68Z" />
  </svg>
)

const wishlistIconSmall = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 21s-6.7-4.35-9.33-8.2C.86 10.02 1.6 6.6 4.6 5.06 6.9 3.9 9.5 4.7 12 7.4c2.5-2.7 5.1-3.5 7.4-2.34 3 1.54 3.74 4.96 1.93 7.74C18.7 16.65 12 21 12 21Z" />
  </svg>
)

export default function ProfileMenu({ firstName }) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)
  const dispatch = useDispatch()

  useEffect(() => {
    if (!isOpen) return

    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  function close() {
    setIsOpen(false)
  }

  function handleLogout() {
    dispatch(logout())
    close()
  }

  return (
    <div className="position-relative" ref={containerRef}>
      <button
        type="button"
        className="btn btn-link text-white text-decoration-none d-flex flex-column align-items-center p-0 border-0"
        title="Profile"
        onClick={() => setIsOpen((open) => !open)}
      >
        {profileIcon}
        <span className="small">{firstName}</span>
      </button>
      {isOpen && (
        <div
          className="position-absolute end-0 mt-2 bg-white text-dark rounded shadow-lg p-3"
          style={{ minWidth: '200px', zIndex: 1060 }}
        >
          <p className="fw-bold mb-2">Hello {firstName},</p>
          <Link
            to="/profile"
            className="d-flex align-items-center gap-2 text-dark text-decoration-none py-1"
            onClick={close}
          >
            {profileIconSmall} Profile
          </Link>
          <Link
            to="/orders"
            className="d-flex align-items-center gap-2 text-dark text-decoration-none py-1"
            onClick={close}
          >
            {ordersIconSmall} My Orders
          </Link>
          <Link
            to="/wishlist"
            className="d-flex align-items-center gap-2 text-dark text-decoration-none py-1"
            onClick={close}
          >
            {wishlistIconSmall} Wishlist
          </Link>
          <button
            type="button"
            className="btn btn-outline-danger btn-sm w-100 mt-2"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  )
}
