'use client'

import { useState, useEffect, useRef, KeyboardEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, FileText, ArrowRight } from 'lucide-react'
import { search, SearchItem } from '@/lib/search'

interface SearchModalProps {
  isOpen?: boolean
  onClose?: () => void
}

export function SearchModal({ isOpen: externalIsOpen, onClose }: SearchModalProps = {}) {
  const [isOpen, setIsOpen] = useState(externalIsOpen ?? false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchItem[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  // Sync with external isOpen prop
  useEffect(() => {
    if (externalIsOpen !== undefined) {
      setIsOpen(externalIsOpen)
    }
  }, [externalIsOpen])

  // Keyboard shortcut: Cmd/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
      }
      if (e.key === 'Escape') {
        handleClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown as any)
    return () => window.removeEventListener('keydown', handleKeyDown as any)
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    setQuery('')
    setResults([])
    onClose?.()
  }

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  // Search as user types
  useEffect(() => {
    if (query.length >= 2) {
      const searchResults = search(query, 10)
      setResults(searchResults)
      setSelectedIndex(0)
    } else {
      setResults([])
      setSelectedIndex(0)
    }
  }, [query])

  // Keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault()
      handleSelect(results[selectedIndex])
    }
  }

  // Scroll selected item into view
  useEffect(() => {
    if (resultsRef.current && selectedIndex >= 0) {
      const selectedElement = resultsRef.current.children[selectedIndex] as HTMLElement
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
      }
    }
  }, [selectedIndex, results])

  const handleSelect = (item: SearchItem) => {
    router.push(item.path)
    handleClose()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] sm:pt-[20vh] px-2 sm:px-4">
        <div
          className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[85vh] sm:max-h-[70vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Input */}
          <div className="flex items-center border-b border-gray-200 p-3 sm:p-4">
            <Search className="w-5 h-5 text-gray-400 mr-2 sm:mr-3 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search..."
              className="flex-1 outline-none text-gray-900 placeholder-gray-400 text-sm sm:text-base"
            />
            <button
              onClick={handleClose}
              className="ml-3 p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Results */}
          <div className="overflow-y-auto flex-1">
            {query.length < 2 ? (
              <div className="p-6 sm:p-8 text-center text-gray-500">
                <Search className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-sm">Type at least 2 characters to search</p>
                <p className="text-xs text-gray-400 mt-2 hidden sm:block">
                  Press <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">⌘K</kbd> or{' '}
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl+K</kbd> to open search
                </p>
              </div>
            ) : results.length === 0 ? (
              <div className="p-6 sm:p-8 text-center text-gray-500">
                <FileText className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-sm">No results found for "{query}"</p>
                <p className="text-xs text-gray-400 mt-2">Try different keywords</p>
              </div>
            ) : (
              <div ref={resultsRef} className="py-2">
                {results.map((item, index) => (
                  <button
                    key={item.path}
                    onClick={() => handleSelect(item)}
                    className={`
                      w-full text-left px-3 sm:px-4 py-2 sm:py-3 hover:bg-gray-50 transition-colors
                      flex items-center justify-between
                      ${selectedIndex === index ? 'bg-blue-50 border-l-4 border-blue-500' : ''}
                    `}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="font-medium text-gray-900 truncate text-sm sm:text-base">{item.title}</span>
                        {item.category && (
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded flex-shrink-0">
                            {item.category}
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 truncate ml-6 hidden sm:block">{item.content}</p>
                      <p className="text-xs text-gray-400 truncate ml-6 mt-1">{item.path}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 ml-2 flex-shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {results.length > 0 && (
            <div className="border-t border-gray-200 px-3 sm:px-4 py-2 flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                <span className="hidden sm:inline">
                  <kbd className="px-1.5 py-0.5 bg-gray-100 rounded">↑↓</kbd> Navigate
                </span>
                <span className="hidden sm:inline">
                  <kbd className="px-1.5 py-0.5 bg-gray-100 rounded">Enter</kbd> Select
                </span>
                <span>
                  <kbd className="px-1.5 py-0.5 bg-gray-100 rounded">Esc</kbd> Close
                </span>
              </div>
              <span className="flex-shrink-0 ml-2">{results.length} result{results.length !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

