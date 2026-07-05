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
