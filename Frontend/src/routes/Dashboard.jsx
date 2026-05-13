import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiRequest, createItem, fetchItems } from '../services/api'

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
const DEFAULT_ITEM_LOCATION = 'Campus'

const STORIES = [
  'Engineering',
  'Dorm Deals',
  'Books',
  'Tech',
  'Furniture',
]

export default function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  const [uploadPreviewUrl, setUploadPreviewUrl] = useState('')
  const [uploadMessage, setUploadMessage] = useState('')
  const [uploadError, setUploadError] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedImageUrl, setUploadedImageUrl] = useState('')

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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

  async function loadItems() {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchItems(1, 20)
      setItems(data.items || [])
    } catch (err) {
      setError(err.message || 'Failed to load items')
      console.error('Error fetching items:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadItems()
  }, [])

  const firstName = user?.firstName || 'Student'

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

  async function handleFileChange(event) {
    const fileInput = event.target
    const selectedFile = event.target.files?.[0]
    if (!selectedFile) {
      return
    }

    if (!ALLOWED_IMAGE_TYPES.has(selectedFile.type)) {
      setUploadError('Please choose a JPG, PNG, GIF, or WebP image.')
      setUploadMessage('')
      fileInput.value = ''
      return
    }

    if (selectedFile.size > MAX_IMAGE_SIZE_BYTES) {
      setUploadError('Please choose an image smaller than 5 MB.')
      setUploadMessage('')
      fileInput.value = ''
      return
    }

    const previewUrl = URL.createObjectURL(selectedFile)
    updatePreviewUrl(previewUrl)
    setUploadError('')
    setUploadMessage('Uploading image...')
    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('image', selectedFile)

      const result = await apiRequest('/uploads/image', {
        method: 'POST',
        body: formData,
      })

      if (result?.url) {
        updatePreviewUrl(result.url)
        setUploadedImageUrl(result.url)
      }

      setUploadMessage(result?.message || 'Image uploaded successfully.')
      setUploadError('')
      setFormErrors((prev) => ({ ...prev, image: '' }))
    } catch (uploadErr) {
      setUploadError(uploadErr instanceof Error ? uploadErr.message : 'Image upload failed.')
      setUploadMessage('Preview ready locally, but upload failed.')
      setUploadedImageUrl('')
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
      nextErrors.price = 'Price is required and must be a positive number.'
    }
    if (!formData.description.trim()) nextErrors.description = 'Description is required.'
    if (!formData.category.trim()) nextErrors.category = 'Category is required.'
    if (!formData.status.trim()) nextErrors.status = 'Status is required.'
    if (!uploadedImageUrl) nextErrors.image = 'Please upload at least one image.'

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
        price: Number(formData.price),
        description: formData.description.trim(),
        category: formData.category.trim(),
        status: formData.status.trim(),
        location: DEFAULT_ITEM_LOCATION,
        image: uploadedImageUrl,
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
      setUploadedImageUrl('')
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
                  min="0.01"
                  step="0.01"
                  placeholder="Price"
                  value={formData.price}
                  onChange={handleFormChange}
                  className="composer-text-input"
                />
                {formErrors.price && <p className="composer-feedback is-error">{formErrors.price}</p>}

                <input
                  name="category"
                  type="text"
                  placeholder="Category"
                  value={formData.category}
                  onChange={handleFormChange}
                  className="composer-text-input"
                />
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
                onChange={handleFileChange}
              />
            </form>
          </section>

          <section className="stories-row" aria-label="Stories">
            {STORIES.map((story) => (
              <article className="story-card" key={story}>
                <span>{story}</span>
              </article>
            ))}
          </section>

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
                  <div className="post-image" aria-hidden="true" />
                  <div className="post-body">
                    <div className="post-price">${item.price}</div>
                    <h2>{item.title}</h2>
                    <p>{item.description}</p>
                  </div>
                  <footer className="post-actions" aria-label="Post actions">
                    <button type="button">Like</button>
                    <button type="button">Comment</button>
                    <button type="button">Send Message</button>
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