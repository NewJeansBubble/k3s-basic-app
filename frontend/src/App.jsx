import { useState } from 'react'
import './App.css'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'

const SESSION_KEY = 'k3s-basic-session'

function loadSession() {
  const storedSession = localStorage.getItem(SESSION_KEY)

  if (!storedSession) {
    return null
  }

  try {
    return JSON.parse(storedSession)
  } catch {
    localStorage.removeItem(SESSION_KEY)
    return null
  }
}

function App() {
  const [session, setSession] = useState(loadSession)
  const [authPage, setAuthPage] = useState('login')

  function handleLogin(newSession) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(newSession))
    setSession(newSession)
    setAuthPage('login')
  }

  function handleLogout() {
    localStorage.removeItem(SESSION_KEY)
    setSession(null)
    setAuthPage('login')
  }

  if (!session) {
    if (authPage === 'register') {
      return (
        <RegisterPage
          onLogin={handleLogin}
          onShowLogin={() => setAuthPage('login')}
        />
      )
    }

    return (
      <LoginPage
        onLogin={handleLogin}
        onShowRegister={() => setAuthPage('register')}
      />
    )
  }

  return <HomePage session={session} onLogout={handleLogout} />
}

export default App
