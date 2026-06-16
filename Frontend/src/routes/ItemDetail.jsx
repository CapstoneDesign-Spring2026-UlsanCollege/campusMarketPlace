import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { API_ORIGIN, fetchItems, fetchUser, openMessageThread } from '../services/api'
import { formatPriceFromUsd } from '../services/currency'
import { getAuthUser } from '../services/auth'
import Avatar from '../components/Avatar'

const DETAIL_COPY = {
  en: {
    justNow: 'Just now',
    minutesAgo: (minutes) => `${minutes}m ago`,
    hoursAgo: (hours) => `${hours}h ago`,
    daysAgo: (days) => `${days}d ago`,
    listingPreview: 'Listing preview',
    loadingItemDetails: 'Loading item details…',
    fetchingLayout: 'Fetching the listing layout so you can see how it will look.',
    itemNotFound: 'The listing was not found.',
    unableToOpen: 'We could not open that item.',
    goBack: 'Go back',
    searchListings: 'Search listings',
    marketplace: 'Marketplace',
    listings: 'Listings',
    item: 'Item',
    category: 'Category',
    condition: 'Condition',
    location: 'Location',
    posted: 'Posted',
    likeNew: 'Like new',
    general: 'General',
    campus: 'Campus',
    seller: 'Seller',
    verified: 'Verified',
    thisIsYourListing: 'This is your listing.',
    loadingSellerProfile: 'Loading seller profile…',
    studentSellerProfile: 'Student seller profile.',
    contact: 'Contact',
    reachSellerDirectly: 'Reach the seller directly',
    messageInApp: 'Message in app',
    fastInAppMessagingAvailable: 'Fast in-app messaging available',
    messageSeller: 'Message seller',
    viewProfile: 'View profile',
    back: 'Back',
    listingImageViewer: 'Listing image viewer',
    closeImageViewer: 'Close image viewer',
    previousImage: 'Previous image',
    nextImage: 'Next image',
    openImageViewer: 'Open image viewer',
    viewImage: (index) => `View image ${index}`,
    thumbnail: (index) => `Thumbnail ${index}`,
    imageCount: (index, total) => `${index} / ${total}`,
  },
  ko: {
    justNow: '방금 전',
    minutesAgo: (minutes) => `${minutes}분 전`,
    hoursAgo: (hours) => `${hours}시간 전`,
    daysAgo: (days) => `${days}일 전`,
    listingPreview: '게시글 미리보기',
    loadingItemDetails: '상품 정보를 불러오는 중…',
    fetchingLayout: '게시글 레이아웃을 불러와 화면을 확인할 수 있게 합니다.',
    itemNotFound: '게시글을 찾을 수 없습니다.',
    unableToOpen: '해당 항목을 열 수 없습니다.',
    goBack: '뒤로 가기',
    searchListings: '게시글 검색',
    marketplace: '마켓플레이스',
    listings: '게시글',
    item: '상품',
    category: '카테고리',
    condition: '상태',
    location: '위치',
    posted: '게시됨',
    likeNew: '거의 새것',
    general: '일반',
    campus: '캠퍼스',
    seller: '판매자',
    verified: '인증됨',
    thisIsYourListing: '이것은 회원님의 게시글입니다.',
    loadingSellerProfile: '판매자 프로필을 불러오는 중…',
    studentSellerProfile: '학생 판매자 프로필입니다.',
    contact: '연락처',
    reachSellerDirectly: '판매자에게 직접 연락',
    messageInApp: '앱에서 메시지',
    fastInAppMessagingAvailable: '빠른 앱 내 메시지 이용 가능',
    messageSeller: '판매자에게 메시지',
    viewProfile: '프로필 보기',
    back: '뒤로',
    listingImageViewer: '게시글 이미지 뷰어',
    closeImageViewer: '이미지 뷰어 닫기',
    previousImage: '이전 이미지',
    nextImage: '다음 이미지',
    openImageViewer: '이미지 뷰어 열기',
    viewImage: (index) => `${index}번 이미지 보기`,
    thumbnail: (index) => `${index}번 썸네일`,
    imageCount: (index, total) => `${index} / ${total}`,
  },
  ne: {
    justNow: 'अहिले नै',
    minutesAgo: (minutes) => `${minutes} मिनेट अघि`,
    hoursAgo: (hours) => `${hours} घण्टा अघि`,
    daysAgo: (days) => `${days} दिन अघि`,
    listingPreview: 'सूची पूर्वावलोकन',
    loadingItemDetails: 'वस्तु विवरण लोड हुँदैछ…',
    fetchingLayout: 'सूची कस्तो देखिन्छ भनेर देखाउन यसको लेआउट ल्याइँदैछ।',
    itemNotFound: 'सूची फेला परेन।',
    unableToOpen: 'यो वस्तु खोल्न सकिएन।',
    goBack: 'फिर्ता जानुहोस्',
    searchListings: 'सूचीहरू खोज्नुहोस्',
    marketplace: 'बजार',
    listings: 'सूचीहरू',
    item: 'वस्तु',
    category: 'श्रेणी',
    condition: 'अवस्था',
    location: 'स्थान',
    posted: 'प्रकाशित',
    likeNew: 'नयाँ जस्तै',
    general: 'सामान्य',
    campus: 'क्याम्पस',
    seller: 'बिक्रेता',
    verified: 'प्रमाणित',
    thisIsYourListing: 'यो तपाईंको सूची हो।',
    loadingSellerProfile: 'बिक्रेताको प्रोफाइल लोड हुँदैछ…',
    studentSellerProfile: 'विद्यार्थी बिक्रेताको प्रोफाइल।',
    contact: 'सम्पर्क',
    reachSellerDirectly: 'बिक्रेतासँग सिधै सम्पर्क गर्नुहोस्',
    messageInApp: 'एपभित्र सन्देश',
    fastInAppMessagingAvailable: 'छिटो इन-एप मेसेजिङ उपलब्ध छ',
    messageSeller: 'बिक्रेतालाई सन्देश',
    viewProfile: 'प्रोफाइल हेर्नुहोस्',
    back: 'फिर्ता',
    listingImageViewer: 'सूची छवि दर्शक',
    closeImageViewer: 'छवि दर्शक बन्द गर्नुहोस्',
    previousImage: 'अघिल्लो छवि',
    nextImage: 'अर्को छवि',
    openImageViewer: 'छवि दर्शक खोल्नुहोस्',
    viewImage: (index) => `छवि ${index} हेर्नुहोस्`,
    thumbnail: (index) => `थम्बनेल ${index}`,
    imageCount: (index, total) => `${index} / ${total}`,
  },
  hi: {
    justNow: 'अभी',
    minutesAgo: (minutes) => `${minutes} मिनट पहले`,
    hoursAgo: (hours) => `${hours} घंटे पहले`,
    daysAgo: (days) => `${days} दिन पहले`,
    listingPreview: 'लिस्टिंग पूर्वावलोकन',
    loadingItemDetails: 'आइटम विवरण लोड हो रहा है…',
    fetchingLayout: 'लिस्टिंग का लेआउट लाकर यह दिखाया जा रहा है कि यह कैसा लगेगा।',
    itemNotFound: 'लिस्टिंग नहीं मिली।',
    unableToOpen: 'हम उस आइटम को खोल नहीं पाए।',
    goBack: 'वापस जाएँ',
    searchListings: 'लिस्टिंग खोजें',
    marketplace: 'मार्केटप्लेस',
    listings: 'लिस्टिंग्स',
    item: 'आइटम',
    category: 'श्रेणी',
    condition: 'स्थिति',
    location: 'स्थान',
    posted: 'पोस्ट किया गया',
    likeNew: 'नए जैसा',
    general: 'सामान्य',
    campus: 'कैंपस',
    seller: 'विक्रेता',
    verified: 'सत्यापित',
    thisIsYourListing: 'यह आपकी लिस्टिंग है।',
    loadingSellerProfile: 'विक्रेता प्रोफ़ाइल लोड हो रही है…',
    studentSellerProfile: 'छात्र विक्रेता प्रोफ़ाइल।',
    contact: 'संपर्क',
    reachSellerDirectly: 'विक्रेता से सीधे संपर्क करें',
    messageInApp: 'ऐप में संदेश',
    fastInAppMessagingAvailable: 'तेज़ इन-ऐप मैसेजिंग उपलब्ध है',
    messageSeller: 'विक्रेता को संदेश',
    viewProfile: 'प्रोफ़ाइल देखें',
    back: 'वापस',
    listingImageViewer: 'लिस्टिंग इमेज व्यूअर',
    closeImageViewer: 'इमेज व्यूअर बंद करें',
    previousImage: 'पिछली छवि',
    nextImage: 'अगली छवि',
    openImageViewer: 'इमेज व्यूअर खोलें',
    viewImage: (index) => `छवि ${index} देखें`,
    thumbnail: (index) => `थंबनेल ${index}`,
    imageCount: (index, total) => `${index} / ${total}`,
  },
}

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

function formatPostedTime(value, copy) {
  if (!value) return copy.justNow

  const createdAt = new Date(value)
  if (Number.isNaN(createdAt.getTime())) return copy.justNow

  const diffMs = Date.now() - createdAt.getTime()
  const diffSeconds = Math.floor(diffMs / 1000)
  if (diffSeconds < 60) return copy.justNow

  const diffMinutes = Math.floor(diffSeconds / 60)
  if (diffMinutes < 60) return copy.minutesAgo(diffMinutes)

  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return copy.hoursAgo(diffHours)

  return copy.daysAgo(Math.floor(diffHours / 24))
}

function getConditionLabel(item, copy) {
  const raw = item?.condition || item?.itemCondition || item?.state || ''
  const normalized = String(raw).trim()
  return normalized || copy.likeNew
}

function buildDetailRows(item, copy) {
  return [
    { label: copy.category, value: item?.category || copy.general },
    { label: copy.condition, value: item?.condition || item?.itemCondition || item?.state || copy.likeNew },
    { label: copy.location, value: item?.location || copy.campus },
    { label: copy.posted, value: formatPostedTime(item?.createdAt, copy) },
  ]
}

export default function ItemDetail({ currency, language = 'en' }) {
  const navigate = useNavigate()
  const params = useParams()
  const location = useLocation()
  const copy = DETAIL_COPY[language] || DETAIL_COPY.en
  const [item, setItem] = useState(location.state?.item || null)
  const [isLoading, setIsLoading] = useState(!location.state?.item)
  const [error, setError] = useState('')
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const [sellerProfile, setSellerProfile] = useState(null)
  const [sellerLoading, setSellerLoading] = useState(false)
  const currentUser = getAuthUser()
  // Development demo item (used only when backend isn't available)
  const demoItem = import.meta.env.DEV
    ? {
        _id: 'demo-1',
        title: 'Demo: Canon DSLR with 18-55mm Lens',
        price: 249.99,
        category: 'Electronics',
        condition: 'Good',
        location: 'Campus Library',
        createdAt: new Date().toISOString(),
        description: 'Well-maintained DSLR camera. Includes charger, strap, and 32GB SD card. Perfect for photography students.',
        images: ['/uploads/demo-camera-1.jpg', '/uploads/demo-camera-2.jpg', '/uploads/demo-camera-3.jpg'],
        sellerName: 'Demo Seller',
        sellerAvatarUrl: '',
        seller_verified: true,
      }
    : null

  const effectiveItem = item || demoItem
  const galleryImages = useMemo(() => getAllImageValues(effectiveItem), [effectiveItem])
  const activeImageSrc = resolveImageUrl(galleryImages[activeImageIndex] || galleryImages[0] || getPrimaryImageValue(effectiveItem))
  const sellerName = sellerProfile
    ? `${sellerProfile?.firstName || ''} ${sellerProfile?.lastName || ''}`.trim() || effectiveItem?.sellerName || copy.seller
    : effectiveItem?.sellerName || copy.seller
  const sellerAvatar = effectiveItem?.sellerAvatarUrl || effectiveItem?.sellerAvatar || effectiveItem?.seller_avatar || effectiveItem?.seller_avatar_url || ''
  const detailRows = useMemo(() => buildDetailRows(effectiveItem, copy), [effectiveItem, copy])
  const sellerLocation = sellerProfile?.location || effectiveItem?.location || copy.campus
  const sellerId = sellerProfile?.id || sellerProfile?._id || effectiveItem?.seller_id || effectiveItem?.sellerId || effectiveItem?.seller?.id || effectiveItem?.seller?._id || ''
  const sellerProfileState = {
    seller: {
      id: sellerId,
      firstName: sellerName,
      avatarUrl: sellerProfile?.avatarUrl || sellerAvatar,
      location: sellerLocation,
    },
  }
  const sellerEmail = sellerProfile?.email || effectiveItem?.sellerEmail || ''
  const sellerPhone = sellerProfile?.phone || effectiveItem?.sellerPhone || ''
  const conditionLabel = getConditionLabel(effectiveItem, copy)
  const categoryTrail = [effectiveItem?.category || copy.listings, conditionLabel, sellerLocation].filter(Boolean)

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
    const sellerId = item?.seller_id || item?.sellerId || item?.seller?.id || item?.seller?._id || ''

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
  }, [item?.sellerId, item?.seller_id, item?.seller?.id, item?.seller?._id])

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
          <p className="eyebrow">{copy.listingPreview}</p>
          <h1>{copy.loadingItemDetails}</h1>
          <p className="subcopy">{copy.fetchingLayout}</p>
        </section>
      </main>
    )
  }
  // If there's an error or no item, show a friendly error page.
  // In development, fall back to a demo item so designers can preview the UI without the backend.
  if (error || !item) {
    if (import.meta.env.DEV) {
      const demo = {
        _id: 'demo-1',
        title: 'Demo: Canon DSLR with 18-55mm Lens',
        price: 249.99,
        category: 'Electronics',
        condition: 'Good',
        location: 'Campus Library',
        createdAt: new Date().toISOString(),
        description: 'Well-maintained DSLR camera. Includes charger, strap, and 32GB SD card. Perfect for photography students.',
        images: [
          '/uploads/demo-camera-1.jpg',
          '/uploads/demo-camera-2.jpg',
          '/uploads/demo-camera-3.jpg',
        ],
        sellerName: 'Demo Seller',
        sellerAvatarUrl: '',
        seller_verified: true,
      }
      // don't set state during render; use demo data via `effectiveItem`
    } else {
      return (
        <main className="page-shell marketplace-shell">
          <section className="panel item-detail-shell item-detail-error">
            <p className="eyebrow">{copy.listingPreview}</p>
            <h1>{copy.unableToOpen}</h1>
            <p className="subcopy">{error || copy.itemNotFound}</p>
            <div className="detail-actions">
              <button className="button button-primary" type="button" onClick={() => navigate(-1)}>
                {copy.goBack}
              </button>
              <Link className="button button-secondary" to="/search">
                {copy.searchListings}
              </Link>
            </div>
          </section>
        </main>
      )
    }
  }

  return (
    <main className="page-shell marketplace-shell">
      <section className="item-detail-shell panel">
        <div className="detail-breadcrumbs">
          <Link to="/browse">{copy.marketplace}</Link>
          <span>›</span>
          <Link to={`/search?category=${encodeURIComponent(effectiveItem?.category || '')}`}>{effectiveItem?.category || copy.listings}</Link>
          <span>›</span>
          <span>{effectiveItem?.title}</span>
        </div>

        <div className="detail-hero">
          <div className="detail-left">
            <div className="detail-header">
            <p className="eyebrow">{copy.listingPreview}</p>
            <div className="detail-trail">
              {categoryTrail.map((part) => (
                <span key={part} className="detail-trail-pill">{part}</span>
              ))}
            </div>
          </div>

            <div className="detail-gallery-card">
            <figure className="detail-gallery">
              {activeImageSrc ? (
                <button type="button" className="detail-gallery-button" onClick={() => openLightbox(activeImageIndex)} aria-label={copy.openImageViewer}>
                  <img src={activeImageSrc} alt={effectiveItem?.title} />
                </button>
              ) : (
                <div className="detail-gallery-fallback" aria-hidden="true">
                  <span>{(effectiveItem?.category || copy.item).slice(0, 1).toUpperCase()}</span>
                </div>
              )}
              {galleryImages.length > 1 ? <figcaption className="detail-gallery-count" aria-hidden="true">{copy.imageCount(activeImageIndex + 1, galleryImages.length)}</figcaption> : null}
            </figure>

            {galleryImages.length > 1 ? (
              <div className="detail-thumbs" aria-label={copy.listingImageViewer}>
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
                      aria-label={copy.viewImage(index + 1)}
                    >
                      {thumbSrc ? <img src={thumbSrc} alt={copy.thumbnail(index + 1)} /> : null}
                    </button>
                  )
                })}
              </div>
            ) : null}
          </div>

          </div>

          <aside className="detail-sidebar panel">
            <h1 className="detail-title">{effectiveItem?.title}</h1>
            <div className="detail-price-row">
              <strong className="detail-price">{formatPriceFromUsd(effectiveItem?.price, currency)}</strong>
              {effectiveItem?.status ? <span className={`status-badge status-${effectiveItem.status}`}>{effectiveItem.status}</span> : null}
            </div>
            <div className="detail-chip-row">
              {detailRows.map((row) => (
                <span key={row.label} className="detail-chip">
                  <strong>{row.label}:</strong> {row.value}
                </span>
              ))}
            </div>
            <p className="detail-description">{effectiveItem?.description}</p>

            <div className="detail-seller-card">
              {sellerId ? (
                <Link to={`/profile/${sellerId}`} state={sellerProfileState} onClick={(e) => e.stopPropagation()}>
                  <Avatar src={sellerProfile?.avatarUrl || sellerAvatar} alt={sellerName} size={56} />
                </Link>
              ) : (
                <Avatar src={sellerProfile?.avatarUrl || sellerAvatar} alt={sellerName} size={56} />
              )}
              <div className="detail-seller-copy">
                <p className="detail-seller-label">{copy.seller}</p>
                <div className="detail-seller-name-row">
                  <strong>{sellerName}</strong>
                  {Boolean(effectiveItem?.seller_verified || effectiveItem?.sellerVerified || sellerProfile?.isVerified) ? <span className="detail-verified-badge">{copy.verified}</span> : null}
                </div>
                <p className="detail-seller-note">{currentUser?.id === effectiveItem?.seller_id ? copy.thisIsYourListing : sellerLoading ? copy.loadingSellerProfile : copy.studentSellerProfile}</p>
                <p className="detail-seller-note detail-seller-location">{sellerLocation}</p>
              </div>
            </div>

            <div className="detail-contact-card">
              <div>
                <p className="detail-seller-label">{copy.contact}</p>
                <strong>{sellerEmail || sellerPhone ? copy.reachSellerDirectly : copy.messageInApp}</strong>
              </div>
              <div className="detail-contact-list">
                {sellerEmail ? <span>{sellerEmail}</span> : null}
                {sellerPhone ? <span>{sellerPhone}</span> : null}
                {!sellerEmail && !sellerPhone ? <span>{copy.fastInAppMessagingAvailable}</span> : null}
              </div>
            </div>

            <div className="detail-actions">
              <button className="button button-primary" type="button" onClick={handleMessageSeller}>
                {copy.messageSeller}
              </button>
              {sellerId ? (
                <Link className="button button-secondary" to={`/profile/${sellerId}`} state={sellerProfileState}>
                  {copy.viewProfile}
                </Link>
              ) : (
                <span className="button button-secondary" aria-disabled="true">
                  {copy.viewProfile}
                </span>
              )}
              <button className="button button-secondary" type="button" onClick={() => navigate(-1)}>
                {copy.back}
              </button>
            </div>
          </aside>
        </div>

        {lightboxIndex !== null && galleryImages[lightboxIndex] ? (
          <div className="detail-lightbox" role="dialog" aria-modal="true" aria-label={copy.listingImageViewer} onClick={closeLightbox}>
            <div className="detail-lightbox-panel" onClick={(event) => event.stopPropagation()}>
              <button type="button" className="detail-lightbox-close" onClick={closeLightbox} aria-label={copy.closeImageViewer}>×</button>
              <button type="button" className="detail-lightbox-nav detail-lightbox-prev" onClick={() => moveLightbox(-1)} aria-label={copy.previousImage}>‹</button>
              <img src={resolveImageUrl(galleryImages[lightboxIndex])} alt={item.title} className="detail-lightbox-image" />
              <button type="button" className="detail-lightbox-nav detail-lightbox-next" onClick={() => moveLightbox(1)} aria-label={copy.nextImage}>›</button>
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
