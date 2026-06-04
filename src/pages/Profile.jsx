import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { reviews as initialReviews, mockApartments } from '../data/mockData'
import ReviewCard from '../components/ReviewCard'
import ReviewDialog from '../components/ReviewDialog'
import './Profile.css'

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [allReviews, setAllReviews] = useState(initialReviews)
  const [editingReview, setEditingReview] = useState(null)

  const myReviews = allReviews.filter(r => r.userId === user?.id)

  function handleDelete(reviewId) {
    setAllReviews(prev => prev.filter(r => r.id !== reviewId))
  }

  function handleEdit(review) {
    setEditingReview(review)
  }

  function handleSaveEdit({ rating, body }) {
    setAllReviews(prev =>
      prev.map(r => r.id === editingReview.id ? { ...r, rating, body } : r)
    )
    setEditingReview(null)
  }

  function getAptName(aptId) {
    return mockApartments.find(a => a.id === aptId)?.name || 'Unknown'
  }

  function handleSignOut() {
    logout()
    navigate('/login')
  }

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

        {/* Profile header */}
        <div className="profile-header-card">
          <div className="profile-avatar-large">
            {user?.initials || user?.name?.[0]?.toUpperCase()}
          </div>
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

        {/* Reviews */}
        <h2 className="profile-section-title">Your Reviews</h2>

        {myReviews.length === 0 ? (
          <div className="no-reviews-profile">
            You haven't written any reviews yet.{' '}
            <Link to="/dashboard" className="back-link">Browse apartments →</Link>
          </div>
        ) : (
          <div className="profile-reviews-list">
            {myReviews.map(r => (
              <div key={r.id} className="profile-review-item">
                <div className="profile-review-apt">
                  <Link to={`/apartment/${r.aptId}`} className="profile-apt-link">
                    {getAptName(r.aptId)}
                  </Link>
                </div>
                <ReviewCard
                  rating={r.rating}
                  body={r.body}
                  date={r.date}
                  author={user.name}
                  onDelete={() => handleDelete(r.id)}
                  onEdit={() => handleEdit(r)}
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
