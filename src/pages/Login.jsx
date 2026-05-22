import { useState } from 'react'
import './Login.css'

export default function Login({ goTo, onLogin }) {
  const [email, setEmail] = useState('alex@dal.ca')
  const [password, setPassword] = useState('password123')

  const handleSubmit = (e) => {
    e.preventDefault()
    onLogin()
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">TenantTrails</div>
        <p className="login-tagline">See what past tenants had to say, before you sign.</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="field-group">
            <label className="field-label">Email</label>
            <input
              type="email"
              className="field-input"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="alex@dal.ca"
            />
          </div>

          <div className="field-group">
            <label className="field-label">Password</label>
            <input
              type="password"
              className="field-input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••••"
            />
          </div>

          <button type="submit" className="login-btn">Sign In</button>
        </form>

        <p className="login-footer">
          Don't have an account?{' '}
          <span className="login-link" onClick={() => goTo('landing')}>Create one</span>
        </p>

        <div className="demo-box">
          Demo: <strong>alex@dal.ca / password123</strong>
        </div>
      </div>
    </div>
  )
}
