import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-gray-100">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold text-accent">
            GeMUNi.ai
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/auth/login" className="text-sm text-muted hover:text-accent">
              Sign In
            </Link>
            <Link
              href="/auth/register"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-600"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="mx-auto mt-20 max-w-7xl px-6 text-center">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-1.5 text-sm text-primary-700">
            <span className="h-2 w-2 rounded-full bg-primary" />
            AI-Powered MUN Research
          </div>
          <h1 className="mx-auto max-w-4xl text-5xl font-bold leading-tight text-accent md:text-6xl">
            AI Research Assistant for{' '}
            <span className="text-primary">Model United Nations</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
            Gather verified research from trusted international organizations with
            AI-generated summaries and citations for every point.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/research/new"
              className="rounded-lg bg-accent px-8 py-3 text-base font-semibold text-white hover:bg-accent-700"
            >
              Start Research
            </Link>
            <Link
              href="#features"
              className="rounded-lg border border-gray-200 bg-white px-8 py-3 text-base font-semibold text-accent hover:bg-gray-50"
            >
              View Demo
            </Link>
          </div>
        </section>

        <section id="features" className="mx-auto mt-32 max-w-7xl px-6">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: 'Verified Sources',
                desc: 'Access data from UN, WHO, Amnesty International, HRW, and 50+ trusted organizations.',
              },
              {
                title: 'AI Summaries',
                desc: 'Every paragraph includes clickable citations back to the original source.',
              },
              {
                title: 'Committee-Specific',
                desc: 'Reports tailored to your country, committee, and agenda — ready for position papers.',
              },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-gray-100 bg-white p-8"
              >
                <h3 className="text-lg font-semibold text-accent">{f.title}</h3>
                <p className="mt-2 text-sm text-muted">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-32 max-w-7xl px-6 pb-32">
          <div className="rounded-2xl bg-accent px-12 py-16 text-center text-white">
            <h2 className="text-3xl font-bold">
              Ready to research like a diplomat?
            </h2>
            <p className="mt-4 text-white/70">
              Generate your first report in under 30 seconds. Free to start.
            </p>
            <Link
              href="/research/new"
              className="mt-8 inline-block rounded-lg bg-primary px-8 py-3 font-semibold text-white hover:bg-primary-600"
            >
              Start Research Now
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-100 py-8 text-center text-sm text-muted">
        <p>&copy; {new Date().getFullYear()} GeMUNi.ai. All rights reserved.</p>
      </footer>
    </div>
  )
}
