import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiRequest, fetchItems } from '../services/api'

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])

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
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
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
    imageInputRef.current?.click()
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
      }

      setUploadMessage(result?.message || 'Image uploaded successfully.')
      setUploadError('')
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Image upload failed.')
      setUploadMessage('Preview ready locally, but upload failed.')
    } finally {
      setIsUploading(false)
      fileInput.value = ''
    }
  }

  return (
    <main className="page-shell marketplace-shell">
      <section className="feed-layout">
        <section className="feed-main-col">
          <section className="feed-panel composer" aria-label="Post composer">
            <div className="composer-row">
              <div className="avatar-badge" aria-hidden="true">
                {firstName.slice(0, 1)}
              </div>
              <button className="composer-input" type="button">
                Do you want to sell anything?
              </button>
              <button className="composer-icon-button composer-camera-right" type="button" onClick={handleImageUpload} aria-label="Camera upload" disabled={isUploading}>
                📷
              </button>
            </div>
            {(uploadMessage || uploadError) && (
              <p className={`composer-feedback ${uploadError ? 'is-error' : 'is-success'}`} aria-live="polite">
                {uploadError || uploadMessage}
              </p>
            )}
            {uploadPreviewUrl && (
              <div className="composer-preview">
                <img src={uploadPreviewUrl} alt="Selected upload preview" />
              </div>
            )}
            <input
              ref={imageInputRef}
              className="composer-file-input"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
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
                    <div className="avatar-badge" aria-hidden="true">{item.sellerName.slice(0, 1)}</div>
                    <div>
                      <strong>{item.sellerName}</strong>
                      <p>{item.location}</p>
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
