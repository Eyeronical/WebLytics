import { useState } from 'react'
import { Search, X } from 'lucide-react'

export default function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(searchTerm)
  }

  const handleClear = () => {
    setSearchTerm('')
    onSearch('')
  }

  return (
    <form onSubmit={handleSubmit} className="search-container">
      <Search className="search-icon w-5 h-5" />
      <input
        type="text"
        placeholder="Search websites by name, URL, or description..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="input search-input pr-12"
      />
      {searchTerm && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </form>
  )
}
