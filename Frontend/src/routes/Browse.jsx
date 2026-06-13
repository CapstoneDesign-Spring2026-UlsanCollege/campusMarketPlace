import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ItemGrid from '../components/ItemGrid'
import { fetchItems } from '../services/api'
import { CATEGORIES } from '../constants/categories'
import { t } from '../services/i18n'

const ITEMS_PER_PAGE = 20

export default function Browse({ currency, language = 'en' }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [items, setItems] = useState([])
  const [pagination, setPagination] = useState({ page: 1, limit: ITEMS_PER_PAGE, total: 0, pages: 1 })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadToken, setReloadToken] = useState(0)
  const [showCategories, setShowCategories] = useState(false)

  const currentPage = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
  const currentCategory = searchParams.get('category') || ''

  useEffect(() => {
    let isActive = true

    async function loadItems() {
      try {
        setIsLoading(true)
        setError('')

        const data = await fetchItems(currentPage, ITEMS_PER_PAGE, currentCategory || null)

        if (!isActive) {
          return
        }

        setItems(Array.isArray(data.items) ? data.items : [])
        setPagination(data.pagination || { page: 1, limit: ITEMS_PER_PAGE, total: 0, pages: 1 })
      } catch (err) {
        if (!isActive) {
          return
        }

        setError(err instanceof Error ? err.message : 'Failed to load items.')
        setItems([])
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    loadItems()

    return () => {
      isActive = false
    }
  }, [currentPage, currentCategory, reloadToken])

  function handleRetry() {
    setReloadToken((current) => current + 1)
  }

  function handleCategoryChange(newCategory) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (newCategory) {
        next.set('category', newCategory)
      } else {
        next.delete('category')
      }
      next.set('page', '1')
      return next
    })
  }

  function handlePageChange(nextPage) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set('page', String(nextPage))
      return next
    })
  }

  return (
    <main className="page-shell browse-shell">
      <section className="browse-hero panel">
        <p className="eyebrow">{t(language, 'browse.eyebrow')}</p>
        <h1>{t(language, 'browse.title')}</h1>
        <p className="subcopy">{t(language, 'browse.subcopy')}</p>
        <div className="category-options-wrap">
          <button
            type="button"
            className="button button-secondary category-toggle"
            aria-expanded={showCategories}
            aria-controls="browse-category-options"
            onClick={() => setShowCategories((current) => !current)}
          >
            Show options <span aria-hidden="true">{showCategories ? '→' : '●'}</span>
          </button>

          {showCategories && (
            <div id="browse-category-options" className="category-chip-row" aria-label="Quick category filters">
            <button
              type="button"
              className={`category-chip ${!currentCategory ? 'is-active' : ''}`}
              onClick={() => handleCategoryChange('')}
            >
              {t(language, 'browse.all')}
            </button>
            {CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                className={`category-chip ${currentCategory === category ? 'is-active' : ''}`}
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </button>
            ))}
            </div>
          )}
        </div>
      </section>

      <ItemGrid
        items={items}
        currency={currency}
        isLoading={isLoading}
        error={error}
        pagination={pagination}
        currentCategory={currentCategory}
        onCategoryChange={handleCategoryChange}
        onPageChange={handlePageChange}
        onRetry={handleRetry}
        language={language}
      />
    </main>
  )
}
