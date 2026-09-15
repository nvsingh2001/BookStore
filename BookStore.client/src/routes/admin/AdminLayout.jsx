import { Outlet, Link } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../features/admin/adminSlice'

export default function AdminLayout() {
  const dispatch = useDispatch()
  const admin = useSelector((state) => state.admin.admin)

  return (
    <div className="d-flex flex-column min-vh-100">
      <nav className="navbar navbar-dark bg-primary">
        <div className="container-fluid">
          <Link to="/admin/products" className="navbar-brand mb-0">
            <img src="/assets/education.svg" alt="Logo" className="d-inline-block align-text-top" />
            BookStore Admin
          </Link>
          <div className="d-flex align-items-center gap-3 text-white">
            <Link to="/admin/products" className="text-white text-decoration-none small">
              Products
            </Link>
            <Link to="/admin/admins/new" className="text-white text-decoration-none small">
              Add Admin
            </Link>
            <span className="small">{admin?.fullName}</span>
            <button
              type="button"
              className="btn btn-outline-light btn-sm"
              onClick={() => dispatch(logout())}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      <main className="flex-grow-1 bg-light">
        <Outlet />
      </main>
    </div>
  )
}
