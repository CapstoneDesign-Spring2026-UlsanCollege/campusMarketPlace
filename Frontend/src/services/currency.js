export const CURRENCY_OPTIONS = {
  USD: 'USD',
  KRW: 'KRW',
}

export const DEFAULT_CURRENCY = CURRENCY_OPTIONS.KRW
export const USD_TO_KRW_RATE = 1300

function toNumber(value) {
  if (typeof value === 'number') {
    return value
  }

  if (typeof value === 'string') {
    return Number(value)
  }

  return NaN
}

export function formatPriceFromUsd(value, currency) {
  const priceInUsd = toNumber(value)
  if (!Number.isFinite(priceInUsd)) {
    return String(value ?? '')
  }

  if (currency === CURRENCY_OPTIONS.KRW) {
    const priceInKrw = Math.round(priceInUsd * USD_TO_KRW_RATE)
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: CURRENCY_OPTIONS.KRW,
      maximumFractionDigits: 0,
    }).format(priceInKrw)
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: CURRENCY_OPTIONS.USD,
  }).format(priceInUsd)
}

export function convertDisplayPriceToUsd(value, currency) {
  const parsedValue = toNumber(value)
  if (!Number.isFinite(parsedValue)) {
    return NaN
  }

  if (currency === CURRENCY_OPTIONS.KRW) {
    return parsedValue / USD_TO_KRW_RATE
  }

  return parsedValue
}

export function getPriceInputMeta(currency) {
  if (currency === CURRENCY_OPTIONS.KRW) {
    return {
      min: '1',
      step: '1',
      placeholder: 'Price (KRW)',
    }
  }

  return {
    min: '0.01',
    step: '0.01',
    placeholder: 'Price (USD)',
  }
}
