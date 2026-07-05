import { Navbar } from '@/components/layout/navbar'
import { UnBackground } from '@/components/landing/un-background'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <UnBackground />
      <Navbar />
      <main>{children}</main>
    </>
  )
}
