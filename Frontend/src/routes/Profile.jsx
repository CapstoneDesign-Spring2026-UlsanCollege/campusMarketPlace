import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchProfile } from '../services/api'
import { formatPriceFromUsd } from '../services/currency'

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

function PaymentMethodList({ paymentMethods }) {
  if (!paymentMethods.length) {
    return (
      <div className="profile-empty-state">
        <p>No saved payment methods.</p>
      </div>
    )
  }

  return (
    <div className="profile-list">
      {paymentMethods.map((method, index) => (
        <article className="profile-list-item" key={method.id || method.label || index}>
          <div>
            <strong>{method.label || method.provider || method.type || 'Payment method'}</strong>
            <p>
              {[method.type, method.provider, method.last4 ? `•••• ${method.last4}` : null]
                .filter(Boolean)
                .join(' • ')}
            </p>
          </div>
          {method.isDefault ? <span>Default</span> : null}
        </article>
      ))}
    </div>
  )
}

function ActivityList({ items, currency, emptyMessage }) {
  if (!items.length) {
    return (
      <div className="profile-empty-state">
        <p>{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="profile-list">
      {items.map((item) => (
        <article className="profile-list-item" key={item._id}>
          <div>
            <strong>{item.title}</strong>
            <p>
              {item.category || 'Listing'} • {item.status || 'active'} • {formatDate(item.createdAt)}
            </p>
          </div>
          <span>{formatPriceFromUsd(item.price, currency)}</span>
        </article>
      ))}
    </div>
  )
}

export default function Profile({ currency }) {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [buyHistory, setBuyHistory] = useState([])
  const [sellHistory, setSellHistory] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('campusMarketplaceToken')
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

  return (
    <main className="page-shell profile-shell">
      <section className="profile-hero panel">
        {profile?.avatarUrl ? (
          <img src={profile.avatarUrl} alt={`${displayName} avatar`} className="profile-avatar-img" />
        ) : (
          <div className="profile-avatar" aria-hidden="true">{getInitial(displayName)}</div>
        )}
        <div className="profile-hero-copy">
          <p className="eyebrow">Your account</p>
          <h1>{displayName}</h1>
          <p className="subcopy">
            Your profile is powered by the backend and keeps your listings, location, and saved payment methods in one place.
          </p>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <button className="button button-secondary" type="button" onClick={() => navigate('/profile/edit')}>
            Edit profile
          </button>
        </div>
        <div className="profile-hero-meta">
          <div>
            <span className="profile-meta-label">Email</span>
            <strong>{profile?.email || 'Not available'}</strong>
          </div>
          <div>
            <span className="profile-meta-label">Location</span>
            <strong>{locationLabel}</strong>
          </div>
          <div>
            <span className="profile-meta-label">Saved payments</span>
            <strong>{paymentMethods.length ? `${paymentMethods.length} method${paymentMethods.length > 1 ? 's' : ''}` : 'None'}</strong>
          </div>
        </div>
      </section>

      <section className="profile-grid" aria-label="Account sections">
        <article className="profile-card panel">
          <div className="profile-card-header">
            <div>
              <p className="eyebrow">Buy history</p>
              <h2>Purchases</h2>
            </div>
          </div>
          {isLoading ? (
            <div className="profile-empty-state">
              <p>Loading purchase history...</p>
            </div>
          ) : loadError ? (
            <div className="profile-empty-state">
              <p>{loadError}</p>
            </div>
          ) : (
            <ActivityList
              items={buyHistory}
              currency={currency}
              emptyMessage="No purchase history yet."
            />
          )}
        </article>

        <article className="profile-card panel">
          <div className="profile-card-header">
            <div>
              <p className="eyebrow">Sell history</p>
              <h2>Your listings</h2>
            </div>
          </div>
          {isLoading ? (
            <div className="profile-empty-state">
              <p>Loading listing history...</p>
            </div>
          ) : loadError ? (
            <div className="profile-empty-state">
              <p>{loadError}</p>
            </div>
          ) : (
            <ActivityList
              items={sellHistory}
              currency={currency}
              emptyMessage="No listings posted yet."
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
            <p>Primary location: {locationLabel}</p>
            <p>Stored from the account record so future edits can update this in one place.</p>
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