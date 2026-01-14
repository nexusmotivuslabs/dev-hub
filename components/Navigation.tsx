'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, Menu, X } from 'lucide-react'
import { SearchModal } from './SearchModal'

export function Navigation({ 
  onSidebarToggle, 
  sidebarOpen = false 
}: { 
  onSidebarToggle?: () => void
  sidebarOpen?: boolean
}) {
  const pathname = usePathname()
  const [showSearch, setShowSearch] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Keyboard shortcut for search (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setShowSearch(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/00-principles', label: 'Principles' },
    { href: '/10-developer-contracts', label: 'Contracts' },
    { href: '/20-workflows', label: 'Workflows' },
    { href: '/30-tooling', label: 'Tooling' },
    { href: '/40-reference', label: 'Reference' },
    { href: '/domains', label: 'Domains' },
  ]

  return (
    <>
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 w-full">
        <div className="w-full max-w-none px-3 sm:px-4 lg:px-6 xl:px-8">
          <div className="flex items-center justify-between h-12 sm:h-14 lg:h-16">
            <Link href="/" className="text-lg sm:text-xl font-bold text-gray-900 flex-shrink-0">
              Developer Hub
            </Link>
            
            {/* Sidebar Toggle Button - Mobile */}
            {onSidebarToggle && (
              <button
                onClick={onSidebarToggle}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
                aria-label="Toggle sidebar"
                aria-expanded={sidebarOpen}
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            )}
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center flex-1 justify-between ml-6">
              {/* Navigation Tabs - Scrollable on smaller desktop */}
              <div className="flex items-center space-x-1 overflow-x-auto scrollbar-hide flex-1 max-w-4xl">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href || 
                    (link.href !== '/' && pathname.startsWith(link.href))
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                        isActive
                          ? 'text-blue-700 bg-blue-50 font-semibold'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {link.label}
                    </Link>
                  )
                })}
              </div>

              {/* Right side: Search */}
              <div className="flex items-center space-x-4 ml-4 flex-shrink-0">
                {/* Search Button */}
                <button
                  onClick={() => setShowSearch(true)}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                  title="Search (⌘K)"
                >
                  <Search className="w-4 h-4" />
                  <span className="hidden xl:inline">Search</span>
                  <kbd className="hidden lg:inline-flex items-center gap-1 px-1.5 py-0.5 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-200 rounded">
                    <span className="text-[10px]">⌘</span>K
                  </kbd>
                </button>
              </div>
            </div>

            {/* Mobile Navigation */}
            <div className="flex lg:hidden items-center space-x-2 flex-shrink-0">
              <button
                onClick={() => setShowSearch(true)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden border-t border-gray-200 py-4">
              {/* Mobile Navigation Tabs - Horizontal Scroll */}
              <div className="flex overflow-x-auto scrollbar-hide space-x-2 pb-4">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href || 
                    (link.href !== '/' && pathname.startsWith(link.href))
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap flex-shrink-0 transition-colors ${
                        isActive
                          ? 'text-blue-700 bg-blue-50 font-semibold'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      {link.label}
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </nav>
      <SearchModal isOpen={showSearch} onClose={() => setShowSearch(false)} />
    </>
  )
}
