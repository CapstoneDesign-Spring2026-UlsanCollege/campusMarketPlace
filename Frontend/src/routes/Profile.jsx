import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchProfile } from '../services/api'
import { formatPriceFromUsd } from '../services/currency'
import { getAuthToken } from '../services/auth'
import { t } from '../services/i18n'

const PROFILE_COPY = {
  en: {
    loginRequired: 'Please log in first.',
    recently: 'Recently',
    noPaymentMethodsYet: 'No payment methods yet',
    addPaymentMethod: 'Add a payment method in your account settings.',
    nothingHereYet: 'Nothing here yet',
    paymentMethod: 'Payment method',
    default: 'Default',
    notAvailable: 'Not available',
    noneSaved: 'None saved',
    editProfile: 'Edit profile',
    location: 'Location',
    paymentMethods: 'Payment methods',
    pickupPreferences: 'Pickup preferences',
    secureCheckout: 'Secure checkout',
    loadingError: 'Unable to load profile data right now.',
    profileSections: 'Account sections',
  },
  ko: {
    loginRequired: '먼저 로그인하세요.',
    recently: '최근',
    noPaymentMethodsYet: '아직 결제 수단이 없습니다',
    addPaymentMethod: '계정 설정에서 결제 수단을 추가하세요.',
    nothingHereYet: '아직 없습니다',
    paymentMethod: '결제 수단',
    default: '기본',
    notAvailable: '없음',
    noneSaved: '저장된 항목 없음',
    editProfile: '프로필 수정',
    location: '위치',
    paymentMethods: '결제 수단',
    pickupPreferences: '수령 설정',
    secureCheckout: '안전한 결제',
    loadingError: '지금은 프로필 데이터를 불러올 수 없습니다.',
    profileSections: '계정 섹션',
  },
  ne: {
    loginRequired: 'पहिले लगइन गर्नुहोस्।',
    recently: 'हालै',
    noPaymentMethodsYet: 'अहिलेसम्म कुनै भुक्तानी विधि छैन',
    addPaymentMethod: 'आफ्नो खाता सेटिङमा भुक्तानी विधि थप्नुहोस्।',
    nothingHereYet: 'अहिलेसम्म केही छैन',
    paymentMethod: 'भुक्तानी विधि',
    default: 'पूर्वनिर्धारित',
    notAvailable: 'उपलब्ध छैन',
    noneSaved: 'केही बचत गरिएको छैन',
    editProfile: 'प्रोफाइल सम्पादन',
    location: 'स्थान',
    paymentMethods: 'भुक्तानी विधिहरू',
    pickupPreferences: 'पिकअप प्राथमिकता',
    secureCheckout: 'सुरक्षित चेकआउट',
    loadingError: 'अहिले प्रोफाइल डेटा लोड गर्न सकिएन।',
    profileSections: 'खाता खण्डहरू',
  },
  hi: {
    loginRequired: 'पहले लॉग इन करें।',
    recently: 'हाल ही में',
    noPaymentMethodsYet: 'अभी कोई भुगतान विधि नहीं है',
    addPaymentMethod: 'अपने खाते की सेटिंग में भुगतान विधि जोड़ें।',
    nothingHereYet: 'अभी यहाँ कुछ नहीं है',
    paymentMethod: 'भुगतान विधि',
    default: 'डिफ़ॉल्ट',
    notAvailable: 'उपलब्ध नहीं',
    noneSaved: 'कोई सेव नहीं है',
    editProfile: 'प्रोफ़ाइल संपादित करें',
    location: 'स्थान',
    paymentMethods: 'भुगतान विधियाँ',
    pickupPreferences: 'पिकअप प्राथमिकताएँ',
    secureCheckout: 'सुरक्षित चेकआउट',
    loadingError: 'अभी प्रोफ़ाइल डेटा लोड नहीं हो सका।',
    profileSections: 'खाता अनुभाग',
  },
}

function getInitial(value) {
  return (value || 'Student').trim().charAt(0).toUpperCase() || 'S'
}

function formatDate(value, language = 'en') {
  const copy = PROFILE_COPY[language] || PROFILE_COPY.en
  if (!value) {
    return copy.recently
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return copy.recently
  }

  const localeMap = { en: 'en-US', ko: 'ko-KR', ne: 'ne-NP', hi: 'hi-IN' }
  return new Intl.DateTimeFormat(localeMap[language] || 'en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

function PaymentMethodList({ paymentMethods, copy }) {
  if (!paymentMethods.length) {
    return (
      <div className="profile-empty-state">
        <div className="empty-state-icon">💳</div>
        <p><strong>{copy.noPaymentMethodsYet}</strong></p>
        <p className="empty-state-hint">{copy.addPaymentMethod}</p>
      </div>
    )
  }

  return (
    <div className="profile-list">
      {paymentMethods.map((method, index) => (
        <article className="profile-list-item profile-payment-item" key={method.id || method.label || index}>
          <div className="payment-info">
            <div className="payment-icon">💳</div>
            <div>
              <strong>{method.label || method.provider || method.type || copy.paymentMethod}</strong>
              <p>
                {[method.type, method.provider, method.last4 ? `•••• ${method.last4}` : null]
                  .filter(Boolean)
                  .join(' • ')}
              </p>
            </div>
          </div>
          {method.isDefault ? <span className="badge badge-default">{copy.default}</span> : null}
        </article>
      ))}
    </div>
  )
}

function ActivityList({ items, currency, emptyMessage, copy }) {
  if (!items.length) {
    return (
      <div className="profile-empty-state">
        <div className="empty-state-icon">📦</div>
        <p><strong>{copy.nothingHereYet}</strong></p>
        <p className="empty-state-hint">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="profile-list">
      {items.map((item) => (
        <article className="profile-list-item profile-activity-item" key={item._id}>
          <div className="activity-info">
            <strong className="activity-title">{item.title}</strong>
            <p className="activity-meta">
              <span className="category-badge">{item.category || 'Listing'}</span>
              <span className={`status-badge status-${(item.status || 'active').toLowerCase()}`}>{item.status || 'active'}</span>
              <span className="date-meta">{formatDate(item.createdAt)}</span>
            </p>
          </div>
          <span className="activity-price">{formatPriceFromUsd(item.price, currency)}</span>
        </article>
      ))}
    </div>
  )
}

export default function Profile({ currency, language = 'en' }) {
  const navigate = useNavigate()
  const copy = PROFILE_COPY[language] || PROFILE_COPY.en
  const [profile, setProfile] = useState(null)
  const [buyHistory, setBuyHistory] = useState([])
  const [sellHistory, setSellHistory] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    const token = getAuthToken()
    if (!token) {
      navigate('/login', { replace: true, state: { message: copy.loginRequired } })
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
        setLoadError(error?.message || copy.loadingError)
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
        <div className="profile-hero-content">
          <div className="profile-avatar-wrapper">
            <img src={profile?.avatarUrl || ''} alt={`${displayName} avatar`} className="profile-avatar-img" onError={(e) => { e.target.style.display = 'none' }} />
            {!profile?.avatarUrl ? <div className="profile-avatar" aria-hidden="true">{getInitial(displayName)}</div> : null}
          </div>
          <div className="profile-hero-copy">
            <p className="eyebrow">{t(language, 'profile.yourAccount')}</p>
            <h1>{displayName}</h1>
            <p className="subcopy">{t(language, 'profile.yourAccount')} — {t(language, 'profile.storedLocationNote')}</p>
          </div>
          <div className="profile-hero-action">
            <button className="button button-primary profile-edit-button" type="button" onClick={() => navigate('/profile/edit')}>
              ✎ {copy.editProfile}
            </button>
          </div>
        </div>
        <div className="profile-hero-meta">
          <div className="meta-item">
            <span className="profile-meta-label">📧 Email</span>
            <strong>{profile?.email || copy.notAvailable}</strong>
          </div>
          <div className="meta-item">
            <span className="profile-meta-label">📍 {copy.location}</span>
            <strong>{locationLabel}</strong>
          </div>
          <div className="meta-item">
            <span className="profile-meta-label">💳 {copy.paymentMethods}</span>
            <strong>{paymentMethods.length ? `${paymentMethods.length} ${copy.paymentMethod}${paymentMethods.length > 1 ? 's' : ''}` : copy.noneSaved}</strong>
          </div>
        </div>
      </section>

      <section className="profile-grid" aria-label={copy.profileSections}>
        <article className="profile-card panel">
            <div className="profile-card-header">
            <div>
              <p className="eyebrow">{t(language, 'profile.buyHistory')}</p>
              <h2>{t(language, 'profile.purchases')}</h2>
            </div>
          </div>
          {isLoading ? (
            <div className="profile-empty-state">
              <p>{t(language, 'profile.loadingPurchaseHistory')}</p>
            </div>
          ) : loadError ? (
            <div className="profile-empty-state">
              <p>{loadError}</p>
            </div>
          ) : (
            <ActivityList
              items={buyHistory}
              currency={currency}
              emptyMessage={t(language, 'profile.noPurchaseHistory')}
              copy={copy}
            />
          )}
        </article>

        <article className="profile-card panel">
          <div className="profile-card-header">
            <div>
              <p className="eyebrow">{t(language, 'profile.sellHistory')}</p>
              <h2>{t(language, 'profile.yourListings')}</h2>
            </div>
          </div>
          {isLoading ? (
            <div className="profile-empty-state">
              <p>{t(language, 'profile.loadingListingHistory')}</p>
            </div>
          ) : loadError ? (
            <div className="profile-empty-state">
              <p>{loadError}</p>
            </div>
          ) : (
            <ActivityList
              items={sellHistory}
              currency={currency}
              emptyMessage={t(language, 'profile.noListingsPosted')}
              copy={copy}
            />
          )}
        </article>

        <article className="profile-card panel">
          <div className="profile-card-header">
            <div>
              <p className="eyebrow">{copy.location}</p>
              <h2>{copy.pickupPreferences}</h2>
            </div>
          </div>
          <div className="profile-detail-box">
            <p>{t(language, 'profile.primaryLocation')}: {locationLabel}</p>
            <p>{t(language, 'profile.storedLocationNote')}</p>
          </div>
        </article>

        <article className="profile-card panel">
          <div className="profile-card-header">
            <div>
              <p className="eyebrow">{copy.paymentMethods}</p>
              <h2>{copy.secureCheckout}</h2>
            </div>
          </div>
          <PaymentMethodList paymentMethods={paymentMethods} copy={copy} />
        </article>
      </section>
    </main>
  )
}