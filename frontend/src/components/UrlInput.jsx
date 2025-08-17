import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Loader2 } from 'lucide-react'

export default function UrlInput({ onAnalyze, loading }) {
  const [url, setUrl] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!url.trim() || loading) return
    
    await onAnalyze(url.trim())
    setUrl('')
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="flex gap-4 flex-col sm:flex-row"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3 }}
    >
      <div className="flex-1 relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Enter website URL (e.g., https://example.com)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="input pl-12 text-gray-800 placeholder-gray-500"
          required
          disabled={loading}
        />
      </div>
      <motion.button
        type="submit"
        disabled={loading || !url.trim()}
        className="btn btn-primary min-w-[140px]"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <Search className="w-4 h-4" />
            Analyze
          </>
        )}
      </motion.button>
    </motion.form>
  )
}
