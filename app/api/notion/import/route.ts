import { NextRequest, NextResponse } from 'next/server'

// Make this route dynamic to avoid build-time Prisma initialization
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  // Dev Hub is read-only - content import disabled
  return NextResponse.json(
    { error: 'Dev Hub is read-only. Content import is not available.' },
    { status: 403 }
  )
}
