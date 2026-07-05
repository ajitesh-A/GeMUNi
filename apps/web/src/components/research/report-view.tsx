'use client'

import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ImagesSection } from './images-section'
import { ChatPanel } from '@/components/chat/chat-panel'

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
  reportId: string
  country: string
  committee: string
  agenda: string
  sections: Section[]
}

export function ReportView({
  reportId,
  country,
  committee,
  agenda,
  sections,
}: ReportViewProps) {
  const sorted = [...sections].sort((a, b) => a.order_index - b.order_index)

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-3">
      <article className="lg:col-span-2">
        <header className="mb-12 border-b border-gray-100 pb-8">
          <div className="mb-4 flex items-center gap-3">
            <Badge variant="primary">Research Report</Badge>
            <Badge>{committee}</Badge>
          </div>
          <h1 className="text-3xl font-bold text-accent">{country}</h1>
          <p className="mt-2 text-lg text-muted">{agenda}</p>
        </header>

        <div className="space-y-10">
          {sorted.map((section, idx) => {
            if (section.section_type === 'images') {
              return <ImagesSection key="images" country={country} />
            }

            return (
              <section key={section.section_type}>
                <h2 className="mb-4 text-xl font-semibold text-accent">
                  {idx + 1}. {SECTION_LABELS[section.section_type] || section.section_type}
                </h2>
                <Separator className="mb-4" />
                <div className="prose prose-sm max-w-none text-muted">
                  {typeof section.content.text === 'string' ? (
                    <p>{section.content.text}</p>
                  ) : section.content.sources ? (
                    <ul className="space-y-2">
                      {(section.content.sources as Array<{ url: string; title: string }>).map(
                        (source: { url: string; title: string }, i: number) => (
                          <li key={i}>
                            <a
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              {source.title || source.url}
                            </a>
                          </li>
                        ),
                      )}
                    </ul>
                  ) : (
                    <p>Content loading...</p>
                  )}
                </div>
              </section>
            )
          })}
        </div>
      </article>

      <aside className="lg:col-span-1">
        <div className="sticky top-24">
          <ChatPanel reportId={reportId} />
        </div>
      </aside>
    </div>
  )
}
