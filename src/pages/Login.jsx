import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Auth.css'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')

  function validate() {
    const e = {}
    if (!email.includes('@')) e.email = 'Please enter a valid email'
    if (password.length < 6) e.password = 'Password must be at least 6 characters'
    return e
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setServerError('')
    const e = validate()
    if (Object.keys(e).length > 0) { setErrors(e); return }
    const result = await login(email, password)
    if (result.success) {
      navigate('/dashboard')
    } else {
      setServerError(result.error)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">TenantTrails</div>
        <p className="auth-tagline">See what past tenants had to say, before you sign.</p>

        {serverError && <div className="error-banner">{serverError}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field-group">
            <label className="field-label">Email</label>
            <input
              type="text"
              className={`field-input ${errors.email ? 'input-error' : ''}`}
              value={email}
              onChange={e => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: '' })) }}
              placeholder="alex@dal.ca"
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="field-group">
            <label className="field-label">Password</label>
            <input
              type="password"
              className={`field-input ${errors.password ? 'input-error' : ''}`}
              value={password}
              onChange={e => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: '' })) }}
              placeholder="••••••••••"
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          <button type="submit" className="auth-btn">Sign In</button>
        </form>

        <p className="auth-footer">
          Don't have an account?{' '}
          <Link to="/signup" className="auth-link">Create one</Link>
        </p>
      </div>
    </div>
  )
}