'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ImagesSection } from './images-section'
import { ChatPanel } from '@/components/chat/chat-panel'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

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

function ChatIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

export function ReportView({
  reportId,
  country,
  committee,
  agenda,
  sections,
}: ReportViewProps) {
  const [chatOpen, setChatOpen] = useState(false)
  const sorted = [...sections].sort((a, b) => a.order_index - b.order_index)

  return (
    <div className="mx-auto max-w-6xl">
      <Link
        href="/dashboard"
        className="mb-6 flex items-center gap-1 text-sm text-muted hover:text-accent dark:hover:text-foreground transition-colors"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Dashboard
      </Link>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <article className="lg:col-span-2">
          <header className="mb-12 border-b border-border pb-8">
            <div className="mb-4 flex items-center gap-3">
              <Badge variant="primary">Research Report</Badge>
              <Badge>{committee}</Badge>
            </div>
            <h1 className="text-3xl font-bold text-accent dark:text-foreground">{country}</h1>
            <p className="mt-2 text-lg text-muted">{agenda}</p>
          </header>

          <div className="space-y-10">
            {sorted.map((section, idx) => {
              if (section.section_type === 'images') {
                return <ImagesSection key="images" country={country} />
              }

              return (
                <section key={section.section_type}>
                  <h2 className="mb-4 text-xl font-semibold text-accent dark:text-foreground">
                    {idx + 1}. {SECTION_LABELS[section.section_type] || section.section_type}
                  </h2>
                  <Separator className="mb-4" />
                  <div className="prose prose-sm max-w-none text-muted">
                    {typeof section.content.text === 'string' ? (
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{section.content.text}</ReactMarkdown>
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

        <aside className="hidden lg:block lg:col-span-1">
          <div className="sticky top-24">
            <ChatPanel reportId={reportId} />
          </div>
        </aside>
      </div>

      <button
        onClick={() => setChatOpen(!chatOpen)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-lg hover:bg-accent-600 transition-colors lg:hidden"
        aria-label={chatOpen ? 'Close chat' : 'Open chat'}
      >
        {chatOpen ? <CloseIcon /> : <ChatIcon />}
      </button>

      {chatOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setChatOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 max-h-[80vh] animate-slide-up overflow-auto rounded-t-2xl bg-background p-4">
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border" />
            <ChatPanel reportId={reportId} />
          </div>
        </div>
      )}
    </div>
  )
}
