import './Dashboard.css'

const apartments = [
  {
    id: 1,
    name: 'The Marlstone',
    address: '5540 Spring Garden Rd',
    neighbourhood: 'Spring Garden',
    rating: 5.0,
    reviews: 1,
    tags: [],
    noAI: true,
    img: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=220&fit=crop',
  },
  {
    id: 2,
    name: 'Park Victoria',
    address: '1496 Carlton St',
    neighbourhood: 'South End',
    rating: 4.5,
    reviews: 2,
    tags: ['Well maintained', 'Quiet', 'Expensive'],
    noAI: false,
    img: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&h=220&fit=crop',
  },
  {
    id: 3,
    name: 'Le Marchant Towers',
    address: '1585 Le Marchant St',
    neighbourhood: 'West End',
    rating: 3.7,
    reviews: 3,
    tags: ['Good location', 'Parking limited', 'Aging building'],
    noAI: false,
    img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=220&fit=crop',
  },
  {
    id: 4,
    name: 'Fenwick Tower',
    address: '5599 Fenwick St',
    neighbourhood: 'Downtown',
    rating: 3.3,
    reviews: 3,
    tags: ['Elevator issues', 'Great views', 'Security concerns'],
    noAI: false,
    img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=220&fit=crop',
  },
  {
    id: 5,
    name: 'Southpoint Apartments',
    address: '1050 South Park St',
    neighbourhood: 'South End',
    rating: 2.5,
    reviews: 4,
    tags: [],
    noAI: true,
    img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=220&fit=crop',
  },
]

function Stars({ rating }) {
  const full = Math.floor(rating)
  const half = rating % 1 >= 0.5
  const empty = 5 - full - (half ? 1 : 0)
  return (
    <div className="stars">
      {'★'.repeat(full)}
      {half ? '★' : ''}
      {'☆'.repeat(empty)}
    </div>
  )
}

function ApartmentCard({ apt }) {
  return (
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
          <span className="pin">📍</span>
          {apt.address} · {apt.neighbourhood}
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
  )
}

export default function Dashboard({ user, onSignOut }) {
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
          />
        </div>
        <div className="dash-user">
          <div className="avatar">{user?.initials || 'AM'}</div>
          <span className="username">{user?.name || 'Alex'}</span>
          <button className="btn-ghost signout" onClick={onSignOut}>Sign out</button>
        </div>
      </nav>

      <main className="dash-main">
        <div className="dash-header">
          <h1 className="dash-title">Apartments in Halifax</h1>
          <p className="dash-subtitle">Honest reviews from real tenants. Read before you rent.</p>
        </div>

        <div className="dash-stats">
          <button className="stat-pill active">5 apartments</button>
          <button className="stat-pill">13 reviews</button>
          <button className="stat-pill">4 neighbourhoods</button>
        </div>

        <div className="dash-filters">
          <select className="filter-select">
            <option>All Neighbourhoods</option>
            <option>South End</option>
            <option>Downtown</option>
            <option>Spring Garden</option>
            <option>West End</option>
          </select>
          <select className="filter-select">
            <option>Highest Rated</option>
            <option>Most Reviews</option>
            <option>Lowest Rated</option>
          </select>
        </div>

        <div className="apt-grid">
          {apartments.map(apt => <ApartmentCard key={apt.id} apt={apt} />)}
        </div>
      </main>
    </div>
  )
}
