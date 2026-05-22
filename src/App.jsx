import { useState } from 'react'
import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'

export default function App() {
  const [page, setPage] = useState('landing')
  const [user, setUser] = useState(null)

  const goTo = (p) => setPage(p)

  const handleLogin = () => {
    setUser({ name: 'Alex', initials: 'AM' })
    setPage('dashboard')
  }

  const handleSignOut = () => {
    setUser(null)
    setPage('landing')
  }

  if (page === 'landing') return <Landing goTo={goTo} />
  if (page === 'login') return <Login goTo={goTo} onLogin={handleLogin} />
  if (page === 'dashboard') return <Dashboard user={user} onSignOut={handleSignOut} />
}
