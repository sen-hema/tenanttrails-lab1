import { useState } from 'react'

export default function ReviewDialog({ onClose, onSubmit, initial = null, title = 'Write a Review' }) {
  const [rating, setRating] = useState(initial?.rating || 0)
  const [hovered, setHovered] = useState(0)
  const [body, setBody] = useState(initial?.body || '')

  function handleSubmit() {
    if (rating === 0 || !body.trim()) return
    onSubmit({ rating, body })
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Your rating</label>
            <div className="star-input">
              {[1, 2, 3, 4, 5].map(n => (
                <span
                  key={n}
                  className="star-btn"
                  style={{ color: n <= (hovered || rating) ? 'var(--star)' : 'var(--border)' }}
                  onClick={() => setRating(n)}
                  onMouseEnter={() => setHovered(n)}
                  onMouseLeave={() => setHovered(0)}
                >
                  ★
                </span>
              ))}
            </div>
            {rating > 0 && <div className="rating-label">{rating} of 5</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Your review</label>
            <textarea
              className="form-textarea"
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder="What was your experience living here? Cover maintenance, responsiveness, noise, pests, deposit handling, and anything future tenants should know."
              rows={5}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={rating === 0 || !body.trim()}
          >
            {initial ? 'Save Changes' : 'Submit Review'}
          </button>
        </div>
      </div>
    </div>
  )
}
