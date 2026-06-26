import { useState, useEffect, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import StarRating from '../components/StarRating'
import ReviewCard from '../components/ReviewCard'
import ReviewDialog from '../components/ReviewDialog'
import './ApartmentDetail.css'

const API = import.meta.env.VITE_API_URL

export default function ApartmentDetail() {
  const { id } = useParams()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showReview, setShowReview] = useState(false)
  const [apt, setApt] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  const loadApartment = useCallback(() => {
    fetch(`${API}/api/apartments/${id}`, { credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        setApt(data)
        setReviews(data.reviews || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  useEffect(() => { loadApartment() }, [loadApartment])

  async function handleSubmitReview({ rating, body }) {
    await fetch(`${API}/api/apartments/${id}/reviews`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating, body }),
    })
    loadApartment()
  }

  function handleSignOut() { logout(); navigate('/login') }

  if (loading) return <div className="detail-page"><p>Loading...</p></div>
  if (!apt) return <div className="detail-page"><p>Apartment not found.</p><Link to="/dashboard">← Back</Link></div>

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : apt.rating?.toFixed(1) || 'N/A'

  const breakdown = [5, 4, 3, 2, 1].map(n => ({ n, count: reviews.filter(r => r.rating === n).length }))
  const maxCount = Math.max(...breakdown.map(b => b.count), 1)

  return (
    <div className="detail-page">
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
          <div className="detail-left">
            <div className="detail-header-card">
              <div className="detail-header-left">
                <h1 className="detail-apt-name">{apt.name}</h1>
                <p className="detail-address">📍 {apt.address} · {apt.neighbourhood}</p>
              </div>
              <div className="detail-header-right">
                <div className="detail-big-rating">{avgRating}</div>
                <StarRating rating={parseFloat(avgRating) || 0} />
                <div className="detail-review-count">{reviews.length} reviews</div>
              </div>
            </div>

            <div className="detail-reviews-header">
              <h2 className="detail-section-title">Reviews ({reviews.length})</h2>
              <button className="btn-write-review" onClick={() => setShowReview(true)}>+ Write a Review</button>
            </div>

            {reviews.length === 0
              ? <div className="no-reviews">No reviews yet. Be the first!</div>
              : <div className="reviews-list">
                  {reviews.map(r => (
                    <ReviewCard
                      key={r.id}
                      rating={r.rating}
                      body={r.body}
                      date={r.created || r.date}
                      author={r.user_id === user?.id ? user.name : `User ${r.user_id}`}
                    />
                  ))}
                </div>
            }
          </div>

          <div className="detail-right">
            <div className="detail-info-card">
              <h3 className="detail-info-title">Property Info</h3>
              <div className="detail-info-rows">
                <div className="detail-info-row"><span className="detail-info-label">Landlord</span><span className="detail-info-value">{apt.landlord}</span></div>
                <div className="detail-info-row"><span className="detail-info-label">Units</span><span className="detail-info-value">{apt.units}</span></div>
                <div className="detail-info-row"><span className="detail-info-label">Year built</span><span className="detail-info-value">{apt.built}</span></div>
                <div className="detail-info-row"><span className="detail-info-label">Neighbourhood</span><span className="detail-info-value">{apt.neighbourhood}</span></div>
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
                      <div className="breakdown-bar" style={{ width: `${(count / maxCount) * 100}%` }} />
                    </div>
                    <span className="breakdown-count">{count}</span>
                  </div>
                ))}
              </div>
              <button className="btn-primary btn-full-width" onClick={() => setShowReview(true)}>Write a Review</button>
            </div>
          </div>
        </div>
      </main>

      {showReview && <ReviewDialog onClose={() => setShowReview(false)} onSubmit={handleSubmitReview} />}
    </div>
  )
}