import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ReviewCard from '../components/ReviewCard'
import ReviewDialog from '../components/ReviewDialog'
import './Profile.css'

const API = import.meta.env.VITE_API_URL

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [myReviews, setMyReviews] = useState([])
  const [editingReview, setEditingReview] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadProfile = useCallback(() => {
    fetch(`${API}/api/auth/me`, { credentials: 'include' })
      .then(r => r.json())
      .then(data => { setMyReviews(data.reviews || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => { loadProfile() }, [loadProfile])

  async function handleDelete(reviewId) {
    await fetch(`${API}/api/reviews/${reviewId}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    loadProfile()
  }

  async function handleSaveEdit({ rating, body }) {
    await fetch(`${API}/api/reviews/${editingReview.id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating, body }),
    })
    setEditingReview(null)
    loadProfile()
  }

  function handleSignOut() { logout(); navigate('/login') }

  return (
    <div className="profile-page">
      <nav className="dash-nav">
        <span className="dash-logo">TenantTrails</span>
        <div className="dash-user">
          <div className="avatar">{user?.initials || user?.name?.[0]?.toUpperCase()}</div>
          <span className="username">{user?.name}</span>
          <button className="btn-signout" onClick={handleSignOut}>Sign out</button>
        </div>
      </nav>

      <main className="profile-main">
        <Link to="/dashboard" className="back-link">← Back to apartments</Link>

        <div className="profile-header-card">
          <div className="profile-avatar-large">{user?.initials || user?.name?.[0]?.toUpperCase()}</div>
          <div className="profile-info">
            <h1 className="profile-name">{user?.name}</h1>
            <p className="profile-email">{user?.email}</p>
          </div>
          <div className="profile-stats">
            <div className="profile-stat">
              <span className="profile-stat-number">{myReviews.length}</span>
              <span className="profile-stat-label">REVIEWS</span>
            </div>
          </div>
        </div>

        <h2 className="profile-section-title">Your Reviews</h2>

        {loading && <p>Loading your reviews...</p>}

        {!loading && myReviews.length === 0 && (
          <div className="no-reviews-profile">
            You haven't written any reviews yet.{' '}
            <Link to="/dashboard" className="back-link">Browse apartments →</Link>
          </div>
        )}

        {!loading && myReviews.length > 0 && (
          <div className="profile-reviews-list">
            {myReviews.map(r => (
              <div key={r.id} className="profile-review-item">
                <div className="profile-review-apt">
                  <Link to={`/apartment/${r.aptId}`} className="profile-apt-link">
                    {r.aptName || `Apartment ${r.aptId}`}
                  </Link>
                </div>
                <ReviewCard
                  rating={r.rating}
                  body={r.body}
                  date={r.date || r.created}
                  author={user.name}
                  onDelete={() => handleDelete(r.id)}
                  onEdit={() => setEditingReview(r)}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      {editingReview && (
        <ReviewDialog
          title="Edit Review"
          initial={editingReview}
          onClose={() => setEditingReview(null)}
          onSubmit={handleSaveEdit}
        />
      )}
    </div>
  )
}