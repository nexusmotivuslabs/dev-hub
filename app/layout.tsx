import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { NavigationWrapper } from '@/components/NavigationWrapper'
import { Footer } from '@/components/Footer'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { AccessibilitySkipLink } from '@/components/AccessibilitySkipLink'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Developer Hub - Nexus Technologies',
  description: 'Centralized knowledge base for Nexus development teams - Java, React, AWS, and more',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <AccessibilitySkipLink />
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <NavigationWrapper />
            <div className="flex flex-1">
              <main id="main-content" className="flex-1 w-full lg:ml-64 min-w-0" tabIndex={-1}>
                <div className="w-full px-3 sm:px-4 lg:px-6 xl:px-8 py-2 sm:py-4 lg:py-6">
                  <Breadcrumbs />
                  {children}
                </div>
              </main>
            </div>
            <Footer />
          </div>
        </ErrorBoundary>
      </body>
    </html>
  )
}


