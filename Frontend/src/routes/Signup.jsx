import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiRequest } from '../services/api'

const REQUIRED_FIELDS = ['firstName', 'lastName', 'email', 'password', 'confirmPassword']

const PASSWORD_RULES = [
  { key: 'length', label: 'At least 8 characters', test: (value) => value.length >= 8 },
  { key: 'uppercase', label: 'One uppercase letter', test: (value) => /[A-Z]/.test(value) },
  { key: 'lowercase', label: 'One lowercase letter', test: (value) => /[a-z]/.test(value) },
  { key: 'number', label: 'One number', test: (value) => /\d/.test(value) },
  { key: 'special', label: 'One special character', test: (value) => /[^A-Za-z0-9]/.test(value) },
  { key: 'spaces', label: 'No spaces', test: (value) => !/\s/.test(value) },
]

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

function validateField(name, values) {
  const value = values[name]?.trim?.() ?? values[name]

  if (REQUIRED_FIELDS.includes(name) && !value) {
    return 'This field is required.'
  }

  if (name === 'firstName' || name === 'lastName') {
    if (!/^[A-Za-z][A-Za-z\s'-]*$/.test(value)) {
      return 'Use letters only (spaces, apostrophes, and hyphens allowed).'
    }
  }

  if (name === 'middleName' && value) {
    if (!/^[A-Za-z\s'-]+$/.test(value)) {
      return 'Use letters only (spaces, apostrophes, and hyphens allowed).'
    }
  }

  if (name === 'email') {
    const normalized = values.email.trim().toLowerCase()
    const basicEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!basicEmailRegex.test(normalized)) {
      return 'Enter a valid email address.'
    }

    if (!normalized.endsWith('@office.uc.ac.kr')) {
      return 'Only @office.uc.ac.kr email addresses are allowed.'
    }
  }

  if (name === 'password') {
    const checks = getPasswordChecks(values.password)
    const isStrong = Object.values(checks).every(Boolean)

    if (!isStrong) {
      return 'Password does not meet strength requirements.'
    }
  }

  if (name === 'confirmPassword') {
    if (values.confirmPassword !== values.password) {
      return 'Passwords do not match.'
    }
  }

  return ''
}

function validateAll(values) {
  return Object.keys(values).reduce((acc, field) => {
    const error = validateField(field, values)
    if (error) {
      acc[field] = error
    }
    return acc
  }, {})
}

export default function Signup() {
  const navigate = useNavigate()
  const [formValues, setFormValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const passwordChecks = useMemo(() => getPasswordChecks(formValues.password), [formValues.password])
  const passwordScore = Object.values(passwordChecks).filter(Boolean).length
  const strengthPercent = Math.round((passwordScore / PASSWORD_RULES.length) * 100)

  function handleBlur(event) {
    const { name } = event.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, formValues),
    }))
  }

  function handleChange(event) {
    const { name, value } = event.target
    const nextValues = { ...formValues, [name]: value }
    setFormValues(nextValues)
    setSubmitStatus({ type: '', message: '' })

    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, nextValues) }))
    }

    if (name === 'password' && touched.confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: validateField('confirmPassword', nextValues) }))
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()

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

    const formErrors = validateAll(normalizedValues)

    setFormValues(normalizedValues)
    setTouched(nextTouched)
    setErrors(formErrors)

    if (Object.keys(formErrors).length > 0) {
      setSubmitStatus({
        type: 'error',
        message: 'Please fix the highlighted fields before creating your account.',
      })
      return
    }

    try {
      const response = await apiRequest('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(normalizedValues),
      })

      navigate('/login', {
        state: {
          message: response.message || 'Account created. Please log in.',
          email: normalizedValues.email,
        },
      })
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: error.message || 'Signup failed. Please try again.',
      })
    }
  }

  function fieldError(name) {
    return touched[name] ? errors[name] : ''
  }

  return (
    <main className="page-shell form-shell">
      <section className="panel auth-panel">
        <p className="eyebrow">Join the campus network</p>
        <h1>Create Account</h1>
        <p className="subcopy">Use your official campus email and a strong password.</p>

        {submitStatus.message && (
          <p className={`form-message ${submitStatus.type}`} role="alert">
            {submitStatus.message}
          </p>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <label className={fieldError('firstName') ? 'has-error' : ''}>
            First Name
            <input
              type="text"
              name="firstName"
              placeholder="First Name *"
              value={formValues.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={Boolean(fieldError('firstName'))}
            />
            {fieldError('firstName') && <span className="field-error">{fieldError('firstName')}</span>}
          </label>

          <label className={fieldError('middleName') ? 'has-error' : ''}>
            Middle Name
            <input
              type="text"
              name="middleName"
              placeholder="Middle Name (Optional)"
              value={formValues.middleName}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={Boolean(fieldError('middleName'))}
            />
            {fieldError('middleName') && <span className="field-error">{fieldError('middleName')}</span>}
          </label>

          <label className={fieldError('lastName') ? 'has-error' : ''}>
            Last Name
            <input
              type="text"
              name="lastName"
              placeholder="Last Name *"
              value={formValues.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={Boolean(fieldError('lastName'))}
            />
            {fieldError('lastName') && <span className="field-error">{fieldError('lastName')}</span>}
          </label>

          <label className={fieldError('email') ? 'has-error' : ''}>
            Email
            <input
              type="email"
              name="email"
              placeholder="yourname@office.uc.ac.kr"
              value={formValues.email}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={Boolean(fieldError('email'))}
              autoComplete="email"
            />
            <span className="field-hint">Must end with @office.uc.ac.kr</span>
            {fieldError('email') && <span className="field-error">{fieldError('email')}</span>}
          </label>

          <label className={fieldError('password') ? 'has-error' : ''}>
            Password
            <div className="input-with-action">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password *"
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
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {fieldError('password') && <span className="field-error">{fieldError('password')}</span>}

            <div className="password-meter" aria-hidden="true">
              <div className="password-meter-bar" style={{ width: `${strengthPercent}%` }} />
            </div>
            <ul className="password-rules" aria-label="Password requirements">
              {PASSWORD_RULES.map((rule) => (
                <li key={rule.key} className={passwordChecks[rule.key] ? 'rule-ok' : 'rule-missing'}>
                  {rule.label}
                </li>
              ))}
            </ul>
          </label>

          <label className={fieldError('confirmPassword') ? 'has-error' : ''}>
            Confirm Password
            <div className="input-with-action">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Confirm Password *"
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
                {showConfirmPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {fieldError('confirmPassword') && (
              <span className="field-error">{fieldError('confirmPassword')}</span>
            )}
          </label>

          <button className="button button-primary" type="submit">
            Sign Up
          </button>
        </form>
      </section>
    </main>
  )
}
