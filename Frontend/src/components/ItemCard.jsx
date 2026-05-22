import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_ORIGIN } from '../services/api'
import Avatar from './Avatar'
import { t } from '../services/i18n'
import { formatPriceFromUsd } from '../services/currency'

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
  const imageSrc = resolveImageUrl(getPrimaryImageValue(item))
  const formattedPrice = formatPriceFromUsd(item.price, currency)
  const originalPriceValue = Number(item?.originalPrice ?? item?.compareAtPrice ?? item?.listPrice ?? item?.previousPrice)
  const hasOriginalPrice = Number.isFinite(originalPriceValue) && originalPriceValue > Number(item.price)
  const locationLabel = item?.location || 'Campus'
  const sellerVerified = Boolean(item?.seller_verified || item?.sellerVerified)
  const conditionLabel = getConditionLabel(item)
  const conditionTone = getConditionTone(conditionLabel)
  const sellerName = item.sellerName || 'Seller'
  const initialLikeCount = Number.isFinite(Number(item?.favoritesCount)) ? Math.max(0, Number(item.favoritesCount)) : 0
  const [isLiked, setIsLiked] = useState(Boolean(item?.isLiked || item?.liked))
  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const [commentDraft, setCommentDraft] = useState('')
  const [isCommentOpen, setIsCommentOpen] = useState(false)

  const suggestedComment = useMemo(() => {
    return `Hi ${sellerName}, I’m interested in ${item.title}. Is it still available?`
  }, [item.title, sellerName])

  function handleLikeToggle() {
    setIsLiked((current) => {
      const nextLiked = !current
      setLikeCount((currentCount) => Math.max(0, currentCount + (nextLiked ? 1 : -1)))
      return nextLiked
    })
  }

  function handleCommentOpen() {
    setIsCommentOpen((current) => !current)
    setCommentDraft((current) => current || suggestedComment)
  }

  function handleMessageSeller() {
    const query = new URLSearchParams({ item: String(item._id) })
    navigate(`/messages?${query.toString()}`)
  }

  function handleSendComment(event) {
    event.preventDefault()
    const draft = commentDraft.trim() || suggestedComment
    const query = new URLSearchParams({ item: String(item._id), draft })
    navigate(`/messages?${query.toString()}`)
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
        <button className="favorite-button" type="button" aria-label={`Save ${item.title}`}>
          ♡
        </button>
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
          <Avatar src={item.sellerAvatarUrl || item.sellerAvatar || item.seller_avatar || item.seller_avatar_url} alt={sellerName} size={36} />
          <div className="item-seller-copy">
            <p className="item-seller">{t(language, 'browse.soldBy')} {sellerName}</p>
          </div>
          {sellerVerified ? <span className="badge badge-default">Verified</span> : null}
        </div>
        <div className="item-actions-row" aria-label="Buyer actions">
          <button
            type="button"
            className={`item-action-button item-action-like ${isLiked ? 'is-active' : ''}`}
            onClick={handleLikeToggle}
            aria-pressed={isLiked}
          >
            <span>{t(language, 'dashboard.like')}</span>
            <strong>{likeCount}</strong>
          </button>

          <button
            type="button"
            className={`item-action-button item-action-comment ${isCommentOpen ? 'is-active' : ''}`}
            onClick={handleCommentOpen}
            aria-expanded={isCommentOpen}
          >
            <span>{t(language, 'dashboard.comment')}</span>
          </button>

          <button
            type="button"
            className="item-action-button item-action-message"
            onClick={handleMessageSeller}
          >
            <span>{t(language, 'dashboard.messageSeller')}</span>
          </button>
        </div>

        {isCommentOpen ? (
          <form className="item-comment-compose" onSubmit={handleSendComment}>
            <label className="sr-only" htmlFor={`item-comment-${item._id}`}>{t(language, 'dashboard.comment')}</label>
            <textarea
              id={`item-comment-${item._id}`}
              className="item-comment-input"
              rows={3}
              value={commentDraft}
              onChange={(event) => setCommentDraft(event.target.value)}
              placeholder={suggestedComment}
            />
            <div className="item-comment-actions">
              <span className="item-comment-hint">Drafts jump straight into Messages for a faster reply.</span>
              <button type="submit" className="button button-primary button-small">Send</button>
            </div>
          </form>
        ) : null}
      </div>
    </article>
  )
}