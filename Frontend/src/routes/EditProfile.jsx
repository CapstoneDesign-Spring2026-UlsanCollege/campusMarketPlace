import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchProfile, updateProfile, uploadProfileAvatar } from '../services/api'

export default function EditProfile() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ firstName: '', lastName: '', location: '' })
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
  }

  function onAvatarSelect(e) {
    const f = e.target.files && e.target.files[0]
    if (f) {
      setAvatarFile(f)
      setAvatarPreview(URL.createObjectURL(f))
    }
  }

  async function onSave(e) {
    e.preventDefault()
    setIsSaving(true)
    setError('')
    try {
      // If an avatar file was selected, upload it first and update avatarUrl
      if (avatarFile) {
        await uploadProfileAvatar(avatarFile)
      }
      await updateProfile(form)
      navigate('/profile', { replace: true })
    } catch (err) {
      setError(err?.message || 'Unable to save profile')
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
              Location
              <input name="location" value={form.location} onChange={onChange} />
            </label>

            {error ? <div className="profile-empty-state">{error}</div> : null}

            <div style={{ marginTop: 12 }}>
              <button className="button button-secondary" type="button" onClick={() => navigate('/profile')} disabled={isSaving}>
                Cancel
              </button>
              <button className="button button-primary" type="submit" disabled={isSaving} style={{ marginLeft: 8 }}>
                {isSaving ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </form>
        </article>
      </section>
    </main>
  )
}
