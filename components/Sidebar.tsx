'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { ChevronRight, ChevronDown, FileText, Folder, FolderOpen } from 'lucide-react'

interface TreeNode {
  name: string
  path: string
  type: 'file' | 'directory'
  children?: TreeNode[]
}

const contentTree: TreeNode[] = [
  {
    name: 'Home',
    path: '/',
    type: 'file',
  },
  {
    name: '00. Principles',
    path: '/00-principles',
    type: 'directory',
  },
  {
    name: '10. Developer Contracts',
    path: '/10-developer-contracts',
    type: 'directory',
  },
  {
    name: '20. Workflows',
    path: '/20-workflows',
    type: 'directory',
  },
  {
    name: '30. Tooling',
    path: '/30-tooling',
    type: 'directory',
    children: [
      {
        name: 'Database Notes',
        path: '/30-tooling/database',
        type: 'file',
      },
    ],
  },
  {
    name: '40. Reference',
    path: '/40-reference',
    type: 'directory',
  },
  {
    name: 'Domains',
    path: '/domains',
    type: 'directory',
    children: [
      {
        name: 'API Integration',
        path: '/domains/api-integration',
        type: 'directory',
        children: [
          {
            name: 'Overview',
            path: '/domains/api-integration',
            type: 'file',
          },
          {
            name: 'Java + React Patterns',
            path: '/domains/api-integration/java-react-patterns',
            type: 'file',
          },
        ],
      },
      {
        name: 'Integration Services',
        path: '/domains/integration-services',
        type: 'directory',
        children: [
          {
            name: 'Email Services',
            path: '/domains/integration-services/implementation/email-services',
            type: 'file',
          },
          {
            name: 'Payment Services',
            path: '/domains/integration-services/implementation/payment-services',
            type: 'file',
          },
          {
            name: 'CI/CD Tools',
            path: '/domains/integration-services/implementation/ci-cd-tools',
            type: 'file',
          },
          {
            name: 'Capabilities Matrix',
            path: '/domains/integration-services/implementation/capabilities-matrix',
            type: 'file',
          },
        ],
      },
      {
        name: 'Security',
        path: '/domains/security',
        type: 'directory',
        children: [
          {
            name: 'Overview',
            path: '/domains/security',
            type: 'file',
          },
          {
            name: 'Architecture',
            path: '/domains/security/architecture/overview',
            type: 'file',
          },
          {
            name: 'Security Procedures',
            path: '/domains/security/implementation/security-procedures',
            type: 'file',
          },
          {
            name: 'Product Security',
            path: '/domains/security/implementation/product-security',
            type: 'file',
          },
          {
            name: 'Security Endpoints',
            path: '/domains/security/api/security-endpoints',
            type: 'file',
          },
        ],
      },
      {
        name: 'Platform Engineering',
        path: '/domains/platform-engineering',
        type: 'directory',
        children: [
          {
            name: 'Overview',
            path: '/domains/platform-engineering',
            type: 'file',
          },
          {
            name: 'Deployment Strategy',
            path: '/domains/platform-engineering/implementation/deployment-strategy',
            type: 'file',
          },
        ],
      },
    ],
  },
]

function TreeNodeComponent({ 
  node, 
  level = 0, 
  expandedPaths, 
  toggleExpand,
  currentPath,
  onLinkClick
}: { 
  node: TreeNode
  level: number
  expandedPaths: Set<string>
  toggleExpand: (path: string) => void
  currentPath: string
  onLinkClick?: () => void
}) {
  const isExpanded = expandedPaths.has(node.path)
  const isActive = currentPath === node.path
  const hasChildren = node.children && node.children.length > 0
  const indent = level * 16

  return (
    <div>
      <div
        className={`flex items-center py-1.5 px-2 rounded-md hover:bg-gray-100 transition-colors ${
          isActive ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
        }`}
        style={{ paddingLeft: `${indent + 8}px` }}
      >
        {hasChildren ? (
          <button
            onClick={() => toggleExpand(node.path)}
            className="mr-1.5 flex items-center justify-center w-4 h-4 hover:bg-gray-200 rounded"
          >
            {isExpanded ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronRight className="w-3 h-3" />
            )}
          </button>
        ) : (
          <span className="w-4 h-4 mr-1.5" />
        )}
        
        {hasChildren ? (
          isExpanded ? (
            <FolderOpen className="w-4 h-4 mr-1.5 text-gray-500" />
          ) : (
            <Folder className="w-4 h-4 mr-1.5 text-gray-500" />
          )
        ) : (
          <FileText className="w-4 h-4 mr-1.5 text-gray-400" />
        )}
        
        <Link
          href={node.path}
          onClick={onLinkClick}
          className="flex-1 text-sm hover:text-blue-600 transition-colors truncate"
        >
          {node.name}
        </Link>
      </div>
      
      {hasChildren && isExpanded && (
        <div>
            {node.children!.map((child) => (
            <TreeNodeComponent
              key={child.path}
              node={child}
              level={level + 1}
              expandedPaths={expandedPaths}
              toggleExpand={toggleExpand}
              currentPath={currentPath}
              onLinkClick={onLinkClick}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function Sidebar() {
  const pathname = usePathname()
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set())
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  // Auto-expand paths that contain the current path
  useEffect(() => {
    const pathsToExpand = new Set<string>()
    
    // Find all parent paths of current path
    const pathParts = pathname.split('/').filter(Boolean)
    for (let i = 1; i <= pathParts.length; i++) {
      const parentPath = '/' + pathParts.slice(0, i).join('/')
      pathsToExpand.add(parentPath)
    }
    
    // Also expand /domains by default
    if (pathname.startsWith('/domains')) {
      pathsToExpand.add('/domains')
    }
    
    setExpandedPaths(pathsToExpand)
  }, [pathname])

  const toggleExpand = (path: string) => {
    setExpandedPaths((prev) => {
      const next = new Set(prev)
      if (next.has(path)) {
        next.delete(path)
      } else {
        next.add(path)
      }
      return next
    })
  }

  return (
    <>
      {/* Mobile toggle button - removed, using navigation menu instead */}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] 
          w-64 bg-white border-r border-gray-200 
          overflow-y-auto z-30
          transition-transform duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          shadow-lg lg:shadow-none
        `}
      >
        <div className="p-3 sm:p-4">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Navigation
          </h2>
          <nav className="space-y-1">
            {contentTree.map((node) => (
              <TreeNodeComponent
                key={node.path}
                node={node}
                level={0}
                expandedPaths={expandedPaths}
                toggleExpand={toggleExpand}
                currentPath={pathname}
                onLinkClick={() => {
                  // Close sidebar on mobile when link is clicked
                  if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                    setIsMobileOpen(false)
                  }
                }}
              />
            ))}
          </nav>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setIsMobileOpen(false)}
          aria-label="Close sidebar"
        />
      )}
    </>
  )
}

