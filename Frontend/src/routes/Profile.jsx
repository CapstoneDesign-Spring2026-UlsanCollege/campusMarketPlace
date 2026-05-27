import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchProfile, toggleItemFavorite, updateItem } from '../services/api'
import { formatPriceFromUsd } from '../services/currency'
import { getAuthToken } from '../services/auth'
import { t } from '../services/i18n'

function getInitial(value) {
  return (value || 'Student').trim().charAt(0).toUpperCase() || 'S'
}

function formatDate(value) {
  if (!value) {
    return 'Recently'
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return 'Recently'
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

function ListingStatusEditor({ item, currency, onStatusUpdated }) {
  const [statusDraft, setStatusDraft] = useState(String(item.status || 'active').toLowerCase())
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [feedback, setFeedback] = useState({ type: '', message: '' })

  useEffect(() => {
    setStatusDraft(String(item.status || 'active').toLowerCase())
  }, [item.status])

  async function handleSaveStatus() {
    setIsSaving(true)
    setFeedback({ type: '', message: '' })

    try {
      await updateItem(item._id, { status: statusDraft })
      setIsEditing(false)
      setFeedback({ type: 'success', message: 'Listing status updated.' })
      if (typeof onStatusUpdated === 'function') {
        onStatusUpdated(item._id, statusDraft)
      }
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error instanceof Error ? error.message : 'Unable to update listing status.',
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <article className="profile-list-item profile-activity-item" key={item._id}>
      <div className="activity-info">
        <strong className="activity-title">{item.title}</strong>
        <p className="activity-meta">
          <span className="category-badge">{item.category || 'Listing'}</span>
          <span className={`status-badge status-${(item.status || 'active').toLowerCase()}`}>{item.status || 'active'}</span>
          <span className="date-meta">{formatDate(item.createdAt)}</span>
        </p>
        {isEditing ? (
          <div className="item-status-editor profile-item-status-editor">
            <label className="item-status-label" htmlFor={`profile-status-${item._id}`}>Status</label>
            <div className="item-status-controls">
              <select
                id={`profile-status-${item._id}`}
                className="category-filter item-status-select"
                value={statusDraft}
                onChange={(event) => setStatusDraft(event.target.value)}
                disabled={isSaving}
              >
                <option value="active">On sale</option>
                <option value="reserved">Reserved</option>
                <option value="sold">Sold</option>
              </select>
              <button
                type="button"
                className="button button-primary button-small"
                onClick={handleSaveStatus}
                disabled={isSaving}
              >
                {isSaving ? 'Saving…' : 'Save status'}
              </button>
              <button
                type="button"
                className="button button-secondary button-small"
                onClick={() => setIsEditing(false)}
                disabled={isSaving}
              >
                Cancel
              </button>
            </div>
            {feedback.message ? <p className={`item-status-feedback ${feedback.type}`}>{feedback.message}</p> : null}
          </div>
        ) : null}
      </div>
      <div className="profile-activity-actions">
        <span className="activity-price">{formatPriceFromUsd(item.price, currency)}</span>
        <button
          type="button"
          className="button button-secondary button-small"
          onClick={() => setIsEditing((current) => !current)}
        >
          Edit status
        </button>
      </div>
    </article>
  )
}

function PaymentMethodList({ paymentMethods }) {
  if (!paymentMethods.length) {
    return (
      <div className="profile-empty-state">
        <div className="empty-state-icon">💳</div>
        <p><strong>No payment methods yet</strong></p>
        <p className="empty-state-hint">Add a payment method in your account settings.</p>
      </div>
    )
  }

  return (
    <div className="profile-list">
      {paymentMethods.map((method, index) => (
        <article className="profile-list-item profile-payment-item" key={method.id || method.label || index}>
          <div className="payment-info">
            <div className="payment-icon">💳</div>
            <div>
              <strong>{method.label || method.provider || method.type || 'Payment method'}</strong>
              <p>
                {[method.type, method.provider, method.last4 ? `•••• ${method.last4}` : null]
                  .filter(Boolean)
                  .join(' • ')}
              </p>
            </div>
          </div>
          {method.isDefault ? <span className="badge badge-default">Default</span> : null}
        </article>
      ))}
    </div>
  )
}

function ActivityList({ items, currency, emptyMessage, onStatusUpdated }) {
  if (!items.length) {
    return (
      <div className="profile-empty-state">
        <div className="empty-state-icon">📦</div>
        <p><strong>Nothing here yet</strong></p>
        <p className="empty-state-hint">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="profile-list">
      {items.map((item) => (
        <ListingStatusEditor key={item._id} item={item} currency={currency} onStatusUpdated={onStatusUpdated} />
      ))}
    </div>
  )
}

function FavoriteItemsList({ items, currency, onRemoveFavorite }) {
  if (!items.length) {
    return (
      <div className="profile-empty-state">
        <div className="empty-state-icon">♡</div>
        <p><strong>No favorites yet</strong></p>
        <p className="empty-state-hint">Tap the love button on any listing to save it here.</p>
      </div>
    )
  }

  return (
    <div className="profile-list">
      {items.map((item) => (
        <article className="profile-list-item profile-favorite-item" key={item._id}>
          <div className="activity-info">
            <strong className="activity-title">{item.title}</strong>
            <p className="activity-meta">
              <span className="category-badge">{item.category || 'Listing'}</span>
              <span className={`status-badge status-${(item.status || 'active').toLowerCase()}`}>{item.status || 'active'}</span>
            </p>
          </div>
          <div className="profile-activity-actions">
            <span className="activity-price">{formatPriceFromUsd(item.price, currency)}</span>
            <button
              type="button"
              className="button button-secondary button-small"
              onClick={() => onRemoveFavorite(item._id)}
            >
              Remove
            </button>
          </div>
        </article>
      ))}
    </div>
  )
}

function StatusFilterTabs({ filter, onChange, counts }) {
  const tabs = [
    { value: 'all', label: 'All', count: counts.all },
    { value: 'active', label: 'On sale', count: counts.active },
    { value: 'reserved', label: 'Reserved', count: counts.reserved },
    { value: 'sold', label: 'Sold', count: counts.sold },
  ]

  return (
    <div className="profile-status-filters" role="tablist" aria-label="Listing status filters">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          role="tab"
          aria-selected={filter === tab.value}
          className={`category-chip profile-status-filter ${filter === tab.value ? 'is-active' : ''}`}
          onClick={() => onChange(tab.value)}
        >
          <span>{tab.label}</span>
          <strong>{tab.count}</strong>
        </button>
      ))}
    </div>
  )
}

export default function Profile({ currency, language = 'en' }) {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [buyHistory, setBuyHistory] = useState([])
  const [sellHistory, setSellHistory] = useState([])
  const [favoriteItems, setFavoriteItems] = useState([])
  const [listingFilter, setListingFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [favoriteError, setFavoriteError] = useState('')

  useEffect(() => {
    const token = getAuthToken()
    if (!token) {
      navigate('/login', { replace: true, state: { message: 'Please log in first.' } })
      return
    }

    let isActive = true

    async function loadProfile() {
      try {
        setIsLoading(true)
        setLoadError('')
        const data = await fetchProfile()

        if (!isActive) {
          return
        }

        setProfile(data?.user || null)
        setBuyHistory(Array.isArray(data?.buyHistory) ? data.buyHistory : [])
        setSellHistory(Array.isArray(data?.sellHistory) ? data.sellHistory : [])
        setFavoriteItems(Array.isArray(data?.favoriteItems) ? data.favoriteItems : [])
      } catch (error) {
        if (!isActive) {
          return
        }
        setLoadError(error?.message || 'Unable to load profile data right now.')
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    loadProfile()

    return () => {
      isActive = false
    }
  }, [navigate])

  const displayName = useMemo(() => {
    const firstName = profile?.firstName || 'Student'
    const lastName = profile?.lastName || ''
    return `${firstName} ${lastName}`.trim()
  }, [profile])

  const locationLabel = profile?.location || 'Campus'
  const paymentMethods = Array.isArray(profile?.paymentMethods) ? profile.paymentMethods : []
  const sellHistoryCounts = useMemo(() => {
    return sellHistory.reduce(
      (counts, item) => {
        const status = String(item?.status || 'active').toLowerCase()
        counts.all += 1
        if (counts[status] !== undefined) {
          counts[status] += 1
        }
        return counts
      },
      { all: 0, active: 0, reserved: 0, sold: 0 },
    )
  }, [sellHistory])

  const visibleSellHistory = useMemo(() => {
    if (listingFilter === 'all') {
      return sellHistory
    }

    return sellHistory.filter((item) => String(item?.status || 'active').toLowerCase() === listingFilter)
  }, [listingFilter, sellHistory])

  function handleListingStatusUpdated(itemId, nextStatus) {
    const normalizedStatus = String(nextStatus || 'active').toLowerCase()
    setSellHistory((current) =>
      current.map((item) => {
        if (item._id !== itemId) {
          return item
        }

        return { ...item, status: normalizedStatus }
      }),
    )
  }

  async function handleFavoriteToggle(itemId) {
    try {
      setFavoriteError('')
      const response = await toggleItemFavorite(itemId)
      const isLoved = Boolean(response?.isLoved)

      setFavoriteItems((current) => {
        if (isLoved) {
          const favoriteItem = response?.item || current.find((item) => item._id === itemId)
          if (!favoriteItem) {
            return current
          }
          return [favoriteItem, ...current.filter((item) => item._id !== itemId)]
        }

        return current.filter((item) => item._id !== itemId)
      })
    } catch (error) {
      setFavoriteError(error instanceof Error ? error.message : 'Unable to update favorites right now.')
    }
  }

  return (
    <main className="page-shell profile-shell">
      <section className="profile-hero panel">
        <div className="profile-hero-content">
          <div className="profile-avatar-wrapper">
            <img src={profile?.avatarUrl || ''} alt={`${displayName} avatar`} className="profile-avatar-img" onError={(e) => { e.target.style.display = 'none' }} />
            {!profile?.avatarUrl ? <div className="profile-avatar" aria-hidden="true">{getInitial(displayName)}</div> : null}
          </div>
          <div className="profile-hero-copy">
            <p className="eyebrow">{t(language, 'profile.yourAccount')}</p>
            <h1>{displayName}</h1>
            <p className="subcopy">{t(language, 'profile.yourAccount')} — {t(language, 'profile.storedLocationNote')}</p>
          </div>
          <div className="profile-hero-action">
            <button className="button button-primary profile-edit-button" type="button" onClick={() => navigate('/profile/edit')}>
              ✎ Edit profile
            </button>
          </div>
        </div>
        <div className="profile-hero-meta">
          <div className="meta-item">
            <span className="profile-meta-label">📧 Email</span>
            <strong>{profile?.email || 'Not available'}</strong>
          </div>
          <div className="meta-item">
            <span className="profile-meta-label">📍 Location</span>
            <strong>{locationLabel}</strong>
          </div>
          <div className="meta-item">
            <span className="profile-meta-label">💳 Payment methods</span>
            <strong>{paymentMethods.length ? `${paymentMethods.length} method${paymentMethods.length > 1 ? 's' : ''}` : 'None saved'}</strong>
          </div>
        </div>
      </section>

      <section className="profile-grid" aria-label="Account sections">
        <article className="profile-card panel">
            <div className="profile-card-header">
            <div>
              <p className="eyebrow">{t(language, 'profile.buyHistory')}</p>
              <h2>{t(language, 'profile.purchases')}</h2>
            </div>
          </div>
          {isLoading ? (
            <div className="profile-empty-state">
              <p>{t(language, 'profile.loadingPurchaseHistory')}</p>
            </div>
          ) : loadError ? (
            <div className="profile-empty-state">
              <p>{loadError}</p>
            </div>
          ) : (
            <ActivityList
              items={buyHistory}
              currency={currency}
              emptyMessage={t(language, 'profile.noPurchaseHistory')}
            />
          )}
        </article>

        <article className="profile-card panel">
          <div className="profile-card-header">
            <div>
              <p className="eyebrow">{t(language, 'profile.sellHistory')}</p>
              <h2>{t(language, 'profile.yourListings')}</h2>
            </div>
          </div>
          <StatusFilterTabs filter={listingFilter} onChange={setListingFilter} counts={sellHistoryCounts} />
          {isLoading ? (
            <div className="profile-empty-state">
              <p>{t(language, 'profile.loadingListingHistory')}</p>
            </div>
          ) : loadError ? (
            <div className="profile-empty-state">
              <p>{loadError}</p>
            </div>
          ) : (
            <ActivityList
              items={visibleSellHistory}
              currency={currency}
              emptyMessage={t(language, 'profile.noListingsPosted')}
              onStatusUpdated={handleListingStatusUpdated}
            />
          )}
        </article>

        <article className="profile-card panel">
          <div className="profile-card-header">
            <div>
              <p className="eyebrow">Favorites</p>
              <h2>Your loved items</h2>
            </div>
          </div>
          {isLoading ? (
            <div className="profile-empty-state">
              <p>Loading favorites...</p>
            </div>
          ) : favoriteError ? (
            <div className="profile-empty-state">
              <p>{favoriteError}</p>
            </div>
          ) : (
            <FavoriteItemsList
              items={favoriteItems}
              currency={currency}
              onRemoveFavorite={handleFavoriteToggle}
            />
          )}
        </article>

        <article className="profile-card panel">
          <div className="profile-card-header">
            <div>
              <p className="eyebrow">Location</p>
              <h2>Pickup preferences</h2>
            </div>
          </div>
          <div className="profile-detail-box">
            <p>{t(language, 'profile.primaryLocation')}: {locationLabel}</p>
            <p>{t(language, 'profile.storedLocationNote')}</p>
          </div>
        </article>

        <article className="profile-card panel">
          <div className="profile-card-header">
            <div>
              <p className="eyebrow">Payment methods</p>
              <h2>Secure checkout</h2>
            </div>
          </div>
          <PaymentMethodList paymentMethods={paymentMethods} />
        </article>
      </section>
    </main>
  )
}