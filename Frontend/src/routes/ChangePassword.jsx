import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { changePassword } from '../services/api'

export default function ChangePassword() {
  const navigate = useNavigate()
  const [currentPassword, setCurrentPassword] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setMessage({ type: '', text: '' })

    if (!currentPassword) {
      setMessage({ type: 'error', text: 'Current password is required.' })
      return
    }

    if (!password) {
      setMessage({ type: 'error', text: 'New password is required.' })
      return
    }

    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' })
      return
    }

    setIsLoading(true)
    try {
      await changePassword(password, currentPassword)
      setMessage({ type: 'success', text: 'Password updated successfully.' })
      setCurrentPassword('')
      setPassword('')
      setConfirmPassword('')
      // optionally navigate back to profile after short delay
      setTimeout(() => navigate('/profile'), 900)
    } catch (err) {
      setMessage({ type: 'error', text: err?.message || 'Unable to change password.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="page-shell form-shell">
      <section className="panel auth-panel">
        <p className="eyebrow">Security</p>
        <h1>Change password</h1>

        {message.text && (
          <p className={`form-message ${message.type}`} role="alert">
            {message.text}
          </p>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Current password
            <div className="input-with-action">
              <input type={showCurrentPassword ? 'text' : 'password'} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} autoComplete="current-password" />
              <button type="button" className="toggle-visibility" onClick={() => setShowCurrentPassword((s) => !s)} aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}>
                {showCurrentPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </label>

          <label>
            New password
            <div className="input-with-action">
              <input type={showNewPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
              <button type="button" className="toggle-visibility" onClick={() => setShowNewPassword((s) => !s)} aria-label={showNewPassword ? 'Hide password' : 'Show password'}>
                {showNewPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </label>

          <label>
            Confirm new password
            <div className="input-with-action">
              <input type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} autoComplete="new-password" />
              <button type="button" className="toggle-visibility" onClick={() => setShowConfirmPassword((s) => !s)} aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}>
                {showConfirmPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </label>

          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button className="button button-secondary" type="button" onClick={() => navigate('/profile')} disabled={isLoading}>
              Cancel
            </button>
            <button className="button button-primary" type="submit" disabled={isLoading}>
              {isLoading ? 'Saving…' : 'Change password'}
            </button>
          </div>
        </form>
      </section>
    </main>
  )
}
