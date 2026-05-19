import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchProfile, updateProfile } from '../services/api'

export default function EditProfile() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ firstName: '', lastName: '', location: '' })
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

  async function onSave(e) {
    e.preventDefault()
    setIsSaving(true)
    setError('')
    try {
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
