import { useEffect, useRef, useState } from 'react'
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
  const [showCategories, setShowCategories] = useState(false)
  const [liveSearchEnabled, setLiveSearchEnabled] = useState(true)
  const [searchDraft, setSearchDraft] = useState('')
  const resultsRef = useRef(null)

  const currentPage = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
  const currentCategory = searchParams.get('category') || ''
  const effectiveMarketQuery = typeof marketQuery === 'string' ? marketQuery : ''
  const setMarketQuery = typeof onMarketQueryChange === 'function' ? onMarketQueryChange : () => {}

  useEffect(() => {
    setSearchDraft(effectiveMarketQuery)
  }, [effectiveMarketQuery])

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

  function handleSearchInputChange(event) {
    const nextQuery = event.target.value
    setSearchDraft(nextQuery)
    if (liveSearchEnabled) {
      setMarketQuery(nextQuery)
    }
  }

  function handleSearchSubmit(event) {
    event.preventDefault()
    setMarketQuery(searchDraft)
    window.requestAnimationFrame(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  function handleLiveSearchToggle() {
    setLiveSearchEnabled((current) => {
      const next = !current
      if (next) {
        setMarketQuery(searchDraft)
      }
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

        <form className="dashboard-search" role="search" aria-label="Marketplace search" onSubmit={handleSearchSubmit}>
          <input
            value={searchDraft}
            onChange={handleSearchInputChange}
            type="search"
            placeholder="Search textbooks, laptops, bikes..."
            aria-label="Search marketplace listings"
          />
          <button
            type="button"
            className={`hero-search-tag live-search-toggle ${liveSearchEnabled ? 'is-active' : ''}`}
            aria-pressed={liveSearchEnabled}
            onClick={handleLiveSearchToggle}
          >
            Live search: {liveSearchEnabled ? 'On' : 'Off'}
          </button>
        </form>

        <div className="category-options-wrap">
          <button
            type="button"
            className="button button-secondary category-toggle"
            aria-expanded={showCategories}
            aria-controls="search-category-options"
            onClick={() => setShowCategories((current) => !current)}
          >
            Show options <span aria-hidden="true">{showCategories ? '→' : '●'}</span>
          </button>

          {showCategories && (
            <div id="search-category-options" className="category-chip-row" aria-label="Quick categories">
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
          )}
        </div>

        <p className="search-page-meta">
          {t(language, 'browse.browseListings')}, {normalizedQuery ? `showing matches for "${effectiveMarketQuery}".` : 'Browse the newest campus listings.'}
        </p>
      </section>

      <div ref={resultsRef}>
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
      </div>
    </main>
  )
}
