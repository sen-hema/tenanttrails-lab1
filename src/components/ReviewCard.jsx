import StarRating from './StarRating'

export default function ReviewCard({ rating, body, date, author, onDelete, onEdit }) {
  return (
    <div className="review-card">
      <div className="review-header">
        <div className="review-author-row">
          <div className="review-avatar">{author?.[0]?.toUpperCase() || '?'}</div>
          <div>
            <div className="review-author-name">{author}</div>
            <div className="review-date">{date}</div>
          </div>
        </div>
        <StarRating rating={rating} />
      </div>
      <p className="review-body">{body}</p>
      {(onDelete || onEdit) && (
        <div className="review-actions">
          {onEdit && (
            <button className="review-action-btn" onClick={onEdit}>Edit</button>
          )}
          {onDelete && (
            <button className="review-action-btn review-action-delete" onClick={onDelete}>Delete</button>
          )}
        </div>
      )}
    </div>
  )
}
