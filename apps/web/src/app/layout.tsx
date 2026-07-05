import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'GeMUNi.ai - AI Research Assistant for Model United Nations',
  description:
    'Gather verified research from trusted international organizations with AI-generated summaries and citations for every point.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
