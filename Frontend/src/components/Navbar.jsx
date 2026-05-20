import { useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import Avatar from './Avatar'
import { CATEGORIES } from '../constants/categories'
import { clearAuthSession } from '../services/auth'

const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English', description: 'Default' },
  { value: 'ko', label: 'Korean' },
  { value: 'ne', label: 'Nepali' },
  { value: 'hi', label: 'Hindi' },
]

export default function Navbar({
  language,
  onLanguageChange,
  isAuthenticated,
  authUser,
  onAuthChange,
}) {
  const location = useLocation()
  const navigate = useNavigate()
  const isDashboard = location.pathname === '/dashboard'
  // Show the authenticated (dashboard-style) nav when user is signed in
  const showAuthNav = isDashboard || isAuthenticated
  const [showSignOutModal, setShowSignOutModal] = useState(false)
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false)
  const [searchMenuOpen, setSearchMenuOpen] = useState(false)

  function handleHome() {
    if (isDashboard) {
      window.location.reload()
      return
    }

    // If the user is authenticated, keep them inside the authenticated
    // dashboard experience and show the full marketplace (home mode).
    if (isAuthenticated) {
      navigate('/dashboard', { state: { mode: 'home' } })
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

    clearAuthSession()
    if (typeof onAuthChange === 'function') {
      onAuthChange()
    }
    navigate('/', { replace: true })
  }

  function cancelSignOut() {
    setShowSignOutModal(false)
  }

  function handleLanguageSelect(value) {
    if (typeof onLanguageChange === 'function') {
      onLanguageChange(value)
    }
    setLanguageMenuOpen(false)
  }

  function toggleLanguageMenu() {
    setLanguageMenuOpen((s) => !s)
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
                  aria-label="Open language menu"
                  type="button"
                  onClick={toggleLanguageMenu}
                >
                  <span aria-hidden style={{display: 'inline-block', marginRight: 6, fontSize: '0.82rem', fontWeight: 600}}>Language</span>
                  <span aria-hidden style={{display: 'inline-flex', flexDirection: 'column', gap: 3}}>
                    <span style={{display: 'block', width: 14, height: 2, background: 'currentColor'}} />
                    <span style={{display: 'block', width: 14, height: 2, background: 'currentColor'}} />
                    <span style={{display: 'block', width: 14, height: 2, background: 'currentColor'}} />
                  </span>
                </button>

                  {languageMenuOpen && (
                  <div
                    className="currency-menu"
                    role="menu"
                    aria-label="Language options"
                  >
                    <div className="menu-section">
                      <div className="menu-section-title">Language</div>
                      {LANGUAGE_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          className="currency-menu-item"
                          type="button"
                          onClick={() => handleLanguageSelect(option.value)}
                          aria-pressed={language === option.value}
                        >
                          {option.label}
                          {option.description ? ` (${option.description})` : ''}
                        </button>
                      ))}
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
                    {CATEGORIES.map((s) => (
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
                  <button className="nav-pill" type="button" onClick={() => navigate('/messages')}>
                    Messages
                  </button>
                )}
                <button className="nav-pill" type="button" onClick={() => navigate('/dashboard', { state: { mode: 'buy' } })}>
                  Buy
                </button>
                <button className="nav-pill" type="button" onClick={() => navigate('/dashboard', { state: { mode: 'sell' } })}>
                  Sell
                </button>
                {isAuthenticated && (
                  <button className="nav-pill" type="button" onClick={handleProfile} style={{display: 'flex', alignItems: 'center', gap: 8}}>
                    <Avatar src={authUser?.avatarUrl || authUser?.avatar} alt={authUser?.firstName || 'You'} size={28} />
                    Profile
                  </button>
                )}
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