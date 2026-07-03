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
        <div className="sidebar-heading">
          <img className="sidebar-logo" src="/k3s-logo.svg" alt="K3s" />
          <p>Cluster workspace</p>
        </div>

        <nav className="sidebar-nav" aria-label="Main navigation">
          <span className="sidebar-label">Workspace</span>
          <button
            type="button"
            className={activePanel === 'profile' ? 'active' : ''}
            aria-current={activePanel === 'profile' ? 'page' : undefined}
            onClick={() => setActivePanel('profile')}
          >
            <span className="nav-indicator" aria-hidden="true" />
            Profile
          </button>
          <button
            type="button"
            className={activePanel === 'runtime' ? 'active' : ''}
            aria-current={activePanel === 'runtime' ? 'page' : undefined}
            onClick={() => setActivePanel('runtime')}
          >
            <span className="nav-indicator" aria-hidden="true" />
            Runtime
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="user-summary">
            <span className="user-avatar" aria-hidden="true">
              {(user?.name ?? session.user.name).charAt(0).toUpperCase()}
            </span>
            <div>
              <strong>{user?.name ?? session.user.name}</strong>
              <span>{user?.email ?? session.user.email}</span>
            </div>
          </div>

          <button className="logout-button" type="button" onClick={onLogout}>
            Logout
          </button>
        </div>
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
