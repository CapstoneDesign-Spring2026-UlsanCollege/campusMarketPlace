import { useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { apiRequest, createItem, fetchItems } from '../services/api'
import { CATEGORIES, getCategoryLabel } from '../constants/categories'
import { convertDisplayPriceToUsd, formatPriceFromUsd, getPriceInputMeta } from '../services/currency'
import { API_ORIGIN } from '../services/api'

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

export default function Dashboard({ currency }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState(null)
  const [mode, setMode] = useState(location.state?.mode || 'sell')

  const [uploadPreviewUrl, setUploadPreviewUrl] = useState('')
  const [uploadMessage, setUploadMessage] = useState('')
  const [uploadError, setUploadError] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedImages, setUploadedImages] = useState([])

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const currentUserId = user?.id || ''

  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    category: '',
    status: 'active',
  })
  const [formErrors, setFormErrors] = useState({})
  const [submitMessage, setSubmitMessage] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComposerOpen, setIsComposerOpen] = useState(false)

  const imageInputRef = useRef(null)
  const previewObjectUrlRef = useRef('')

  useEffect(() => {
    const token = localStorage.getItem('campusMarketplaceToken')
    const userRaw = localStorage.getItem('campusMarketplaceUser')

    if (!token || !userRaw) {
      navigate('/login', {
        replace: true,
        state: { message: 'Please log in first.' },
      })
      return
    }

    try {
      setUser(JSON.parse(userRaw))
    } catch {
      localStorage.removeItem('campusMarketplaceToken')
      localStorage.removeItem('campusMarketplaceUser')
      navigate('/login', {
        replace: true,
        state: { message: 'Please log in again.' },
      })
    }
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
        filteredItems = filteredItems.filter(item => 
          item.sellerName === `${user?.firstName} ${user?.lastName}`
        )
      }
      // In 'buy' mode, show all items from other sellers
      
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
      updatePreviewUrl(nextImages[0] || '')
      return nextImages
    })
    setFormErrors((prev) => ({ ...prev, image: '' }))
  }

  function clearUploadedImages() {
    setUploadedImages([])
    updatePreviewUrl('')
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

  function validateForm() {
    const nextErrors = {}
    const priceValue = Number(formData.price)

    if (!formData.title.trim()) nextErrors.title = 'Title is required.'
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
      const payload = {
        title: formData.title.trim(),
        price: convertDisplayPriceToUsd(formData.price, currency),
        description: formData.description.trim(),
        category: formData.category.trim(),
        status: formData.status.trim(),
        location: DEFAULT_ITEM_LOCATION,
        image: uploadedImages[0],
        images: uploadedImages,
      }

      await createItem(payload)

      setSubmitMessage('Item posted successfully.')
      setFormData({
        title: '',
        price: '',
        description: '',
        category: '',
        status: 'active',
      })
      setFormErrors({})
      setUploadedImages([])
      updatePreviewUrl('')
      setUploadMessage('')
      setUploadError('')
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
          {mode !== 'buy' && (
            <section className="feed-panel composer" aria-label="Post composer">
              <form className="composer-form" onSubmit={handlePostItemSubmit} noValidate>
              <div className="composer-row">
                <div className="avatar-badge" aria-hidden="true">
                  {firstName.slice(0, 1)}
                </div>
                <button
                  className="composer-input"
                  type="button"
                  onClick={openComposer}
                  aria-label="Open post composer"
                  disabled={isSubmitting || isUploading}
                >
                  What's on your mind?
                </button>
                <button
                  className="composer-icon-button composer-camera-right"
                  type="button"
                  onClick={handleImageUpload}
                  aria-label="Upload image"
                  disabled={isUploading || isSubmitting}
                >
                  📷
                </button>
              </div>

              {isComposerOpen && (
                <div className="composer-fields">
                <input
                  name="title"
                  type="text"
                  placeholder="Title"
                  value={formData.title}
                  onChange={handleFormChange}
                  className="composer-text-input"
                />
                {formErrors.title && <p className="composer-feedback is-error">{formErrors.title}</p>}

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
                  <option value="">Select a category</option>
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
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                </select>
                {formErrors.status && <p className="composer-feedback is-error">{formErrors.status}</p>}

                <textarea
                  name="description"
                  placeholder="Description"
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
                  <img src={uploadPreviewUrl} alt="Selected upload preview" />
                  {uploadedImages.length > 1 && (
                    <div className="composer-preview-strip" aria-label="Selected image thumbnails">
                      {uploadedImages.map((imageUrl, index) => (
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
                    </div>
                  )}
                  {uploadedImages.length > 0 && (
                    <button type="button" className="composer-clear-images" onClick={clearUploadedImages}>
                      Clear images
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
                  {isSubmitting ? 'Posting...' : 'Post Item'}
                </button>
              )}

              <input
                ref={imageInputRef}
                className="composer-file-input"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
              />
            </form>
            </section>
          )}

          {/* Stories moved into the Search menu in the navbar */}

          <section className="feed-post-list" aria-label="Marketplace feed posts">
            {loading ? (
              <div className="loading-state">
                <p>Loading marketplace items...</p>
              </div>
            ) : error ? (
              <div className="error-state">
                <p>Error: {error}</p>
              </div>
            ) : items.length === 0 ? (
              <div className="empty-state">
                <p>No items available yet.</p>
              </div>
            ) : (
              items.map((item) => (
                <article className="feed-panel post-card" key={item._id}>
                  <header className="post-header">
                    <div className="avatar-badge" aria-hidden="true">
                      {(item.sellerName || 'S').slice(0, 1)}
                    </div>
                    <div>
                      <strong>{item.sellerName || 'Seller'}</strong>
                      <p>{item.location || 'Campus'}</p>
                    </div>
                  </header>
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
                  <div className="post-body">
                    <div className="post-meta">
                      <span className="post-category">{getCategoryLabel(item.category)}</span>
                      <div className="post-price">{formatPriceFromUsd(item.price, currency)}</div>
                    </div>
                    <h2>{item.title}</h2>
                    <p>{item.description}</p>
                  </div>
                  <footer className="post-actions" aria-label="Post actions">
                    <button type="button">Like</button>
                    <button type="button">Comment</button>
                    {currentUserId && item.status === 'active' && item.seller_id && item.seller_id !== currentUserId ? (
                      <button type="button" onClick={() => openMessageThread(item._id)}>
                        Message seller
                      </button>
                    ) : (
                      <button type="button" disabled>
                        {currentUserId
                          ? (item.status === 'active' ? 'Your listing' : 'Messaging unavailable')
                          : 'Loading account...'}
                      </button>
                    )}
                  </footer>
                </article>
              ))
            )}
          </section>
        </section>
      </section>
    </main>
  )
}