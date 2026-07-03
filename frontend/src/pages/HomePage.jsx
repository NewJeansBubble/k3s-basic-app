import { useEffect, useState } from 'react'
import { getUser } from '../api.js'

function HomePage({ session, onLogout }) {
  const [user, setUser] = useState(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isActive = true

    async function loadUser() {
      try {
        const data = await getUser(
          session.user.id,
          session.accessToken,
        )

        if (isActive) {
          setUser(data)
        }
      } catch (error) {
        if (isActive) {
          setError(error.message)
        }
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    loadUser()

    return () => {
      isActive = false
    }
  }, [session.accessToken, session.user.id])

  return (
    <main className="home-page">
      <section className="home-card">
        <header className="home-header">
          <div>
            <h1>Welcome</h1>
            <p>Your account information</p>
          </div>

          <button type="button" onClick={onLogout}>
            Logout
          </button>
        </header>

        {isLoading && <p>Loading user...</p>}

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        {user && (
          <dl className="user-details">
            <div>
              <dt>Name</dt>
              <dd>{user.name}</dd>
            </div>

            <div>
              <dt>Email</dt>
              <dd>{user.email}</dd>
            </div>

            <div>
              <dt>Role</dt>
              <dd>{user.role}</dd>
            </div>

            <div>
              <dt>Created at</dt>
              <dd>{new Date(user.createdAt).toLocaleString()}</dd>
            </div>
          </dl>
        )}
      </section>
    </main>
  )
}

export default HomePage