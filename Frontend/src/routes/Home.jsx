import { Link } from 'react-router-dom'
import { t } from '../services/i18n'

const features = ['feature1', 'feature2', 'feature3']

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

        <div className="hero-actions">
          <Link className="button button-primary" to="/signup">
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