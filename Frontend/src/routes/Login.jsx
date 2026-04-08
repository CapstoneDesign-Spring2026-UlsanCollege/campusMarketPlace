import { useState } from 'react'

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <main className="page-shell form-shell">
      <section className="panel auth-panel">
        <p className="eyebrow">Welcome back</p>
        <h1>Login</h1>
        <p className="subcopy">This screen will connect to the Flask API later.</p>
        <form className="auth-form">
          <label>
            Email
            <input type="email" name="email" placeholder="student@office.uc.ac.kr" autoComplete="email" />
          </label>
          <label>
            Password
            <div className="input-with-action">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Enter your password"
                autoComplete="current-password"
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
          <button className="button button-primary" type="submit">
            Login
          </button>
        </form>
      </section>
    </main>
  )
}