import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchUser, fetchUserActivity } from '../services/api'
import Avatar from '../components/Avatar'
import ItemCard from '../components/ItemCard'
import { t } from '../services/i18n'

function getInitial(value) {
  return (value || 'Student').trim().charAt(0).toUpperCase() || 'S'
}

export default function PublicProfile({ currency, language = 'en' }) {
  const { id } = useParams()
  const [user, setUser] = useState(null)
  const [activity, setActivity] = useState({ sellHistory: [] })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isActive = true
    async function load() {
      try {
        setIsLoading(true)
        setError('')
        const u = await fetchUser(id)
        const a = await fetchUserActivity(id)
        if (!isActive) return
        setUser(u?.user || null)
        setActivity(a || { sellHistory: [] })
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
      <section className="profile-hero panel">
        <div className="profile-hero-content">
          <div className="profile-avatar-wrapper">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={`${displayName} avatar`} className="profile-avatar-img" />
            ) : (
              <div className="profile-avatar" aria-hidden="true">{getInitial(displayName)}</div>
            )}
          </div>
          <div className="profile-hero-copy">
            <p className="eyebrow">{t(language, 'profile.sellerProfile') || 'Seller'}</p>
            <h1>{displayName}</h1>
            <p className="subcopy">{user?.location || ''}</p>
          </div>
        </div>
      </section>

      <section className="profile-grid" aria-label="Seller listings">
        <article className="profile-card panel">
          <div className="profile-card-header">
            <div>
              <p className="eyebrow">{t(language, 'profile.sellerListings') || 'Listings'}</p>
              <h2>{t(language, 'profile.listings') || 'Listings'}</h2>
            </div>
          </div>
          <div className="item-grid">
            {Array.isArray(activity.sellHistory) && activity.sellHistory.length ? (
              activity.sellHistory.map((it) => (
                <ItemCard key={it._id} item={it} currency={currency} language={language} />
              ))
            ) : (
              <div className="profile-empty-state"><p>{t(language, 'profile.noListings') || 'No listings yet'}</p></div>
            )}
          </div>
        </article>
      </section>
    </main>
  )
}
