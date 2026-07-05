'use client'

import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

const SECTION_LABELS: Record<string, string> = {
  executive_summary: 'Executive Summary',
  country_profile: 'Country Profile',
  agenda_background: 'Agenda Background',
  current_situation: 'Current Situation',
  country_position: 'Country Position',
  un_resolutions: 'UN Resolutions',
  ngo_reports: 'NGO Reports',
  statistics: 'Statistics',
  bloc_positions: 'Bloc Positions',
  speaking_points: 'Speaking Points',
  possible_solutions: 'Possible Solutions',
  questions_to_ask: 'Questions to Ask',
  images: 'Images',
  sources: 'Sources',
}

interface Section {
  section_type: string
  content: Record<string, unknown>
  order_index: number
}

interface ReportViewProps {
  country: string
  committee: string
  agenda: string
  sections: Section[]
}

export function ReportView({
  country,
  committee,
  agenda,
  sections,
}: ReportViewProps) {
  const sorted = [...sections].sort((a, b) => a.order_index - b.order_index)

  return (
    <article className="mx-auto max-w-4xl">
      <header className="mb-12 border-b border-gray-100 pb-8">
        <div className="flex items-center gap-3 mb-4">
          <Badge variant="primary">Research Report</Badge>
          <Badge>{committee}</Badge>
        </div>
        <h1 className="text-3xl font-bold text-accent">{country}</h1>
        <p className="mt-2 text-lg text-muted">{agenda}</p>
      </header>

      <div className="space-y-10">
        {sorted.map((section, idx) => (
          <section key={section.section_type}>
            <h2 className="mb-4 text-xl font-semibold text-accent">
              {idx + 1}. {SECTION_LABELS[section.section_type] || section.section_type}
            </h2>
            <Separator className="mb-4" />
            <div className="prose prose-sm max-w-none text-muted">
              {typeof section.content.text === 'string' ? (
                <p>{section.content.text}</p>
              ) : (
                <p>Content loading...</p>
              )}
            </div>
          </section>
        ))}
      </div>
    </article>
  )
}
