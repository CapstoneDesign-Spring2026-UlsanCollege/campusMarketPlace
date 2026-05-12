import { API_ORIGIN } from '../services/api'

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

export default function ItemCard({ item }) {
  const imageSrc = resolveImageUrl(getPrimaryImageValue(item))
  const price = typeof item.price === 'number' ? item.price : Number(item.price)
  const formattedPrice = Number.isFinite(price)
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)
    : item.price

  return (
    <article className="item-card">
      <div className="item-thumb">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={`${item.title} by ${item.sellerName}`}
            loading="lazy"
          />
        ) : (
          <div className="item-thumb-fallback" aria-hidden="true">
            <span>{item.category?.slice(0, 1)?.toUpperCase() || 'I'}</span>
          </div>
        )}
      </div>

      <div className="item-card-body">
        <div className="item-card-topline">
          <span className="item-category">{item.category}</span>
          <span className="item-price">{formattedPrice}</span>
        </div>
        <h2 className="item-title">{item.title}</h2>
        <p className="item-seller">Sold by {item.sellerName}</p>
      </div>
    </article>
  )
}