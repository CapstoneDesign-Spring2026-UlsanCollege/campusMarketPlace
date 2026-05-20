import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { apiRequest } from '../services/api'
import { saveAuthSession } from '../services/auth'
import { t } from '../services/i18n'

export default function Login({ language = 'en', onAuthChange }) {
  const navigate = useNavigate()
  const location = useLocation()
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
        message: error.message || 'Login failed. Please check your credentials.',
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
                aria-label={showPassword ? 'Hide password' : 'Show password'}
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