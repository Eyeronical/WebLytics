import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { Search, BarChart3, Globe2, Clock } from 'lucide-react'
import WebsiteList from './components/WebsiteList'
import { analyzeWebsite, getWebsites, getStats } from './services/api'

function App() {
  const [websites, setWebsites] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [url, setUrl] = useState('')

  const fetchWebsites = async (search = '') => {
    setLoading(true)
    try {
      const response = await getWebsites(1, 20, search)
      setWebsites(response.data)
    } 
    catch { toast.error('Failed to fetch websites') }
    setLoading(false)
  }

  const fetchStats = async () => {
    try {
      setStats(await getStats())
    } catch {}
  }

  useEffect(() => { fetchWebsites(searchTerm) }, [searchTerm])
  useEffect(() => { fetchStats() }, [websites])

  const handleAnalyze = async (e) => {
    e.preventDefault()
    if (!url.trim() || loading) return
    setLoading(true)
    try {
      await analyzeWebsite(url.trim())
      toast.success('Website analyzed successfully!')
      setUrl('')
      fetchWebsites(searchTerm)
      fetchStats()
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to analyze website')
    }
    setLoading(false)
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  // Manual IST conversion: Add exactly 5 hours 30 minutes to UTC
  const convertToIST = (utcDateString) => {
    if (!utcDateString) return 'N/A'
    
    try {
      const utcDate = new Date(utcDateString)
      const istOffsetMs = 5.5 * 60 * 60 * 1000 // 5 hours 30 minutes in milliseconds
      const istDate = new Date(utcDate.getTime() + istOffsetMs)
      
      const options = {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }
      
      return istDate.toLocaleString('en-US', options) + ' IST'
    } catch {
      return 'Invalid Date'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container">
        <div className="header">
          <div className="header-content">
            <h1>Website Analyzer</h1>
            <p>Analyze websites with AI-powered insights and smart scraping</p>
            <form onSubmit={handleAnalyze} className="input-section">
              <input
                type="text"
                placeholder="Enter website URL (e.g., https://example.com)"
                value={url}
                onChange={e => setUrl(e.target.value)}
                className="input"
                required
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !url.trim()}
                className="btn"
                style={{ 
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
                  color: 'white', 
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.39)',
                  border: 'none'
                }}
              >
                <Search size={16} />
                {loading ? 'Analyzing...' : 'Analyze'}
              </button>
            </form>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <BarChart3 size={24} style={{ color: '#2563eb', margin: '0 auto 0.5rem' }} />
            <span className="stat-number">{stats.totalWebsites || 0}</span>
            <div className="stat-label">Websites Analyzed</div>
          </div>
          <div className="stat-card">
            <Globe2 size={24} style={{ color: '#10b981', margin: '0 auto 0.5rem' }} />
            <span className="stat-number" style={{ fontSize: '1.2rem' }}>
              {stats.mostRecent && typeof stats.mostRecent === 'string' 
                ? stats.mostRecent.slice(0, 15) + (stats.mostRecent.length > 15 ? '...' : '')
                : 'None Yet'}
            </span>
            <div className="stat-label">Most Recent Site</div>
          </div>
          <div className="stat-card">
            <Clock size={24} style={{ color: '#eab308', margin: '0 auto 0.5rem' }} />
            <span className="stat-number" style={{ fontSize: '1rem' }}>
              {convertToIST(stats.lastAdded)}
            </span>
            <div className="stat-label">Last Added</div>
          </div>
        </div>

        <div className="main-card">
          <div className="card-header">
            <h2 className="card-title">Analyzed Websites</h2>
          </div>
          <div className="card-content">
            <div className="search-container">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search websites by name, URL, or description..."
                value={searchTerm}
                onChange={handleSearch}
                className="search-input"
              />
            </div>
            <WebsiteList 
              websites={websites} 
              loading={loading}
              onRefresh={() => fetchWebsites(searchTerm)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
