import { ResearchForm } from '@/components/research/research-form'

export default function NewResearchPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold text-accent">New Research</h1>
        <p className="mt-2 text-muted">
          Generate a comprehensive, source-backed research report
        </p>
      </div>
      <ResearchForm />
    </div>
  )
}
