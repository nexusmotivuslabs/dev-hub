import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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

// GET: Fetch active pages
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const token = authHeader.substring(7)
  const { verifyToken } = await import('@/lib/auth')
  const decoded = verifyToken(token)

  if (!decoded || decoded.role !== 'admin') {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

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

// POST: Add/update active pages
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const token = authHeader.substring(7)
  const { verifyToken } = await import('@/lib/auth')
  const decoded = verifyToken(token)

  if (!decoded || decoded.role !== 'admin') {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { pages } = body

    if (!Array.isArray(pages)) {
      return NextResponse.json(
        { error: 'Pages must be an array' },
        { status: 400 }
      )
    }

    // Process pages in transaction
    await prisma.$transaction(async (tx) => {
      for (const page of pages) {
        const existing = await tx.activePage.findUnique({
          where: { notionId: page.id },
        })

        if (existing) {
          // Update existing
          await tx.activePage.update({
            where: { notionId: page.id },
            data: {
              title: page.title,
              slug: page.slug,
              category: page.category,
              notionUrl: page.notionUrl,
              active: page.active ?? true,
              lastSynced: page.active ? new Date() : existing.lastSynced,
            },
          })
        } else {
          // Create new
          await tx.activePage.create({
            data: {
              notionId: page.id,
              title: page.title,
              slug: page.slug,
              category: page.category,
              notionUrl: page.notionUrl,
              active: page.active ?? true,
            },
          })
        }
      }

      // Mark pages as inactive if they're not in the list
      const selectedIds = new Set(pages.map((p: ActivePage) => p.id))
      await tx.activePage.updateMany({
        where: {
          notionId: {
            notIn: Array.from(selectedIds),
          },
        },
        data: {
          active: false,
        },
      })
    })

    // Fetch updated pages
    const updatedPages = await prisma.activePage.findMany({
      orderBy: { selectedAt: 'desc' },
    })

    const formattedPages: ActivePage[] = updatedPages.map((page) => ({
      id: page.notionId,
      title: page.title,
      slug: page.slug ?? undefined,
      category: page.category ?? undefined,
      notionUrl: page.notionUrl ?? undefined,
      selectedAt: page.selectedAt.toISOString(),
      lastSynced: page.lastSynced?.toISOString(),
      active: page.active,
    }))

    return NextResponse.json({
      success: true,
      data: {
        pages: formattedPages,
        lastUpdated: new Date().toISOString(),
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// DELETE: Remove pages
export async function DELETE(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const token = authHeader.substring(7)
  const { verifyToken } = await import('@/lib/auth')
  const decoded = verifyToken(token)

  if (!decoded || decoded.role !== 'admin') {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const pageIds = searchParams.get('ids')?.split(',') || []

    if (pageIds.length === 0) {
      return NextResponse.json(
        { error: 'No page IDs provided' },
        { status: 400 }
      )
    }

    await prisma.activePage.deleteMany({
      where: {
        notionId: {
          in: pageIds,
        },
      },
    })

    const remainingPages = await prisma.activePage.findMany({
      orderBy: { selectedAt: 'desc' },
    })

    const formattedPages: ActivePage[] = remainingPages.map((page) => ({
      id: page.notionId,
      title: page.title,
      slug: page.slug ?? undefined,
      category: page.category ?? undefined,
      notionUrl: page.notionUrl ?? undefined,
      selectedAt: page.selectedAt.toISOString(),
      lastSynced: page.lastSynced?.toISOString(),
      active: page.active,
    }))

    return NextResponse.json({
      success: true,
      data: {
        pages: formattedPages,
        lastUpdated: new Date().toISOString(),
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
