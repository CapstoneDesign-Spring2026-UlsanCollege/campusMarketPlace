import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ItemGrid from '../components/ItemGrid'
import { fetchItems } from '../services/api'

const ITEMS_PER_PAGE = 20

export default function Browse() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [items, setItems] = useState([])
  const [pagination, setPagination] = useState({ page: 1, limit: ITEMS_PER_PAGE, total: 0, pages: 1 })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadToken, setReloadToken] = useState(0)

  const currentPage = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
  const currentCategory = searchParams.get('category') || ''

  useEffect(() => {
    let isActive = true

    async function loadItems() {
      try {
        setIsLoading(true)
        setError('')

        // Require a category selection before fetching; browse shows sold items only.
        if (!currentCategory) {
          setItems([])
          setPagination({ page: 1, limit: ITEMS_PER_PAGE, total: 0, pages: 1 })
          return
        }

        const data = await fetchItems(currentPage, ITEMS_PER_PAGE, currentCategory, 'sold')

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
        <p className="eyebrow">Campus marketplace</p>
        <h1>Browse items</h1>
        <p className="subcopy">Find books, tech, furniture, and everyday essentials in a clean grid view.</p>
      </section>

      <ItemGrid
        items={items}
        isLoading={isLoading}
        error={error}
        pagination={pagination}
        currentCategory={currentCategory}
        onCategoryChange={handleCategoryChange}
        onPageChange={handlePageChange}
        onRetry={handleRetry}
      />
    </main>
  )
}