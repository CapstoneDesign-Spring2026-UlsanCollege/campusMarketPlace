import { useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { apiRequest, createItem, fetchItems, fetchUser } from '../services/api'
import { CATEGORIES, getCategoryLabel } from '../constants/categories'
import { getAuthUser, getAuthToken } from '../services/auth'
import { convertDisplayPriceToUsd, formatPriceFromUsd, getPriceInputMeta } from '../services/currency'
import { API_ORIGIN } from '../services/api'
import ItemCard from '../components/ItemCard'
import { t } from '../services/i18n'

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024
const MAX_IMAGE_COUNT = 5
const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
  'image/bmp',
  'image/tiff',
  'image/heic',
  'image/heif',
  'image/x-icon',
])
const DEFAULT_ITEM_LOCATION = 'Campus'
const LOCATION_OPTIONS = [
  'Cafeteria',
  'Hall',
  'Study Cafe',
  'Library',
  'Floor No. 1',
  'Floor No. 2',
  'Floor No. 3',
  'Floor No. 4',
  'Floor No. 5',
  'Canteen',
  'Dorm',
  'Football Ground',
  'Building No. 1',
  'Building No. 2',
  'Building No. 3',
  'Building No. 4',
  'Building No. 5',
]

const STORIES = [
  'Engineering',
  'Dorm Deals',
  'Books',
  'Tech',
  'Furniture',
]

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

function resolveImageUrl(imageUrl) {
  if (!imageUrl) {
    return ''
  }

  if (/^https?:\/\//i.test(imageUrl) || imageUrl.startsWith('data:') || imageUrl.startsWith('blob:')) {
    return imageUrl
  }

  return new URL(imageUrl.replace(/^\/+/, ''), `${API_ORIGIN}/`).href
}

export default function Dashboard({ currency, language = 'en' }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState(null)
  const [mode, setMode] = useState(location.state?.mode || 'home')
  const [marketQuery, setMarketQuery] = useState('')

  const [uploadPreviewUrl, setUploadPreviewUrl] = useState('')
  const [uploadMessage, setUploadMessage] = useState('')
  const [uploadError, setUploadError] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedImages, setUploadedImages] = useState([])
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(false)

  const [items, setItems] = useState([])
  const [sellerAvatars, setSellerAvatars] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const currentUserId = user?.id || ''

  const [formData, setFormData] = useState({
    location: '',
    price: '',
    description: '',
    category: '',
    status: 'active',
  })
  const [locationSelection, setLocationSelection] = useState('')
  const [formErrors, setFormErrors] = useState({})
  const [submitMessage, setSubmitMessage] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComposerOpen, setIsComposerOpen] = useState(false)

  const imageInputRef = useRef(null)
  const previewObjectUrlRef = useRef('')
  const normalizedQuery = marketQuery.trim().toLowerCase()
  const visibleItems = normalizedQuery
    ? items.filter((item) => {
        const haystack = [item.title, item.category, item.description, item.location, item.sellerName]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
        return haystack.includes(normalizedQuery)
      })
    : items
  const spotlightItems = visibleItems.slice(0, 4)

  useEffect(() => {
    const token = getAuthToken()
    const sessionUser = getAuthUser()

    if (!token || !sessionUser) {
      navigate('/login', {
        replace: true,
        state: { message: 'Please log in first.' },
      })
      return
    }

    setUser(sessionUser)
  }, [navigate])

  useEffect(() => {
    return () => {
      if (previewObjectUrlRef.current.startsWith('blob:')) {
        URL.revokeObjectURL(previewObjectUrlRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (location.state?.mode) {
      setMode(location.state.mode)
    }
  }, [location.state])

  async function loadItems() {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchItems(1, 20)
      let filteredItems = data.items || []

      // Filter items based on mode
      if (mode === 'sell') {
        // Show only items posted by current user
        filteredItems = filteredItems.filter((item) => {
          const sellerId = item.seller_id || item.sellerId || ''
          return sellerId === currentUserId
        })
      } else if (mode === 'buy') {
        // Show only items posted by other users
        filteredItems = filteredItems.filter((item) => {
          const sellerId = item.seller_id || item.sellerId || ''
          return sellerId && sellerId !== currentUserId
        })
      } else {
        // 'home' mode: show all items
      }

      setItems(filteredItems)
    } catch (err) {
      setError(err.message || 'Failed to load items')
      console.error('Error fetching items:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      loadItems()
    }
  }, [mode, user])

  useEffect(() => {
    // For any items missing a sellerAvatarUrl, fetch the public user profile
    // and cache the avatar so we can display it without changing server data.
    if (!items || items.length === 0) return

    items.forEach((item) => {
      const sellerId = item.seller_id || item.sellerId || ''
      if (!sellerId) return
      if (item.sellerAvatarUrl) return
      if (sellerAvatars[sellerId]) return

      fetchUser(sellerId)
        .then((res) => {
          const userObj = res.user || {}
          const avatar = userObj.avatarUrl || userObj.avatar || ''
          if (avatar) {
            setSellerAvatars((prev) => ({ ...prev, [sellerId]: avatar }))
          }
        })
        .catch(() => {
          // ignore fetch failures
        })
    })
  }, [items])

  const firstName = user?.firstName || 'Student'
  const priceInputMeta = getPriceInputMeta(currency)

  function updatePreviewUrl(nextUrl) {
    if (
      previewObjectUrlRef.current &&
      previewObjectUrlRef.current !== nextUrl &&
      previewObjectUrlRef.current.startsWith('blob:')
    ) {
      URL.revokeObjectURL(previewObjectUrlRef.current)
    }

    previewObjectUrlRef.current = nextUrl
    setUploadPreviewUrl(nextUrl)
  }

  function renderAvatarForUser(userObj, altText) {
    const avatar = userObj?.avatarUrl || userObj?.avatar || ''
    if (avatar) {
      // If relative path, resolve to absolute using API_ORIGIN
      const src = /^https?:\/\//i.test(avatar) ? avatar : new URL(String(avatar).replace(/^\/+/, ''), `${API_ORIGIN}/`).href
      return <img src={src} alt={altText || 'avatar'} style={{width: 40, height: 40, borderRadius: '50%', objectFit: 'cover'}} />
    }
    return null
  }

  function handleImageUpload() {
    setIsComposerOpen(true)
    imageInputRef.current?.click()
  }

  function openComposer() {
    setIsComposerOpen(true)
  }

  function openMessageThread(itemId) {
    navigate(`/messages?item=${encodeURIComponent(itemId)}`)
  }

  function getItemImageSrc(item) {
    return resolveImageUrl(getPrimaryImageValue(item))
  }

  function removeUploadedImage(indexToRemove) {
    setUploadedImages((current) => {
      const nextImages = current.filter((_, index) => index !== indexToRemove)
      if (nextImages.length <= 2) {
        setIsPreviewExpanded(false)
      }
      updatePreviewUrl(nextImages[0] || '')
      return nextImages
    })
    setFormErrors((prev) => ({ ...prev, image: '' }))
  }

  function clearUploadedImages() {
    setUploadedImages([])
    updatePreviewUrl('')
    setIsPreviewExpanded(false)
    setFormErrors((prev) => ({ ...prev, image: '' }))
  }

  async function handleFileChange(event) {
    const fileInput = event.target
    const selectedFiles = Array.from(event.target.files || [])
    if (selectedFiles.length === 0) {
      return
    }

    if (selectedFiles.length + uploadedImages.length > MAX_IMAGE_COUNT) {
      setUploadError(`Please choose up to ${MAX_IMAGE_COUNT} images total.`)
      setUploadMessage('')
      fileInput.value = ''
      return
    }

    const unsupportedFile = selectedFiles.find((selectedFile) => !ALLOWED_IMAGE_TYPES.has(selectedFile.type))
    if (unsupportedFile) {
      setUploadError('Please choose a supported image type (JPG, PNG, GIF, WebP, AVIF, BMP, TIFF, HEIC, or ICO).')
      setUploadMessage('')
      fileInput.value = ''
      return
    }

    setUploadError('')
    setUploadMessage(`Uploading ${selectedFiles.length} image${selectedFiles.length > 1 ? 's' : ''}...`)
    setIsUploading(true)

    try {
      const uploadedUrls = []

      for (const selectedFile of selectedFiles) {
        if (selectedFile.size > MAX_IMAGE_SIZE_BYTES) {
          throw new Error('Please choose images smaller than 5 MB each.')
        }

        const formData = new FormData()
        formData.append('image', selectedFile)

        const result = await apiRequest('/uploads/image', {
          method: 'POST',
          body: formData,
        })

        if (result?.url) {
          uploadedUrls.push(result.url)
        }
      }

      const nextImages = [...uploadedImages, ...uploadedUrls]
      setUploadedImages(nextImages)
      setIsPreviewExpanded(false)
      updatePreviewUrl(nextImages[0] || '')
      setUploadMessage(
        uploadedUrls.length > 1
          ? `${uploadedUrls.length} images uploaded successfully.`
          : 'Image uploaded successfully.',
      )
      setUploadError('')
      setFormErrors((prev) => ({ ...prev, image: '' }))
    } catch (uploadErr) {
      setUploadError(uploadErr instanceof Error ? uploadErr.message : 'Image upload failed.')
        setUploadMessage('')
    } finally {
      setIsUploading(false)
      fileInput.value = ''
    }
  }

  function handleFormChange(event) {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setFormErrors((prev) => ({ ...prev, [name]: '' }))
    setSubmitError('')
    setSubmitMessage('')
  }

  function handleLocationSelectionChange(event) {
    const { value } = event.target
    setLocationSelection(value)
    setFormErrors((prev) => ({ ...prev, location: '' }))
    setSubmitError('')
    setSubmitMessage('')

    if (!value) {
      setFormData((prev) => ({ ...prev, location: '' }))
      return
    }

    if (value === '__custom__') {
      setFormData((prev) => ({ ...prev, location: '' }))
      return
    }

    setFormData((prev) => ({ ...prev, location: value }))
  }

  function validateForm() {
    const nextErrors = {}
    const priceValue = Number(formData.price)

    if (!formData.location.trim()) nextErrors.location = 'Location is required.'
    if (!formData.price.trim() || !Number.isFinite(priceValue) || priceValue <= 0) {
      nextErrors.price = `Price is required and must be a positive ${currency === 'KRW' ? 'KRW amount' : 'USD amount'}.`
    }
    if (!formData.description.trim()) nextErrors.description = 'Description is required.'
    if (!formData.category.trim()) nextErrors.category = 'Category is required.'
    if (!formData.status.trim()) nextErrors.status = 'Status is required.'
    if (uploadedImages.length === 0) nextErrors.image = 'Please upload at least one image.'

    setFormErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  async function handlePostItemSubmit(event) {
    event.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    setSubmitError('')
    setSubmitMessage('')

    try {
      const normalizedLocation = formData.location.trim()
      const payload = {
        title: normalizedLocation,
        price: convertDisplayPriceToUsd(formData.price, currency),
        description: formData.description.trim(),
        category: formData.category.trim(),
        status: formData.status.trim(),
        location: normalizedLocation || DEFAULT_ITEM_LOCATION,
        image: uploadedImages[0],
        images: uploadedImages,
      }

      await createItem(payload)

      setSubmitMessage('Item posted successfully.')
      setFormData({
        location: '',
        price: '',
        description: '',
        category: '',
        status: 'active',
      })
      setLocationSelection('')
      setFormErrors({})
      setUploadedImages([])
      setIsPreviewExpanded(false)
      updatePreviewUrl('')
      setUploadMessage('')
      setUploadError('')
      setIsComposerOpen(false)
      await loadItems()
    } catch (submitErr) {
      setSubmitError(submitErr.message || 'Failed to post item.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="page-shell marketplace-shell">
      <section className="feed-layout">
        <section className="feed-main-col">
          <section className="panel marketplace-hero" aria-label="Campus marketplace hero">
            <p className="eyebrow">Verified students only</p>
            <h1>Buy &amp; sell on campus safely</h1>
            <p className="subcopy">
              Browse premium campus deals, list what you no longer need, and chat with verified students in a calmer, cleaner marketplace.
            </p>

            <div className="dashboard-search" role="search" aria-label="Marketplace search">
              <input
                value={marketQuery}
                onChange={(event) => setMarketQuery(event.target.value)}
                type="search"
                placeholder="Search textbooks, laptops, bikes..."
                aria-label="Search marketplace listings"
              />
              <span className="hero-search-tag">Live search</span>
            </div>

            <div className="category-chip-row" aria-label="Quick categories">
              <button type="button" className={`category-chip ${!marketQuery ? 'is-active' : ''}`} onClick={() => setMarketQuery('')}>
                All
              </button>
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={`category-chip ${marketQuery.toLowerCase().includes(category.toLowerCase()) ? 'is-active' : ''}`}
                  onClick={() => setMarketQuery(category)}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="hero-stat-grid">
              <article className="hero-stat-card">
                <span className="hero-stat-label">Active listings</span>
                <strong className="hero-stat-value">{visibleItems.length.toLocaleString()}</strong>
              </article>
              <article className="hero-stat-card">
                <span className="hero-stat-label">Trades today</span>
                <strong className="hero-stat-value">{items.filter((item) => item.status === 'active').length.toLocaleString()}</strong>
              </article>
              <article className="hero-stat-card">
                <span className="hero-stat-label">Avg. rating</span>
                <strong className="hero-stat-value">4.9★</strong>
              </article>
            </div>

            <div className="trust-grid" aria-label="Campus trust highlights">
              <article className="trust-card">
                <strong>Verified student-only access</strong>
                <p className="subcopy">Only authenticated campus accounts can list and chat.</p>
              </article>
              <article className="trust-card">
                <strong>Safe meetup guidance</strong>
                <p className="subcopy">Use on-campus pickup spots and trusted public locations.</p>
              </article>
              <article className="trust-card">
                <strong>Fast, friendly chat</strong>
                <p className="subcopy">Message sellers directly without leaving the app flow.</p>
              </article>
            </div>
          </section>

          <section className="browse-section" aria-label="Near you">
            <div className="browse-toolbar">
              <div>
                <p className="eyebrow">Near you</p>
                <h2>Campus picks nearby</h2>
                <p className="browse-summary">A quick swipe through items that already feel close to home.</p>
              </div>
              <button className="button button-secondary" type="button" onClick={() => navigate('/browse')}>
                View all
              </button>
            </div>

            {loading ? (
              <div className="loading-state">
                <p>{t(language, 'dashboard.loading')}</p>
              </div>
            ) : error ? (
              <div className="error-state">
                <p>Error: {error}</p>
              </div>
            ) : spotlightItems.length === 0 ? (
              <div className="empty-state">
                <p>{t(language, 'dashboard.noItems')}</p>
              </div>
            ) : (
              <div className="near-you-grid">
                {spotlightItems.map((item, index) => (
                  <article className="near-you-card" key={item._id}>
                    <div className="post-image">
                      {getItemImageSrc(item) ? (
                        <img
                          src={getItemImageSrc(item)}
                          alt={item.title ? `${item.title} listing` : 'Marketplace listing'}
                          loading="lazy"
                        />
                      ) : (
                        <div className="post-image-fallback" aria-hidden="true">
                          <span>{(item.category || 'Item').slice(0, 1).toUpperCase()}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="eyebrow" style={{ marginBottom: '0.35rem' }}>{item.category || 'Nearby'}</p>
                      <strong>{item.title}</strong>
                      <div className="listing-price-row">
                        <span className="item-price">{formatPriceFromUsd(item.price, currency)}</span>
                        <span className="distance-chip">{index + 1} stop</span>
                      </div>
                      <span className="mini-location">{item.location || t(language, 'dashboard.campus')}</span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          {mode !== 'buy' && (
            <section className="feed-panel composer" aria-label="Post composer">
              <form className="composer-form" onSubmit={handlePostItemSubmit} noValidate>
                <div className="composer-row">
                  <div className="avatar-badge" aria-hidden="true">
                    {renderAvatarForUser(user) || firstName.slice(0, 1)}
                  </div>
                  <button
                    className="composer-input"
                    type="button"
                    onClick={openComposer}
                    aria-label="Open post composer"
                    disabled={isSubmitting || isUploading}
                  >
                    {t(language, 'dashboard.prompt')}
                  </button>
                  <button
                    className="composer-icon-button composer-camera-right"
                    type="button"
                    onClick={handleImageUpload}
                    aria-label={t(language, 'dashboard.uploadImage')}
                    disabled={isUploading || isSubmitting}
                  >
                    📷
                  </button>
                </div>

                {isComposerOpen && (
                  <div className="composer-fields">
                    <div className="composer-choice-group">
                      <select
                        name="locationSelection"
                        value={locationSelection}
                        onChange={handleLocationSelectionChange}
                        className="composer-text-input composer-select"
                      >
                        <option value="">{t(language, 'dashboard.locationPlaceholder')}</option>
                        {LOCATION_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                        <option value="__custom__">Write a custom location</option>
                      </select>

                      {locationSelection === '__custom__' && (
                        <input
                          name="location"
                          type="text"
                          placeholder="Enter a meeting spot or room"
                          value={formData.location}
                          onChange={handleFormChange}
                          className="composer-text-input"
                        />
                      )}
                    </div>
                    {formErrors.location && <p className="composer-feedback is-error">{formErrors.location}</p>}

                    <input
                      name="price"
                      type="number"
                      min={priceInputMeta.min}
                      step={priceInputMeta.step}
                      placeholder={priceInputMeta.placeholder}
                      value={formData.price}
                      onChange={handleFormChange}
                      className="composer-text-input"
                    />
                    {formErrors.price && <p className="composer-feedback is-error">{formErrors.price}</p>}

                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleFormChange}
                      className="composer-text-input"
                    >
                      <option value="">{t(language, 'dashboard.selectCategory')}</option>
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    {formErrors.category && <p className="composer-feedback is-error">{formErrors.category}</p>}

                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleFormChange}
                      className="composer-text-input"
                    >
                      <option value="active">{t(language, 'dashboard.active')}</option>
                      <option value="draft">{t(language, 'dashboard.draft')}</option>
                    </select>
                    {formErrors.status && <p className="composer-feedback is-error">{formErrors.status}</p>}

                    <textarea
                      name="description"
                      placeholder={t(language, 'dashboard.description')}
                      value={formData.description}
                      onChange={handleFormChange}
                      className="composer-textarea"
                      rows={4}
                    />
                    {formErrors.description && <p className="composer-feedback is-error">{formErrors.description}</p>}

                    {formErrors.image && <p className="composer-feedback is-error">{formErrors.image}</p>}
                  </div>
                )}

                {isComposerOpen && (uploadMessage || uploadError) && (
                  <p className={`composer-feedback ${uploadError ? 'is-error' : 'is-success'}`} aria-live="polite">
                    {uploadError || uploadMessage}
                  </p>
                )}

                {isComposerOpen && uploadPreviewUrl && (
                  <div className="composer-preview">
                    {uploadedImages.length <= 1 ? (
                      <div className="composer-preview-single">
                        <img src={uploadPreviewUrl} alt="Selected upload preview" />
                      </div>
                    ) : (
                      <div className={`composer-preview-grid ${isPreviewExpanded ? 'is-expanded' : 'is-collapsed'}`}>
                        {uploadedImages.slice(0, isPreviewExpanded ? uploadedImages.length : 2).map((imageUrl, index) => (
                          <div className="composer-thumb" key={`${imageUrl}-${index}`}>
                            <img src={imageUrl} alt={`Selected image ${index + 1}`} />
                            <button
                              type="button"
                              className="composer-thumb-remove"
                              onClick={() => removeUploadedImage(index)}
                              aria-label={`Remove image ${index + 1}`}
                            >
                              ×
                            </button>
                          </div>
                        ))}

                        {!isPreviewExpanded && uploadedImages.length > 2 && (
                          <button
                            type="button"
                            className="composer-more-tile"
                            onClick={() => setIsPreviewExpanded(true)}
                            aria-label={`Show ${uploadedImages.length - 2} more uploaded image${uploadedImages.length - 2 === 1 ? '' : 's'}`}
                          >
                            <span className="composer-more-count">+{uploadedImages.length - 2}</span>
                            <span className="composer-more-label">more</span>
                          </button>
                        )}

                        {isPreviewExpanded && uploadedImages.length > 2 && (
                          <button type="button" className="composer-more-toggle" onClick={() => setIsPreviewExpanded(false)}>
                            Show less
                          </button>
                        )}
                      </div>
                    )}
                    {uploadedImages.length > 0 && (
                      <button type="button" className="composer-clear-images" onClick={clearUploadedImages}>
                        {t(language, 'dashboard.clearImages')}
                      </button>
                    )}
                  </div>
                )}

                {isComposerOpen && (submitMessage || submitError) && (
                  <p className={`composer-feedback ${submitError ? 'is-error' : 'is-success'}`} aria-live="polite">
                    {submitError || submitMessage}
                  </p>
                )}

                {isComposerOpen && (
                  <button className="composer-submit" type="submit" disabled={isSubmitting || isUploading}>
                    {isSubmitting ? t(language, 'dashboard.posting') : t(language, 'dashboard.postItem')}
                  </button>
                )}

                <div className="composer-upload-panel">
                  <div className="composer-upload-copy">
                    <p className="composer-upload-label">Photos</p>
                    <p className="composer-upload-hint">
                      Add up to {MAX_IMAGE_COUNT} clear images. JPG, PNG, WebP, GIF, and more.
                    </p>
                  </div>
                  <div className="composer-upload-actions">
                    <button
                      type="button"
                      className="composer-upload-button"
                      onClick={handleImageUpload}
                      disabled={isUploading || isSubmitting}
                    >
                      Choose photos
                    </button>
                    <span className="composer-upload-meta">
                      {uploadedImages.length > 0
                        ? `${uploadedImages.length} selected`
                        : 'No photos selected yet'}
                    </span>
                  </div>
                  <input
                    ref={imageInputRef}
                    className="composer-file-input"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                  />
                </div>
              </form>
            </section>
          )}

          <section className="feed-post-list" aria-label="Marketplace feed posts">
            <div className="browse-toolbar">
              <div>
                <p className="eyebrow">Trending listings</p>
                <h2>{visibleItems.length.toLocaleString()} results</h2>
                <p className="browse-summary">
                  {normalizedQuery ? `Showing matches for "${marketQuery}"` : 'Fresh campus listings from students around Ulsan College.'}
                </p>
              </div>
              {marketQuery ? (
                <button className="button button-secondary" type="button" onClick={() => setMarketQuery('')}>
                  Clear search
                </button>
              ) : null}
            </div>

            {loading ? (
              <div className="loading-state">
                <p>{t(language, 'dashboard.loading')}</p>
              </div>
            ) : error ? (
              <div className="error-state">
                <p>Error: {error}</p>
              </div>
            ) : visibleItems.length === 0 ? (
              <div className="empty-state">
                <p>{t(language, 'dashboard.noItems')}</p>
              </div>
            ) : (
              <div className="item-grid">
                {visibleItems.map((item) => (
                  <ItemCard key={item._id} item={item} currency={currency} language={language} />
                ))}
              </div>
            )}
          </section>
        </section>
      </section>
    </main>
  )
}