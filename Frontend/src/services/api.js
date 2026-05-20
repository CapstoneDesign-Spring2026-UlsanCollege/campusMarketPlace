import { getAuthToken } from './auth'
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
export const API_ORIGIN = new URL(API_BASE_URL).origin

export async function apiRequest(path, options = {}) {
  const headers = {
    ...(options.headers || {}),
  }

  const isFormDataBody = typeof FormData !== 'undefined' && options.body instanceof FormData

  if (!isFormDataBody && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json'
  }

  if (typeof window !== 'undefined') {
    const token = getAuthToken()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers,
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

export async function fetchItems(page = 1, limit = 20, category = null, status = null) {
  const skip = Math.max(0, (page - 1) * limit)
  let path = `/items?limit=${limit}&skip=${skip}`
  if (category) {
    path += `&category=${encodeURIComponent(category)}`
  }
  if (status) {
    path += `&status=${encodeURIComponent(status)}`
  }
  return apiRequest(path)
}

export async function createItem(itemData) {
  return apiRequest('/items', {
    method: 'POST',
    body: JSON.stringify(itemData),
  })
}

export async function fetchProfile() {
  return apiRequest('/profile')
}

export async function updateProfile(data) {
  return apiRequest('/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function fetchMessageThreads() {
  return apiRequest('/messages/threads')
}

export async function fetchUser(userId) {
  if (!userId) throw new Error('userId required')
  return apiRequest(`/users/${encodeURIComponent(userId)}`)
}

export async function openMessageThread(itemId) {
  return apiRequest('/messages/threads', {
    method: 'POST',
    body: JSON.stringify({ itemId }),
  })
}

export async function fetchThreadMessages(threadId, since = '') {
  const suffix = since ? `?since=${encodeURIComponent(since)}` : ''
  return apiRequest(`/messages/threads/${threadId}/messages${suffix}`)
}

export async function sendThreadMessage(threadId, body) {
  return apiRequest(`/messages/threads/${threadId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ body }),
  })
}

export async function markThreadRead(threadId) {
  return apiRequest(`/messages/threads/${threadId}/read`, {
    method: 'POST',
  })
}

export async function uploadProfileAvatar(file) {
  const fd = new FormData()
  fd.append('image', file)
  return apiRequest('/profile/avatar', {
    method: 'POST',
    body: fd,
  })
}

export async function updateEmail(email) {
  return apiRequest('/profile/email', {
    method: 'PUT',
    body: JSON.stringify({ email }),
  })
}

export async function changePassword(password, currentPassword = '') {
  return apiRequest('/profile/password', {
    method: 'PUT',
    body: JSON.stringify({ password, currentPassword }),
  })
}
