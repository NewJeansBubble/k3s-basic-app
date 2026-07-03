import { useState } from 'react'
import { updateUser } from '../api.js'

function ProfilePanel({ user, token, onUserUpdated }) {
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSuccess('')

    const normalizedName = name.trim()
    const normalizedEmail = email.trim().toLowerCase()
    const changes = {}

    if (normalizedName !== user.name) {
      changes.name = normalizedName
    }

    if (normalizedEmail !== user.email) {
      changes.email = normalizedEmail
    }

    if (Object.keys(changes).length === 0) {
      setSuccess('No changes to save')
      return
    }

    setIsSaving(true)

    try {
      const updatedUser = await updateUser(user.id, changes, token)
      setName(updatedUser.name)
      setEmail(updatedUser.email)
      onUserUpdated(updatedUser)
      setSuccess('Profile updated successfully')
    } catch (error) {
      setError(error.message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section className="panel">
      <header className="panel-header">
        <div>
          <h1>Profile</h1>
          <p>View and update your account information.</p>
        </div>
        <span className="role-badge">{user.role}</span>
      </header>

      <form className="profile-form" onSubmit={handleSubmit}>
        <label>
          Name
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            minLength={2}
            maxLength={100}
            required
          />
        </label>

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>

        <div className="readonly-field">
          <span>Created at</span>
          <strong>{new Date(user.createdAt).toLocaleString()}</strong>
        </div>

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        {success && (
          <p className="form-success" role="status">
            {success}
          </p>
        )}

        <button className="primary-button" type="submit" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save changes'}
        </button>
      </form>
    </section>
  )
}

export default ProfilePanel
