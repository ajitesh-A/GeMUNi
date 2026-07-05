'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { DemoTour } from '@/components/landing/demo-tour'

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}

const stagger = {
  animate: {
    transition: { staggerChildren: 0.1 },
  },
}

export default function LandingPage() {
  const [showDemo, setShowDemo] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <motion.section
        className="mx-auto mt-20 max-w-7xl px-6 text-center"
        initial="initial"
        animate="animate"
        variants={stagger}
      >
        <motion.h1
          variants={fadeUp}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto max-w-4xl text-5xl font-bold leading-tight text-accent md:text-6xl"
        >
          AI Research Assistant for{' '}
          <span className="text-primary">Model United Nations</span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-muted"
        >
          Gather verified research from trusted international organizations with
          AI-generated summaries and citations for every point.
        </motion.p>

        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex items-center justify-center gap-4"
        >
          <Link
            href="/research/new"
            className="rounded-lg bg-accent px-8 py-3 text-base font-semibold text-white hover:bg-accent-700"
          >
            Start Research
          </Link>
          <button
            onClick={() => setShowDemo(true)}
            className="rounded-lg border border-border bg-card px-8 py-3 text-base font-semibold text-accent hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            View Demo
          </button>
        </motion.div>
      </motion.section>

      <motion.section
        className="mx-auto mt-32 max-w-7xl px-6"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: '-100px' }}
        variants={stagger}
      >
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
            <motion.div
              key={f.title}
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="rounded-xl border border-border bg-card p-8"
            >
              <h3 className="text-lg font-semibold text-accent">{f.title}</h3>
              <p className="mt-2 text-sm text-muted">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {showDemo && <DemoTour onClose={() => setShowDemo(false)} />}

      <motion.section
        className="mx-auto mt-32 max-w-7xl px-6 pb-32"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={fadeUp}
        transition={{ duration: 0.6 }}
      >
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
      </motion.section>

      <footer className="border-t border-border py-8 text-center text-sm text-muted">
        <p>&copy; {new Date().getFullYear()} GeMUNi. All rights reserved.</p>
      </footer>
    </div>
  )
}
