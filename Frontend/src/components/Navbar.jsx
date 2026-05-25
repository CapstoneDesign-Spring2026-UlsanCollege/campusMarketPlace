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
  const dashboardMode = location.state?.mode
  // Show the authenticated (dashboard-style) nav when user is signed in
  const showAuthNav = isDashboard || isAuthenticated
  const [showSignOutModal, setShowSignOutModal] = useState(false)
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false)
  const [searchMenuOpen, setSearchMenuOpen] = useState(false)
  const currentLangLabel = LANGUAGE_OPTIONS.find((o) => o.value === language)?.label || language

  const isDashboardHomeActive = isDashboard && !dashboardMode
  const isBuyActive = isDashboard && dashboardMode === 'buy'
  const isSellActive = isDashboard && dashboardMode === 'sell'
  const isHomeActive = (!isAuthenticated && location.pathname === '/') || isDashboardHomeActive
  const isMessagesActive = location.pathname === '/messages'
  const isProfileActive = location.pathname === '/profile'
  const isLoginActive = location.pathname === '/login'
  const isSignupActive = location.pathname === '/signup'

  const iconLabels = {
    home: '⌂',
    search: '⌕',
    messages: '✉',
    buy: '◌',
    sell: '+',
    profile: '◍',
    login: '↪',
    signup: '＋',
    signout: '⇢',
  }

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

  function renderLabeledContent(icon, label) {
    return (
      <>
        <span className="nav-action-icon" aria-hidden="true">{icon}</span>
        <span className="nav-action-label">{label}</span>
      </>
    )
  }

  function renderActionButton({ className = 'nav-pill', icon, label, onClick, active = false }) {
    return (
      <button className={`${className}${active ? ' is-active' : ''}`} type="button" onClick={onClick} aria-label={label} aria-current={active ? 'page' : undefined}>
        {renderLabeledContent(icon, label)}
      </button>
    )
  }

  function renderActionLink({ to, end, icon, label, noIcon = false }) {
    return (
      <NavLink to={to} end={end} aria-label={label} className={({ isActive }) => `nav-link-item${isActive ? ' is-active' : ''}`}>
        {noIcon ? <span className="nav-action-label">{label}</span> : renderLabeledContent(icon, label)}
      </NavLink>
    )
  }

  function renderPrimaryActions() {
    return (
      <>
        {showAuthNav ? (
          <>
            {renderActionButton({ className: 'nav-pill', icon: iconLabels.home, label: t(language, 'navbar.home'), onClick: handleHome, active: isHomeActive })}
            {renderActionButton({ className: 'nav-pill', icon: iconLabels.search, label: t(language, 'navbar.search'), onClick: handleSearch })}
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
              renderActionButton({ className: 'nav-pill', icon: iconLabels.messages, label: t(language, 'navbar.messages'), onClick: () => navigate('/messages'), active: isMessagesActive })
            )}
            {renderActionButton({ className: 'nav-pill', icon: iconLabels.buy, label: t(language, 'navbar.buy'), onClick: () => navigate('/dashboard', { state: { mode: 'buy' } }), active: isBuyActive })}
            {renderActionButton({ className: 'nav-pill', icon: iconLabels.sell, label: t(language, 'navbar.sell'), onClick: () => navigate('/dashboard', { state: { mode: 'sell' } }), active: isSellActive })}
            {isAuthenticated && (
              <button className={`nav-pill nav-profile-pill${isProfileActive ? ' is-active' : ''}`} type="button" onClick={handleProfile} aria-label={t(language, 'navbar.profile')} aria-current={isProfileActive ? 'page' : undefined}>
                <Avatar src={authUser?.avatarUrl || authUser?.avatar} alt={authUser?.firstName || 'You'} size={28} />
                <span className="nav-action-label">{t(language, 'navbar.profile')}</span>
              </button>
            )}
            {renderActionButton({ className: 'nav-signout', icon: iconLabels.signout, label: t(language, 'navbar.signOut'), onClick: handleSignOut })}
          </>
        ) : (
          <>
            {renderActionLink({ to: '/', end: true, icon: iconLabels.home, label: t(language, 'navbar.home') })}
            {isAuthenticated ? renderActionLink({ to: '/profile', icon: iconLabels.profile, label: t(language, 'navbar.profile') }) : renderActionLink({ to: '/login', icon: iconLabels.login, label: 'Login', noIcon: true })}
            {!isAuthenticated ? renderActionLink({ to: '/signup', icon: iconLabels.signup, label: 'Sign Up', noIcon: true }) : null}
            {isAuthenticated ? (
              renderActionButton({ className: 'nav-signout', icon: iconLabels.signout, label: t(language, 'navbar.signOut'), onClick: handleSignOut })
            ) : null}
          </>
        )}
      </>
    )
  }

  return (
    <>
      <header className="topbar">
        <div className="brand-row" style={{ position: 'relative' }}>
          <Link className="brand" to="/">
            UC Market
          </Link>
          <nav className="nav-links" aria-label="Primary">
            <div className="currency-hamburger-wrapper">
              <button
                className="currency-hamburger"
                aria-label={t(language, 'navbar.language')}
                type="button"
                onClick={toggleLanguageMenu}
              >
                <span aria-hidden style={{ display: 'inline-flex', flexDirection: 'column', gap: 3 }}>
                  <span style={{ display: 'block', width: 14, height: 2, background: 'currentColor' }} />
                  <span style={{ display: 'block', width: 14, height: 2, background: 'currentColor' }} />
                  <span style={{ display: 'block', width: 14, height: 2, background: 'currentColor' }} />
                </span>
              </button>
              <div className="language-indicator" aria-hidden>
                {currentLangLabel}
              </div>

              {languageMenuOpen && (
                <div className="currency-menu" role="menu" aria-label={t(language, 'navbar.language')}>
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
            {renderPrimaryActions()}
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