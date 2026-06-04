export default function AISummary({ summary, issues }) {
    return (
      <div className="ai-summary">
        <div className="ai-summary-label">✦ AI-GENERATED SUMMARY</div>
        <p className="ai-summary-text">{summary}</p>
        {issues && issues.length > 0 && (
          <div className="ai-issues">
            <div className="ai-issues-title">Key Issues</div>
            <div className="ai-issues-list">
              {issues.map(issue => (
                <span key={issue} className="ai-issue-tag">{issue}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }
  