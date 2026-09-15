import { Outlet, Link } from 'react-router'
import Header from '../components/Header'

export default function Layout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <footer className="bg-dark text-white py-3">
        <div className="container d-flex justify-content-between align-items-center flex-wrap gap-2">
          <span>Copyright &copy; 2026, BookStore. All Rights Reserved.</span>
          <Link to="/admin/login" className="text-white-50 small">
            Admin Login
          </Link>
        </div>
      </footer>
    </div>
  )
}
