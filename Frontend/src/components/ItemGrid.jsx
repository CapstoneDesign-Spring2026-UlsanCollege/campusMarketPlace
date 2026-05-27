import ItemCard from './ItemCard'
import { CATEGORIES, getCategoryLabel } from '../constants/categories'
import { t } from '../services/i18n'

function LoadingState({ language = 'en' }) {
  return (
    <div className="state-card" role="status" aria-live="polite">
      <p className="state-title">{t(language, 'browse.loadingItems')}</p>
      <p className="state-copy">{t(language, 'browse.fetchingLatest')}</p>
    </div>
  )
}

function ErrorState({ error, onRetry, language = 'en' }) {
  return (
    <div className="state-card state-card-error" role="alert">
      <p className="state-title">{t(language, 'browse.couldNotLoad')}</p>
      <p className="state-copy">{error}</p>
      <button className="button button-primary" type="button" onClick={onRetry}>
        {t(language, 'browse.tryAgain')}
      </button>
    </div>
  )
}

function EmptyState({ language = 'en' }) {
  return (
    <div className="state-card" role="status">
      <p className="state-title">{t(language, 'browse.noItemsYet')}</p>
      <p className="state-copy">{t(language, 'browse.beFirst')}</p>
    </div>
  )
}

export default function ItemGrid({
  items,
  currency,
  isLoading,
  error,
  pagination,
  currentCategory,
  onCategoryChange,
  onPageChange,
  onRetry,
  language = 'en',
}) {
  const page = pagination?.page || 1
  const pages = pagination?.pages || 1
  const total = pagination?.total || 0
  const limit = pagination?.limit || items.length || 20
  const start = total === 0 ? 0 : (page - 1) * limit + 1
  const end = total === 0 ? 0 : Math.min(page * limit, total)

  return (
    <section className="browse-section" aria-label={t(language, 'browse.title')}>
      <div className="browse-toolbar">
        <div>
          <p className="eyebrow">{t(language, 'browse.browseListings')}</p>
          <h2>{t(language, 'browse.exploreItems')}</h2>
          <p className="browse-summary">
            {total > 0
              ? `${t(language, 'browse.showing')} ${start}-${end} ${t(language, 'browse.of')} ${total} ${t(language, 'browse.items')}${currentCategory ? ` ${t(language, 'browse.in')} ${getCategoryLabel(currentCategory)}` : ''}`
              : t(language, 'browse.latestListings')}
          </p>
        </div>

        <div className="filter-and-pagination">
          <select
            className="category-filter"
            value={currentCategory || ''}
            onChange={(e) => onCategoryChange(e.target.value || null)}
            disabled={isLoading}
            aria-label="Filter by category"
          >
            <option value="">{t(language, 'browse.selectCategory')}</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <div className="pagination-summary" aria-label="Pagination summary">
            <span>
              {t(language, 'browse.page')} {page} {t(language, 'browse.of')} {pages}
            </span>
            <div className="pagination-actions">
              <button
                className="button button-secondary"
                type="button"
                onClick={() => onPageChange(Math.max(1, page - 1))}
                disabled={isLoading || page <= 1}
              >
                {t(language, 'browse.previous')}
              </button>
              <button
                className="button button-secondary"
                type="button"
                onClick={() => onPageChange(Math.min(pages, page + 1))}
                disabled={isLoading || page >= pages}
              >
                {t(language, 'browse.next')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <LoadingState language={language} />
      ) : error ? (
        <ErrorState error={error} onRetry={onRetry} language={language} />
      ) : items.length === 0 ? (
        <EmptyState language={language} />
      ) : (
        <div className="item-grid" aria-busy={isLoading ? 'true' : 'false'}>
          {items.map((item) => (
            <ItemCard key={item._id} item={item} currency={currency} language={language} />
          ))}
        </div>
      )}
    </section>
  )
}