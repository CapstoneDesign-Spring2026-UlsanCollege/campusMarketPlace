import { Link } from 'react-router-dom'

const features = ['Campus-only access', 'Safe & trusted trading', 'Verified student accounts']

export default function Home() {
  return (
    <main className="page-shell hero-shell">
      <section className="hero-card">
        <p className="eyebrow">Campus marketplace</p>
        <h1>Ulsan College Marketplace</h1>
        <p className="tagline">Buy & Sell within Ulsan College</p>

        <div className="feature-list" aria-label="Marketplace features">
          {features.map((feature) => (
            <div className="feature-pill" key={feature}>
              {feature}
            </div>
          ))}
        </div>

        <div className="hero-actions">
          <Link className="button button-primary" to="/signup">
            Get Started
          </Link>
          <Link className="button button-secondary" to="/login">
            Sign In
          </Link>
        </div>
      </section>
    </main>
  )
}