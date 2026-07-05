'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { ReportCard } from '@/components/dashboard/report-card'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface Report {
  id: string
  country: string
  committee: string
  agenda: string
  status: string
  createdAt: string
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [reports, setReports] = useState<Report[]>([])
  const [tab, setTab] = useState<'recent' | 'saved'>('recent')
  const [loading, setLoading] = useState(true)

  async function fetchReports(saved = false) {
    setLoading(true)
    try {
      const res = await fetch(`/api/reports?saved=${saved}&limit=50`)
      const data = await res.json()
      setReports(data.reports || [])
    } catch {
      setReports([])
    }
    setLoading(false)
  }

  useEffect(() => {
    if (!session) return
    fetchReports(tab === 'saved')
  }, [session, tab])

  async function handleDelete(id: string) {
    try {
      await fetch(`/api/reports/${id}`, { method: 'DELETE' })
      setReports((prev) => prev.filter((r) => r.id !== id))
    } catch {}
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-accent">Dashboard</h1>
          <p className="mt-1 text-muted">
            Welcome back{session?.user?.name ? `, ${session.user.name}` : ''}
          </p>
        </div>
        <Link href="/research/new">
          <Button variant="primary" size="lg">
            New Research
          </Button>
        </Link>
      </div>

      <div className="mb-6 flex gap-4 border-b border-gray-100">
        <button
          onClick={() => setTab('recent')}
          className={`pb-3 text-sm font-medium ${
            tab === 'recent'
              ? 'border-b-2 border-accent text-accent'
              : 'text-muted hover:text-accent'
          }`}
        >
          Recent Reports
        </button>
        <button
          onClick={() => setTab('saved')}
          className={`pb-3 text-sm font-medium ${
            tab === 'saved'
              ? 'border-b-2 border-accent text-accent'
              : 'text-muted hover:text-accent'
          }`}
        >
          Saved
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : reports.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 py-20 text-center">
          <p className="text-muted">
            {tab === 'recent'
              ? 'No research reports yet. Start your first one!'
              : 'No saved reports.'}
          </p>
          <Link href="/research/new">
            <Button variant="primary" className="mt-4">
              Generate Research
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {reports.map((report) => (
            <ReportCard
              key={report.id}
              {...report}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}
