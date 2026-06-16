import { useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiRequest } from '../services/api'
import { saveAuthSession } from '../services/auth'
import { t } from '../services/i18n'

const REQUIRED_FIELDS = ['firstName', 'lastName', 'email', 'password', 'confirmPassword']

const PASSWORD_RULES = [
  { key: 'length', test: (value) => value.length >= 8 },
  { key: 'uppercase', test: (value) => /[A-Z]/.test(value) },
  { key: 'lowercase', test: (value) => /[a-z]/.test(value) },
  { key: 'number', test: (value) => /\d/.test(value) },
  { key: 'special', test: (value) => /[^A-Za-z0-9]/.test(value) },
  { key: 'spaces', test: (value) => !/\s/.test(value) },
]

const SIGNUP_COPY = {
  en: {
    requiredField: 'This field is required.',
    nameFormat: 'Use letters only (spaces, apostrophes, and hyphens allowed).',
    emailFormat: 'Enter a valid email address.',
    emailDomain: 'Only @office.uc.ac.kr email addresses are allowed.',
    passwordStrength: 'Password does not meet strength requirements.',
    passwordsDoNotMatch: 'Passwords do not match.',
    highlightFields: 'Please fix the highlighted fields before creating your account.',
    verificationSent: 'A verification code was sent to your email.',
    verificationResent: 'Verification code resent.',
    resendFailed: 'Failed to resend code.',
    signupFailed: 'Signup failed. Please try again.',
    verificationFailed: 'Verification failed.',
    verificationCode: 'Verification code',
    show: 'Show',
    hide: 'Hide',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
    resendIn: (seconds) => `Resend in ${seconds}s`,
    resendCode: 'Resend code',
    passwordRules: {
      length: 'At least 8 characters',
      uppercase: 'One uppercase letter',
      lowercase: 'One lowercase letter',
      number: 'One number',
      special: 'One special character',
      spaces: 'No spaces',
    },
  },
  ko: {
    requiredField: '이 필드는 필수입니다.',
    nameFormat: '문자만 사용하세요(공백, 아포스트로피, 하이픈 허용).',
    emailFormat: '유효한 이메일 주소를 입력하세요.',
    emailDomain: '@office.uc.ac.kr 이메일만 사용할 수 있습니다.',
    passwordStrength: '비밀번호가 보안 요구 사항을 충족하지 않습니다.',
    passwordsDoNotMatch: '비밀번호가 일치하지 않습니다.',
    highlightFields: '강조된 항목을 수정한 후 계정을 생성하세요.',
    verificationSent: '인증 코드가 이메일로 전송되었습니다.',
    verificationResent: '인증 코드가 다시 전송되었습니다.',
    resendFailed: '코드를 다시 보내지 못했습니다.',
    signupFailed: '가입에 실패했습니다. 다시 시도하세요.',
    verificationFailed: '인증에 실패했습니다.',
    verificationCode: '인증 코드',
    show: '표시',
    hide: '숨기기',
    showPassword: '비밀번호 표시',
    hidePassword: '비밀번호 숨기기',
    resendIn: (seconds) => `${seconds}초 후 재전송`,
    resendCode: '코드 재전송',
    passwordRules: {
      length: '8자 이상',
      uppercase: '대문자 1개',
      lowercase: '소문자 1개',
      number: '숫자 1개',
      special: '특수문자 1개',
      spaces: '공백 없음',
    },
  },
  ne: {
    requiredField: 'यो फिल्ड अनिवार्य छ।',
    nameFormat: 'अक्षर मात्र प्रयोग गर्नुहोस् (स्पेस, अपोस्ट्रोफी, र हाइफन अनुमति छ)।',
    emailFormat: 'मान्य इमेल ठेगाना प्रविष्ट गर्नुहोस्।',
    emailDomain: 'केवल @office.uc.ac.kr इमेल ठेगानाहरू मात्र अनुमति छन्।',
    passwordStrength: 'पासवर्डले बलियोपनका आवश्यकताहरू पूरा गर्दैन।',
    passwordsDoNotMatch: 'पासवर्डहरू मिल्दैनन्।',
    highlightFields: 'कृपया आफ्नो खाता सिर्जना गर्नु अघि हाइलाइट गरिएका फिल्डहरू ठीक गर्नुहोस्।',
    verificationSent: 'तपाईंको इमेलमा प्रमाणीकरण कोड पठाइएको छ।',
    verificationResent: 'प्रमाणीकरण कोड फेरि पठाइयो।',
    resendFailed: 'कोड फेरि पठाउन सकिएन।',
    signupFailed: 'साइनअप असफल भयो। कृपया फेरि प्रयास गर्नुहोस्।',
    verificationFailed: 'प्रमाणीकरण असफल भयो।',
    verificationCode: 'प्रमाणीकरण कोड',
    show: 'देखाउनुहोस्',
    hide: 'लुकाउनुहोस्',
    showPassword: 'पासवर्ड देखाउनुहोस्',
    hidePassword: 'पासवर्ड लुकाउनुहोस्',
    resendIn: (seconds) => `${seconds} सेकेन्डमा पुनः पठाउनुहोस्`,
    resendCode: 'कोड पुनः पठाउनुहोस्',
    passwordRules: {
      length: 'कम्तीमा 8 अक्षर',
      uppercase: 'एक ठूलो अक्षर',
      lowercase: 'एक सानो अक्षर',
      number: 'एक अंक',
      special: 'एक विशेष चिन्ह',
      spaces: 'स्पेस छैन',
    },
  },
  hi: {
    requiredField: 'यह फ़ील्ड आवश्यक है।',
    nameFormat: 'केवल अक्षरों का उपयोग करें (स्पेस, अपॉस्ट्रोफी, और हाइफ़न अनुमति हैं)।',
    emailFormat: 'मान्य ईमेल पता दर्ज करें।',
    emailDomain: 'केवल @office.uc.ac.kr ईमेल पतों की अनुमति है।',
    passwordStrength: 'पासवर्ड सुरक्षा आवश्यकताओं को पूरा नहीं करता।',
    passwordsDoNotMatch: 'पासवर्ड मेल नहीं खाते।',
    highlightFields: 'कृपया खाता बनाने से पहले हाइलाइट किए गए फ़ील्ड ठीक करें।',
    verificationSent: 'आपके ईमेल पर एक सत्यापन कोड भेजा गया है।',
    verificationResent: 'सत्यापन कोड फिर से भेजा गया।',
    resendFailed: 'कोड फिर से भेजने में विफल रहा।',
    signupFailed: 'साइनअप विफल रहा। कृपया फिर से प्रयास करें।',
    verificationFailed: 'सत्यापन विफल रहा।',
    verificationCode: 'सत्यापन कोड',
    show: 'दिखाएँ',
    hide: 'छिपाएँ',
    showPassword: 'पासवर्ड दिखाएँ',
    hidePassword: 'पासवर्ड छिपाएँ',
    resendIn: (seconds) => `${seconds} सेकंड में फिर भेजें`,
    resendCode: 'कोड फिर भेजें',
    passwordRules: {
      length: 'कम से कम 8 अक्षर',
      uppercase: 'एक बड़ा अक्षर',
      lowercase: 'एक छोटा अक्षर',
      number: 'एक संख्या',
      special: 'एक विशेष वर्ण',
      spaces: 'कोई स्पेस नहीं',
    },
  },
}

const initialValues = {
  firstName: '',
  middleName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
}

function getPasswordChecks(password) {
  return PASSWORD_RULES.reduce((acc, rule) => {
    acc[rule.key] = rule.test(password)
    return acc
  }, {})
}

function validateField(name, values, copy) {
  const value = values[name]?.trim?.() ?? values[name]

  if (REQUIRED_FIELDS.includes(name) && !value) {
    return copy.requiredField
  }

  if (name === 'firstName' || name === 'lastName') {
    if (!/^[A-Za-z][A-Za-z\s'-]*$/.test(value)) {
      return copy.nameFormat
    }
  }

  if (name === 'middleName' && value) {
    if (!/^[A-Za-z\s'-]+$/.test(value)) {
      return copy.nameFormat
    }
  }

  if (name === 'email') {
    const normalized = values.email.trim().toLowerCase()
    const basicEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!basicEmailRegex.test(normalized)) {
      return copy.emailFormat
    }

    if (!normalized.endsWith('@office.uc.ac.kr')) {
      return copy.emailDomain
    }
  }

  if (name === 'password') {
    const checks = getPasswordChecks(values.password)
    const isStrong = Object.values(checks).every(Boolean)

    if (!isStrong) {
      return copy.passwordStrength
    }
  }

  if (name === 'confirmPassword') {
    if (values.confirmPassword !== values.password) {
      return copy.passwordsDoNotMatch
    }
  }

  return ''
}

function validateAll(values, copy) {
  return Object.keys(values).reduce((acc, field) => {
    const error = validateField(field, values, copy)
    if (error) {
      acc[field] = error
    }
    return acc
  }, {})
}

export default function Signup({ language = 'en', onAuthChange }) {
  const navigate = useNavigate()
  const copy = SIGNUP_COPY[language] || SIGNUP_COPY.en
  const [formValues, setFormValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isAwaitingVerification, setIsAwaitingVerification] = useState(false)
  const [otpValue, setOtpValue] = useState('')
  const [otpStatus, setOtpStatus] = useState({ type: '', message: '' })
  const [resendSecondsLeft, setResendSecondsLeft] = useState(0)

  const passwordChecks = useMemo(() => getPasswordChecks(formValues.password), [formValues.password])
  const passwordScore = Object.values(passwordChecks).filter(Boolean).length
  const strengthPercent = Math.round((passwordScore / PASSWORD_RULES.length) * 100)

  function handleBlur(event) {
    const { name } = event.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, formValues, copy),
    }))
  }

  function handleChange(event) {
    const { name, value } = event.target
    const nextValues = { ...formValues, [name]: value }
    setFormValues(nextValues)
    setSubmitStatus({ type: '', message: '' })

    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, nextValues, copy) }))
    }

    if (name === 'password' && touched.confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: validateField('confirmPassword', nextValues, copy) }))
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (isLoading) {
      return
    }

    const normalizedValues = {
      ...formValues,
      firstName: formValues.firstName.trim(),
      middleName: formValues.middleName.trim(),
      lastName: formValues.lastName.trim(),
      email: formValues.email.trim().toLowerCase(),
    }

    const nextTouched = Object.keys(normalizedValues).reduce((acc, key) => {
      acc[key] = true
      return acc
    }, {})

    const formErrors = validateAll(normalizedValues, copy)

    setFormValues(normalizedValues)
    setTouched(nextTouched)
    setErrors(formErrors)

    if (Object.keys(formErrors).length > 0) {
      setSubmitStatus({
        type: 'error',
        message: copy.highlightFields,
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await apiRequest('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(normalizedValues),
      })

      if (response?.requiresVerification) {
        setIsAwaitingVerification(true)
        setOtpStatus({ type: 'info', message: copy.verificationSent })
        if (response?.resendAvailableAt) {
          const then = new Date(response.resendAvailableAt).getTime()
          const now = Date.now()
          const seconds = Math.max(0, Math.ceil((then - now) / 1000))
          setResendSecondsLeft(seconds)
        }
        return
      }

      if (!response?.token || !response?.user) {
        throw new Error('Signup completed but no session was returned.')
      }

      saveAuthSession(response.token, response.user)
      if (typeof onAuthChange === 'function') {
        onAuthChange()
      }

      setSubmitStatus({ type: '', message: '' })
      navigate('/dashboard', { replace: true })
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Signup failed. Please try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleVerifyOtp(ev) {
    ev.preventDefault()
    setOtpStatus({ type: '', message: '' })
    try {
      const payload = await apiRequest('/auth/verify-email-otp', {
        method: 'POST',
        body: JSON.stringify({ email: formValues.email.trim().toLowerCase(), otp: otpValue.trim() }),
      })

      if (!payload?.token || !payload?.user) {
        throw new Error(copy.verificationFailed)
      }

      saveAuthSession(payload.token, payload.user)
      if (typeof onAuthChange === 'function') onAuthChange()
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setOtpStatus({ type: 'error', message: err instanceof Error ? err.message : copy.verificationFailed })
    }
  }

  async function handleResendOtp() {
    setOtpStatus({ type: '', message: '' })
    try {
      await apiRequest('/auth/resend-email-otp', {
        method: 'POST',
        body: JSON.stringify({ email: formValues.email.trim().toLowerCase() }),
      })
      setOtpStatus({ type: 'info', message: copy.verificationResent })
      // start 2-minute cooldown
      setResendSecondsLeft(120)
    } catch (err) {
      const msg = err instanceof Error ? err.message : copy.resendFailed
      setOtpStatus({ type: 'error', message: msg })
      // try to extract seconds from server message like 'Please wait 90 seconds...'
      const m = msg.match(/(\d+)\s*seconds/)
      if (m) {
        setResendSecondsLeft(parseInt(m[1], 10))
      }
    }
  }

  // Countdown effect for resend cooldown
  useEffect(() => {
    if (resendSecondsLeft <= 0) return
    const id = setInterval(() => {
      setResendSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(id)
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [resendSecondsLeft])

  function fieldError(name) {
    return touched[name] ? errors[name] : ''
  }

  return (
    <main className="page-shell form-shell">
      <section className="panel auth-panel">
        <p className="eyebrow">{t(language, 'signup.join')}</p>
        <h1>{t(language, 'signup.title')}</h1>
        <p className="subcopy">{t(language, 'signup.subcopy')}</p>

        {submitStatus.message && (
          <p className={`form-message ${submitStatus.type}`} role="alert">
            {submitStatus.message}
          </p>
        )}

        <form className="auth-form" onSubmit={isAwaitingVerification ? handleVerifyOtp : handleSubmit} noValidate>
          <label className={fieldError('firstName') ? 'has-error' : ''}>
            <span className="label-text">{t(language, 'signup.firstName')}</span>
            <input
              type="text"
              name="firstName"
              placeholder={t(language, 'signup.firstNamePlaceholder')}
              value={formValues.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={Boolean(fieldError('firstName'))}
            />
            {fieldError('firstName') && <span className="field-error">{fieldError('firstName')}</span>}
          </label>

          <label className={fieldError('middleName') ? 'has-error' : ''}>
            <span className="label-text">{t(language, 'signup.middleName')}</span>
            <input
              type="text"
              name="middleName"
              placeholder={t(language, 'signup.middleNamePlaceholder')}
              value={formValues.middleName}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={Boolean(fieldError('middleName'))}
            />
            {fieldError('middleName') && <span className="field-error">{fieldError('middleName')}</span>}
          </label>

          <label className={fieldError('lastName') ? 'has-error' : ''}>
            <span className="label-text">{t(language, 'signup.lastName')}</span>
            <input
              type="text"
              name="lastName"
              placeholder={t(language, 'signup.lastNamePlaceholder')}
              value={formValues.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={Boolean(fieldError('lastName'))}
            />
            {fieldError('lastName') && <span className="field-error">{fieldError('lastName')}</span>}
          </label>

          <label className={fieldError('email') ? 'has-error' : ''}>
            <span className="label-text">{t(language, 'signup.email')}</span>
            <input
              type="email"
              name="email"
              placeholder={t(language, 'signup.emailPlaceholder')}
              value={formValues.email}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={Boolean(fieldError('email'))}
              autoComplete="email"
            />
            <span className="field-hint">{t(language, 'signup.emailHint')}</span>
            {fieldError('email') && <span className="field-error">{fieldError('email')}</span>}
          </label>

          <label className={fieldError('password') ? 'has-error' : ''}>
            <span className="label-text">{t(language, 'signup.password')}</span>
            <div className="input-with-action">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder={t(language, 'signup.passwordPlaceholder')}
                value={formValues.password}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={Boolean(fieldError('password'))}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="toggle-visibility"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? copy.hidePassword : copy.showPassword}
              >
                {showPassword ? copy.hide : copy.show}
              </button>
            </div>
            {fieldError('password') && <span className="field-error">{fieldError('password')}</span>}
            <ul className="password-rules" aria-label="Password requirements">
              {PASSWORD_RULES.map((rule) => (
                <li key={rule.key} className={passwordChecks[rule.key] ? 'rule-ok' : 'rule-missing'}>
                  {copy.passwordRules[rule.key]}
                </li>
              ))}
            </ul>
          </label>

          <label className={fieldError('confirmPassword') ? 'has-error' : ''}>
            <span className="label-text">{t(language, 'signup.confirmPassword')}</span>
            <div className="input-with-action">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder={t(language, 'signup.confirmPasswordPlaceholder')}
                value={formValues.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={Boolean(fieldError('confirmPassword'))}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="toggle-visibility"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              >
                {showConfirmPassword ? t(language, 'signup.hide') : t(language, 'signup.show')}
              </button>
            </div>
            {fieldError('confirmPassword') && (
              <span className="field-error">{fieldError('confirmPassword')}</span>
            )}
          </label>

          {!isAwaitingVerification ? (
            <button className="button button-primary" type="submit" disabled={isLoading}>
              {isLoading ? t(language, 'signup.creatingAccount') : t(language, 'signup.createAccount')}
            </button>
          ) : (
            <div>
              <label>
                <span className="label-text">{copy.verificationCode}</span>
                <input
                  type="text"
                  name="otp"
                  value={otpValue}
                  onChange={(e) => setOtpValue(e.target.value)}
                  placeholder="Enter the 6-digit code"
                />
              </label>

              {otpStatus.message && (
                <p className={`form-message ${otpStatus.type}`} role="alert">{otpStatus.message}</p>
              )}

              <div className="otp-actions">
                <button className="button button-primary" type="submit">Verify code</button>
                <button
                  type="button"
                  className="button"
                  onClick={handleResendOtp}
                  disabled={resendSecondsLeft > 0}
                >
                  {resendSecondsLeft > 0 ? copy.resendIn(resendSecondsLeft) : copy.resendCode}
                </button>
              </div>
            </div>
          )}
        </form>
      </section>
    </main>
  )
}
