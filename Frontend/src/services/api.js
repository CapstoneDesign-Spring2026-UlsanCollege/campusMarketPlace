const envApiBaseUrl = import.meta.env.VITE_API_BASE_URL

function resolveApiBaseUrl() {
  if (envApiBaseUrl && envApiBaseUrl.trim()) {
    return envApiBaseUrl.trim()
  }

  if (typeof window !== 'undefined' && window.location.hostname.includes('github.io')) {
    return 'https://campusmarketplace-lndr.onrender.com/api'
  }

  return 'http://localhost:5050/api'
}

const API_BASE_URL = resolveApiBaseUrl()

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  const contentType = response.headers.get('content-type') || ''
  const payload = contentType.includes('application/json') ? await response.json() : await response.text()

  if (!response.ok) {
    const message = typeof payload === 'string' ? payload : payload.error || `Request failed with status ${response.status}`
    throw new Error(message)
  }

  return payload
}