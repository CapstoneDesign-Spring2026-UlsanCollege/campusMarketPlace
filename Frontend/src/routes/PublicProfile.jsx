import { useEffect, useMemo, useState } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { fetchUser, fetchUserActivity, fetchUserReviews, postUserReview } from '../services/api'
import Avatar from '../components/Avatar'
import ItemCard from '../components/ItemCard'
import { t } from '../services/i18n'

function getInitial(value) {
  return (value || 'Student').trim().charAt(0).toUpperCase() || 'S'
}

function normalizeReviews(payload) {
  if (Array.isArray(payload)) return payload
  if (payload && Array.isArray(payload.reviews)) return payload.reviews
  return []
}

export default function PublicProfile({ currency, language = 'en' }) {
  const { id } = useParams()
  const location = useLocation()
  const [user, setUser] = useState(null)
  const [activity, setActivity] = useState({ sellHistory: [] })
  const [reviews, setReviews] = useState([])
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' })
  const [submittingReview, setSubmittingReview] = useState(false)
  const [activeTab, setActiveTab] = useState('listings')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isActive = true
    async function load() {
      try {
        setIsLoading(true)
        setError('')
        // If navigation provided seller data in state, use it and avoid network fetch.
        const stateSeller = location?.state?.seller
        if (stateSeller && String(stateSeller.id) === String(id)) {
          setUser({ firstName: stateSeller.firstName || '', avatarUrl: stateSeller.avatarUrl || '', location: stateSeller.location || '' })
          // Still attempt to fetch activity but tolerate failures
          try {
            const a = await fetchUserActivity(id)
            if (!isActive) return
            setActivity(a || { sellHistory: [] })
          } catch (e) {
            if (!isActive) return
            setActivity({ sellHistory: [] })
          }
          // try to fetch reviews but tolerate failures
          try {
            const r = await fetchUserReviews(id)
            if (!isActive) return
            setReviews(normalizeReviews(r))
          } catch (e) {
            if (!isActive) return
            setReviews([])
          }
          if (!isActive) return
          setIsLoading(false)
          return
        }

        const u = await fetchUser(id)
        const a = await fetchUserActivity(id)
        const r = await fetchUserReviews(id).catch(() => [])
        if (!isActive) return
        setUser(u?.user || null)
        setActivity(a || { sellHistory: [] })
        setReviews(normalizeReviews(r))
      } catch (err) {
        if (!isActive) return
        setError(err?.message || 'Unable to load profile.')
      } finally {
        if (isActive) setIsLoading(false)
      }
    }

    load()
    return () => { isActive = false }
  }, [id])

  const displayName = useMemo(() => {
    if (!user) return 'Seller'
    const firstName = user.firstName || 'Student'
    const lastName = user.lastName || ''
    return `${firstName} ${lastName}`.trim()
  }, [user])

  const averageRating = useMemo(() => {
    if (!Array.isArray(reviews) || !reviews.length) return 0
    const sum = reviews.reduce((s, r) => s + (r.rating || 0), 0)
    return Math.round((sum / reviews.length) * 10) / 10
  }, [reviews])

  const listingCount = Array.isArray(activity.sellHistory) ? activity.sellHistory.length : 0

  const ratingStars = useMemo(() => {
    const fullStars = Math.max(0, Math.min(5, Math.round(averageRating || 0)))
    return '★'.repeat(fullStars) + '☆'.repeat(Math.max(0, 5 - fullStars))
  }, [averageRating])

  const recentReviews = useMemo(() => {
    if (!Array.isArray(reviews)) return []
    return [...reviews].slice(0, 3)
  }, [reviews])

  function handleReviewChange(e) {
    const { name, value } = e.target
    setReviewForm((s) => ({ ...s, [name]: name === 'rating' ? Number(value) : value }))
  }

  async function submitReview(e) {
    e.preventDefault()
    if (!reviewForm.comment || !reviewForm.rating) return
    try {
      setSubmittingReview(true)
      await postUserReview(id, { rating: reviewForm.rating, comment: reviewForm.comment })
      const fresh = await fetchUserReviews(id).catch(() => [])
      setReviews(normalizeReviews(fresh))
      setReviewForm({ rating: 5, comment: '' })
    } catch (err) {
      // ignore or surface error — keep simple for now
      console.error('Failed to submit review', err)
    } finally {
      setSubmittingReview(false)
    }
  }

  if (isLoading) {
    return (
      <main className="page-shell profile-shell">
        <div className="profile-empty-state"><p>{t(language, 'profile.loadingProfile') || 'Loading...'}</p></div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="page-shell profile-shell">
        <div className="profile-empty-state"><p>{error}</p></div>
      </main>
    )
  }

  return (
    <main className="page-shell profile-shell">
      <section className="profile-hero panel profile-hero-hb">
        <div className="profile-hero-content">
          <div className="profile-avatar-wrapper profile-hero-avatar">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={`${displayName} avatar`} className="profile-avatar-img" />
            ) : (
              <div className="profile-avatar" aria-hidden="true">{getInitial(displayName)}</div>
            )}
          </div>
          <div className="profile-hero-copy">
            <p className="eyebrow">{t(language, 'profile.sellerProfile') || 'Seller profile'}</p>
            <div className="profile-title-row">
              <h1>{displayName}</h1>
              {user?.isVerified ? <span className="profile-verified-pill">Verified</span> : null}
            </div>
            <p className="subcopy profile-location-line">{user?.location || 'Campus seller'}</p>
            <div className="profile-stat-row" aria-label="Seller summary">
              <div className="profile-stat-card">
                <strong>{listingCount}</strong>
                <span>{t(language, 'profile.listings') || 'Listings'}</span>
              </div>
              <div className="profile-stat-card">
                <strong>{reviews.length}</strong>
                <span>{t(language, 'profile.reviews') || 'Reviews'}</span>
              </div>
              <div className="profile-stat-card">
                <strong>{averageRating || '—'}</strong>
                <span>{ratingStars}</span>
              </div>
            </div>
          </div>
          <div className="profile-hero-action">
            <button type="button" className="button button-primary profile-contact-button">
              {t(language, 'profile.contactSeller') || 'Message seller'}
            </button>
          </div>
        </div>
        <div className="profile-tab-bar" role="tablist" aria-label="Seller profile sections">
          <button type="button" role="tab" aria-selected={activeTab === 'listings'} className={`profile-tab ${activeTab === 'listings' ? 'is-active' : ''}`} onClick={() => setActiveTab('listings')}>
            {t(language, 'profile.listings') || 'Listings'}
            <span>{listingCount}</span>
          </button>
          <button type="button" role="tab" aria-selected={activeTab === 'reviews'} className={`profile-tab ${activeTab === 'reviews' ? 'is-active' : ''}`} onClick={() => setActiveTab('reviews')}>
            {t(language, 'profile.reviews') || 'Reviews'}
            <span>{reviews.length}</span>
          </button>
          <button type="button" role="tab" aria-selected={activeTab === 'about'} className={`profile-tab ${activeTab === 'about' ? 'is-active' : ''}`} onClick={() => setActiveTab('about')}>
            {t(language, 'profile.sellerProfile') || 'About'}
          </button>
        </div>
      </section>

      <section className="profile-grid" aria-label="Seller listings">
        <aside className="profile-card panel profile-sidebar">
          <div className="profile-detail-box profile-summary-card">
            <p className="eyebrow">{t(language, 'profile.sellerProfile') || 'About seller'}</p>
            <p className="profile-summary-text">
              {displayName} is selling on campus and sharing listings, reviews, and availability in one place.
            </p>
            <div className="profile-summary-meta">
              <div>
                <span className="profile-meta-label">Location</span>
                <strong>{user?.location || 'Campus'}</strong>
              </div>
              <div>
                <span className="profile-meta-label">Response</span>
                <strong>Fast</strong>
              </div>
            </div>
          </div>
          <div className="profile-sidebar-footer">
            <div className="profile-review-summary profile-review-summary-tight">
              <strong className="profile-rating">{averageRating || '—'}</strong>
              <span className="profile-rating-count">{reviews.length ? `${reviews.length} reviews` : 'No reviews'}</span>
            </div>
            <div className="profile-recent-reviews">
              {recentReviews.length ? recentReviews.map((r) => (
                <div key={r._id || `${r.author}_${r.createdAt}`} className="review-item review-item-compact">
                  <div className="review-meta">
                    <div className="review-author-block">
                      {r.reviewerAvatarUrl ? <img src={r.reviewerAvatarUrl} alt="Reviewer avatar" className="review-avatar" /> : <div className="review-avatar review-avatar-fallback">{getInitial(r.reviewerName || r.authorName || 'A')}</div>}
                      <div>
                        <strong className="review-author">{r.reviewerName || r.authorName || r.author || 'Anonymous'}</strong>
                        <div className="review-rating">{'★'.repeat(r.rating || 0)}{'☆'.repeat(Math.max(0, 5 - (r.rating || 0)))}</div>
                      </div>
                    </div>
                    <time className="review-date">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ''}</time>
                  </div>
                  <div className="review-body">{r.comment}</div>
                </div>
              )) : (
                <div className="profile-empty-state"><p>{t(language,'profile.noReviews') || 'No reviews yet'}</p></div>
              )}
            </div>
            <form className="profile-review-form" onSubmit={submitReview}>
              <label>
                {t(language,'profile.yourRating') || 'Your rating'}
                <select name="rating" value={reviewForm.rating} onChange={handleReviewChange}>
                  <option value={5}>5</option>
                  <option value={4}>4</option>
                  <option value={3}>3</option>
                  <option value={2}>2</option>
                  <option value={1}>1</option>
                </select>
              </label>
              <label>
                {t(language,'profile.yourReview') || 'Your review'}
                <textarea name="comment" value={reviewForm.comment} onChange={handleReviewChange} rows={3} placeholder="Share your experience with this seller" />
              </label>
              <div>
                <button type="submit" className="button button-primary" disabled={submittingReview || !reviewForm.comment}>{submittingReview ? t(language,'profile.submitting')||'Submitting...' : t(language,'profile.submit')||'Submit review'}</button>
              </div>
            </form>
          </div>
        </aside>

        <article className="profile-card panel profile-main-card" role="tabpanel">
          <div className="profile-card-header">
            <div>
              <p className="eyebrow">{activeTab === 'reviews' ? (t(language, 'profile.reviews') || 'Reviews') : activeTab === 'about' ? (t(language, 'profile.sellerProfile') || 'About') : (t(language, 'profile.sellerListings') || 'Listings')}</p>
              <h2>{activeTab === 'reviews' ? (t(language, 'profile.reviewsTitle') || 'Buyer feedback') : activeTab === 'about' ? (t(language, 'profile.sellerProfile') || 'About seller') : (t(language, 'profile.listings') || 'Listings')}</h2>
            </div>
          </div>
          {activeTab === 'about' ? (
            <div className="profile-about-panel">
              <div className="profile-detail-box">
                <p className="profile-summary-text">
                  {displayName} is selling on campus and sharing listings, reviews, and availability in one place.
                </p>
                <div className="profile-summary-meta">
                  <div>
                    <span className="profile-meta-label">Location</span>
                    <strong>{user?.location || 'Campus'}</strong>
                  </div>
                  <div>
                    <span className="profile-meta-label">Response</span>
                    <strong>Fast</strong>
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === 'reviews' ? (
            <div className="profile-reviews-panel">
              <div className="profile-reviews-list profile-reviews-list-compact">
                {Array.isArray(reviews) && reviews.length ? (
                  reviews.map((r) => (
                    <div key={r._id || `${r.author}_${r.createdAt}`} className="review-item">
                      <div className="review-meta">
                        <div className="review-author-block">
                          {r.reviewerAvatarUrl ? <img src={r.reviewerAvatarUrl} alt="Reviewer avatar" className="review-avatar" /> : <div className="review-avatar review-avatar-fallback">{getInitial(r.reviewerName || r.authorName || 'A')}</div>}
                          <div>
                            <strong className="review-author">{r.reviewerName || r.authorName || r.author || 'Anonymous'}</strong>
                            <div className="review-rating">{'★'.repeat(r.rating || 0)}{'☆'.repeat(Math.max(0, 5 - (r.rating || 0)))}</div>
                          </div>
                        </div>
                        <time className="review-date">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ''}</time>
                      </div>
                      <div className="review-body">{r.comment}</div>
                    </div>
                  ))
                ) : (
                  <div className="profile-empty-state"><p>{t(language,'profile.noReviews') || 'No reviews yet'}</p></div>
                )}
              </div>
            </div>
          ) : (
            <div className="item-grid profile-item-grid">
              {Array.isArray(activity.sellHistory) && activity.sellHistory.length ? (
                activity.sellHistory.map((it) => (
                  <ItemCard key={it._id} item={it} currency={currency} language={language} />
                ))
              ) : (
                <div className="profile-empty-state"><p>{t(language, 'profile.noListings') || 'No listings yet'}</p></div>
              )}
            </div>
          )}
        </article>
      </section>
    </main>
  )
}
