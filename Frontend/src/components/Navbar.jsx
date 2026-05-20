import { useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import Avatar from './Avatar'
import { CATEGORIES } from '../constants/categories'
import { clearAuthSession } from '../services/auth'
import { t } from '../services/i18n'

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
  const currentLangLabel = LANGUAGE_OPTIONS.find((o) => o.value === language)?.label || language

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
              <div className="currency-hamburger-wrapper" style={{position: 'absolute', right: 12, top: 12, display: 'flex', alignItems: 'center', gap: 8}}>
                <button
                  className="currency-hamburger"
                  aria-label={t(language, 'navbar.language')}
                  type="button"
                  onClick={toggleLanguageMenu}
                >
                  <span aria-hidden style={{display: 'inline-block', marginRight: 6, fontSize: '0.82rem', fontWeight: 600}}>{t(language, 'navbar.language')}</span>
                  <span aria-hidden style={{display: 'inline-flex', flexDirection: 'column', gap: 3}}>
                    <span style={{display: 'block', width: 14, height: 2, background: 'currentColor'}} />
                    <span style={{display: 'block', width: 14, height: 2, background: 'currentColor'}} />
                    <span style={{display: 'block', width: 14, height: 2, background: 'currentColor'}} />
                  </span>
                </button>
                <div className="language-indicator" aria-hidden style={{fontSize: '0.82rem', fontWeight: 600}}>{currentLangLabel}</div>

                  {languageMenuOpen && (
                  <div
                    className="currency-menu"
                    role="menu"
                    aria-label={t(language, 'navbar.language')}
                  >
                    <div className="menu-section">
                      <div className="menu-section-title">{t(language, 'navbar.language')}</div>
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
                  {t(language, 'navbar.home')}
                </button>
                <button className="nav-pill" type="button" onClick={handleSearch}>
                  {t(language, 'navbar.search')}
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
                    {t(language, 'navbar.messages')}
                  </button>
                )}
                <button className="nav-pill" type="button" onClick={() => navigate('/dashboard', { state: { mode: 'buy' } })}>
                  {t(language, 'navbar.buy')}
                </button>
                <button className="nav-pill" type="button" onClick={() => navigate('/dashboard', { state: { mode: 'sell' } })}>
                  {t(language, 'navbar.sell')}
                </button>
                {isAuthenticated && (
                  <button className="nav-pill" type="button" onClick={handleProfile} style={{display: 'flex', alignItems: 'center', gap: 8}}>
                    <Avatar src={authUser?.avatarUrl || authUser?.avatar} alt={authUser?.firstName || 'You'} size={28} />
                    {t(language, 'navbar.profile')}
                  </button>
                )}
                <button className="nav-signout" type="button" onClick={handleSignOut}>
                  {t(language, 'navbar.signOut')}
                </button>
              </>
            ) : (
              <>
                <NavLink to="/" end>
                  {t(language, 'navbar.home')}
                </NavLink>
                {isAuthenticated ? <NavLink to="/profile">{t(language, 'navbar.profile')}</NavLink> : <NavLink to="/login">Login</NavLink>}
                {!isAuthenticated ? <NavLink to="/signup">Sign Up</NavLink> : null}
                {isAuthenticated ? (
                  <button className="nav-signout" type="button" onClick={handleSignOut}>
                    {t(language, 'navbar.signOut')}
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
            <p className="eyebrow">{t(language, 'navbar.signOut')}</p>
            <h2 id="signout-title">{t(language, 'navbar.signOutTitle')}</h2>
            <p className="subcopy">{t(language, 'navbar.signOutBody')}</p>

            <div className="modal-actions">
              <button className="button button-secondary" type="button" onClick={cancelSignOut}>
                {t(language, 'navbar.stay')}
              </button>
              <button className="button button-primary" type="button" onClick={confirmSignOut}>
                {t(language, 'navbar.confirmSignOut')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}