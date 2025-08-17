import { Loader2, RefreshCw } from 'lucide-react'
import WebsiteCard from './WebsiteCard'

export default function WebsiteList({ websites, loading, onRefresh }) {
  if (loading) {
    return (
      <div className="empty-state">
        <Loader2 className="loading-spinner" size={32} />
        <h3>Loading websites...</h3>
      </div>
    )
  }

  if (!websites.length) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🌐</div>
        <h3>No websites analyzed yet</h3>
        <p>Start by analyzing your first website above!</p>
        <button onClick={onRefresh} className="btn btn-secondary" style={{ marginTop: '1rem' }}>
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>
    )
  }

  return (
    <div>
      {websites.map((website) => (
        <WebsiteCard 
          key={website.id} 
          website={website} 
          onRefresh={onRefresh} 
        />
      ))}
    </div>
  )
}
