import { useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { CURRENCY_OPTIONS } from '../services/currency'

export default function Navbar({ currency, onCurrencyChange }) {
  const location = useLocation()
  const navigate = useNavigate()
  const isDashboard = location.pathname === '/dashboard'
  const [showSignOutModal, setShowSignOutModal] = useState(false)

  function handleHome() {
    if (isDashboard) {
      window.location.reload()
      return
    }

    navigate('/')
  }

  function handleProfile() {
    const profileElement = document.getElementById('profile')
    if (profileElement) {
      profileElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  function handleSearch() {
    const composerButton = document.querySelector('.composer-input')
    if (composerButton instanceof HTMLElement) {
      composerButton.focus()
      composerButton.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  function handleSignOut() {
    setShowSignOutModal(true)
  }

  function confirmSignOut() {
    setShowSignOutModal(false)

    localStorage.removeItem('campusMarketplaceToken')
    localStorage.removeItem('campusMarketplaceUser')
    navigate('/', { replace: true })
  }

  function cancelSignOut() {
    setShowSignOutModal(false)
  }

  return (
    <>
      <header className="topbar">
        <div className="brand-row">
          <Link className="brand" to="/">
            UC Marketplace
          </Link>
          <nav className="nav-links" aria-label="Primary">
            <label className="currency-select-wrapper" aria-label="Select currency">
              <span>Currency</span>
              <select
                className="currency-select"
                value={currency}
                onChange={(event) => onCurrencyChange(event.target.value)}
              >
                <option value={CURRENCY_OPTIONS.USD}>USD ($)</option>
                <option value={CURRENCY_OPTIONS.KRW}>KRW (₩)</option>
              </select>
            </label>
            {isDashboard ? (
              <>
                <button className="nav-pill" type="button" onClick={handleHome}>
                  Home
                </button>
                <button className="nav-pill" type="button" onClick={handleProfile}>
                  Profile
                </button>
                <button className="nav-pill" type="button" onClick={handleSearch}>
                  Search
                </button>
                <button className="nav-pill" type="button" onClick={() => navigate('/dashboard')}>
                  Buy
                </button>
                <button className="nav-pill" type="button" onClick={() => navigate('/dashboard')}>
                  Sell
                </button>
                <button className="nav-signout" type="button" onClick={handleSignOut}>
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <NavLink to="/" end>
                  Home
                </NavLink>
                <NavLink to="/browse">Browse</NavLink>
                <NavLink to="/login">Login</NavLink>
                <NavLink to="/signup">Sign Up</NavLink>
              </>
            )}
          </nav>
        </div>
      </header>

      {showSignOutModal && (
        <div className="modal-backdrop" role="presentation" onClick={cancelSignOut}>
          <div className="signout-modal" role="dialog" aria-modal="true" aria-labelledby="signout-title" onClick={(event) => event.stopPropagation()}>
            <p className="eyebrow">Sign Out</p>
            <h2 id="signout-title">Do you really want to sign out?</h2>
            <p className="subcopy">You can come back anytime by logging in again.</p>

            <div className="modal-actions">
              <button className="button button-secondary" type="button" onClick={cancelSignOut}>
                No, stay here
              </button>
              <button className="button button-primary" type="button" onClick={confirmSignOut}>
                Yes, sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}