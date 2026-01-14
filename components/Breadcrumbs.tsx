'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'

export function Breadcrumbs() {
  const pathname = usePathname()
  
  // Don't show breadcrumbs on home page
  if (pathname === '/') {
    return null
  }

  // Split pathname into segments
  const segments = pathname.split('/').filter(Boolean)
  
  // Build breadcrumb items
  const breadcrumbs: Array<{ label: string; href: string; icon?: typeof Home }> = [
    { label: 'Home', href: '/', icon: Home },
    ...segments.map((segment, index) => {
      const href = '/' + segments.slice(0, index + 1).join('/')
      // Format label: convert kebab-case to Title Case
      const label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
      return { label, href }
    }),
  ]

  return (
    <nav aria-label="Breadcrumb" className="mb-4 sm:mb-6">
      <ol className="flex items-center space-x-2 text-sm text-gray-600 flex-wrap">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1
          const Icon = crumb.icon

          return (
            <li key={crumb.href} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="w-4 h-4 mx-2 text-gray-400" aria-hidden="true" />
              )}
              {isLast ? (
                <span className="text-gray-900 font-medium" aria-current="page">
                  {Icon ? <Icon className="w-4 h-4 inline mr-1" /> : null}
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="hover:text-gray-900 transition-colors flex items-center"
                >
                  {Icon ? <Icon className="w-4 h-4 mr-1" /> : null}
                  {crumb.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

