import { useEffect, useState } from 'react'
import { getUser } from '../api.js'
import ProfilePanel from '../components/ProfilePanel.jsx'
import RuntimePanel from '../components/RuntimePanel.jsx'

function HomePage({ session, onLogout, onUserUpdated }) {
  const [user, setUser] = useState(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [activePanel, setActivePanel] = useState('profile')

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

  function handleUserUpdated(updatedUser) {
    setUser(updatedUser)
    onUserUpdated(updatedUser)
  }

  return (
    <main className="dashboard">
      <aside className="sidebar">
        <div>
          <p className="sidebar-brand">K3s Basic App</p>
          <p className="sidebar-user">{user?.name ?? session.user.name}</p>
        </div>

        <nav className="sidebar-nav" aria-label="Main navigation">
          <button
            type="button"
            className={activePanel === 'profile' ? 'active' : ''}
            aria-current={activePanel === 'profile' ? 'page' : undefined}
            onClick={() => setActivePanel('profile')}
          >
            Profile
          </button>
          <button
            type="button"
            className={activePanel === 'runtime' ? 'active' : ''}
            aria-current={activePanel === 'runtime' ? 'page' : undefined}
            onClick={() => setActivePanel('runtime')}
          >
            Runtime
          </button>
        </nav>

        <button className="logout-button" type="button" onClick={onLogout}>
          Logout
        </button>
      </aside>

      <section className="dashboard-content">
        {isLoading && <p>Loading user...</p>}

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        {activePanel === 'profile' && user && (
          <ProfilePanel
            user={user}
            token={session.accessToken}
            onUserUpdated={handleUserUpdated}
          />
        )}

        {activePanel === 'runtime' && <RuntimePanel token={session.accessToken} />}
      </section>
    </main>
  )
}

export default HomePage
