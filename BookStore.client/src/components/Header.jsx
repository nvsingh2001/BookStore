import { useRef } from 'react'
import { Link } from 'react-router'

export default function Header() {
  const searchRef = useRef(null)

  function handleSearchSubmit(e) {
    e.preventDefault()
    const query = searchRef.current.value
    // TODO
    console.log(query)
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
      </div>
    </nav>
  )
}
