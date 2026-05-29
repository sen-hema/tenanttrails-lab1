import { createContext, useContext, useState } from 'react'
import { mockUsers } from '../data/mockData'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [users, setUsers] = useState(mockUsers)

  function login(email, password) {
    const found = users.find(
      u => u.email === email && u.password === password
    )
    if (found) {
      setUser(found)
      return { success: true }
    }
    return { success: false, error: 'Invalid email or password' }
  }

  function signup(name, email, password) {
    const exists = users.find(u => u.email === email)
    if (exists) return { success: false, error: 'Email already registered' }
    const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    const newUser = { id: users.length + 1, name, email, password, initials }
    setUsers([...users, newUser])
    setUser(newUser)
    return { success: true }
  }

  function logout() {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
