const AUTH_TOKEN_KEY = 'campusMarketplaceToken'
const AUTH_USER_KEY = 'campusMarketplaceUser'

function getSessionStorage() {
  if (typeof window === 'undefined') {
    return null
  }

  return window.sessionStorage
}

export function readAuthSession() {
  const storage = getSessionStorage()
  if (!storage) {
    return { token: null, user: null }
  }

  const token = storage.getItem(AUTH_TOKEN_KEY)
  const userRaw = storage.getItem(AUTH_USER_KEY)

  let user = null
  if (userRaw) {
    try {
      user = JSON.parse(userRaw)
    } catch {
      user = null
    }
  }

  return { token, user }
}

export function saveAuthSession(token, user) {
  const storage = getSessionStorage()
  if (!storage) {
    return
  }

  storage.setItem(AUTH_TOKEN_KEY, token)
  storage.setItem(AUTH_USER_KEY, JSON.stringify(user))
}

export function clearAuthSession() {
  const storage = getSessionStorage()
  if (!storage) {
    return
  }

  storage.removeItem(AUTH_TOKEN_KEY)
  storage.removeItem(AUTH_USER_KEY)
}

export function getAuthToken() {
  return readAuthSession().token
}

export function getAuthUser() {
  return readAuthSession().user
}