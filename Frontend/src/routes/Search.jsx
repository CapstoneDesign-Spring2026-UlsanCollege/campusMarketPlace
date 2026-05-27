import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ItemGrid from '../components/ItemGrid'
import { fetchItems } from '../services/api'
import { CATEGORIES } from '../constants/categories'
import { t } from '../services/i18n'

const ITEMS_PER_PAGE = 20

export default function Search({ currency, language = 'en', marketQuery, onMarketQueryChange }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [items, setItems] = useState([])
  const [pagination, setPagination] = useState({ page: 1, limit: ITEMS_PER_PAGE, total: 0, pages: 1 })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadToken, setReloadToken] = useState(0)

  const currentPage = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
  const currentCategory = searchParams.get('category') || ''
  const effectiveMarketQuery = typeof marketQuery === 'string' ? marketQuery : ''
  const setMarketQuery = typeof onMarketQueryChange === 'function' ? onMarketQueryChange : () => {}

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

  const normalizedQuery = effectiveMarketQuery.trim().toLowerCase()
  const visibleItems = normalizedQuery
    ? items.filter((item) => {
        const haystack = [item.title, item.category, item.description, item.location, item.sellerName]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
        return haystack.includes(normalizedQuery)
      })
    : items

  return (
    <main className="page-shell marketplace-shell">
      <section className="panel search-page-hero">
        <p className="eyebrow">Verified students only</p>
        <h1>Buy &amp; sell on campus safely</h1>
        <p className="subcopy">
          Search listings, narrow by category, and keep the marketplace focused on Ulsan College students.
        </p>

        <div className="dashboard-search" role="search" aria-label="Marketplace search">
          <input
            value={effectiveMarketQuery}
            onChange={(event) => setMarketQuery(event.target.value)}
            type="search"
            placeholder="Search textbooks, laptops, bikes..."
            aria-label="Search marketplace listings"
          />
          <span className="hero-search-tag">Live search</span>
        </div>

        <div className="category-chip-row" aria-label="Quick categories">
          <button
            type="button"
            className={`category-chip ${!currentCategory ? 'is-active' : ''}`}
            onClick={() => handleCategoryChange('')}
          >
            All
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

        <div className="search-page-meta">
          <span>{t(language, 'browse.browseListings')}</span>
          <span>{normalizedQuery ? `Showing matches for "${effectiveMarketQuery}"` : 'Browse the newest campus listings.'}</span>
        </div>
      </section>

      <ItemGrid
        items={visibleItems}
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