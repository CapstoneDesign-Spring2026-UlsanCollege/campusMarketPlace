import { Link } from 'react-router-dom'
import { t } from '../services/i18n'

const features = ['feature1', 'feature2', 'feature3']
const highlights = [
  { label: 'Verified students', value: '100%' },
  { label: 'Campus-safe trades', value: '24/7' },
  { label: 'Live deal alerts', value: 'Fast' },
]

const spotlightCategories = [
  { label: 'Textbooks', tone: 'lavender', icon: '📚' },
  { label: 'Electronics', tone: 'blue', icon: '💻' },
  { label: 'Dorm Deals', tone: 'peach', icon: '🛋️' },
  { label: 'Tutor', tone: 'yellow', icon: '🎓' },
]

function fallbackIcon(label) {
  const map = {
    Textbooks: '📚',
    Electronics: '💻',
    'Dorm Deals': '🛋️',
    Tutor: '🎓',
  }
  return map[label] || '📦'
}

export default function Home({ language = 'en' }) {
  return (
    <main className="page-shell hero-shell">
      <section className="hero-card">
        <p className="eyebrow">{t(language, 'home.eyebrow')}</p>
        <h1>{t(language, 'home.title')}</h1>
        <p className="tagline">{t(language, 'home.tagline')}</p>
        <p className="subcopy">{t(language, 'home.subcopy')}</p>

        <div className="feature-list" aria-label="Marketplace features">
          {features.map((feature) => (
            <div className="feature-pill" key={feature}>
              {t(language, `home.${feature}`)}
            </div>
          ))}
        </div>

        <div className="hero-stat-grid" aria-label="Marketplace highlights">
          {highlights.map((item) => (
            <article className="hero-stat-card" key={item.label}>
              <span className="hero-stat-label">{item.label}</span>
              <strong className="hero-stat-value">{item.value}</strong>
            </article>
          ))}
        </div>

        <div className="category-grid" aria-label="Popular student categories">
          {spotlightCategories.map((category) => (
            <article key={category.label} className={`category-card ${category.tone}`}>
              <div className="category-card-icon" aria-hidden="true">{category.icon || fallbackIcon(category.label)}</div>
              <strong>{category.label}</strong>
              <span className="subcopy">Browse trusted campus listings in a cleaner, calmer experience.</span>
            </article>
          ))}
        </div>

        <div className="trust-grid" aria-label="Trust and safety highlights">
          <article className="trust-card">
            <strong>Verified student-only access</strong>
            <p className="subcopy">Campus accounts keep the marketplace safer and more relevant.</p>
          </article>
          <article className="trust-card">
            <strong>On-campus meetups</strong>
            <p className="subcopy">Trade in familiar places with clear pickup guidance.</p>
          </article>
          <article className="trust-card">
            <strong>Fast mobile checkout flow</strong>
            <p className="subcopy">Start from anywhere and keep the browsing experience fluid.</p>
          </article>
        </div>

        <div className="hero-actions">
          <Link className="button button-primary home-cta-primary" to="/signup">
            {t(language, 'home.getStarted')}
          </Link>
          <Link className="button button-secondary" to="/login">
            {t(language, 'home.signIn')}
          </Link>
        </div>
      </section>
    </main>
  )
}