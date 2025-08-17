import { useState } from 'react'
import toast from 'react-hot-toast'
import { ExternalLink, Edit3, Trash2, Save, X } from 'lucide-react'
import { updateWebsite, deleteWebsite } from '../services/api'

export default function WebsiteCard({ website, onRefresh }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    brand_name: website.brand_name || '',
    description: website.description || '',
    ai_description: website.ai_description || ''
  })

  const handleEdit = () => {
    setIsEditing(true)
    setEditData({
      brand_name: website.brand_name || '',
      description: website.description || '',
      ai_description: website.ai_description || ''
    })
  }

  const handleSave = async () => {
    try {
      await updateWebsite(website.id, editData)
      toast.success('Website updated successfully!')
      setIsEditing(false)
      onRefresh()
    } catch (error) {
      toast.error('Failed to update website')
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this website?')) return
    
    try {
      await deleteWebsite(website.id)
      toast.success('Website deleted successfully!')
      onRefresh()
    } catch (error) {
      toast.error('Failed to delete website')
    }
  }

  // Manual IST conversion
  const convertToIST = (utcDateString) => {
    if (!utcDateString) return 'Unknown'
    
    try {
      const utcDate = new Date(utcDateString)
      const istOffsetMs = 5.5 * 60 * 60 * 1000 // 5 hours 30 minutes
      const istDate = new Date(utcDate.getTime() + istOffsetMs)
      
      const options = {
        year: 'numeric',
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

  if (isEditing) {
    return (
      <div className="website-card edit-form">
        <div className="form-group">
          <label className="form-label">Brand Name</label>
          <input
            type="text"
            value={editData.brand_name}
            onChange={(e) => setEditData(prev => ({ ...prev, brand_name: e.target.value }))}
            className="input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Original Description</label>
          <textarea
            value={editData.description}
            onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
            className="textarea"
            rows={3}
          />
        </div>

        <div className="form-group">
          <label className="form-label">AI Enhanced Description</label>
          <textarea
            value={editData.ai_description}
            onChange={(e) => setEditData(prev => ({ ...prev, ai_description: e.target.value }))}
            className="textarea"
            rows={4}
          />
        </div>

        <div className="form-actions">
          <button onClick={handleSave} className="btn btn-primary">
            <Save size={16} />
            Save Changes
          </button>
          <button onClick={() => setIsEditing(false)} className="btn btn-secondary">
            <X size={16} />
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="website-card">
      <div className="website-header">
        <div className="website-info">
          <h3>{website.brand_name}</h3>
          <a 
            href={website.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="website-url"
          >
            {website.url} <ExternalLink size={12} style={{ display: 'inline' }} />
          </a>
        </div>
        <div className="website-actions">
          <button onClick={handleEdit} className="btn btn-secondary">
            <Edit3 size={16} />
            Edit
          </button>
          <button onClick={handleDelete} className="btn btn-danger">
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>

      <div className="description-section">
        <label className="description-label">Scraped Description</label>
        <div className="description-content scraped-desc">
          {website.description || 'No description available'}
        </div>
      </div>

      {website.ai_description && (
        <div className="description-section">
          <label className="description-label">AI Enhanced Description</label>
          <div className="description-content ai-desc">
            {website.ai_description}
          </div>
        </div>
      )}

      <div className="website-meta">
        <span>Added {convertToIST(website.created_at)}</span>
        {website.language && (
          <span>Language: {website.language.toUpperCase()}</span>
        )}
      </div>
    </div>
  )
}
