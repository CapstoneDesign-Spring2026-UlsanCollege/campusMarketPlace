import { Link } from 'react-router-dom'
import { t } from '../services/i18n'

const features = ['feature1', 'feature2', 'feature3']
const highlights = [
  { label: 'Verified students', value: '100%' },
  { label: 'Campus-safe trades', value: '24/7' },
  { label: 'Live deal alerts', value: 'Fast' },
]

const CATEGORY_ICONS = {
  Textbooks: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect x="4" y="5" width="7" height="14" rx="1.6" stroke="currentColor" strokeWidth="1.6" />
      <rect x="13" y="5" width="7" height="14" rx="1.6" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 6.5v11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.55" />
    </svg>
  ),
  Electronics: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect x="6" y="6" width="12" height="9" rx="1.6" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4.5 18h15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M9 18l-1 2h8l-1-2" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  ),
  'Dorm Deals': (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M5 11.2c0-1 0.8-1.8 1.8-1.8h10.4c1 0 1.8 0.8 1.8 1.8V17H5v-5.8z" stroke="currentColor" strokeWidth="1.6" />
      <rect x="6.3" y="11" width="4.2" height="2.8" rx="1.1" stroke="currentColor" strokeWidth="1.2" opacity="0.7" />
      <path d="M5 17v2M19 17v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  Tutor: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M12 5l9 4-9 4-9-4 9-4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M6.2 11.2V15c0 1.4 2.9 3 5.8 3s5.8-1.6 5.8-3v-3.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M21 9v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
    </svg>
  ),
}

const DEFAULT_CATEGORY_ICON = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <rect x="6" y="6" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.6" />
  </svg>
)

const spotlightCategories = [
  { label: 'Textbooks', tone: 'lavender', icon: CATEGORY_ICONS.Textbooks },
  { label: 'Electronics', tone: 'blue', icon: CATEGORY_ICONS.Electronics },
  { label: 'Dorm Deals', tone: 'peach', icon: CATEGORY_ICONS['Dorm Deals'] },
  { label: 'Tutor', tone: 'yellow', icon: CATEGORY_ICONS.Tutor },
]

function fallbackIcon(label) {
  return CATEGORY_ICONS[label] || DEFAULT_CATEGORY_ICON
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