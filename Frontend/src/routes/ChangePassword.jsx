import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { changePassword } from '../services/api'
import { t } from '../services/i18n'

export default function ChangePassword({ language = 'en' }) {
  const navigate = useNavigate()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
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

    if (!newPassword) {
      setMessage({ type: 'error', text: 'New password is required.' })
      return
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' })
      return
    }

    setIsLoading(true)
    try {
      await changePassword(currentPassword, newPassword)
      setMessage({ type: 'success', text: t(language, 'changePassword.success') })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
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
        <p className="eyebrow">{t(language, 'changePassword.security')}</p>
        <h1>{t(language, 'changePassword.title')}</h1>

        {message.text && (
          <p className={`form-message ${message.type}`} role="alert">
            {message.text}
          </p>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            {t(language, 'changePassword.currentPassword')}
            <div className="input-with-action">
              <input type={showCurrentPassword ? 'text' : 'password'} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} autoComplete="current-password" />
              <button type="button" className="toggle-visibility" onClick={() => setShowCurrentPassword((s) => !s)} aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}>
                {showCurrentPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </label>

          <label>
            {t(language, 'changePassword.newPassword')}
            <div className="input-with-action">
              <input type={showNewPassword ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} autoComplete="new-password" />
              <button type="button" className="toggle-visibility" onClick={() => setShowNewPassword((s) => !s)} aria-label={showNewPassword ? 'Hide password' : 'Show password'}>
                {showNewPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </label>

          <label>
            {t(language, 'changePassword.confirmNewPassword')}
            <div className="input-with-action">
              <input type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} autoComplete="new-password" />
              <button type="button" className="toggle-visibility" onClick={() => setShowConfirmPassword((s) => !s)} aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}>
                {showConfirmPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </label>

          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button className="button button-secondary" type="button" onClick={() => navigate('/profile')} disabled={isLoading}>
              {t(language, 'changePassword.cancel')}
            </button>
            <button className="button button-primary" type="submit" disabled={isLoading}>
              {isLoading ? t(language, 'changePassword.saving') : t(language, 'changePassword.save')}
            </button>
          </div>
        </form>
      </section>
    </main>
  )
}
