import { useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { CURRENCY_OPTIONS } from '../services/currency'

export default function Navbar({
  currency,
  onCurrencyChange,
  language,
  onLanguageChange,
  isAuthenticated,
  onAuthChange,
}) {
  const location = useLocation()
  const navigate = useNavigate()
  const isDashboard = location.pathname === '/dashboard'
  // Show the authenticated (dashboard-style) nav when user is signed in
  const showAuthNav = isDashboard || isAuthenticated
  const [showSignOutModal, setShowSignOutModal] = useState(false)
  const [currencyMenuOpen, setCurrencyMenuOpen] = useState(false)
  const [searchMenuOpen, setSearchMenuOpen] = useState(false)

  const STORIES = ['Engineering', 'Dorm Deals', 'Books']

  function handleHome() {
    if (isDashboard) {
      window.location.reload()
      return
    }

    // If the user is authenticated, keep them inside the authenticated
    // dashboard experience instead of sending them back to the public home
    // page. Only unauthenticated users are routed to the public `/` home.
    if (isAuthenticated) {
      navigate('/dashboard')
      return
    }

    navigate('/')
  }

  function handleProfile() {
    navigate('/profile')
  }

  function handleSearch() {
    // Toggle the search/story menu instead of focusing the composer directly
    setSearchMenuOpen((s) => !s)
  }

  function handleSignOut() {
    setShowSignOutModal(true)
  }

  function confirmSignOut() {
    setShowSignOutModal(false)

    localStorage.removeItem('campusMarketplaceToken')
    localStorage.removeItem('campusMarketplaceUser')
    if (typeof onAuthChange === 'function') {
      onAuthChange()
    }
    navigate('/', { replace: true })
  }

  function cancelSignOut() {
    setShowSignOutModal(false)
  }

  function toggleCurrencyMenu() {
    setCurrencyMenuOpen((s) => !s)
  }

  function handleCurrencySelect(value) {
    onCurrencyChange(value)
    setCurrencyMenuOpen(false)
  }

  function handleLanguageSelect(value) {
    if (typeof onLanguageChange === 'function') {
      onLanguageChange(value)
    }
    setCurrencyMenuOpen(false)
  }

  return (
    <>
      <header className="topbar">
        <div className="brand-row" style={{ position: 'relative' }}>
          <Link className="brand" to="/">
            UC Marketplace
          </Link>
          <nav className="nav-links" aria-label="Primary">
              <div className="currency-hamburger-wrapper" style={{position: 'absolute', right: 12, top: 12}}>
                <button
                  className="currency-hamburger"
                  aria-label="Open account preferences menu"
                  type="button"
                  onClick={toggleCurrencyMenu}
                >
                  <span aria-hidden style={{display: 'block', width: 18, height: 2, background: 'currentColor', margin: '3px 0'}} />
                  <span aria-hidden style={{display: 'block', width: 18, height: 2, background: 'currentColor', margin: '3px 0'}} />
                  <span aria-hidden style={{display: 'block', width: 18, height: 2, background: 'currentColor', margin: '3px 0'}} />
                </button>

                  {currencyMenuOpen && (
                  <div
                    className="currency-menu"
                    role="menu"
                    aria-label="Currency and language options"
                  >
                    <div className="menu-section">
                      <div className="menu-section-title">Currency</div>
                      <button className="currency-menu-item" type="button" onClick={() => handleCurrencySelect(CURRENCY_OPTIONS.KRW)} aria-pressed={currency === CURRENCY_OPTIONS.KRW}>
                        KRW (₩)
                      </button>
                      <button className="currency-menu-item" type="button" onClick={() => handleCurrencySelect(CURRENCY_OPTIONS.USD)} aria-pressed={currency === CURRENCY_OPTIONS.USD}>
                        USD ($)
                      </button>
                    </div>

                    <div className="menu-section" style={{borderTop: '1px solid rgba(255,255,255,0.04)', marginTop: 6, paddingTop: 6}}>
                      <div className="menu-section-title">Language</div>
                      <button className="currency-menu-item" type="button" onClick={() => handleLanguageSelect('en')} aria-pressed={language === 'en'}>
                        English
                      </button>
                      <button className="currency-menu-item" type="button" onClick={() => handleLanguageSelect('ko')} aria-pressed={language === 'ko'}>
                        한국어
                      </button>
                    </div>
                  </div>
                )}
              </div>
            {showAuthNav ? (
              <>
                <button className="nav-pill" type="button" onClick={handleHome}>
                  Home
                </button>
                <button className="nav-pill" type="button" onClick={handleSearch}>
                  Search
                </button>
                {searchMenuOpen && (
                  <div className="search-menu" role="menu" aria-label="Quick categories">
                    {STORIES.map((s) => (
                      <button
                        key={s}
                        type="button"
                        className="currency-menu-item"
                        onClick={() => {
                          setSearchMenuOpen(false)
                          navigate(`/browse?category=${encodeURIComponent(s)}`)
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
                {isAuthenticated && (
                  <button className="nav-pill" type="button" onClick={handleProfile}>
                    Profile
                  </button>
                )}
                {isAuthenticated && (
                  <button className="nav-pill" type="button" onClick={() => navigate('/messages')}>
                    Messages
                  </button>
                )}
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
                {isAuthenticated ? <NavLink to="/profile">Profile</NavLink> : <NavLink to="/login">Login</NavLink>}
                {!isAuthenticated ? <NavLink to="/signup">Sign Up</NavLink> : null}
                {isAuthenticated ? (
                  <button className="nav-signout" type="button" onClick={handleSignOut}>
                    Sign Out
                  </button>
                ) : null}
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