import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { API_ORIGIN, fetchItems, fetchUser, openMessageThread } from '../services/api'
import { formatPriceFromUsd } from '../services/currency'
import { getAuthUser } from '../services/auth'
import Avatar from '../components/Avatar'

function getPrimaryImageValue(item) {
  if (item?.image) {
    if (typeof item.image === 'string') return item.image
    if (typeof item.image === 'object' && item.image.url) return item.image.url
  }

  if (Array.isArray(item?.images) && item.images.length > 0) {
    const first = item.images[0]
    if (typeof first === 'string') return first
    if (first && typeof first === 'object' && first.url) return first.url
  }

  return ''
}

function getAllImageValues(item) {
  const values = []

  const primary = getPrimaryImageValue(item)
  if (primary) values.push(primary)

  if (Array.isArray(item?.images)) {
    for (const image of item.images) {
      const value = typeof image === 'string' ? image : image?.url || ''
      if (value && !values.includes(value)) {
        values.push(value)
      }
    }
  }

  return values
}

function resolveImageUrl(imageUrl) {
  if (!imageUrl) return ''
  if (/^https?:\/\//i.test(imageUrl) || imageUrl.startsWith('data:') || imageUrl.startsWith('blob:')) return imageUrl
  return new URL(imageUrl.replace(/^\/+/, ''), `${API_ORIGIN}/`).href
}

function formatPostedTime(value) {
  if (!value) return 'Just now'

  const createdAt = new Date(value)
  if (Number.isNaN(createdAt.getTime())) return 'Just now'

  const diffMs = Date.now() - createdAt.getTime()
  const diffSeconds = Math.floor(diffMs / 1000)
  if (diffSeconds < 60) return 'Just now'

  const diffMinutes = Math.floor(diffSeconds / 60)
  if (diffMinutes < 60) return `${diffMinutes}m ago`

  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours}h ago`

  return `${Math.floor(diffHours / 24)}d ago`
}

function getConditionLabel(item) {
  const raw = item?.condition || item?.itemCondition || item?.state || ''
  const normalized = String(raw).trim()
  return normalized || 'Like new'
}

function buildDetailRows(item) {
  return [
    { label: 'Category', value: item?.category || 'General' },
    { label: 'Condition', value: item?.condition || item?.itemCondition || item?.state || 'Like new' },
    { label: 'Location', value: item?.location || 'Campus' },
    { label: 'Posted', value: formatPostedTime(item?.createdAt) },
  ]
}

export default function ItemDetail({ currency, language = 'en' }) {
  const navigate = useNavigate()
  const params = useParams()
  const location = useLocation()
  const [item, setItem] = useState(location.state?.item || null)
  const [isLoading, setIsLoading] = useState(!location.state?.item)
  const [error, setError] = useState('')
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const [sellerProfile, setSellerProfile] = useState(null)
  const [sellerLoading, setSellerLoading] = useState(false)
  const currentUser = getAuthUser()
  const galleryImages = useMemo(() => getAllImageValues(item), [item])
  const activeImageSrc = resolveImageUrl(galleryImages[activeImageIndex] || galleryImages[0] || getPrimaryImageValue(item))
  const sellerName = sellerProfile
    ? `${sellerProfile?.firstName || ''} ${sellerProfile?.lastName || ''}`.trim() || item?.sellerName || 'Seller'
    : item?.sellerName || 'Seller'
  const sellerAvatar = item?.sellerAvatarUrl || item?.sellerAvatar || item?.seller_avatar || item?.seller_avatar_url || ''
  const detailRows = useMemo(() => buildDetailRows(item), [item])
  const sellerLocation = sellerProfile?.location || item?.location || 'Campus'
  const sellerEmail = sellerProfile?.email || item?.sellerEmail || ''
  const sellerPhone = sellerProfile?.phone || item?.sellerPhone || ''
  const conditionLabel = getConditionLabel(item)
  const categoryTrail = [item?.category || 'Listings', conditionLabel, sellerLocation].filter(Boolean)

  useEffect(() => {
    let isActive = true

    async function loadItem() {
      if (item || !params.id) return

      try {
        setIsLoading(true)
        setError('')
        const data = await fetchItems(1, 100)
        if (!isActive) return

        const found = (Array.isArray(data.items) ? data.items : []).find((candidate) => String(candidate._id) === String(params.id))
        if (found) {
          setItem(found)
        } else {
          setError('Item not found.')
        }
      } catch (loadError) {
        if (!isActive) return
        setError(loadError instanceof Error ? loadError.message : 'Unable to load listing.')
      } finally {
        if (isActive) setIsLoading(false)
      }
    }

    loadItem()

    return () => {
      isActive = false
    }
  }, [item, params.id])

  useEffect(() => {
    setActiveImageIndex(0)
  }, [item?._id])

  useEffect(() => {
    function handleKeyDown(event) {
      if (lightboxIndex === null) return

      if (event.key === 'Escape') {
        setLightboxIndex(null)
        return
      }

      if (event.key === 'ArrowLeft') {
        setLightboxIndex((current) => (current === null ? current : (current - 1 + galleryImages.length) % galleryImages.length))
      }

      if (event.key === 'ArrowRight') {
        setLightboxIndex((current) => (current === null ? current : (current + 1) % galleryImages.length))
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [galleryImages.length, lightboxIndex])

  useEffect(() => {
    let isActive = true
    const sellerId = item?.seller_id || item?.sellerId || ''

    async function loadSellerProfile() {
      if (!sellerId) {
        setSellerProfile(null)
        return
      }

      try {
        setSellerLoading(true)
        const response = await fetchUser(sellerId)
        if (!isActive) return
        setSellerProfile(response?.user || null)
      } catch {
        if (!isActive) return
        setSellerProfile(null)
      } finally {
        if (isActive) setSellerLoading(false)
      }
    }

    loadSellerProfile()

    return () => {
      isActive = false
    }
  }, [item?.sellerId, item?.seller_id])

  async function handleMessageSeller() {
    if (!item?._id) return
    try {
      await openMessageThread(item._id)
    } catch {
      // continue to inbox route even if thread creation already exists
    }
    navigate(`/messages?item=${encodeURIComponent(item._id)}`)
  }

  function openLightbox(index) {
    if (!galleryImages.length) return
    setLightboxIndex(index)
  }

  function closeLightbox() {
    setLightboxIndex(null)
  }

  function moveLightbox(direction) {
    if (lightboxIndex === null || !galleryImages.length) return
    setLightboxIndex((current) => (current + direction + galleryImages.length) % galleryImages.length)
  }

  if (isLoading) {
    return (
      <main className="page-shell marketplace-shell">
        <section className="panel item-detail-shell">
          <p className="eyebrow">Listing preview</p>
          <h1>Loading item details…</h1>
          <p className="subcopy">Fetching the listing layout so you can see how it will look.</p>
        </section>
      </main>
    )
  }

  if (error || !item) {
    return (
      <main className="page-shell marketplace-shell">
        <section className="panel item-detail-shell item-detail-error">
          <p className="eyebrow">Listing preview</p>
          <h1>We could not open that item.</h1>
          <p className="subcopy">{error || 'The listing was not found.'}</p>
          <div className="detail-actions">
            <button className="button button-primary" type="button" onClick={() => navigate(-1)}>
              Go back
            </button>
            <Link className="button button-secondary" to="/search">
              Search listings
            </Link>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="page-shell marketplace-shell">
      <section className="item-detail-shell panel">
        <div className="detail-breadcrumbs">
          <Link to="/browse">Marketplace</Link>
          <span>›</span>
          <Link to={`/search?category=${encodeURIComponent(item.category || '')}`}>{item.category || 'Listings'}</Link>
          <span>›</span>
          <span>{item.title}</span>
        </div>

        <div className="detail-hero">
          <div className="detail-gallery-card">
            <div className="detail-gallery">
              {activeImageSrc ? (
                <button type="button" className="detail-gallery-button" onClick={() => openLightbox(activeImageIndex)} aria-label="Open image viewer">
                  <img src={activeImageSrc} alt={item.title} />
                </button>
              ) : (
                <div className="detail-gallery-fallback" aria-hidden="true">
                  <span>{(item.category || 'Item').slice(0, 1).toUpperCase()}</span>
                </div>
              )}
              {galleryImages.length > 1 ? <span className="detail-gallery-count">{activeImageIndex + 1}/{galleryImages.length}</span> : null}
            </div>

            {galleryImages.length > 1 ? (
              <div className="detail-thumbs" aria-label="Listing photos">
                {galleryImages.map((image, index) => {
                  const thumbSrc = resolveImageUrl(image)
                  const isActive = index === activeImageIndex
                  return (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      className={`detail-thumb ${isActive ? 'is-active' : ''}`}
                      onClick={() => {
                        setActiveImageIndex(index)
                        openLightbox(index)
                      }}
                      aria-label={`View image ${index + 1}`}
                    >
                      {thumbSrc ? <img src={thumbSrc} alt="Listing thumbnail" /> : null}
                    </button>
                  )
                })}
              </div>
            ) : null}
          </div>

          <aside className="detail-sidebar">
            <div className="detail-header">
              <p className="eyebrow">Listing preview</p>
              <div className="detail-trail">
                {categoryTrail.map((part) => (
                  <span key={part} className="detail-trail-pill">{part}</span>
                ))}
              </div>
            </div>

            <h1 className="detail-title">{item.title}</h1>
            <div className="detail-price-row">
              <strong className="detail-price">{formatPriceFromUsd(item.price, currency)}</strong>
              {item?.status ? <span className={`status-badge status-${item.status}`}>{item.status}</span> : null}
            </div>
            <div className="detail-chip-row">
              {detailRows.map((row) => (
                <span key={row.label} className="detail-chip">
                  <strong>{row.label}:</strong> {row.value}
                </span>
              ))}
            </div>
            <p className="detail-description">{item.description}</p>

            <div className="detail-seller-card">
              <Link to={`/profile/${item?.seller_id || item?.sellerId || ''}`} onClick={(e) => e.stopPropagation()}>
                <Avatar src={sellerProfile?.avatarUrl || sellerAvatar} alt={sellerName} size={56} />
              </Link>
              <div className="detail-seller-copy">
                <p className="detail-seller-label">Seller</p>
                <div className="detail-seller-name-row">
                  <strong>{sellerName}</strong>
                  {Boolean(item?.seller_verified || item?.sellerVerified || sellerProfile?.isVerified) ? <span className="detail-verified-badge">Verified</span> : null}
                </div>
                <p className="detail-seller-note">{currentUser?.id === item?.seller_id ? 'This is your listing.' : sellerLoading ? 'Loading seller profile…' : 'Student seller profile.'}</p>
                <p className="detail-seller-note detail-seller-location">{sellerLocation}</p>
              </div>
            </div>

            <div className="detail-contact-card">
              <div>
                <p className="detail-seller-label">Contact</p>
                <strong>{sellerEmail || sellerPhone ? 'Reach the seller directly' : 'Message in app'}</strong>
              </div>
              <div className="detail-contact-list">
                {sellerEmail ? <span>{sellerEmail}</span> : null}
                {sellerPhone ? <span>{sellerPhone}</span> : null}
                {!sellerEmail && !sellerPhone ? <span>Fast in-app messaging available</span> : null}
              </div>
            </div>

            <div className="detail-actions">
              <button className="button button-primary" type="button" onClick={handleMessageSeller}>
                Message seller
              </button>
              <Link className="button button-secondary" to={`/profile/${item?.seller_id || item?.sellerId || ''}`}>
                View profile
              </Link>
              <button className="button button-secondary" type="button" onClick={() => navigate(-1)}>
                Back
              </button>
            </div>
          </aside>
        </div>

        {lightboxIndex !== null && galleryImages[lightboxIndex] ? (
          <div className="detail-lightbox" role="dialog" aria-modal="true" aria-label="Listing image viewer" onClick={closeLightbox}>
            <div className="detail-lightbox-panel" onClick={(event) => event.stopPropagation()}>
              <button type="button" className="detail-lightbox-close" onClick={closeLightbox} aria-label="Close image viewer">×</button>
              <button type="button" className="detail-lightbox-nav detail-lightbox-prev" onClick={() => moveLightbox(-1)} aria-label="Previous image">‹</button>
              <img src={resolveImageUrl(galleryImages[lightboxIndex])} alt={item.title} className="detail-lightbox-image" />
              <button type="button" className="detail-lightbox-nav detail-lightbox-next" onClick={() => moveLightbox(1)} aria-label="Next image">›</button>
              <div className="detail-lightbox-caption">
                <strong>{item.title}</strong>
                <span>{lightboxIndex + 1} / {galleryImages.length}</span>
              </div>
            </div>
          </div>
        ) : null}
      </section>
    </main>
  )
}
