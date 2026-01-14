import { NextRequest, NextResponse } from 'next/server'

// Make this route dynamic to avoid build-time Prisma initialization
export const dynamic = 'force-dynamic'
import { Client } from '@notionhq/client'

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
})

export async function GET(request: NextRequest) {
  // Dev Hub is read-only - public access
  if (!process.env.NOTION_DATABASE_ID) {
    return NextResponse.json(
      { error: 'NOTION_DATABASE_ID not configured' },
      { status: 500 }
    )
  }

  if (!process.env.NOTION_API_KEY) {
    return NextResponse.json(
      { error: 'NOTION_API_KEY not configured' },
      { status: 500 }
    )
  }

  try {
    let allPages: any[] = []
    let cursor: string | undefined = undefined

    do {
      const response = await notion.databases.query({
        database_id: process.env.NOTION_DATABASE_ID!,
        start_cursor: cursor,
        page_size: 100,
      })

      allPages = [...allPages, ...response.results]
      cursor = response.next_cursor || undefined
    } while (cursor)

    // Format pages for UI
    const formattedPages = allPages.map((page: any) => {
      const props = page.properties || {}
      return {
        id: page.id,
        title:
          props.Title?.title?.[0]?.plain_text ||
          props.Name?.title?.[0]?.plain_text ||
          'Untitled',
        slug: props.Slug?.rich_text?.[0]?.plain_text,
        category:
          props.Category?.select?.name ||
          props.Type?.select?.name ||
          props.category?.select?.name,
        url: page.url,
        lastEdited: page.last_edited_time,
        created: page.created_time,
      }
    })

    return NextResponse.json({ pages: formattedPages })
  } catch (error) {
    console.error('Error fetching Notion pages:', error)
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Unknown error',
        details: error,
      },
      { status: 500 }
    )
  }
}

