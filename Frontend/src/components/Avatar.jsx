import React from 'react'
import { API_ORIGIN } from '../services/api'

function resolveUrl(avatar) {
  if (!avatar) return ''
  if (/^https?:\/\//i.test(avatar)) return avatar
  return new URL(String(avatar).replace(/^\/+/, ''), `${API_ORIGIN}/`).href
}

export default function Avatar({ src, alt = 'User', size = 40, className = '' }) {
  const resolved = resolveUrl(src)
  const style = { width: size, height: size, borderRadius: '50%', objectFit: 'cover' }

  if (resolved) {
    return <img className={`avatar ${className}`} src={resolved} alt={alt} style={style} />
  }

  const initial = (alt || 'U').slice(0, 1).toUpperCase()
  return (
    <div className={`avatar avatar-initial ${className}`} style={{ ...style, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#ddd', color: '#333' }}>
      {initial}
    </div>
  )
}
