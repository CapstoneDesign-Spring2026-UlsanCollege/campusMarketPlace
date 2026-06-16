import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import Home from './routes/Home'
import Browse from './routes/Browse'
import Search from './routes/Search'
import Login from './routes/Login'
import Signup from './routes/Signup'
import Dashboard from './routes/Dashboard'
import ItemDetail from './routes/ItemDetail'
import Messages from './routes/Messages'
import Profile from './routes/Profile'
import PublicProfile from './routes/PublicProfile'
import EditProfile from './routes/EditProfile'
import ChangePassword from './routes/ChangePassword'
import { CURRENCY_OPTIONS, DEFAULT_CURRENCY } from './services/currency'
import { readAuthSession } from './services/auth'

const CURRENCY_STORAGE_KEY = 'campusMarketplaceCurrency'
const LANGUAGE_STORAGE_KEY = 'campusMarketplaceLanguage'
const DARK_MODE_STORAGE_KEY = 'campusMarketplaceDarkMode'

export default function App() {
  const [authSession, setAuthSession] = useState(readAuthSession)
  const [marketQuery, setMarketQuery] = useState('')
  const [currency, setCurrency] = useState(() => {
    const savedCurrency = localStorage.getItem(CURRENCY_STORAGE_KEY)
    if (savedCurrency === CURRENCY_OPTIONS.USD || savedCurrency === CURRENCY_OPTIONS.KRW) {
      return savedCurrency
    }
    return DEFAULT_CURRENCY
  })

  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY)
    return saved || 'en'
  })

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem(DARK_MODE_STORAGE_KEY)
    if (saved !== null) {
      return saved === 'true'
    }
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return false
  })

  useEffect(() => {
    localStorage.setItem(CURRENCY_STORAGE_KEY, currency)
  }, [currency])

  useEffect(() => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
  }, [language])

  useEffect(() => {
    localStorage.setItem(DARK_MODE_STORAGE_KEY, isDarkMode)
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  function refreshAuthSession() {
    setAuthSession(readAuthSession())
  }

  return (
    <div className="app-shell">
      <Navbar
        currency={currency}
        language={language}
        onLanguageChange={setLanguage}
        isDarkMode={isDarkMode}
        onDarkModeChange={setIsDarkMode}
        isAuthenticated={Boolean(authSession.token)}
        authUser={authSession.user}
        onAuthChange={refreshAuthSession}
      />
      <Routes>
        <Route path="/" element={authSession.token ? <Navigate to="/dashboard" replace /> : <Home language={language} />} />
        <Route
          path="/browse"
          element={authSession.token ? <Browse currency={currency} language={language} /> : <Navigate to="/login" replace state={{ message: 'Please log in first.' }} />}
        />
        <Route
          path="/search"
          element={authSession.token ? <Search currency={currency} language={language} marketQuery={marketQuery} onMarketQueryChange={setMarketQuery} /> : <Navigate to="/login" replace state={{ message: 'Please log in first.' }} />}
        />
        <Route path="/login" element={<Login language={language} onAuthChange={refreshAuthSession} />} />
        <Route path="/signup" element={<Signup language={language} onAuthChange={refreshAuthSession} />} />
        <Route
          path="/dashboard"
          element={authSession.token ? (
            <Dashboard currency={currency} language={language} marketQuery={marketQuery} onMarketQueryChange={setMarketQuery} />
          ) : (
            <Navigate to="/login" replace state={{ message: 'Please log in first.' }} />
          )}
        />
        <Route path="/item/:id" element={<ItemDetail currency={currency} language={language} />} />
        <Route
          path="/messages"
          element={authSession.token ? <Messages language={language} /> : <Navigate to="/login" replace state={{ message: 'Please log in first.' }} />}
        />
        <Route path="/profile/:id" element={<PublicProfile currency={currency} language={language} />} />
        <Route
          path="/profile"
          element={
            authSession.token ? (
              <Profile currency={currency} language={language} />
            ) : (
              <Navigate to="/login" replace state={{ message: 'Please log in first.' }} />
            )
          }
        />
        <Route
          path="/profile/edit"
          element={
            authSession.token ? (
              <EditProfile language={language} />
            ) : (
              <Navigate to="/login" replace state={{ message: 'Please log in first.' }} />
            )
          }
        />
        <Route
          path="/profile/change-password"
          element={
            authSession.token ? (
              <ChangePassword language={language} />
            ) : (
              <Navigate to="/login" replace state={{ message: 'Please log in first.' }} />
            )
          }
        />
      </Routes>
      <Footer />
    </div>
  )
}
