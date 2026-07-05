import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const report = await prisma.report.findUnique({
      where: { id: params.id },
      include: {
        sections: { orderBy: { orderIndex: 'asc' } },
      },
    })

    if (!report) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const markdown = generateMarkdown(report)
    const safeName = report.country.replace(/\s+/g, '_').toLowerCase()

    return new NextResponse(markdown, {
      headers: {
        'Content-Type': 'text/markdown',
        'Content-Disposition': `attachment; filename="${safeName}_research.md"`,
      },
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function generateMarkdown(report: any): string {
  const lines: string[] = []

  lines.push(`# ${report.country} - Research Report`)
  lines.push(`**Committee:** ${report.committee}`)
  lines.push(`**Agenda:** ${report.agenda}`)
  lines.push(`**Generated:** ${new Date(report.createdAt).toLocaleDateString()}`)
  lines.push('')
  lines.push('---')
  lines.push('')

  for (const section of report.sections) {
    const title = section.sectionType.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())
    lines.push(`## ${title}`)
    lines.push('')

    if (typeof section.content.text === 'string') {
      lines.push(section.content.text)
    } else if (section.content.sources) {
      for (const source of section.content.sources) {
        lines.push(`- [${source.title}](${source.url})`)
      }
    }
    lines.push('')
    lines.push('---')
    lines.push('')
  }

  return lines.join('\n')
}
