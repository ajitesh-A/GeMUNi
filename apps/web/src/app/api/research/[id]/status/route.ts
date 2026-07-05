import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const AI_ENGINE_URL = process.env.AI_ENGINE_URL || ''
const FIVE_MIN = 5 * 60 * 1000

export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const report = await prisma.report.findUnique({
      where: { id: params.id },
      select: { status: true, createdAt: true },
    })

    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 })
    }

    if (report.status !== 'generating') {
      return NextResponse.json({
        status: report.status,
        progress: report.status === 'completed' ? 100 : 0,
      })
    }

    if (Date.now() - new Date(report.createdAt).getTime() > FIVE_MIN) {
      await prisma.report.update({
        where: { id: params.id },
        data: { status: 'failed' },
      })
      return NextResponse.json({ status: 'failed', progress: 0 })
    }

    if (AI_ENGINE_URL) {
      try {
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 5000)

        const res = await fetch(
          `${AI_ENGINE_URL}/api/v1/generate/${params.id}/result`,
          { signal: controller.signal },
        )
        clearTimeout(timeout)

        if (res.ok) {
          const data = await res.json()
          if (data.sections && data.sections.length > 0) {
            for (const section of data.sections) {
              await prisma.reportSection.create({
                data: {
                  reportId: params.id,
                  sectionType: section.section_type,
                  content: JSON.stringify(section.content),
                  orderIndex: section.order_index,
                },
              })
            }
            await prisma.report.update({
              where: { id: params.id },
              data: { status: 'completed' },
            })
            return NextResponse.json({ status: 'completed', progress: 100 })
          }
        }
      } catch {
        // AI engine poll failed — continue showing generating
      }
    }

    return NextResponse.json({ status: 'generating', progress: 50 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
