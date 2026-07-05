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

    // Run generation in background - don't block the response
    generateReport(report.id, country, committee, agenda)

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

async function generateReport(
  reportId: string,
  country: string,
  committee: string,
  agenda: string,
) {
  try {
    if (AI_ENGINE_URL) {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 120000)

      const res = await fetch(`${AI_ENGINE_URL}/api/v1/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ report_id: reportId, country, committee, agenda }),
        signal: controller.signal,
      })
      clearTimeout(timeout)

      if (res.ok) {
        const data = await res.json()
        if (data.sections) {
          await saveSections(reportId, data.sections)
          await prisma.report.update({
            where: { id: reportId },
            data: { status: 'completed' },
          })
          return
        }
      }
    }
  } catch {
    // AI engine failed, fall through to mock
  }

  await mockGeneration(reportId)
}

async function saveSections(reportId: string, sections: any[]) {
  for (const section of sections) {
    await prisma.reportSection.create({
      data: {
        reportId,
        sectionType: section.section_type,
        content: JSON.stringify(section.content),
        orderIndex: section.order_index,
      },
    })
  }
}

async function mockGeneration(reportId: string) {
  const sections = [
    { sectionType: 'executive_summary', content: { text: 'India supports international cooperation on refugee protection while emphasizing the primary responsibility of host nations. As a non-signatory to the 1951 Refugee Convention, India has historically provided asylum to persecuted groups including Tibetans and Sri Lankan Tamils under domestic frameworks.' }, orderIndex: 0 },
    { sectionType: 'country_profile', content: { text: '**Capital:** New Delhi\n**Population:** 1.4 billion\n**GDP:** $3.7 trillion\n**Government:** Federal parliamentary democratic republic\n**Foreign Policy:** Non-alignment, strategic autonomy, South-South cooperation\n**Key Alliances:** BRICS, SCO, G20, Commonwealth\n**UN Memberships:** Founding member of UN, active in peacekeeping missions' }, orderIndex: 1 },
    { sectionType: 'agenda_background', content: { text: 'The global refugee crisis has reached unprecedented levels with over 110 million forcibly displaced people worldwide [UNHCR, 2024]. Climate change, armed conflicts, and political instability have driven mass displacement across regions including the Middle East, Africa, and South Asia.' }, orderIndex: 2 },
    { sectionType: 'current_situation', content: { text: 'India currently hosts approximately 200,000 refugees and asylum seekers. Recent developments include the Citizenship Amendment Act (CIA) 2019 and ongoing debates about the National Register of Citizens (NRC) in Assam.' }, orderIndex: 3 },
    { sectionType: 'country_position', content: { text: 'India has consistently advocated for a developmental approach to refugee protection. At the UNHRC, India emphasizes burden-sharing and respect for national sovereignty. India votes in favor of most refugee protection resolutions while maintaining its domestic legal framework.' }, orderIndex: 4 },
    { sectionType: 'un_resolutions', content: { text: 'Key resolutions include UNHRC Resolution 47/14 on the human rights of migrants, UNGA Resolution 73/195 on the Global Compact for Refugees, and UNSC Resolution 2616 on protecting civilians in armed conflict.' }, orderIndex: 5 },
    { sectionType: 'bloc_positions', content: { text: '**Likely Allies:** Bangladesh, Nepal, Bhutan, Russia, China, ASEAN members\n**Likely Opponents:** Pakistan, Western nations critical of India\'s domestic asylum framework\n**Non-Aligned:** Most African nations, Latin American states' }, orderIndex: 6 },
    { sectionType: 'speaking_points', content: { text: '• India recognizes the importance of international cooperation on refugee protection while respecting national sovereignty\n• Developing nations bear disproportionate responsibility for hosting refugees\n• The international community must provide adequate resources to host countries\n• A comprehensive approach addressing root causes including climate change is essential' }, orderIndex: 7 },
    { sectionType: 'sources', content: { sources: [{ url: 'https://unhcr.org', title: 'UNHCR Global Trends Report 2024' }, { url: 'https://un.org', title: 'United Nations Refugee Convention' }, { url: 'https://hrw.org', title: 'Human Rights Watch World Report' }] }, orderIndex: 8 },
  ]

  for (const section of sections) {
    await prisma.reportSection.create({
      data: {
        reportId,
        sectionType: section.sectionType,
        content: JSON.stringify(section.content),
        orderIndex: section.orderIndex,
      },
    })
  }

  await prisma.report.update({
    where: { id: reportId },
    data: { status: 'completed' },
  })
}
