'use client'

import { useState, useMemo } from 'react'
import { COUNTRIES } from '@gemuni/shared'

interface CountrySelectProps {
  value: string
  onChange: (country: string) => void
}

export function CountrySelect({ value, onChange }: CountrySelectProps) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)

  const filtered = useMemo(
    () =>
      COUNTRIES.filter((c) =>
        c.toLowerCase().includes(query.toLowerCase()),
      ),
    [query],
  )

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-accent mb-2">
        Select Country
      </label>
      <input
        type="text"
        placeholder="Search for a country..."
        value={open ? query : value || query}
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
              No countries found
            </div>
          ) : (
            filtered.map((country) => (
              <button
                key={country}
                type="button"
                onClick={() => {
                  onChange(country)
                  setQuery(country)
                  setOpen(false)
                }}
                className={`w-full px-4 py-2.5 text-left text-sm hover:bg-primary-50 ${
                  value === country ? 'bg-primary-50 font-medium text-primary-700' : 'text-accent'
                }`}
              >
                {country}
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
