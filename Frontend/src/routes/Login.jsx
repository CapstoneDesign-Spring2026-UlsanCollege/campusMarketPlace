import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { apiRequest } from '../services/api'

export default function Login({ onAuthChange }) {
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

      localStorage.setItem('campusMarketplaceToken', response.token)
      localStorage.setItem('campusMarketplaceUser', JSON.stringify(response.user))
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
        <p className="eyebrow">Welcome back</p>
        <h1>Login</h1>
        <p className="subcopy">Use the same campus email and password you created during signup.</p>

        {submitStatus.message && (
          <p className={`form-message ${submitStatus.type}`} role="alert">
            {submitStatus.message}
          </p>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              name="email"
              placeholder="student@office.uc.ac.kr"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <label>
            Password
            <div className="input-with-action">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Enter your password"
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
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </label>
          <button className="button button-primary" type="submit" disabled={isLoading}>
            {isLoading ? 'Logging in…' : 'Login'}
          </button>
        </form>
      </section>
    </main>
  )
}