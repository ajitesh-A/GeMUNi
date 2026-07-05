import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const chatSchema = z.object({
  report_id: z.string(),
  message: z.string().min(1).max(2000),
})

const AI_ENGINE_URL = process.env.AI_ENGINE_URL || ''

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { report_id, message } = chatSchema.parse(body)

    const report = await prisma.report.findUnique({
      where: { id: report_id },
      select: { id: true, userId: true, country: true, committee: true, agenda: true },
    })

    if (!report || report.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    if (AI_ENGINE_URL) {
      try {
        const sections = await prisma.reportSection.findMany({
          where: { reportId: report_id },
          orderBy: { orderIndex: 'asc' },
          select: { sectionType: true, content: true },
        })

        const context = sections.map((s) => {
          let text = ''
          try {
            const parsed = JSON.parse(s.content)
            text = parsed.text || ''
          } catch {
            text = s.content
          }
          return `[${s.sectionType.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}]\n${text}`
        }).join('\n\n')

        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 30000)

        const aiRes = await fetch(`${AI_ENGINE_URL}/api/v1/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            report_id,
            message,
            context,
            country: report.country,
            committee: report.committee,
            agenda: report.agenda,
          }),
          signal: controller.signal,
        })
        clearTimeout(timeout)

        if (aiRes.ok) {
          const data = await aiRes.json()
          return NextResponse.json(data)
        }

        const errorBody = await aiRes.text().catch(() => '')
        console.error(`Chat AI engine returned ${aiRes.status}:`, errorBody)
      } catch (e) {
        console.error('Chat AI engine fetch failed:', e)
      }
    }

    const response = `**${report.country}** · **${report.committee}** · *${report.agenda}*

Based on available research, the most accurate and cited information is in the report sections above. Refer to those for verified details on "${message}".`

    return NextResponse.json({ response, citations: [] })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
