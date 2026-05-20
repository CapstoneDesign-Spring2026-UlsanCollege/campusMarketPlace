import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import Home from './routes/Home'
import Browse from './routes/Browse'
import Login from './routes/Login'
import Signup from './routes/Signup'
import Dashboard from './routes/Dashboard'
import Messages from './routes/Messages'
import Profile from './routes/Profile'
import EditProfile from './routes/EditProfile'
import ChangePassword from './routes/ChangePassword'
import { CURRENCY_OPTIONS, DEFAULT_CURRENCY } from './services/currency'
import { readAuthSession } from './services/auth'

const CURRENCY_STORAGE_KEY = 'campusMarketplaceCurrency'
const LANGUAGE_STORAGE_KEY = 'campusMarketplaceLanguage'

export default function App() {
  const [authSession, setAuthSession] = useState(readAuthSession)
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

  useEffect(() => {
    localStorage.setItem(CURRENCY_STORAGE_KEY, currency)
  }, [currency])

  useEffect(() => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
  }, [language])

  function refreshAuthSession() {
    setAuthSession(readAuthSession())
  }

  return (
    <div className="app-shell">
      <Navbar
        currency={currency}
        onCurrencyChange={setCurrency}
        language={language}
        onLanguageChange={setLanguage}
        isAuthenticated={Boolean(authSession.token)}
        onAuthChange={refreshAuthSession}
      />
      <Routes>
        <Route path="/" element={authSession.token ? <Home /> : <Navigate to="/login" replace state={{ message: 'Please log in first.' }} />} />
        <Route
          path="/browse"
          element={authSession.token ? <Browse currency={currency} /> : <Navigate to="/login" replace state={{ message: 'Please log in first.' }} />}
        />
        <Route path="/login" element={<Login onAuthChange={refreshAuthSession} />} />
        <Route path="/signup" element={<Signup onAuthChange={refreshAuthSession} />} />
        <Route
          path="/dashboard"
          element={authSession.token ? <Dashboard currency={currency} /> : <Navigate to="/login" replace state={{ message: 'Please log in first.' }} />}
        />
        <Route
          path="/messages"
          element={authSession.token ? <Messages /> : <Navigate to="/login" replace state={{ message: 'Please log in first.' }} />}
        />
        <Route
          path="/profile"
          element={
            authSession.token ? (
              <Profile currency={currency} />
            ) : (
              <Navigate to="/login" replace state={{ message: 'Please log in first.' }} />
            )
          }
        />
        <Route
          path="/profile/edit"
          element={
            authSession.token ? (
              <EditProfile />
            ) : (
              <Navigate to="/login" replace state={{ message: 'Please log in first.' }} />
            )
          }
        />
        <Route
          path="/profile/change-password"
          element={
            authSession.token ? (
              <ChangePassword />
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