import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { mockApartments, reviews } from '../data/mockData'
import StarRating from '../components/StarRating'
import AISummary from '../components/AISummary'
import ReviewCard from '../components/ReviewCard'
import ReviewDialog from '../components/ReviewDialog'
import './ApartmentDetail.css'

export default function ApartmentDetail() {
  const { id } = useParams()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showReview, setShowReview] = useState(false)
  const [localReviews, setLocalReviews] = useState(reviews)

  const apt = mockApartments.find(a => a.id === Number(id))

  if (!apt) {
    return (
      <div className="detail-page">
        <p>Apartment not found.</p>
        <Link to="/dashboard">← Back</Link>
      </div>
    )
  }

  const aptReviews = localReviews.filter(r => r.aptId === apt.id)
  const avgRating = aptReviews.length
    ? (aptReviews.reduce((sum, r) => sum + r.rating, 0) / aptReviews.length).toFixed(1)
    : apt.rating.toFixed(1)

  // Rating breakdown counts
  const breakdown = [5, 4, 3, 2, 1].map(n => ({
    n,
    count: aptReviews.filter(r => r.rating === n).length,
  }))
  const maxCount = Math.max(...breakdown.map(b => b.count), 1)

  function handleSubmitReview({ rating, body }) {
    const newReview = {
      id: Date.now(),
      aptId: apt.id,
      userId: user.id,
      rating,
      body,
      date: new Date().toISOString().slice(0, 10),
    }
    setLocalReviews(prev => [newReview, ...prev])
  }

  function handleSignOut() {
    logout()
    navigate('/login')
  }

  return (
    <div className="detail-page">
      {/* Navbar */}
      <nav className="dash-nav">
        <span className="dash-logo">TenantTrails</span>
        <div className="dash-user">
          <Link to="/profile" className="avatar" style={{ textDecoration: 'none', color: 'white' }}>
            {user?.initials || user?.name?.[0]?.toUpperCase()}
          </Link>
          <Link to="/profile" className="username" style={{ color: 'var(--text-primary)' }}>{user?.name}</Link>
          <button className="btn-signout" onClick={handleSignOut}>Sign out</button>
        </div>
      </nav>

      <main className="detail-main">
        <Link to="/dashboard" className="back-link">← Back to all apartments</Link>

        <div className="detail-layout">
          {/* Left column */}
          <div className="detail-left">
            {/* Header card */}
            <div className="detail-header-card">
              <div className="detail-header-left">
                <h1 className="detail-apt-name">{apt.name}</h1>
                <p className="detail-address">📍 {apt.address} · {apt.neighbourhood}</p>
                <p className="detail-description">
                  {apt.yearBuilt < 1990 ? 'Classic' : 'Modern'} building in {apt.neighbourhood}.
                </p>
              </div>
              <div className="detail-header-right">
                <div className="detail-big-rating">{avgRating}</div>
                <StarRating rating={parseFloat(avgRating)} />
                <div className="detail-review-count">{aptReviews.length} reviews</div>
              </div>
            </div>

            {/* AI Summary */}
            {apt.aiSummary && (
              <AISummary summary={apt.aiSummary} issues={apt.aiIssues} />
            )}

            {/* Reviews */}
            <div className="detail-reviews-header">
              <h2 className="detail-section-title">Reviews ({aptReviews.length})</h2>
              <button className="btn-write-review" onClick={() => setShowReview(true)}>
                + Write a Review
              </button>
            </div>

            {aptReviews.length === 0 ? (
              <div className="no-reviews">No reviews yet. Be the first!</div>
            ) : (
              <div className="reviews-list">
                {aptReviews.map(r => (
                  <ReviewCard
                    key={r.id}
                    rating={r.rating}
                    body={r.body}
                    date={r.date}
                    author={r.userId === user?.id ? user.name : `User ${r.userId}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right column */}
          <div className="detail-right">
            <div className="detail-info-card">
              <h3 className="detail-info-title">Property Info</h3>
              <div className="detail-info-rows">
                <div className="detail-info-row">
                  <span className="detail-info-label">Landlord</span>
                  <span className="detail-info-value">{apt.landlord}</span>
                </div>
                <div className="detail-info-row">
                  <span className="detail-info-label">Units</span>
                  <span className="detail-info-value">{apt.units}</span>
                </div>
                <div className="detail-info-row">
                  <span className="detail-info-label">Year built</span>
                  <span className="detail-info-value">{apt.yearBuilt}</span>
                </div>
                <div className="detail-info-row">
                  <span className="detail-info-label">Neighbourhood</span>
                  <span className="detail-info-value">{apt.neighbourhood}</span>
                </div>
              </div>
            </div>

            <div className="detail-info-card">
              <h3 className="detail-info-title">Rating Breakdown</h3>
              <div className="rating-breakdown">
                {breakdown.map(({ n, count }) => (
                  <div key={n} className="breakdown-row">
                    <span className="breakdown-n">{n}</span>
                    <span className="breakdown-star">★</span>
                    <div className="breakdown-bar-wrap">
                      <div
                        className="breakdown-bar"
                        style={{ width: `${(count / maxCount) * 100}%` }}
                      />
                    </div>
                    <span className="breakdown-count">{count}</span>
                  </div>
                ))}
              </div>
              <button className="btn-primary btn-full-width" onClick={() => setShowReview(true)}>
                Write a Review
              </button>
            </div>
          </div>
        </div>
      </main>

      {showReview && (
        <ReviewDialog
          onClose={() => setShowReview(false)}
          onSubmit={handleSubmitReview}
        />
      )}
    </div>
  )
}
