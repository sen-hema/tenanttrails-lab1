import './Landing.css'

export default function Landing({ goTo }) {
  return (
    <div className="landing">
      <nav className="landing-nav">
        <span className="landing-logo">TenantTrails</span>
        <div className="landing-nav-right">
          <button className="btn-ghost" onClick={() => goTo('login')}>Sign In</button>
          <button className="btn-primary" onClick={() => goTo('login')}>Get Started</button>
        </div>
      </nav>

      <main className="landing-hero">
        <div className="launch-badge">Launching in Halifax, Nova Scotia</div>

        <h1 className="hero-title">
          Know what you're signing<br />before you sign it.
        </h1>

        <p className="hero-subtitle">
          Read honest reviews from past tenants. See AI-generated summaries.<br />
          Make informed decisions about where you live.
        </p>

        <div className="hero-cta">
          <button className="btn-primary btn-large" onClick={() => goTo('login')}>
            Create Free Account
          </button>
          <button className="btn-outline btn-large" onClick={() => goTo('login')}>
            Sign In
          </button>
        </div>

        <div className="features-row">
          <div className="feature-item">
            <span className="feature-emoji">⭐</span>
            <h3>Verified Reviews</h3>
            <p>Real ratings with photos and videos from past tenants.</p>
          </div>
          <div className="feature-item">
            <span className="feature-emoji">🤖</span>
            <h3>AI Summaries</h3>
            <p>Key issues and sentiment extracted from every review.</p>
          </div>
          <div className="feature-item">
            <span className="feature-emoji">💬</span>
            <h3>Ask Questions</h3>
            <p>Comment on reviews and get answers from past tenants.</p>
          </div>
        </div>
      </main>
    </div>
  )
}
