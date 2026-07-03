import { useState } from 'react'
import './App.css'
import LoginPage from './LoginPage.jsx'

function App() {
  const [session, setSession] = useState(null)

  if (!session) {
    return <LoginPage onLogin={setSession} />
  }

  return (
    <main className="home-page">
      <h1>Welcome, {session.user.name}</h1>
      <p>You are signed in as {session.user.email}</p>
    </main>
  )
}

export default App