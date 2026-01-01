'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Menu, X } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { SearchModal } from './SearchModal'

export function Navigation() {
  const { user, logout, isAdmin, isPaid } = useAuth()
  const [showSearch, setShowSearch] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Developer Hub
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6">
              {/* Search Button */}
              <button
                onClick={() => setShowSearch(true)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                title="Search (⌘K)"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
                <kbd className="inline-flex items-center gap-1 px-1.5 py-0.5 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-200 rounded">
                  <span className="text-[10px]">⌘</span>K
                </kbd>
              </button>

              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-600 hover:text-gray-900"
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Blog - Only for paid users */}
              {isPaid && (
                <Link href="/blog" className="text-gray-600 hover:text-gray-900">
                  Blog
                </Link>
              )}

              {/* Admin - Only for admins */}
              {isAdmin && (
                <Link href="/admin" className="text-gray-600 hover:text-gray-900 border-l border-gray-300 pl-6">
                  Admin
                </Link>
              )}

              {/* Auth buttons */}
              <div className="border-l border-gray-300 pl-6">
                {user ? (
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600 hidden xl:inline">
                      {user.name || user.email}
                      {user.role !== 'regular' && (
                        <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                          {user.role}
                        </span>
                      )}
                    </span>
                    <button
                      onClick={logout}
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-4">
                    <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Navigation */}
            <div className="flex lg:hidden items-center space-x-2">
              <button
                onClick={() => setShowSearch(true)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
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
              <div className="flex flex-col space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                  >
                    {link.label}
                  </Link>
                ))}
                
                {isPaid && (
                  <Link
                    href="/blog"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                  >
                    Blog
                  </Link>
                )}

                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                  >
                    Admin
                  </Link>
                )}

                <div className="border-t border-gray-200 pt-2 mt-2">
                  {user ? (
                    <div className="px-4 py-2">
                      <div className="text-sm text-gray-600 mb-2">
                        {user.name || user.email}
                        {user.role !== 'regular' && (
                          <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                            {user.role}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          logout()
                          setMobileMenuOpen(false)
                        }}
                        className="text-sm text-gray-600 hover:text-gray-900"
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-2 px-4">
                      <Link
                        href="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-sm text-gray-600 hover:text-gray-900"
                      >
                        Login
                      </Link>
                      <Link
                        href="/signup"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-center"
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
      <SearchModal isOpen={showSearch} onClose={() => setShowSearch(false)} />
    </>
  )
}
