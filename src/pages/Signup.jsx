import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Auth.css'

export default function Signup() {
  const navigate = useNavigate()
  const { signup } = useAuth()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')

  function validate() {
    const e = {}
    if (!name.trim()) e.name = 'Full name is required'
    if (!email.includes('@')) e.email = 'Please enter a valid email'
    if (password.length < 6) e.password = 'Password must be at least 6 characters'
    if (password !== confirm) e.confirm = 'Passwords do not match'
    return e
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setServerError('')
    const e = validate()
    if (Object.keys(e).length > 0) { setErrors(e); return }
    const result = await signup(name, email, password)
    if (result.success) {
      navigate('/dashboard')
    } else {
      setServerError(result.error)
    }
  }

  const clear = (field) => setErrors(prev => ({ ...prev, [field]: '' }))

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">TenantTrails</div>
        <p className="auth-tagline">Create your account to submit reviews and comments.</p>

        {serverError && <div className="error-banner">{serverError}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field-group">
            <label className="field-label">Full name</label>
            <input
              type="text"
              className={`field-input ${errors.name ? 'input-error' : ''}`}
              value={name}
              onChange={e => { setName(e.target.value); clear('name') }}
              placeholder="Your name"
            />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>

          <div className="field-group">
            <label className="field-label">Email</label>
            <input
              type="text"
              className={`field-input ${errors.email ? 'input-error' : ''}`}
              value={email}
              onChange={e => { setEmail(e.target.value); clear('email') }}
              placeholder="you@example.com"
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="field-group">
            <label className="field-label">Password</label>
            <input
              type="password"
              className={`field-input ${errors.password ? 'input-error' : ''}`}
              value={password}
              onChange={e => { setPassword(e.target.value); clear('password') }}
              placeholder="At least 6 characters"
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          <div className="field-group">
            <label className="field-label">Confirm password</label>
            <input
              type="password"
              className={`field-input ${errors.confirm ? 'input-error' : ''}`}
              value={confirm}
              onChange={e => { setConfirm(e.target.value); clear('confirm') }}
              placeholder="Repeat password"
            />
            {errors.confirm && <span className="field-error">{errors.confirm}</span>}
          </div>

          <button type="submit" className="auth-btn">Create Account</button>
        </form>

        <p className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">Sign in</Link>
        </p>
      </div>
    </div>
  )
}