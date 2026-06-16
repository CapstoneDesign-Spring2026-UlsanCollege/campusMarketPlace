import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { changePassword } from '../services/api'
import { t } from '../services/i18n'

const PASSWORD_COPY = {
  en: {
    currentPasswordRequired: 'Current password is required.',
    newPasswordRequired: 'New password is required.',
    passwordsDoNotMatch: 'Passwords do not match.',
    unableToChange: 'Unable to change password.',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
    showConfirmPassword: 'Show confirm password',
    hideConfirmPassword: 'Hide confirm password',
    show: 'Show',
    hide: 'Hide',
  },
  ko: {
    currentPasswordRequired: '현재 비밀번호가 필요합니다.',
    newPasswordRequired: '새 비밀번호가 필요합니다.',
    passwordsDoNotMatch: '비밀번호가 일치하지 않습니다.',
    unableToChange: '비밀번호를 변경할 수 없습니다.',
    showPassword: '비밀번호 표시',
    hidePassword: '비밀번호 숨기기',
    showConfirmPassword: '확인 비밀번호 표시',
    hideConfirmPassword: '확인 비밀번호 숨기기',
    show: '표시',
    hide: '숨기기',
  },
  ne: {
    currentPasswordRequired: 'हालको पासवर्ड आवश्यक छ।',
    newPasswordRequired: 'नयाँ पासवर्ड आवश्यक छ।',
    passwordsDoNotMatch: 'पासवर्डहरू मिल्दैनन्।',
    unableToChange: 'पासवर्ड परिवर्तन गर्न सकिएन।',
    showPassword: 'पासवर्ड देखाउनुहोस्',
    hidePassword: 'पासवर्ड लुकाउनुहोस्',
    showConfirmPassword: 'पुष्टि पासवर्ड देखाउनुहोस्',
    hideConfirmPassword: 'पुष्टि पासवर्ड लुकाउनुहोस्',
    show: 'देखाउनुहोस्',
    hide: 'लुकाउनुहोस्',
  },
  hi: {
    currentPasswordRequired: 'वर्तमान पासवर्ड आवश्यक है।',
    newPasswordRequired: 'नया पासवर्ड आवश्यक है।',
    passwordsDoNotMatch: 'पासवर्ड मेल नहीं खाते।',
    unableToChange: 'पासवर्ड बदला नहीं जा सका।',
    showPassword: 'पासवर्ड दिखाएँ',
    hidePassword: 'पासवर्ड छिपाएँ',
    showConfirmPassword: 'पुष्टि पासवर्ड दिखाएँ',
    hideConfirmPassword: 'पुष्टि पासवर्ड छिपाएँ',
    show: 'दिखाएँ',
    hide: 'छिपाएँ',
  },
}

export default function ChangePassword({ language = 'en' }) {
  const navigate = useNavigate()
  const copy = PASSWORD_COPY[language] || PASSWORD_COPY.en
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
      setMessage({ type: 'error', text: copy.currentPasswordRequired })
      return
    }

    if (!newPassword) {
      setMessage({ type: 'error', text: copy.newPasswordRequired })
      return
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: copy.passwordsDoNotMatch })
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
      setMessage({ type: 'error', text: err?.message || copy.unableToChange })
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
              <button type="button" className="toggle-visibility" onClick={() => setShowCurrentPassword((s) => !s)} aria-label={showCurrentPassword ? copy.hidePassword : copy.showPassword}>
                {showCurrentPassword ? copy.hide : copy.show}
              </button>
            </div>
          </label>

          <label>
            {t(language, 'changePassword.newPassword')}
            <div className="input-with-action">
              <input type={showNewPassword ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} autoComplete="new-password" />
              <button type="button" className="toggle-visibility" onClick={() => setShowNewPassword((s) => !s)} aria-label={showNewPassword ? copy.hidePassword : copy.showPassword}>
                {showNewPassword ? copy.hide : copy.show}
              </button>
            </div>
          </label>

          <label>
            {t(language, 'changePassword.confirmNewPassword')}
            <div className="input-with-action">
              <input type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} autoComplete="new-password" />
              <button type="button" className="toggle-visibility" onClick={() => setShowConfirmPassword((s) => !s)} aria-label={showConfirmPassword ? copy.hideConfirmPassword : copy.showConfirmPassword}>
                {showConfirmPassword ? copy.hide : copy.show}
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
