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
import { CURRENCY_OPTIONS, DEFAULT_CURRENCY } from './services/currency'

const CURRENCY_STORAGE_KEY = 'campusMarketplaceCurrency'
const LANGUAGE_STORAGE_KEY = 'campusMarketplaceLanguage'

function readAuthSession() {
  const token = localStorage.getItem('campusMarketplaceToken')
  const userRaw = localStorage.getItem('campusMarketplaceUser')

  let user = null
  if (userRaw) {
    try {
      user = JSON.parse(userRaw)
    } catch {
      user = null
    }
  }

  return { token, user }
}

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
        <Route path="/" element={<Home />} />
        <Route path="/browse" element={<Browse currency={currency} />} />
        <Route path="/login" element={<Login onAuthChange={refreshAuthSession} />} />
        <Route path="/signup" element={<Signup onAuthChange={refreshAuthSession} />} />
        <Route path="/dashboard" element={<Dashboard currency={currency} />} />
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
      </Routes>
      <Footer />
    </div>
  )
}