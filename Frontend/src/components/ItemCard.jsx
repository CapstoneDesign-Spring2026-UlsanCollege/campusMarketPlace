import { useEffect, useMemo, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { API_ORIGIN, updateItem } from '../services/api'
import { toggleItemFavorite } from '../services/api'
import Avatar from './Avatar'
import { t } from '../services/i18n'
import { formatPriceFromUsd } from '../services/currency'
import { getAuthUser } from '../services/auth'

function getPrimaryImageValue(item) {
  if (item?.image) {
    if (typeof item.image === 'string') {
      return item.image
    }
    if (typeof item.image === 'object' && item.image.url) {
      return item.image.url
    }
  }

  if (Array.isArray(item?.images) && item.images.length > 0) {
    const first = item.images[0]
    if (typeof first === 'string') {
      return first
    }
    if (first && typeof first === 'object' && first.url) {
      return first.url
    }
  }

  return ''
}

function resolveImageUrl(image) {
  if (!image) {
    return ''
  }

  if (/^https?:\/\//i.test(image) || image.startsWith('data:') || image.startsWith('blob:')) {
    return image
  }

  return new URL(image.replace(/^\/+/, ''), `${API_ORIGIN}/`).href
}

function formatPostedTime(value) {
  if (!value) {
    return 'Recently'
  }

  const createdAt = new Date(value)
  if (Number.isNaN(createdAt.getTime())) {
    return 'Recently'
  }

  const diffHours = Math.max(1, Math.round((Date.now() - createdAt.getTime()) / (1000 * 60 * 60)))
  if (diffHours < 24) {
    return `${diffHours}h ago`
  }

  return `${Math.max(1, Math.round(diffHours / 24))}d ago`
}

function getConditionLabel(item) {
  const raw = item?.condition || item?.itemCondition || item?.state || ''
  const normalized = String(raw).trim()

  if (normalized) {
    return normalized
  }

  if (item?.status === 'sold') {
    return 'Popular'
  }

  return 'Like New'
}

function getConditionTone(label) {
  const normalized = String(label).toLowerCase()

  if (normalized.includes('popular') || normalized.includes('hot')) {
    return 'is-popular'
  }

  if (normalized.includes('like') || normalized.includes('new')) {
    return 'is-hot'
  }

  return ''
}

export default function ItemCard({ item, currency, language = 'en' }) {
  const navigate = useNavigate()
  const currentUser = getAuthUser()
  const currentUserId = currentUser?.id || currentUser?._id || currentUser?.userId || ''
  const imageSrc = resolveImageUrl(getPrimaryImageValue(item))
  const formattedPrice = formatPriceFromUsd(item.price, currency)
  const originalPriceValue = Number(item?.originalPrice ?? item?.compareAtPrice ?? item?.listPrice ?? item?.previousPrice)
  const hasOriginalPrice = Number.isFinite(originalPriceValue) && originalPriceValue > Number(item.price)
  const locationLabel = item?.location || 'Campus'
  const sellerVerified = Boolean(item?.seller_verified || item?.sellerVerified)
  const conditionLabel = getConditionLabel(item)
  const conditionTone = getConditionTone(conditionLabel)
  const sellerName = item.sellerName || 'Seller'
  const sellerId = item?.seller_id || item?.sellerId || ''
  const isSeller = Boolean(currentUserId && sellerId && String(currentUserId) === String(sellerId))
  const initialListingStatus = String(item?.status || 'active').toLowerCase()
  const [listingStatus, setListingStatus] = useState(initialListingStatus)
  const sellerLabelMap = {
    active: 'On sale by',
    reserved: 'Reserved by',
    sold: 'Sold by',
    removed: 'On sale by',
    draft: 'On sale by',
  }
  const sellerLabel = sellerLabelMap[listingStatus] || 'On sale by'
  const statusOptions = [
    { value: 'active', label: 'On sale' },
    { value: 'reserved', label: 'Reserved' },
    { value: 'sold', label: 'Sold' },
  ]
  const initialLoveCount = Number.isFinite(Number(item?.favoritesCount)) ? Math.max(0, Number(item.favoritesCount)) : 0
  const [isLoved, setIsLoved] = useState(Boolean(item?.isLoved || item?.isFavorited || item?.isLiked || item?.liked))
  const [loveCount, setLoveCount] = useState(initialLoveCount)
  // comment UI removed per design — keep messaging only
  const [isEditingStatus, setIsEditingStatus] = useState(false)
  const [statusDraft, setStatusDraft] = useState(initialListingStatus)
  const [statusMessage, setStatusMessage] = useState('')
  const [statusError, setStatusError] = useState('')
  const [isSavingStatus, setIsSavingStatus] = useState(false)
  const [isSavingLove, setIsSavingLove] = useState(false)

  useEffect(() => {
    const nextStatus = String(item?.status || 'active').toLowerCase()
    setListingStatus(nextStatus)
    setStatusDraft(nextStatus)
  }, [item?.status])



  async function handleLoveToggle() {
    if (isSavingLove) {
      return
    }

    const nextLoved = !isLoved
    const nextCount = Math.max(0, loveCount + (nextLoved ? 1 : -1))
    setIsSavingLove(true)
    setIsLoved(nextLoved)
    setLoveCount(nextCount)

    try {
      const response = await toggleItemFavorite(item._id)
      const updatedItem = response?.item || {}
      const confirmedLoved = Boolean(updatedItem?.isLoved || updatedItem?.isFavorited || response?.isLoved)
      setIsLoved(confirmedLoved)
      if (Number.isFinite(Number(updatedItem?.favoritesCount))) {
        setLoveCount(Math.max(0, Number(updatedItem.favoritesCount)))
      }
    } catch (error) {
      setIsLoved(!nextLoved)
      setLoveCount(loveCount)
      setStatusError(error instanceof Error ? error.message : 'Unable to update favorites.')
    } finally {
      setIsSavingLove(false)
    }
  }

  function handleMessageSeller() {
    const query = new URLSearchParams({ item: String(item._id) })
    navigate(`/messages?${query.toString()}`)
  }

  function openStatusEditor() {
    setStatusDraft(listingStatus)
    setStatusError('')
    setStatusMessage('')
    setIsEditingStatus((current) => !current)
  }

  async function handleSaveStatus() {
    if (!isSeller) {
      return
    }

    setIsSavingStatus(true)
    setStatusError('')
    setStatusMessage('')

    try {
      await updateItem(item._id, { status: statusDraft })
      setListingStatus(statusDraft)
      setStatusMessage('Listing status updated.')
      setIsEditingStatus(false)
    } catch (error) {
      setStatusError(error instanceof Error ? error.message : 'Unable to update listing status.')
    } finally {
      setIsSavingStatus(false)
    }
  }

  return (
    <article className="item-card">
      <div className="item-thumb">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={`${item.title} by ${sellerName}`}
            loading="lazy"
          />
        ) : (
          <div className="item-thumb-fallback" aria-hidden="true">
            <span>{item.category?.slice(0, 1)?.toUpperCase() || 'I'}</span>
          </div>
        )}
      </div>

      <div className="item-card-body">
        <div className="item-card-topline">
          <span className="item-category">{item.category}</span>
          <span className="item-posted">{formatPostedTime(item.createdAt)}</span>
        </div>
        <h2 className="item-title">{item.title}</h2>
        <div className="listing-price-row">
          <span className="item-price">{formattedPrice}</span>
          {hasOriginalPrice ? <span className="item-original-price">{formatPriceFromUsd(originalPriceValue, currency)}</span> : null}
        </div>
        <div className="listing-meta">
          <span className={`item-condition ${conditionTone}`}>{conditionLabel}</span>
          <span className="item-location">{locationLabel}</span>
        </div>
        <div className="item-seller-row">
          <Link to={`/profile/${sellerId}`} className="seller-avatar-link">
            <Avatar src={item.sellerAvatarUrl || item.sellerAvatar || item.seller_avatar || item.seller_avatar_url} alt={sellerName} size={36} />
          </Link>
          <div className="item-seller-copy">
            {/* seller name removed from inline copy per design — avatar links to profile */}
            {isSeller ? <p className="item-seller-hint">You can update this listing when it is reserved or sold.</p> : null}
          </div>
          <div className="item-seller-actions">
            {/* show friendly status label instead of raw status and remove verified badge */}
            <span className={`status-badge status-${listingStatus}`}>{(statusOptions.find(o => o.value === listingStatus) || { label: 'On sale' }).label}</span>
          </div>
        </div>
        {isSeller ? (
          <div className="item-status-editor">
            {isEditingStatus ? (
              <>
                <label className="item-status-label" htmlFor={`status-${item._id}`}>Status</label>
                <div className="item-status-controls">
                  <select
                    id={`status-${item._id}`}
                    className="category-filter item-status-select"
                    value={statusDraft}
                    onChange={(event) => setStatusDraft(event.target.value)}
                    disabled={isSavingStatus}
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="button button-primary button-small"
                    onClick={handleSaveStatus}
                    disabled={isSavingStatus}
                  >
                    {isSavingStatus ? 'Saving…' : 'Save status'}
                  </button>
                  <button
                    type="button"
                    className="button button-secondary button-small"
                    onClick={() => setIsEditingStatus(false)}
                    disabled={isSavingStatus}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <button type="button" className="button button-secondary button-small" onClick={openStatusEditor}>
                Edit status
              </button>
            )}
            {statusMessage ? <p className="item-status-feedback success">{statusMessage}</p> : null}
            {statusError ? <p className="item-status-feedback error">{statusError}</p> : null}
          </div>
        ) : null}
        <div className="item-actions-row" aria-label="Buyer actions">
          <button
            type="button"
            className={`item-action-button item-action-love ${isLoved ? 'is-active' : ''}`}
            onClick={handleLoveToggle}
            aria-pressed={isLoved}
            disabled={isSavingLove}
          >
            <span>♥ {t(language, 'dashboard.love')}</span>
            <strong>{loveCount}</strong>
          </button>

          <button
            type="button"
            className="item-action-button item-action-message"
            onClick={handleMessageSeller}
          >
            <span>{t(language, 'dashboard.messageSeller')}</span>
          </button>
        </div>
        {/* comment compose removed; messaging flows through Messages page */}
      </div>
    </article>
  )
}