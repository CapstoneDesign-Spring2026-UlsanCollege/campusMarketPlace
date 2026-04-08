import { Link, NavLink } from 'react-router-dom'

export default function Navbar() {
  return (
    <header className="topbar">
      <div className="brand-row">
        <Link className="brand" to="/">
          UC Marketplace
        </Link>
        <nav className="nav-links" aria-label="Primary">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/login">Login</NavLink>
          <NavLink to="/signup">Sign Up</NavLink>
        </nav>
      </div>
    </header>
  )
}