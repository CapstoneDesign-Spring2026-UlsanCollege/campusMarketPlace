import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ItemGrid from '../components/ItemGrid'
import { fetchItems } from '../services/api'
import { CATEGORIES } from '../constants/categories'
import { t } from '../services/i18n'

const ITEMS_PER_PAGE = 20
const SORT_LABELS = {
  relevance: 'Best match',
  newest: 'Newest first',
  priceLow: 'Price: low to high',
  priceHigh: 'Price: high to low',
}

function getItemPrice(item) {
  const price = Number(item?.price)
  return Number.isFinite(price) ? price : Number.POSITIVE_INFINITY
}

function getCreatedAtValue(item) {
  const createdAt = new Date(item?.createdAt || 0).getTime()
  return Number.isFinite(createdAt) ? createdAt : 0
}

function buildSearchText(item) {
  return [item?.title, item?.category, item?.description, item?.location, item?.sellerName]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
}

function getRelevanceScore(item, normalizedQuery) {
  if (!normalizedQuery) return 0

  const queryTerms = normalizedQuery.split(/\s+/).filter(Boolean)
  const title = String(item?.title || '').toLowerCase()
  const category = String(item?.category || '').toLowerCase()
  const description = String(item?.description || '').toLowerCase()
  const location = String(item?.location || '').toLowerCase()
  const sellerName = String(item?.sellerName || '').toLowerCase()

  let score = 0

  for (const term of queryTerms) {
    const titleIndex = title.indexOf(term)
    const categoryIndex = category.indexOf(term)
    const descriptionIndex = description.indexOf(term)
    const locationIndex = location.indexOf(term)
    const sellerIndex = sellerName.indexOf(term)

    if (titleIndex >= 0) score += titleIndex === 0 ? 8 : 4
    if (categoryIndex >= 0) score += categoryIndex === 0 ? 5 : 2
    if (descriptionIndex >= 0) score += descriptionIndex === 0 ? 3 : 1
    if (locationIndex >= 0) score += locationIndex === 0 ? 3 : 1
    if (sellerIndex >= 0) score += sellerIndex === 0 ? 2 : 1
  }

  if (title.includes(normalizedQuery)) score += 10
  if (category.includes(normalizedQuery)) score += 6
  if (description.includes(normalizedQuery)) score += 2

  return score
}

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
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false)
  const resultsRef = useRef(null)

  const currentPage = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
  const currentCategory = searchParams.get('category') || ''
  const currentSort = searchParams.get('sort') || 'relevance'
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

  function handleSortChange(nextSort) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (nextSort && nextSort !== 'relevance') {
        next.set('sort', nextSort)
      } else {
        next.delete('sort')
      }
      next.set('page', '1')
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
    setIsSuggestionsOpen(false)
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

  function handleSuggestionSelect(value) {
    setSearchDraft(value)
    setMarketQuery(value)
    setIsSuggestionsOpen(false)
    window.requestAnimationFrame(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  const normalizedQuery = effectiveMarketQuery.trim().toLowerCase()
  const searchSuggestions = useMemo(() => {
    const query = searchDraft.trim().toLowerCase()
    if (query.length < 2) return []

    const seen = new Set()
    const suggestions = []

    for (const item of items) {
      const candidates = [item?.title, item?.category, item?.location, item?.sellerName].filter(Boolean)
      for (const candidate of candidates) {
        const text = String(candidate).trim()
        const normalized = text.toLowerCase()
        if (!text || seen.has(normalized) || !normalized.includes(query)) {
          continue
        }

        seen.add(normalized)
        suggestions.push(text)
        break
      }

      if (suggestions.length >= 6) {
        break
      }
    }

    return suggestions
  }, [items, searchDraft])

  const visibleItems = normalizedQuery
    ? items.filter((item) => {
        return buildSearchText(item).includes(normalizedQuery)
      })
    : items
  const sortedItems = useMemo(() => {
    const nextItems = [...visibleItems]

    if (currentSort === 'priceLow') {
      return nextItems.sort((left, right) => getItemPrice(left) - getItemPrice(right))
    }

    if (currentSort === 'priceHigh') {
      return nextItems.sort((left, right) => getItemPrice(right) - getItemPrice(left))
    }

    if (currentSort === 'newest') {
      return nextItems.sort((left, right) => getCreatedAtValue(right) - getCreatedAtValue(left))
    }

    if (normalizedQuery) {
      return nextItems.sort((left, right) => getRelevanceScore(right, normalizedQuery) - getRelevanceScore(left, normalizedQuery))
    }

    return nextItems.sort((left, right) => getCreatedAtValue(right) - getCreatedAtValue(left))
  }, [visibleItems, currentSort, normalizedQuery])

  return (
    <main className="page-shell marketplace-shell">
      <section className="panel search-page-hero">
        <p className="eyebrow">Verified students only</p>
        <h1>Buy &amp; sell on campus safely</h1>
        <p className="subcopy">
          Search listings, narrow by category, and keep the marketplace focused on Ulsan College students.
        </p>

        <div className="search-toolbar-panel">
          <form className="dashboard-search search-toolbar-search" role="search" aria-label="Marketplace search" onSubmit={handleSearchSubmit}>
            <div className="search-input-shell">
              <input
                value={searchDraft}
                onChange={handleSearchInputChange}
                onFocus={() => setIsSuggestionsOpen(true)}
                onBlur={() => window.setTimeout(() => setIsSuggestionsOpen(false), 120)}
                type="search"
                placeholder="Search textbooks, laptops, bikes..."
                aria-label="Search marketplace listings"
                aria-autocomplete="list"
                aria-expanded={isSuggestionsOpen && searchSuggestions.length > 0}
                aria-controls="search-suggestions"
              />
              {isSuggestionsOpen && searchSuggestions.length > 0 ? (
                <div id="search-suggestions" className="search-suggestions" role="listbox" aria-label="Search suggestions">
                  {searchSuggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      className="search-suggestion"
                      role="option"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => handleSuggestionSelect(suggestion)}
                    >
                      <span>{suggestion}</span>
                      <small>Search this term</small>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            <button
              type="button"
              className={`hero-search-tag live-search-toggle ${liveSearchEnabled ? 'is-active' : ''}`}
              aria-pressed={liveSearchEnabled}
              onClick={handleLiveSearchToggle}
            >
              Live search: {liveSearchEnabled ? 'On' : 'Off'}
            </button>
            <select
              className="search-sort-select"
              value={currentSort}
              onChange={(event) => handleSortChange(event.target.value)}
              aria-label="Sort search results"
            >
              {Object.entries(SORT_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </form>

          <div className="search-toolbar-meta">
            <span className="search-toolbar-pill">{searchSuggestions.length ? `${searchSuggestions.length} suggestions` : 'Type to see suggestions'}</span>
            <span className="search-toolbar-pill">{SORT_LABELS[currentSort] || SORT_LABELS.relevance}</span>
          </div>
        </div>

        <div className="category-options-wrap">
          <button
            type="button"
            className="button button-secondary category-toggle"
            aria-expanded={showCategories}
            aria-controls="search-category-options"
            onClick={() => setShowCategories((current) => !current)}
          >
            {showCategories ? 'Hide filters' : 'Show filters'} <span aria-hidden="true">{showCategories ? '−' : '+'}</span>
          </button>

          {showCategories && (
            <div id="search-category-options" className="category-chip-row search-category-options" aria-label="Quick categories">
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
          items={sortedItems}
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
