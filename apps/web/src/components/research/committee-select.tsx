'use client'

import { COMMITTEES } from '@gemuni/shared'

interface CommitteeSelectProps {
  value: string
  onChange: (committee: string) => void
}

export function CommitteeSelect({ value, onChange }: CommitteeSelectProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-accent mb-2">
        Select Committee
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-50"
      >
        <option value="" disabled>
          Choose a committee...
        </option>
        {COMMITTEES.map((c) => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        ))}
      </select>
    </div>
  )
}
