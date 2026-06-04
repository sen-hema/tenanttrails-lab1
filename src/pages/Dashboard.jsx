import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { mockApartments } from '../data/mockData'
import './Dashboard.css'

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
          <img src={apt.img} alt={apt.name} className="apt-img" />
          <div className="apt-rating-badge">
            <span className="rating-star">★</span>
            {apt.rating.toFixed(1)}
          </div>
        </div>
        <div className="apt-body">
          <h3 className="apt-name">{apt.name}</h3>
          <p className="apt-address">
            📍 {apt.address} · {apt.neighbourhood}
          </p>
          <div className="apt-tags">
            {apt.noAI
              ? <span className="tag tag-gray">No AI summary yet</span>
              : apt.tags.map(t => <span key={t} className="tag">{t}</span>)
            }
          </div>
          <div className="apt-footer">
            <span className="apt-review-count">{apt.reviews} review{apt.reviews !== 1 ? 's' : ''}</span>
            <Stars rating={apt.rating} />
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const [neighbourhood, setNeighbourhood] = useState('All Neighbourhoods')
  const [sortBy, setSortBy] = useState('Highest Rated')
  const [filtered, setFiltered] = useState(mockApartments)

  const neighbourhoods = ['All Neighbourhoods', ...new Set(mockApartments.map(a => a.neighbourhood))]

  useEffect(() => {
    let result = [...mockApartments]

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(a =>
        a.name.toLowerCase().includes(q) ||
        a.address.toLowerCase().includes(q) ||
        a.neighbourhood.toLowerCase().includes(q)
      )
    }

    if (neighbourhood !== 'All Neighbourhoods') {
      result = result.filter(a => a.neighbourhood === neighbourhood)
    }

    if (sortBy === 'Highest Rated') result.sort((a, b) => b.rating - a.rating)
    else if (sortBy === 'Lowest Rated') result.sort((a, b) => a.rating - b.rating)
    else if (sortBy === 'Most Reviews') result.sort((a, b) => b.reviews - a.reviews)

    setFiltered(result)
  }, [search, neighbourhood, sortBy])

  function handleSignOut() {
    logout()
    navigate('/login')
  }

  const totalReviews = mockApartments.reduce((sum, a) => sum + a.reviews, 0)

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

        <div className="dash-stats">
          <button className="stat-pill active">{mockApartments.length} apartments</button>
          <button className="stat-pill">{totalReviews} reviews</button>
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
          : <div className="apt-grid">
              {filtered.map(apt => <ApartmentCard key={apt.id} apt={apt} />)}
            </div>
        }
      </main>
    </div>
  )
}
