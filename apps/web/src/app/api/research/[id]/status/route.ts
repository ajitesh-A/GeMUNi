import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const report = await prisma.report.findUnique({
      where: { id: params.id },
      select: { status: true },
    })

    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 })
    }

    const progress = report.status === 'completed'
      ? 100
      : report.status === 'failed'
        ? 0
        : 50

    return NextResponse.json({
      status: report.status,
      progress,
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
