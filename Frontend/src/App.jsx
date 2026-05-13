import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import Home from './routes/Home'
import Browse from './routes/Browse'
import Login from './routes/Login'
import Signup from './routes/Signup'
import Dashboard from './routes/Dashboard'
import { CURRENCY_OPTIONS, DEFAULT_CURRENCY } from './services/currency'

const CURRENCY_STORAGE_KEY = 'campusMarketplaceCurrency'
const LANGUAGE_STORAGE_KEY = 'campusMarketplaceLanguage'

export default function App() {
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

  return (
    <div className="app-shell">
      <Navbar currency={currency} onCurrencyChange={setCurrency} language={language} onLanguageChange={setLanguage} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/browse" element={<Browse currency={currency} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard currency={currency} />} />
      </Routes>
      <Footer />
    </div>
  )
}