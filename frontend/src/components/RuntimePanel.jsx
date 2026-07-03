import { useEffect, useState } from 'react'
import { getSystemInfo } from '../api.js'

function RuntimePanel({ token }) {
  const [info, setInfo] = useState(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [refreshVersion, setRefreshVersion] = useState(0)

  useEffect(() => {
    let isActive = true

    async function loadInfo() {
      setIsLoading(true)
      setError('')

      try {
        const data = await getSystemInfo(token)

        if (isActive) {
          setInfo(data)
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

    loadInfo()

    return () => {
      isActive = false
    }
  }, [refreshVersion, token])

  return (
    <section className="panel">
      <header className="panel-header">
        <div>
          <h1>Runtime</h1>
          <p>Information about the API instance that served this request.</p>
        </div>

        <button
          className="secondary-button"
          type="button"
          onClick={() => setRefreshVersion((value) => value + 1)}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Refresh'}
        </button>
      </header>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      {info && (
        <div className="runtime-sections">
          <section>
            <h2>Application</h2>
            <dl className="info-grid">
              <div>
                <dt>Environment</dt>
                <dd>{info.application.environment}</dd>
              </div>
              <div>
                <dt>Version</dt>
                <dd>{info.application.version}</dd>
              </div>
              <div>
                <dt>Runtime</dt>
                <dd>{info.application.runtime}</dd>
              </div>
              <div>
                <dt>Response time</dt>
                <dd>{new Date(info.timestamp).toLocaleString()}</dd>
              </div>
            </dl>
          </section>

          <section>
            <h2>Kubernetes</h2>

            {!info.kubernetes.enabled ? (
              <p className="empty-state">Running outside Kubernetes.</p>
            ) : (
              <dl className="info-grid">
                <div>
                  <dt>Pod</dt>
                  <dd>{info.kubernetes.podName}</dd>
                </div>
                <div>
                  <dt>Namespace</dt>
                  <dd>{info.kubernetes.namespace}</dd>
                </div>
                <div>
                  <dt>Pod IP</dt>
                  <dd>{info.kubernetes.podIp}</dd>
                </div>
                <div>
                  <dt>Node</dt>
                  <dd>{info.kubernetes.nodeName}</dd>
                </div>
              </dl>
            )}
          </section>
        </div>
      )}
    </section>
  )
}

export default RuntimePanel
