export type Country = (typeof import('./constants').COUNTRIES)[number]

export type Committee = (typeof import('./constants').COMMITTEES)[number]

export type ReportStatus = 'generating' | 'completed' | 'failed'

export interface ReportSection {
  id?: string
  report_id?: string
  section_type: string
  content: Record<string, unknown>
  order_index: number
}

export interface Citation {
  id?: string
  report_section_id?: string
  statement_preview: string
  url: string
  source_name: string
  accessed_at?: string
}

export interface Report {
  id: string
  user_id?: string
  country: string
  committee: string
  agenda: string
  status: ReportStatus
  created_at: string
  updated_at?: string
}

export interface GenerateResearchRequest {
  country: string
  committee: string
  agenda: string
}

export interface GenerateResearchResponse {
  report_id: string
  status: ReportStatus
}

export interface User {
  id: string
  email: string
  name?: string
  avatar_url?: string
}
