import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { apiRequest } from '../services/api'
import { saveAuthSession } from '../services/auth'
import { t } from '../services/i18n'

const LOGIN_COPY = {
  en: {
    loginFailed: 'Login failed. Please check your credentials.',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
  },
  ko: {
    loginFailed: '로그인에 실패했습니다. 자격 증명을 확인하세요.',
    showPassword: '비밀번호 표시',
    hidePassword: '비밀번호 숨기기',
  },
  ne: {
    loginFailed: 'लगइन असफल भयो। कृपया तपाईंका विवरणहरू जाँच गर्नुहोस्।',
    showPassword: 'पासवर्ड देखाउनुहोस्',
    hidePassword: 'पासवर्ड लुकाउनुहोस्',
  },
  hi: {
    loginFailed: 'लॉगिन विफल रहा। कृपया अपनी जानकारी जांचें।',
    showPassword: 'पासवर्ड दिखाएँ',
    hidePassword: 'पासवर्ड छिपाएँ',
  },
}

export default function Login({ language = 'en', onAuthChange }) {
  const navigate = useNavigate()
  const location = useLocation()
  const copy = LOGIN_COPY[language] || LOGIN_COPY.en
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState(location.state?.email || '')
  const [password, setPassword] = useState('')
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: location.state?.message || '' })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (location.state?.message) {
      setSubmitStatus({ type: 'success', message: location.state.message })
    }
  }, [location.state])

  async function handleSubmit(event) {
    event.preventDefault()

    setIsLoading(true)
    try {
      const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })

      saveAuthSession(response.token, response.user)
      if (typeof onAuthChange === 'function') {
        onAuthChange()
      }
      navigate('/dashboard', { replace: true })
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: error.message || copy.loginFailed,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="page-shell form-shell">
      <section className="panel auth-panel">
        <p className="eyebrow">{t(language, 'login.welcome')}</p>
        <h1>{t(language, 'login.title')}</h1>
        <p className="subcopy">{t(language, 'login.subcopy')}</p>

        {submitStatus.message && (
          <p className={`form-message ${submitStatus.type}`} role="alert">
            {submitStatus.message}
          </p>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            {t(language, 'login.email')}
            <input
              type="email"
              name="email"
              placeholder={t(language, 'login.emailPlaceholder')}
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <label>
            {t(language, 'login.password')}
            <div className="input-with-action">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder={t(language, 'login.passwordPlaceholder')}
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <button
                type="button"
                className="toggle-visibility"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? copy.hidePassword : copy.showPassword}
              >
                {showPassword ? t(language, 'login.hide') : t(language, 'login.show')}
              </button>
            </div>
          </label>
          <button className="button button-primary" type="submit" disabled={isLoading}>
            {isLoading ? t(language, 'login.submitting') : t(language, 'login.submit')}
          </button>
        </form>
      </section>
    </main>
  )
}