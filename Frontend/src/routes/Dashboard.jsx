import { useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { apiRequest, createItem, fetchItems, fetchUser } from '../services/api'
import { CATEGORIES, getCategoryLabel } from '../constants/categories'
import { getAuthUser, getAuthToken } from '../services/auth'
import { convertDisplayPriceToUsd, formatPriceFromUsd, getPriceInputMeta } from '../services/currency'
import { API_ORIGIN } from '../services/api'
import ItemCard from '../components/ItemCard'
import { t } from '../services/i18n'

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
const LOCATION_OPTIONS = [
  'cafetria',
  'study cafe',
  'library',
]

const STORIES = [
  'Engineering',
  'Dorm Deals',
  'Books',
  'Tech',
  'Furniture',
]

const DASHBOARD_COPY = {
  en: {
    loginRequired: 'Please log in first.',
    uploadLimit: (count) => `Please choose up to ${count} images total.`,
    supportedImageType: 'Please choose a supported image type (JPG, PNG, GIF, WebP, AVIF, BMP, TIFF, HEIC, or ICO).',
    uploading: (count) => `Uploading ${count} image${count > 1 ? 's' : ''}...`,
    imageTooLarge: 'Please choose images smaller than 5 MB each.',
    uploadedSuccessfully: (count) => (count > 1 ? `${count} images uploaded successfully.` : 'Image uploaded successfully.'),
    locationRequired: 'Location is required.',
    priceRequired: (currency) => `Price is required and must be a positive ${currency === 'KRW' ? 'KRW amount' : 'USD amount'}.`,
    descriptionRequired: 'Description is required.',
    categoryRequired: 'Category is required.',
    statusRequired: 'Status is required.',
    imageRequired: 'Please upload at least one image.',
    itemPostedSuccessfully: 'Item posted successfully.',
    failedToPostItem: 'Failed to post item.',
    postComposer: 'Post composer',
    openPostComposer: 'Open post composer',
    writeCustomLocation: 'Write a custom location',
    meetingSpotPlaceholder: 'Enter a meeting spot or room',
    photos: 'Photos',
    photoHint: (count) => `Add up to ${count} clear images. JPG, PNG, WebP, GIF, and more.`,
    choosePhotos: 'Choose photos',
    noPhotosSelected: 'No photos selected yet',
    trendingListings: 'Trending listings',
    results: 'results',
    showingMatches: (query) => `Showing matches for "${query}"`,
    freshListings: 'Fresh campus listings from students around Ulsan College.',
    clearSearch: 'Clear search',
  },
  ko: {
    loginRequired: '먼저 로그인하세요.',
    uploadLimit: (count) => `이미지는 총 ${count}장까지 선택할 수 있습니다.`,
    supportedImageType: '지원되는 이미지 형식을 선택하세요(JPG, PNG, GIF, WebP, AVIF, BMP, TIFF, HEIC, ICO).',
    uploading: (count) => `${count}개의 이미지를 업로드하는 중...`,
    imageTooLarge: '각 이미지는 5MB보다 작아야 합니다.',
    uploadedSuccessfully: (count) => (count > 1 ? `${count}개의 이미지가 업로드되었습니다.` : '이미지가 업로드되었습니다.'),
    locationRequired: '위치를 입력하세요.',
    priceRequired: (currency) => `가격은 필수이며 양수 ${currency === 'KRW' ? 'KRW 금액' : 'USD 금액'}이어야 합니다.`,
    descriptionRequired: '설명을 입력하세요.',
    categoryRequired: '카테고리를 선택하세요.',
    statusRequired: '상태를 선택하세요.',
    imageRequired: '이미지를 하나 이상 업로드하세요.',
    itemPostedSuccessfully: '게시글이 등록되었습니다.',
    failedToPostItem: '게시글을 등록하지 못했습니다.',
    postComposer: '게시글 작성',
    openPostComposer: '게시글 작성 열기',
    writeCustomLocation: '직접 위치 작성',
    meetingSpotPlaceholder: '만남 장소나 방을 입력하세요',
    photos: '사진',
    photoHint: (count) => `선명한 이미지를 최대 ${count}장까지 추가하세요. JPG, PNG, WebP, GIF 등 지원.`,
    choosePhotos: '사진 선택',
    noPhotosSelected: '선택된 사진이 없습니다',
    trendingListings: '인기 게시글',
    results: '개 결과',
    showingMatches: (query) => `"${query}"에 대한 결과를 표시 중`,
    freshListings: '울산과학대학교 학생들의 새로운 캠퍼스 게시글입니다.',
    clearSearch: '검색 지우기',
  },
  ne: {
    loginRequired: 'पहिले लगइन गर्नुहोस्।',
    uploadLimit: (count) => `कुल ${count} वटा छविसम्म मात्र छान्न सक्नुहुन्छ।`,
    supportedImageType: 'समर्थित छवि प्रकार छान्नुहोस् (JPG, PNG, GIF, WebP, AVIF, BMP, TIFF, HEIC, वा ICO).',
    uploading: (count) => `${count} छवि${count > 1 ? 'हरू' : ''} अपलोड हुँदैछ...`,
    imageTooLarge: 'कृपया प्रत्येक 5 MB भन्दा साना छविहरू छान्नुहोस्।',
    uploadedSuccessfully: (count) => (count > 1 ? `${count} छविहरू सफलतापूर्वक अपलोड भए।` : 'छवि सफलतापूर्वक अपलोड भयो।'),
    locationRequired: 'स्थान आवश्यक छ।',
    priceRequired: (currency) => `मूल्य आवश्यक छ र यो सकारात्मक ${currency === 'KRW' ? 'KRW रकम' : 'USD रकम'} हुनुपर्छ।`,
    descriptionRequired: 'विवरण आवश्यक छ।',
    categoryRequired: 'श्रेणी आवश्यक छ।',
    statusRequired: 'स्थिति आवश्यक छ।',
    imageRequired: 'कृपया कम्तीमा एउटा छवि अपलोड गर्नुहोस्।',
    itemPostedSuccessfully: 'वस्तु सफलतापूर्वक पोस्ट भयो।',
    failedToPostItem: 'वस्तु पोस्ट गर्न सकिएन।',
    postComposer: 'पोस्ट कम्पोजर',
    openPostComposer: 'पोस्ट कम्पोजर खोल्नुहोस्',
    writeCustomLocation: 'कस्टम स्थान लेख्नुहोस्',
    meetingSpotPlaceholder: 'भेट्ने ठाउँ वा कोठा लेख्नुहोस्',
    photos: 'फोटोहरू',
    photoHint: (count) => `स्पष्ट छविहरू ${count} वटासम्म थप्नुहोस्। JPG, PNG, WebP, GIF आदि।`,
    choosePhotos: 'फोटो छान्नुहोस्',
    noPhotosSelected: 'अहिलेसम्म फोटो छानिएको छैन',
    trendingListings: 'प्रचलित सूचिहरू',
    results: 'नतिजा',
    showingMatches: (query) => `"${query}" का मिल्दोजुल्दो नतिजा देखाउँदै`,
    freshListings: 'उल्सान कलेजका विद्यार्थीहरूबाट नयाँ क्याम्पस सूचिहरू।',
    clearSearch: 'खोजी खाली गर्नुहोस्',
  },
  hi: {
    loginRequired: 'पहले लॉग इन करें।',
    uploadLimit: (count) => `कुल ${count} छवियों तक चुनें।`,
    supportedImageType: 'समर्थित छवि प्रकार चुनें (JPG, PNG, GIF, WebP, AVIF, BMP, TIFF, HEIC, या ICO).',
    uploading: (count) => `${count} छवियाँ अपलोड हो रही हैं...`,
    imageTooLarge: 'कृपया प्रत्येक 5 MB से छोटी छवियाँ चुनें।',
    uploadedSuccessfully: (count) => (count > 1 ? `${count} छवियाँ सफलतापूर्वक अपलोड हुईं।` : 'छवि सफलतापूर्वक अपलोड हुई।'),
    locationRequired: 'स्थान आवश्यक है।',
    priceRequired: (currency) => `मूल्य आवश्यक है और यह एक सकारात्मक ${currency === 'KRW' ? 'KRW राशि' : 'USD राशि'} होना चाहिए।`,
    descriptionRequired: 'विवरण आवश्यक है।',
    categoryRequired: 'श्रेणी आवश्यक है।',
    statusRequired: 'स्थिति आवश्यक है।',
    imageRequired: 'कृपया कम से कम एक छवि अपलोड करें।',
    itemPostedSuccessfully: 'आइटम सफलतापूर्वक पोस्ट किया गया।',
    failedToPostItem: 'आइटम पोस्ट नहीं किया जा सका।',
    postComposer: 'पोस्ट कंपोज़र',
    openPostComposer: 'पोस्ट कंपोज़र खोलें',
    writeCustomLocation: 'कस्टम स्थान लिखें',
    meetingSpotPlaceholder: 'मिलने की जगह या कमरा दर्ज करें',
    photos: 'फ़ोटो',
    photoHint: (count) => `अधिकतम ${count} स्पष्ट छवियाँ जोड़ें। JPG, PNG, WebP, GIF और अधिक।`,
    choosePhotos: 'फ़ोटो चुनें',
    noPhotosSelected: 'अभी कोई फ़ोटो नहीं चुनी गई',
    trendingListings: 'ट्रेंडिंग लिस्टिंग्स',
    results: 'परिणाम',
    showingMatches: (query) => `"${query}" के मिलते-जुलते परिणाम दिखा रहे हैं`,
    freshListings: 'उल्सान कॉलेज के छात्रों की नई कैंपस लिस्टिंग्स।',
    clearSearch: 'खोज साफ़ करें',
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

function resolveImageUrl(imageUrl) {
  if (!imageUrl) {
    return ''
  }

  if (/^https?:\/\//i.test(imageUrl) || imageUrl.startsWith('data:') || imageUrl.startsWith('blob:')) {
    return imageUrl
  }

  return new URL(imageUrl.replace(/^\/+/, ''), `${API_ORIGIN}/`).href
}

export default function Dashboard({ currency, language = 'en', marketQuery, onMarketQueryChange }) {
  const navigate = useNavigate()
  const location = useLocation()
  const copy = DASHBOARD_COPY[language] || DASHBOARD_COPY.en
  const [user, setUser] = useState(null)
  const [mode, setMode] = useState(location.state?.mode || 'home')
  const [internalMarketQuery, setInternalMarketQuery] = useState('')

  const [uploadPreviewUrl, setUploadPreviewUrl] = useState('')
  const [uploadMessage, setUploadMessage] = useState('')
  const [uploadError, setUploadError] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedImages, setUploadedImages] = useState([])
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(false)

  const [items, setItems] = useState([])
  const [sellerAvatars, setSellerAvatars] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const currentUserId = user?.id || ''

  const [formData, setFormData] = useState({
    location: '',
    price: '',
    description: '',
    category: '',
    status: 'active',
  })
  const [locationSelection, setLocationSelection] = useState('')
  const [formErrors, setFormErrors] = useState({})
  const [submitMessage, setSubmitMessage] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComposerOpen, setIsComposerOpen] = useState(false)

  const imageInputRef = useRef(null)
  const previewObjectUrlRef = useRef('')
  const effectiveMarketQuery = typeof marketQuery === 'string' ? marketQuery : internalMarketQuery
  const setMarketQuery = typeof onMarketQueryChange === 'function' ? onMarketQueryChange : setInternalMarketQuery
  const normalizedQuery = effectiveMarketQuery.trim().toLowerCase()
  const visibleItems = normalizedQuery
    ? items.filter((item) => {
        const haystack = [item.title, item.category, item.description, item.location, item.sellerName]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
        return haystack.includes(normalizedQuery)
      })
    : items
  const spotlightItems = visibleItems.slice(0, 4)

  useEffect(() => {
    const token = getAuthToken()
    const sessionUser = getAuthUser()

    if (!token || !sessionUser) {
      navigate('/login', {
        replace: true,
        state: { message: copy.loginRequired },
      })
      return
    }

    setUser(sessionUser)
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
        filteredItems = filteredItems.filter((item) => {
          const sellerId = item.seller_id || item.sellerId || ''
          return sellerId === currentUserId
        })
      } else if (mode === 'buy') {
        // Show only items posted by other users
        filteredItems = filteredItems.filter((item) => {
          const sellerId = item.seller_id || item.sellerId || ''
          return sellerId && sellerId !== currentUserId
        })
      } else {
        // 'home' mode: show all items
      }

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

  useEffect(() => {
    // For any items missing a sellerAvatarUrl, fetch the public user profile
    // and cache the avatar so we can display it without changing server data.
    if (!items || items.length === 0) return

    items.forEach((item) => {
      const sellerId = item.seller_id || item.sellerId || ''
      if (!sellerId) return
      if (item.sellerAvatarUrl) return
      if (sellerAvatars[sellerId]) return

      fetchUser(sellerId)
        .then((res) => {
          const userObj = res.user || {}
          const avatar = userObj.avatarUrl || userObj.avatar || ''
          if (avatar) {
            setSellerAvatars((prev) => ({ ...prev, [sellerId]: avatar }))
          }
        })
        .catch(() => {
          // ignore fetch failures
        })
    })
  }, [items])

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

  function renderAvatarForUser(userObj, altText) {
    const avatar = userObj?.avatarUrl || userObj?.avatar || ''
    if (avatar) {
      // If relative path, resolve to absolute using API_ORIGIN
      const src = /^https?:\/\//i.test(avatar) ? avatar : new URL(String(avatar).replace(/^\/+/, ''), `${API_ORIGIN}/`).href
      return <img src={src} alt={altText || 'avatar'} style={{width: 40, height: 40, borderRadius: '50%', objectFit: 'cover'}} />
    }
    return null
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
      if (nextImages.length <= 2) {
        setIsPreviewExpanded(false)
      }
      updatePreviewUrl(nextImages[0] || '')
      return nextImages
    })
    setFormErrors((prev) => ({ ...prev, image: '' }))
  }

  function clearUploadedImages() {
    setUploadedImages([])
    updatePreviewUrl('')
    setIsPreviewExpanded(false)
    setFormErrors((prev) => ({ ...prev, image: '' }))
  }

  async function handleFileChange(event) {
    const fileInput = event.target
    const selectedFiles = Array.from(event.target.files || [])
    if (selectedFiles.length === 0) {
      return
    }

    if (selectedFiles.length + uploadedImages.length > MAX_IMAGE_COUNT) {
      setUploadError(copy.uploadLimit(MAX_IMAGE_COUNT))
      setUploadMessage('')
      fileInput.value = ''
      return
    }

    const unsupportedFile = selectedFiles.find((selectedFile) => !ALLOWED_IMAGE_TYPES.has(selectedFile.type))
    if (unsupportedFile) {
      setUploadError(copy.supportedImageType)
      setUploadMessage('')
      fileInput.value = ''
      return
    }

    setUploadError('')
    setUploadMessage(copy.uploading(selectedFiles.length))
    setIsUploading(true)

    try {
      const uploadedUrls = []

      for (const selectedFile of selectedFiles) {
        if (selectedFile.size > MAX_IMAGE_SIZE_BYTES) {
          throw new Error(copy.imageTooLarge)
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
      setIsPreviewExpanded(false)
      updatePreviewUrl(nextImages[0] || '')
      setUploadMessage(
        copy.uploadedSuccessfully(uploadedUrls.length),
      )
      setUploadError('')
      setFormErrors((prev) => ({ ...prev, image: '' }))
    } catch (uploadErr) {
      setUploadError(uploadErr instanceof Error ? uploadErr.message : copy.failedToPostItem)
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

  function handleLocationSelectionChange(event) {
    const { value } = event.target
    setLocationSelection(value)
    setFormErrors((prev) => ({ ...prev, location: '' }))
    setSubmitError('')
    setSubmitMessage('')

    if (!value) {
      setFormData((prev) => ({ ...prev, location: '' }))
      return
    }

    if (value === '__custom__') {
      setFormData((prev) => ({ ...prev, location: '' }))
      return
    }

    setFormData((prev) => ({ ...prev, location: value }))
  }

  function validateForm() {
    const nextErrors = {}
    const priceValue = Number(formData.price)

    if (!formData.location.trim()) nextErrors.location = copy.locationRequired
    if (!formData.price.trim() || !Number.isFinite(priceValue) || priceValue <= 0) {
      nextErrors.price = copy.priceRequired(currency)
    }
    if (!formData.description.trim()) nextErrors.description = copy.descriptionRequired
    if (!formData.category.trim()) nextErrors.category = copy.categoryRequired
    if (!formData.status.trim()) nextErrors.status = copy.statusRequired
    if (uploadedImages.length === 0) nextErrors.image = copy.imageRequired

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
      const normalizedLocation = formData.location.trim()
      const payload = {
        title: normalizedLocation,
        price: convertDisplayPriceToUsd(formData.price, currency),
        description: formData.description.trim(),
        category: formData.category.trim(),
        status: formData.status.trim(),
        location: normalizedLocation || DEFAULT_ITEM_LOCATION,
        image: uploadedImages[0],
        images: uploadedImages,
      }

      await createItem(payload)

      setSubmitMessage(copy.itemPostedSuccessfully)
      setFormData({
        location: '',
        price: '',
        description: '',
        category: '',
        status: 'active',
      })
      setLocationSelection('')
      setFormErrors({})
      setUploadedImages([])
      setIsPreviewExpanded(false)
      updatePreviewUrl('')
      setUploadMessage('')
      setUploadError('')
      setIsComposerOpen(false)
      await loadItems()
    } catch (submitErr) {
      setSubmitError(submitErr.message || copy.failedToPostItem)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="page-shell marketplace-shell">
      <section className="feed-layout">
        <section className="feed-main-col">
          {mode !== 'buy' && (
            <section className="feed-panel composer" aria-label={copy.postComposer}>
              <form className="composer-form" onSubmit={handlePostItemSubmit} noValidate>
                <div className="composer-row">
                  <div className="avatar-badge" aria-hidden="true">
                    {renderAvatarForUser(user) || firstName.slice(0, 1)}
                  </div>
                  <button
                    className="composer-input"
                    type="button"
                    onClick={openComposer}
                    aria-label={copy.openPostComposer}
                    disabled={isSubmitting || isUploading}
                  >
                    {t(language, 'dashboard.prompt')}
                  </button>
                  <button
                    className="composer-icon-button composer-camera-right"
                    type="button"
                    onClick={handleImageUpload}
                    aria-label={t(language, 'dashboard.uploadImage')}
                    disabled={isUploading || isSubmitting}
                  >
                    📷
                  </button>
                </div>

                {isComposerOpen && (
                  <div className="composer-fields">
                    <div className="composer-choice-group">
                      <select
                        name="locationSelection"
                        value={locationSelection}
                        onChange={handleLocationSelectionChange}
                        className="composer-text-input composer-select"
                      >
                        <option value="">{t(language, 'dashboard.locationPlaceholder')}</option>
                        {LOCATION_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                        <option value="__custom__">{copy.writeCustomLocation}</option>
                      </select>

                      {locationSelection === '__custom__' && (
                        <input
                          name="location"
                          type="text"
                          placeholder={copy.meetingSpotPlaceholder}
                          value={formData.location}
                          onChange={handleFormChange}
                          className="composer-text-input"
                        />
                      )}
                    </div>
                    {formErrors.location && <p className="composer-feedback is-error">{formErrors.location}</p>}

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
                      <option value="">{t(language, 'dashboard.selectCategory')}</option>
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
                      <option value="active">{t(language, 'dashboard.active')}</option>
                      <option value="draft">{t(language, 'dashboard.draft')}</option>
                    </select>
                    {formErrors.status && <p className="composer-feedback is-error">{formErrors.status}</p>}

                    <textarea
                      name="description"
                      placeholder={t(language, 'dashboard.description')}
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
                    {uploadedImages.length <= 1 ? (
                      <div className="composer-preview-single">
                        <img src={uploadPreviewUrl} alt="Selected upload preview" />
                      </div>
                    ) : (
                      <div className={`composer-preview-grid ${isPreviewExpanded ? 'is-expanded' : 'is-collapsed'}`}>
                        {uploadedImages.slice(0, isPreviewExpanded ? uploadedImages.length : 2).map((imageUrl, index) => (
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

                        {!isPreviewExpanded && uploadedImages.length > 2 && (
                          <button
                            type="button"
                            className="composer-more-tile"
                            onClick={() => setIsPreviewExpanded(true)}
                            aria-label={`Show ${uploadedImages.length - 2} more uploaded image${uploadedImages.length - 2 === 1 ? '' : 's'}`}
                          >
                            <span className="composer-more-count">+{uploadedImages.length - 2}</span>
                            <span className="composer-more-label">more</span>
                          </button>
                        )}

                        {isPreviewExpanded && uploadedImages.length > 2 && (
                          <button type="button" className="composer-more-toggle" onClick={() => setIsPreviewExpanded(false)}>
                            Show less
                          </button>
                        )}
                      </div>
                    )}
                    {uploadedImages.length > 0 && (
                      <button type="button" className="composer-clear-images" onClick={clearUploadedImages}>
                        {t(language, 'dashboard.clearImages')}
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
                    {isSubmitting ? t(language, 'dashboard.posting') : t(language, 'dashboard.postItem')}
                  </button>
                )}

                <div className="composer-upload-panel">
                  <div className="composer-upload-copy">
                    <p className="composer-upload-label">{copy.photos}</p>
                    <p className="composer-upload-hint">
                      {copy.photoHint(MAX_IMAGE_COUNT)}
                    </p>
                  </div>
                  <div className="composer-upload-actions">
                    <button
                      type="button"
                      className="composer-upload-button"
                      onClick={handleImageUpload}
                      disabled={isUploading || isSubmitting}
                    >
                      {copy.choosePhotos}
                    </button>
                    <span className="composer-upload-meta">
                      {uploadedImages.length > 0
                        ? `${uploadedImages.length} selected`
                        : copy.noPhotosSelected}
                    </span>
                  </div>
                  <input
                    ref={imageInputRef}
                    className="composer-file-input"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                  />
                </div>
              </form>
            </section>
          )}

          <section className="feed-post-list" aria-label="Marketplace feed posts">
            <div className="browse-toolbar">
              <div>
                <p className="eyebrow">{copy.trendingListings}</p>
                <h2>{visibleItems.length.toLocaleString()} {copy.results}</h2>
                <p className="browse-summary">
                  {normalizedQuery ? copy.showingMatches(marketQuery) : copy.freshListings}
                </p>
              </div>
              {marketQuery ? (
                <button className="button button-secondary" type="button" onClick={() => setMarketQuery('')}>
                  {copy.clearSearch}
                </button>
              ) : null}
            </div>

            {loading ? (
              <div className="loading-state">
                <p>{t(language, 'dashboard.loading')}</p>
              </div>
            ) : error ? (
              <div className="error-state">
                <p>Error: {error}</p>
              </div>
            ) : visibleItems.length === 0 ? (
              <div className="empty-state">
                <p>{t(language, 'dashboard.noItems')}</p>
              </div>
            ) : (
              <div className="item-grid">
                {visibleItems.map((item) => (
                  <ItemCard key={item._id} item={item} currency={currency} language={language} />
                ))}
              </div>
            )}
          </section>
        </section>
      </section>
    </main>
  )
}