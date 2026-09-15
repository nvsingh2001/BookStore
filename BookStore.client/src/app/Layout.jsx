import { Outlet, Link } from 'react-router'
import Header from '../components/Header'

export default function Layout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <footer className="bg-dark text-white text-center py-3">
        Copyright &copy; 2026, BookStore. All Rights Reserved.{' '}
        <Link to="/admin/login" className="text-white-50 small">
          Admin Login
        </Link>
      </footer>
    </div>
  )
}
