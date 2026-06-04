export default function StarRating({ rating, max = 5 }) {
    const full = Math.round(rating)
    return (
      <span className="stars">
        {Array.from({ length: max }, (_, i) => (
          <span key={i} style={{ color: i < full ? 'var(--star)' : 'var(--border)', fontSize: '15px' }}>
            {i < full ? '★' : '☆'}
          </span>
        ))}
      </span>
    )
  }
  