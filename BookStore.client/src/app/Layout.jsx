import { Outlet } from 'react-router'
import Header from '../components/Header'

export default function Layout() {
  return (
    <>
      <Header />
      <Outlet />
      <footer className="text-center text-secondary py-4">&copy; 2026 Bookstore</footer>
    </>
  )
}
