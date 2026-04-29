import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const STORIES = [
  'Engineering',
  'Dorm Deals',
  'Books',
  'Tech',
  'Furniture',
]

const FEED_POSTS = [
  {
    id: 1,
    seller: 'Sujan Kim',
    location: 'Library Front Gate',
    posted: '2h',
    item: 'iPad 9th Gen 64GB',
    price: '$210',
    description: 'Great condition, includes charger and case. Pickup near library after classes.',
  },
  {
    id: 2,
    seller: 'Campus Kitchen Club',
    location: 'Student Center',
    posted: '4h',
    item: 'Mini Rice Cooker',
    price: '$28',
    description: 'Used one semester only. Works perfectly for dorm meal prep.',
  },
  {
    id: 3,
    seller: 'Mina Park',
    location: 'Dorm C Lobby',
    posted: '7h',
    item: 'Desk + Chair Set',
    price: '$55',
    description: 'Moving out next week. Selling as a set, first come first served.',
  },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const imageInputRef = useRef(null)

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

  const firstName = user?.firstName || 'Student'

  function handleImageUpload() {
    imageInputRef.current?.click()
  }

  function handleFileChange(event) {
    const selectedFile = event.target.files?.[0]
    if (!selectedFile) {
      return
    }

    event.target.value = ''
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
              <button className="composer-icon-button composer-camera-right" type="button" onClick={handleImageUpload} aria-label="Camera upload">
                📷
              </button>
            </div>
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
            {FEED_POSTS.map((post) => (
              <article className="feed-panel post-card" key={post.id}>
                <header className="post-header">
                  <div className="avatar-badge" aria-hidden="true">{post.seller.slice(0, 1)}</div>
                  <div>
                    <strong>{post.seller}</strong>
                    <p>{post.location} · {post.posted}</p>
                  </div>
                </header>
                <div className="post-image" aria-hidden="true" />
                <div className="post-body">
                  <div className="post-price">{post.price}</div>
                  <h2>{post.item}</h2>
                  <p>{post.description}</p>
                </div>
                <footer className="post-actions" aria-label="Post actions">
                  <button type="button">Like</button>
                  <button type="button">Comment</button>
                  <button type="button">Send Message</button>
                </footer>
              </article>
            ))}
          </section>

        </section>
      </section>
    </main>
  )
}
