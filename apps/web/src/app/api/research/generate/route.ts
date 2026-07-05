import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const generateSchema = z.object({
  country: z.string().min(1),
  committee: z.string().min(1),
  agenda: z.string().min(1),
})

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

    // TODO: Queue AI engine job (Phase 4)
    // For now, simulate a delay and generate a mock report
    simulateGeneration(report.id)

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

async function simulateGeneration(reportId: string) {
  // Simulates AI generation pipeline
  // Phase 4 will replace this with real AI engine calls
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
