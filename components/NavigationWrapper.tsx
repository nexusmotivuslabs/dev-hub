'use client'

import { useState } from 'react'
import { Navigation } from './Navigation'
import { Sidebar } from './Sidebar'

export function NavigationWrapper() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      <Navigation 
        onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
      />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  )
}

