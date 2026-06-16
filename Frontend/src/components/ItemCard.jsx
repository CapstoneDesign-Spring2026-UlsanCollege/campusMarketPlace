import { useEffect, useMemo, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { API_ORIGIN, updateItem } from '../services/api'
import { toggleItemFavorite } from '../services/api'
import Avatar from './Avatar'
import { t } from '../services/i18n'
import { formatPriceFromUsd } from '../services/currency'
import { getAuthUser } from '../services/auth'

const ITEM_CARD_COPY = {
  en: {
    justNow: 'Just now',
    minutesAgo: (minutes) => `${minutes}m ago`,
    hoursAgo: (hours) => `${hours}h ago`,
    daysAgo: (days) => `${days}d ago`,
    popular: 'Popular',
    likeNew: 'Like New',
    onSale: 'On sale',
    reserved: 'Reserved',
    soldOut: 'Sold out',
    seller: 'Seller',
    campus: 'Campus',
    sellerActions: 'Seller actions',
    buyerActions: 'Buyer actions',
    editListing: 'Edit listing',
    listingStatus: 'Listing status',
    saving: 'Saving…',
    saveStatus: 'Save status',
    cancel: 'Cancel',
    listingStatusUpdated: 'Listing status updated.',
    unableToUpdateFavorites: 'Unable to update favorites.',
    unableToUpdateListingStatus: 'Unable to update listing status.',
  },
  ko: {
    justNow: '방금 전',
    minutesAgo: (minutes) => `${minutes}분 전`,
    hoursAgo: (hours) => `${hours}시간 전`,
    daysAgo: (days) => `${days}일 전`,
    popular: '인기',
    likeNew: '거의 새것',
    onSale: '판매 중',
    reserved: '예약됨',
    soldOut: '판매 완료',
    seller: '판매자',
    campus: '캠퍼스',
    sellerActions: '판매자 작업',
    buyerActions: '구매자 작업',
    editListing: '게시글 수정',
    listingStatus: '게시글 상태',
    saving: '저장 중…',
    saveStatus: '상태 저장',
    cancel: '취소',
    listingStatusUpdated: '게시글 상태가 업데이트되었습니다.',
    unableToUpdateFavorites: '찜 목록을 업데이트할 수 없습니다.',
    unableToUpdateListingStatus: '게시글 상태를 업데이트할 수 없습니다.',
  },
  ne: {
    justNow: 'अहिले नै',
    minutesAgo: (minutes) => `${minutes} मिनेट अघि`,
    hoursAgo: (hours) => `${hours} घण्टा अघि`,
    daysAgo: (days) => `${days} दिन अघि`,
    popular: 'लोकप्रिय',
    likeNew: 'नयाँ जस्तै',
    onSale: 'बिक्रीमा',
    reserved: 'आरक्षित',
    soldOut: 'बिक्री समाप्त',
    seller: 'बिक्रेता',
    campus: 'क्याम्पस',
    sellerActions: 'बिक्रेता कार्यहरू',
    buyerActions: 'खरिदकर्ता कार्यहरू',
    editListing: 'सूची सम्पादन',
    listingStatus: 'सूचीको स्थिति',
    saving: 'सञ्चय हुँदैछ…',
    saveStatus: 'स्थिति बचत गर्नुहोस्',
    cancel: 'रद्द गर्नुहोस्',
    listingStatusUpdated: 'सूची स्थिति अद्यावधिक भयो।',
    unableToUpdateFavorites: 'मनपर्नेहरू अद्यावधिक गर्न सकिएन।',
    unableToUpdateListingStatus: 'सूची स्थिति अद्यावधिक गर्न सकिएन।',
  },
  hi: {
    justNow: 'अभी',
    minutesAgo: (minutes) => `${minutes} मिनट पहले`,
    hoursAgo: (hours) => `${hours} घंटे पहले`,
    daysAgo: (days) => `${days} दिन पहले`,
    popular: 'लोकप्रिय',
    likeNew: 'नए जैसा',
    onSale: 'बिक्री पर',
    reserved: 'आरक्षित',
    soldOut: 'बिक चुका',
    seller: 'विक्रेता',
    campus: 'कैंपस',
    sellerActions: 'विक्रेता क्रियाएँ',
    buyerActions: 'खरीदार क्रियाएँ',
    editListing: 'लिस्टिंग संपादित करें',
    listingStatus: 'लिस्टिंग स्थिति',
    saving: 'सहेजा जा रहा है…',
    saveStatus: 'स्थिति सहेजें',
    cancel: 'रद्द करें',
    listingStatusUpdated: 'लिस्टिंग स्थिति अपडेट हो गई।',
    unableToUpdateFavorites: 'पसंद को अपडेट नहीं किया जा सका।',
    unableToUpdateListingStatus: 'लिस्टिंग स्थिति अपडेट नहीं की जा सकी।',
  },
}

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

function resolveImageUrl(image) {
  if (!image) {
    return ''
  }

  if (/^https?:\/\//i.test(image) || image.startsWith('data:') || image.startsWith('blob:')) {
    return image
  }

  return new URL(image.replace(/^\/+/, ''), `${API_ORIGIN}/`).href
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

  const diffDays = Math.floor(diffHours / 24)
  return copy.daysAgo(diffDays)
}

function getConditionLabel(item, copy) {
  const raw = item?.condition || item?.itemCondition || item?.state || ''
  const normalized = String(raw).trim()

  if (normalized) {
    return normalized
  }

  if (item?.status === 'sold') {
    return copy.popular
  }

  return copy.likeNew
}

function getConditionTone(label) {
  const normalized = String(label).toLowerCase()

  if (normalized.includes('popular') || normalized.includes('hot')) {
    return 'is-popular'
  }

  if (normalized.includes('like') || normalized.includes('new')) {
    return 'is-hot'
  }

  return ''
}

export default function ItemCard({ item, currency, language = 'en' }) {
  const navigate = useNavigate()
  const copy = ITEM_CARD_COPY[language] || ITEM_CARD_COPY.en
  const currentUser = getAuthUser()
  const currentUserId = currentUser?.id || currentUser?._id || currentUser?.userId || ''
  const imageSrc = resolveImageUrl(getPrimaryImageValue(item))
  const formattedPrice = formatPriceFromUsd(item.price, currency)
  const originalPriceValue = Number(item?.originalPrice ?? item?.compareAtPrice ?? item?.listPrice ?? item?.previousPrice)
  const hasOriginalPrice = Number.isFinite(originalPriceValue) && originalPriceValue > Number(item.price)
  const locationLabel = item?.location || copy.campus
  const sellerVerified = Boolean(item?.seller_verified || item?.sellerVerified)
  const conditionLabel = getConditionLabel(item, copy)
  const conditionTone = getConditionTone(conditionLabel)
  const sellerName = item.sellerName || copy.seller
  const sellerId = item?.seller_id || item?.sellerId || ''
  const isSeller = Boolean(currentUserId && sellerId && String(currentUserId) === String(sellerId))
  const initialListingStatus = String(item?.status || 'active').toLowerCase()
  const [listingStatus, setListingStatus] = useState(initialListingStatus)
  const statusOptions = [
    { value: 'active', label: copy.onSale },
    { value: 'reserved', label: copy.reserved },
    { value: 'sold', label: copy.soldOut },
  ]
  const initialLoveCount = Number.isFinite(Number(item?.favoritesCount)) ? Math.max(0, Number(item.favoritesCount)) : 0
  const [isLoved, setIsLoved] = useState(Boolean(item?.isLoved || item?.isFavorited || item?.isLiked || item?.liked))
  const [loveCount, setLoveCount] = useState(initialLoveCount)
  // comment UI removed per design — keep messaging only
  const [isEditingStatus, setIsEditingStatus] = useState(false)
  const [statusDraft, setStatusDraft] = useState(initialListingStatus)
  const [statusMessage, setStatusMessage] = useState('')
  const [statusError, setStatusError] = useState('')
  const [isSavingStatus, setIsSavingStatus] = useState(false)
  const [isSavingLove, setIsSavingLove] = useState(false)

  useEffect(() => {
    const nextStatus = String(item?.status || 'active').toLowerCase()
    setListingStatus(nextStatus)
    setStatusDraft(nextStatus)
  }, [item?.status])



  async function handleLoveToggle() {
    if (isSavingLove) {
      return
    }

    const nextLoved = !isLoved
    const nextCount = Math.max(0, loveCount + (nextLoved ? 1 : -1))
    setIsSavingLove(true)
    setIsLoved(nextLoved)
    setLoveCount(nextCount)

    try {
      const response = await toggleItemFavorite(item._id)
      const updatedItem = response?.item || {}
      const confirmedLoved = Boolean(updatedItem?.isLoved || updatedItem?.isFavorited || response?.isLoved)
      setIsLoved(confirmedLoved)
      if (Number.isFinite(Number(updatedItem?.favoritesCount))) {
        setLoveCount(Math.max(0, Number(updatedItem.favoritesCount)))
      }
    } catch (error) {
      setIsLoved(!nextLoved)
      setLoveCount(loveCount)
      setStatusError(error instanceof Error ? error.message : copy.unableToUpdateFavorites)
    } finally {
      setIsSavingLove(false)
    }
  }

  function handleMessageSeller() {
    const query = new URLSearchParams({ item: String(item._id) })
    navigate(`/messages?${query.toString()}`)
  }

  function openStatusEditor() {
    setStatusDraft(listingStatus)
    setStatusError('')
    setStatusMessage('')
    setIsEditingStatus((current) => !current)
  }

  async function handleSaveStatus() {
    if (!isSeller) {
      return
    }

    setIsSavingStatus(true)
    setStatusError('')
    setStatusMessage('')

    try {
      await updateItem(item._id, { status: statusDraft })
      setListingStatus(statusDraft)
      setStatusMessage(copy.listingStatusUpdated)
      setIsEditingStatus(false)
    } catch (error) {
      setStatusError(error instanceof Error ? error.message : copy.unableToUpdateListingStatus)
    } finally {
      setIsSavingStatus(false)
    }
  }

  function openItemDetail() {
    navigate(`/item/${item._id}`, { state: { item } })
  }

  return (
    <article
      className="item-card"
      role="button"
      tabIndex={0}
      onClick={openItemDetail}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          openItemDetail()
        }
      }}
    >
      <div className="item-thumb">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={`${item.title} by ${sellerName}`}
            loading="lazy"
          />
        ) : (
          <div className="item-thumb-fallback" aria-hidden="true">
            <span>{item.category?.slice(0, 1)?.toUpperCase() || 'I'}</span>
          </div>
        )}
      </div>

      <div className="item-card-body item-card-compact">
        <div className="item-card-header">
          <div className="item-card-header-left">
            <div className="item-compact-avatar">
              <Link
                to={`/profile/${sellerId}`}
                state={{ seller: { id: sellerId, firstName: sellerName, avatarUrl: item.sellerAvatarUrl || item.sellerAvatar || item.seller_avatar || item.seller_avatar_url, location: item.location || '' } }}
                onClick={(e) => e.stopPropagation()}
              >
                <Avatar src={item.sellerAvatarUrl || item.sellerAvatar || item.seller_avatar || item.seller_avatar_url} alt={sellerName} size={40} />
              </Link>
            </div>
            {/* Hide title in the compact header when it's just the meeting spot/location */}
            {String(item.title || '').trim() && String(item.title || '').trim() !== String(locationLabel || '').trim() ? (
              <h2 className="item-title">{item.title}</h2>
            ) : null}
          </div>
          <div className="item-card-header-right">
            <span className="item-category-pill">{item.category || ''}</span>
          </div>
        </div>
        <div className="listing-price-row">
          <span className="item-price">{formattedPrice}</span>
          <span className={`status-badge status-${listingStatus}`}>
            {(statusOptions.find((o) => o.value === listingStatus) || { label: copy.onSale }).label}
          </span>
        </div>
        <div className="item-compact-meta">
          {/* keep meta area for price/other small bits; status moved to header right */}
        </div>
        <div className="item-actions-row compact-actions" aria-label={isSeller ? copy.sellerActions : copy.buyerActions}>
          {isSeller ? (
            <button
              type="button"
              className="item-action-button item-action-edit button button-primary"
              onClick={(event) => {
                event.stopPropagation()
                openStatusEditor()
              }}
            >
              <span>{copy.editListing}</span>
            </button>
          ) : (
            <button
              type="button"
              className="item-action-button item-action-message button button-primary"
              onClick={(event) => {
                event.stopPropagation()
                handleMessageSeller()
              }}
            >
              <span>{t(language, 'dashboard.messageSeller')}</span>
            </button>
          )}
        </div>
        {isSeller && isEditingStatus ? (
          <div className="item-status-editor" onClick={(event) => event.stopPropagation()}>
            <label className="item-status-editor-label">
              {copy.listingStatus}
              <select value={statusDraft} onChange={(event) => setStatusDraft(event.target.value)}>
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
            <div className="item-status-editor-actions">
              <button type="button" className="button button-primary" onClick={handleSaveStatus} disabled={isSavingStatus}>
                {isSavingStatus ? copy.saving : copy.saveStatus}
              </button>
              <button type="button" className="button button-secondary" onClick={openStatusEditor} disabled={isSavingStatus}>
                {copy.cancel}
              </button>
            </div>
            {statusMessage ? <p className="message-status is-success">{statusMessage}</p> : null}
            {statusError ? <p className="message-status is-error">{statusError}</p> : null}
          </div>
        ) : null}
      </div>
    </article>
  )
}