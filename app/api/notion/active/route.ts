import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Make this route dynamic to avoid build-time Prisma initialization
export const dynamic = 'force-dynamic'

interface ActivePage {
  id: string
  title: string
  slug?: string
  category?: string
  notionUrl?: string
  selectedAt: string
  lastSynced?: string
  active: boolean
}

// GET: Fetch active pages (public read access)
export async function GET(request: NextRequest) {
  try {
    const pages = await prisma.activePage.findMany({
      orderBy: { selectedAt: 'desc' },
    })

    const formattedPages: ActivePage[] = pages.map((page) => ({
      id: page.notionId,
      title: page.title,
      slug: page.slug ?? undefined,
      category: page.category ?? undefined,
      notionUrl: page.notionUrl ?? undefined,
      selectedAt: page.selectedAt.toISOString(),
      lastSynced: page.lastSynced?.toISOString(),
      active: page.active,
    }))

    const lastUpdated = pages.length > 0 && pages[0].updatedAt
      ? pages[0].updatedAt.toISOString()
      : new Date().toISOString()

    return NextResponse.json({
      pages: formattedPages,
      lastUpdated,
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// POST: Add/update active pages (disabled - read-only hub)
export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: 'Dev Hub is read-only. Content updates are not available.' },
    { status: 403 }
  )
}

// DELETE: Remove pages (disabled - read-only hub)
export async function DELETE(request: NextRequest) {
  return NextResponse.json(
    { error: 'Dev Hub is read-only. Content deletion is not available.' },
    { status: 403 }
  )
}
