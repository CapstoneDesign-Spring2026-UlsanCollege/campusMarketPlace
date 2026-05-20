import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchProfile, updateProfile, uploadProfileAvatar, updateEmail } from '../services/api'

export default function EditProfile() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ firstName: '', lastName: '', location: '' })
  const [email, setEmail] = useState('')
  const [originalEmail, setOriginalEmail] = useState('')
  const [isDirty, setIsDirty] = useState(false)
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' })
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let isActive = true
    async function load() {
      try {
        const data = await fetchProfile()
        if (!isActive) return
        const user = data?.user || {}
        setForm({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          location: user.location || '',
        })
        setAvatarPreview(user.avatarUrl || '')
        setEmail(user.email || '')
        setOriginalEmail(user.email || '')
      } catch (err) {
        if (!isActive) return
        setError(err?.message || 'Unable to load profile')
      }
    }
    load()
    return () => {
      isActive = false
    }
  }, [])

  function onChange(e) {
    const { name, value } = e.target
    setForm((s) => ({ ...s, [name]: value }))
    setIsDirty(true)
  }

  function onAvatarSelect(e) {
    const f = e.target.files && e.target.files[0]
    if (f) {
      // Resize image client-side for consistent avatar size and smaller upload
      resizeImageFile(f, 512, 0.85)
        .then((resized) => {
          // Keep original file name if possible
          const fileWithMeta = new File([resized], f.name, { type: resized.type })
          setAvatarFile(fileWithMeta)
          setAvatarPreview(URL.createObjectURL(fileWithMeta))
          setIsDirty(true)
        })
        .catch(() => {
          // Fallback to original file if resizing fails
          setAvatarFile(f)
          setAvatarPreview(URL.createObjectURL(f))
          setIsDirty(true)
        })
    }
  }

  function resizeImageFile(file, maxDim = 512, quality = 0.85) {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let { width, height } = img
        if (width > maxDim || height > maxDim) {
          const ratio = width / height
          if (ratio > 1) {
            width = maxDim
            height = Math.round(maxDim / ratio)
          } else {
            height = maxDim
            width = Math.round(maxDim * ratio)
          }
        }
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        // Use webp if supported for smaller size, otherwise keep original type
        const preferredType = 'image/webp'
        const mime = file.type === 'image/png' ? 'image/png' : preferredType
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob)
            else reject(new Error('Canvas toBlob produced no data'))
          },
          mime,
          quality,
        )
      }
      img.onerror = reject
      // Support object URLs and DataURL
      img.src = URL.createObjectURL(file)
    })
  }

  async function onSave(e) {
    e.preventDefault()
    setIsSaving(true)
    setError('')
    setSubmitStatus({ type: '', message: '' })
    try {
      // If an avatar file was selected, upload it first and update avatarUrl
      if (avatarFile) {
        await uploadProfileAvatar(avatarFile)
      }
      // If email changed, try dedicated endpoint first and fallback to profile PUT on 404
      if (email && email !== originalEmail) {
        try {
          await updateEmail(email)
        } catch (err) {
          // fallback when dedicated endpoint not found on backend
          if (String(err?.message || '').includes('404')) {
            await updateProfile({ ...form, email })
          } else {
            throw err
          }
        }
      } else {
        await updateProfile(form)
      }
      setSubmitStatus({ type: 'success', message: 'Profile updated.' })
      navigate('/profile', { replace: true })
    } catch (err) {
      setError(err?.message || 'Unable to save profile')
      setSubmitStatus({ type: 'error', message: err?.message || 'Unable to save profile' })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <main className="page-shell profile-shell">
      <section className="profile-hero panel">
        <div>
          <p className="eyebrow">Edit profile</p>
          <h1>Edit your account</h1>
          <p className="subcopy">Update your name and pickup location.</p>
        </div>
      </section>

      <section className="profile-grid" aria-label="Edit profile form">
        <article className="profile-card panel">
          <form onSubmit={onSave}>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', marginBottom: 6 }}>Avatar</label>
              {avatarPreview ? (
                <img src={avatarPreview} alt="avatar preview" style={{ width: 72, height: 72, borderRadius: 8, objectFit: 'cover', display: 'block', marginBottom: 6 }} />
              ) : (
                <div style={{ width: 72, height: 72, borderRadius: 8, background: '#eee', display: 'inline-block', marginBottom: 6 }} />
              )}
              <input type="file" accept="image/*" onChange={onAvatarSelect} />
            </div>
            <label>
              First name
              <input name="firstName" value={form.firstName} onChange={onChange} />
            </label>

            <label>
              Last name
              <input name="lastName" value={form.lastName} onChange={onChange} />
            </label>

            <label>
              Email
              <input name="email" value={email} onChange={(e) => { setEmail(e.target.value); setIsDirty(true) }} />
            </label>

            <label>
              Location
              <input name="location" value={form.location} onChange={onChange} />
            </label>

            {error ? <div className="profile-empty-state">{error}</div> : null}
            <div style={{ marginTop: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
              <button className="button button-secondary" type="button" onClick={() => navigate('/profile')} disabled={isSaving}>
                Cancel
              </button>

              <button className="button" type="button" onClick={() => navigate('/profile/change-password')} style={{ marginLeft: 8 }}>
                Change password
              </button>

              <button className="button button-primary" type="submit" disabled={isSaving || !isDirty} style={{ marginLeft: 'auto' }}>
                {isSaving ? 'Saving…' : 'Save changes'}
              </button>
            </div>
            {submitStatus.message && (
              <p className={`form-message ${submitStatus.type}`} role="status" style={{ marginTop: 12 }}>
                {submitStatus.message}
              </p>
            )}
          </form>
        </article>
      </section>
    </main>
  )
}
