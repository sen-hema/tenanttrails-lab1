import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Dashboard.css'

const API = import.meta.env.VITE_API_URL

const APT_IMAGES = {
  1: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=220&fit=crop',
  2: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&h=220&fit=crop',
  3: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=220&fit=crop',
  4: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=220&fit=crop',
  5: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=220&fit=crop',
}

function Stars({ rating }) {
  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className={i <= Math.round(rating) ? 'star-full' : 'star-empty'}>★</span>
      ))}
    </div>
  )
}

function ApartmentCard({ apt }) {
  return (
    <Link to={`/apartment/${apt.id}`} style={{ textDecoration: 'none' }}>
      <div className="apt-card">
        <div className="apt-img-wrap">
          <img
            src={APT_IMAGES[apt.id] || apt.img || 'https://placehold.co/400x200'}
            alt={apt.name}
            className="apt-img"
          />
          <div className="apt-rating-badge">
            <span className="rating-star">★</span>
            {apt.rating ? parseFloat(apt.rating).toFixed(1) : 'N/A'}
          </div>
        </div>
        <div className="apt-body">
          <h3 className="apt-name">{apt.name}</h3>
          <p className="apt-address">📍 {apt.address} · {apt.neighbourhood}</p>
          <div className="apt-footer">
            <span className="apt-review-count">{apt.reviews} review{apt.reviews !== 1 ? 's' : ''}</span>
            <Stars rating={parseFloat(apt.rating) || 0} />
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [apartments, setApartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [neighbourhood, setNeighbourhood] = useState('All Neighbourhoods')
  const [sortBy, setSortBy] = useState('Highest Rated')

  useEffect(() => {
    fetch(`${API}/api/apartments`, { credentials: 'include' })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => { setApartments(data); setLoading(false) })
      .catch(() => { setError('Could not load apartments'); setLoading(false) })
  }, [])

  const neighbourhoods = ['All Neighbourhoods', ...new Set(apartments.map(a => a.neighbourhood))]

  let filtered = [...apartments]
  if (search.trim()) {
    const q = search.toLowerCase()
    filtered = filtered.filter(a =>
      a.name.toLowerCase().includes(q) ||
      a.address.toLowerCase().includes(q) ||
      a.neighbourhood.toLowerCase().includes(q)
    )
  }
  if (neighbourhood !== 'All Neighbourhoods') {
    filtered = filtered.filter(a => a.neighbourhood === neighbourhood)
  }
  if (sortBy === 'Highest Rated') filtered.sort((a, b) => (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0))
  else if (sortBy === 'Lowest Rated') filtered.sort((a, b) => (parseFloat(a.rating) || 0) - (parseFloat(b.rating) || 0))
  else if (sortBy === 'Most Reviews') filtered.sort((a, b) => (b.reviews || 0) - (a.reviews || 0))

  function handleSignOut() { logout(); navigate('/login') }

  return (
    <div className="dashboard">
      <nav className="dash-nav">
        <span className="dash-logo">TenantTrails</span>
        <div className="dash-search-wrap">
          <span className="search-icon">🔍</span>
          <input
            className="dash-search"
            type="text"
            placeholder="Search apartments by address or neighbourhood..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="dash-user">
          <Link to="/profile" className="avatar" style={{ textDecoration: 'none', color: 'white' }}>
            {user?.initials || user?.name?.[0]?.toUpperCase()}
          </Link>
          <Link to="/profile" className="username" style={{ color: 'var(--text-primary)' }}>{user?.name}</Link>
          <button className="btn-signout" onClick={handleSignOut}>Sign out</button>
        </div>
      </nav>

      <main className="dash-main">
        <div className="dash-header">
          <h1 className="dash-title">Apartments in Halifax</h1>
          <p className="dash-subtitle">Honest reviews from real tenants. Read before you rent.</p>
        </div>

        {loading && <p>Loading apartments...</p>}
        {error && <p>{error}</p>}

        {!loading && !error && (
          <>
            <div className="dash-stats">
              <button className="stat-pill active">{apartments.length} apartments</button>
              <button className="stat-pill">{neighbourhoods.length - 1} neighbourhoods</button>
            </div>
            <div className="dash-filters">
              <select className="filter-select" value={neighbourhood} onChange={e => setNeighbourhood(e.target.value)}>
                {neighbourhoods.map(n => <option key={n}>{n}</option>)}
              </select>
              <select className="filter-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option>Highest Rated</option>
                <option>Lowest Rated</option>
                <option>Most Reviews</option>
              </select>
            </div>
            {filtered.length === 0
              ? <div className="no-results">No apartments match your search.</div>
              : <div className="apt-grid">{filtered.map(apt => <ApartmentCard key={apt.id} apt={apt} />)}</div>
            }
          </>
        )}
      </main>
    </div>
  )
}