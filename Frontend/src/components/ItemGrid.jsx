import ItemCard from './ItemCard'

function LoadingState() {
  return (
    <div className="state-card" role="status" aria-live="polite">
      <p className="state-title">Loading items</p>
      <p className="state-copy">Fetching the latest marketplace listings…</p>
    </div>
  )
}

function ErrorState({ error, onRetry }) {
  return (
    <div className="state-card state-card-error" role="alert">
      <p className="state-title">Could not load items</p>
      <p className="state-copy">{error}</p>
      <button className="button button-primary" type="button" onClick={onRetry}>
        Try again
      </button>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="state-card" role="status">
      <p className="state-title">No items yet</p>
      <p className="state-copy">Be the first to post something for the campus marketplace.</p>
    </div>
  )
}

export default function ItemGrid({ items, isLoading, error, pagination, onPageChange, onRetry }) {
  const page = pagination?.page || 1
  const pages = pagination?.pages || 1
  const total = pagination?.total || 0
  const limit = pagination?.limit || items.length || 20
  const start = total === 0 ? 0 : (page - 1) * limit + 1
  const end = total === 0 ? 0 : Math.min(page * limit, total)

  return (
    <section className="browse-section" aria-label="Marketplace items">
      <div className="browse-toolbar">
        <div>
          <p className="eyebrow">Browse listings</p>
          <h2>Explore items across campus</h2>
          <p className="browse-summary">
            {total > 0 ? `Showing ${start}-${end} of ${total} items` : 'Browse the latest listings from students.'}
          </p>
        </div>

        <div className="pagination-summary" aria-label="Pagination summary">
          <span>Page {page} of {pages}</span>
          <div className="pagination-actions">
            <button
              className="button button-secondary"
              type="button"
              onClick={() => onPageChange(Math.max(1, page - 1))}
              disabled={isLoading || page <= 1}
            >
              Previous
            </button>
            <button
              className="button button-secondary"
              type="button"
              onClick={() => onPageChange(Math.min(pages, page + 1))}
              disabled={isLoading || page >= pages}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState error={error} onRetry={onRetry} />
      ) : items.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="item-grid" aria-busy={isLoading ? 'true' : 'false'}>
          {items.map((item) => (
            <ItemCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </section>
  )
}