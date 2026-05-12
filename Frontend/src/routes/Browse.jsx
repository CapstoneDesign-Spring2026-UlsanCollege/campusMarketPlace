import { useEffect, useState } from 'react'
import ItemGrid from '../components/ItemGrid'
import { fetchItems } from '../services/api'

const ITEMS_PER_PAGE = 20

export default function Browse() {
  const [items, setItems] = useState([])
  const [pagination, setPagination] = useState({ page: 1, limit: ITEMS_PER_PAGE, total: 0, pages: 1 })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadToken, setReloadToken] = useState(0)

  useEffect(() => {
    let isActive = true

    async function loadItems() {
      try {
        setIsLoading(true)
        setError('')

        const data = await fetchItems(pagination.page, ITEMS_PER_PAGE)

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
  }, [pagination.page, reloadToken])

  function handleRetry() {
    setReloadToken((current) => current + 1)
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
        onPageChange={(nextPage) => setPagination((current) => ({ ...current, page: nextPage }))}
        onRetry={handleRetry}
      />
    </main>
  )
}