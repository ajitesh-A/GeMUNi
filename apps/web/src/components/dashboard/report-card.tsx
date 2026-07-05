'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface ReportCardProps {
  id: string
  country: string
  committee: string
  agenda: string
  status: string
  createdAt: string
  onDelete?: (id: string) => void
}

export function ReportCard({
  id,
  country,
  committee,
  agenda,
  status,
  createdAt,
  onDelete,
}: ReportCardProps) {
  const date = new Date(createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 transition-shadow hover:shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-accent">{country}</h3>
            <Badge variant={status === 'completed' ? 'success' : 'default'}>
              {status}
            </Badge>
          </div>
          <p className="text-sm font-medium text-primary">{committee}</p>
          <p className="mt-1 text-sm text-muted line-clamp-2">{agenda}</p>
          <p className="mt-3 text-xs text-muted">{date}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <Link href={`/research/${id}`}>
          <Button variant="primary" size="sm">
            View Report
          </Button>
        </Link>
        <Link href={`/api/reports/${id}/export`}>
          <Button variant="outline" size="sm">
            Export MD
          </Button>
        </Link>
        {onDelete && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(id)}
            className="text-red-500 hover:text-red-600"
          >
            Delete
          </Button>
        )}
      </div>
    </div>
  )
}
