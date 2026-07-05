import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { ReportView } from '@/components/research/report-view'

export default async function ReportPage({
  params,
}: {
  params: { id: string }
}) {
  const report = await prisma.report.findUnique({
    where: { id: params.id },
    include: { sections: true },
  })

  if (!report) {
    notFound()
  }

  if (report.status !== 'completed') {
    return (
      <div className="mx-auto max-w-4xl px-6 py-16 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-50">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
        <h1 className="text-xl font-semibold text-accent">Report is being generated...</h1>
        <p className="mt-2 text-sm text-muted">
          Please wait, this page will refresh automatically.
        </p>
        <meta httpEquiv="refresh" content="3" />
      </div>
    )
  }

  return (
    <div className="px-6 py-16">
      <ReportView
        country={report.country}
        committee={report.committee}
        agenda={report.agenda}
        sections={report.sections.map((s) => ({
          section_type: s.sectionType,
          content: s.content as Record<string, unknown>,
          order_index: s.orderIndex,
        }))}
      />
    </div>
  )
}
