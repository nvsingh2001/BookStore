import { Outlet } from 'react-router'
import Header from '../components/Header'

export default function Layout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <footer className="bg-dark text-white text-center py-3">
        Copyright &copy; 2026, BookStore. All Rights Reserved.
      </footer>
    </div>
  )
}
