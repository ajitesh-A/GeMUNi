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

    // Try to call the AI engine, fall back to simulation if unavailable
    callAiEngine(report.id, country, committee, agenda).catch(() => {
      simulateGeneration(report.id)
    })

    return NextResponse.json(
      { report_id: report.id, status: 'generating' },
      { status: 201 },
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function callAiEngine(
  reportId: string,
  country: string,
  committee: string,
  agenda: string,
) {
  if (!AI_ENGINE_URL) throw new Error('AI engine URL not configured')

  const res = await fetch(`${AI_ENGINE_URL}/api/v1/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ report_id: reportId, country, committee, agenda }),
  })

  if (!res.ok) throw new Error('AI engine request failed')

  const data = await res.json()

  await prisma.report.update({
    where: { id: reportId },
    data: { status: data.status },
  })
}

async function simulateGeneration(reportId: string) {
  const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

  await delay(2000)

  await prisma.report.update({
    where: { id: reportId },
    data: { status: 'completed' },
  })

  const sections = [
    { sectionType: 'executive_summary', content: { text: 'Executive summary content...' }, orderIndex: 0 },
    { sectionType: 'country_profile', content: { text: 'Country profile content...' }, orderIndex: 1 },
    { sectionType: 'agenda_background', content: { text: 'Agenda background content...' }, orderIndex: 2 },
    { sectionType: 'current_situation', content: { text: 'Current situation content...' }, orderIndex: 3 },
    { sectionType: 'country_position', content: { text: 'Country position content...' }, orderIndex: 4 },
    { sectionType: 'un_resolutions', content: { text: 'UN resolutions content...' }, orderIndex: 5 },
    { sectionType: 'bloc_positions', content: { text: 'Bloc positions content...' }, orderIndex: 6 },
    { sectionType: 'speaking_points', content: { text: 'Speaking points content...' }, orderIndex: 7 },
    { sectionType: 'sources', content: { text: 'Sources content...' }, orderIndex: 8 },
  ]

  for (const section of sections) {
    await prisma.reportSection.create({
      data: {
        reportId,
        sectionType: section.sectionType,
        content: section.content,
        orderIndex: section.orderIndex,
      },
    })
    await delay(500)
  }
}
