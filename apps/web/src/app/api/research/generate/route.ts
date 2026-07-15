import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const generateSchema = z.object({
  country: z.string().min(1),
  committee: z.string().min(1),
  agenda: z.string().min(1),
})

const AI_ENGINE_URL = process.env.AI_ENGINE_URL || ''

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { country, committee, agenda } = generateSchema.parse(body)

    const report = await prisma.report.create({
      data: {
        userId: session.user.id,
        country,
        committee,
        agenda,
        status: 'generating',
      },
    })

    if (AI_ENGINE_URL) {
      fetch(`${AI_ENGINE_URL}/api/v1/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ report_id: report.id, country, committee, agenda }),
      }).catch(e => console.error('Generate: failed to start pipeline:', e))
      pollForResult(report.id).catch(e => console.error('[Generate] poll failed:', e))
    } else {
      console.error('Generate: AI_ENGINE_URL not set')
    }

    console.log(`[Generate] Report ${report.id} created, starting pipeline`)
    return NextResponse.json(
      { report_id: report.id, status: 'generating', v: 2 },
      { status: 201 },
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function pollForResult(reportId: string) {
  if (!AI_ENGINE_URL) return
  for (let i = 0; i < 60; i++) {
    await new Promise(r => setTimeout(r, 3000))
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 5000)
      const res = await fetch(`${AI_ENGINE_URL}/api/v1/generate/${reportId}/result`, {
        signal: controller.signal,
      })
      clearTimeout(timeout)
      if (!res.ok) continue
      const data = await res.json()
      if (data.status === 'processing') continue
      if (data.sections && data.sections.length > 0) {
        for (const section of data.sections) {
          await prisma.reportSection.create({
            data: {
              reportId,
              sectionType: section.section_type,
              content: JSON.stringify(section.content),
              orderIndex: section.order_index,
            },
          })
        }
        await prisma.report.update({
          where: { id: reportId },
          data: { status: 'completed' },
        })
        console.log(`[Poll] Report ${reportId}: sections saved, completed`)
        return
      }
    } catch {
      // poll failed, retry
    }
  }
  console.error(`[Poll] Report ${reportId}: timed out after 60 attempts`)
}
