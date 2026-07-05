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
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 30000)

        const aiRes = await fetch(`${AI_ENGINE_URL}/api/v1/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ report_id, message }),
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

    const response = `Regarding **${report.country}** and **${report.agenda}** in **${report.committee}**:

Based on the available research, here's what I can tell you about "${message}":

The research report covers this topic. For the most accurate and cited information, please refer to the generated report sections above.`

    return NextResponse.json({ response, citations: [] })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
