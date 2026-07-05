'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { CountrySelect } from './country-select'
import { CommitteeSelect } from './committee-select'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

const STEPS = ['Country', 'Committee', 'Agenda']

const PROGRESS_STAGES = [
  { label: 'Searching UN documents', done: false },
  { label: 'Searching NGO reports', done: false },
  { label: 'Reading WHO reports', done: false },
  { label: 'Reading UNICEF reports', done: false },
  { label: 'Reading Amnesty International', done: false },
  { label: 'Reading Human Rights Watch', done: false },
  { label: 'Generating summaries', done: false },
  { label: 'Assembling report', done: false },
]

export function ResearchForm() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [country, setCountry] = useState('')
  const [committee, setCommittee] = useState('')
  const [agenda, setAgenda] = useState('')
  const [generating, setGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [stages, setStages] = useState(PROGRESS_STAGES)

  async function handleGenerate() {
    setGenerating(true)
    setProgress(5)

    try {
      const res = await fetch('/api/research/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country, committee, agenda }),
      })

      if (!res.ok) throw new Error('Failed to start generation')

      const { report_id } = await res.json()

      let attempts = 0
      const interval = setInterval(async () => {
        try {
          attempts++
          if (attempts > 30) {
            clearInterval(interval)
            setGenerating(false)
            return
          }

          const statusRes = await fetch(`/api/research/${report_id}/status`)
          const data = await statusRes.json()

          setProgress(data.progress || 0)

          const completedStages = Math.floor((data.progress || 0) / (100 / PROGRESS_STAGES.length))
          setStages((prev) =>
            prev.map((s, i) => ({ ...s, done: i < completedStages })),
          )

          if (data.status === 'completed') {
            clearInterval(interval)
            router.push(`/research/${report_id}`)
          } else if (data.status === 'failed') {
            clearInterval(interval)
            setGenerating(false)
          }
        } catch {
          // polling error, retry on next interval
        }
      }, 1500)
    } catch {
      setGenerating(false)
    }
  }

  if (generating) {
    return (
      <div className="mx-auto max-w-lg text-center">
        <div className="mb-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-50">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
          <h2 className="text-xl font-semibold text-accent">
            Gathering Research
          </h2>
          <p className="mt-1 text-sm text-muted">
            {country} · {committee}
          </p>
        </div>

        <Progress value={progress} className="mb-8" />

        <div className="space-y-2 text-left">
          {stages.map((stage, i) => (
            <div
              key={stage.label}
              className={`flex items-center gap-3 rounded-lg px-4 py-2 text-sm ${
                stage.done ? 'text-green-600' : i === stages.findIndex((s) => !s.done) ? 'text-accent' : 'text-muted'
              }`}
            >
              <span className="flex h-5 w-5 items-center justify-center">
                {stage.done ? (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="h-2 w-2 rounded-full bg-current" />
                )}
              </span>
              {stage.label}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-8 flex items-center justify-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                i <= step
                  ? 'bg-accent text-white'
                  : 'bg-gray-100 text-muted'
              }`}
            >
              {i + 1}
            </div>
            <span
              className={`text-sm ${i <= step ? 'font-medium text-accent' : 'text-muted'}`}
            >
              {s}
            </span>
            {i < STEPS.length - 1 && (
              <div
                className={`mx-2 h-px w-8 ${
                  i < step ? 'bg-accent' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {step === 0 && (
        <CountrySelect value={country} onChange={setCountry} />
      )}

      {step === 1 && (
        <CommitteeSelect value={committee} onChange={setCommittee} />
      )}

      {step === 2 && (
        <div>
          <label className="block text-sm font-medium text-accent mb-2">
            Enter Agenda
          </label>
          <textarea
            value={agenda}
            onChange={(e) => setAgenda(e.target.value)}
            placeholder="e.g., Addressing the global impact of food insecurity caused by climate change."
            rows={5}
            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-50 resize-none"
          />
        </div>
      )}

      <div className="mt-8 flex justify-between">
        {step > 0 && (
          <Button variant="outline" onClick={() => setStep(step - 1)}>
            Back
          </Button>
        )}
        <div className="flex-1" />
        {step < STEPS.length - 1 ? (
          <Button
            onClick={() => setStep(step + 1)}
            disabled={
              (step === 0 && !country) ||
              (step === 1 && !committee)
            }
          >
            Next
          </Button>
        ) : (
          <Button onClick={handleGenerate} disabled={!agenda}>
            Generate Research
          </Button>
        )}
      </div>
    </div>
  )
}
