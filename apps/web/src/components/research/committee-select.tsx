'use client'

import { useState, useMemo } from 'react'
import { COMMITTEES } from '@gemuni/shared'

interface CommitteeSelectProps {
  value: string
  onChange: (committee: string) => void
}

export function CommitteeSelect({ value, onChange }: CommitteeSelectProps) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)

  const filtered = useMemo(
    () =>
      COMMITTEES.filter((c) =>
        c.label.toLowerCase().includes(query.toLowerCase()) ||
        c.value.toLowerCase().includes(query.toLowerCase()),
      ),
    [query],
  )

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-accent mb-2">
        Select Committee
      </label>
      <input
        type="text"
        placeholder="Search for a committee..."
        value={open ? query : value ? COMMITTEES.find(c => c.value === value)?.label || value : query}
        onChange={(e) => {
          setQuery(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-50"
      />
      {open && (
        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg">
          {filtered.length === 0 ? (
            <div className="px-4 py-3 text-sm text-muted">
              No committees found
            </div>
          ) : (
            filtered.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => {
                  onChange(c.value)
                  setQuery('')
                  setOpen(false)
                }}
                className={`w-full px-4 py-2.5 text-left text-sm hover:bg-primary-50 ${
                  value === c.value ? 'bg-primary-50 font-medium text-primary-700' : 'text-accent'
                }`}
              >
                {c.label}
              </button>
            ))
          )}
        </div>
      )}
      {open && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setOpen(false)}
        />
      )}
    </div>
  )
}
