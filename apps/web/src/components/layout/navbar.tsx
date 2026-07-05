'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/ui/logo'

export function Navbar() {
  const { data: session } = useSession()

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Logo />

        <nav className="flex items-center gap-4">
          {session?.user ? (
            <>
              <Link
                href="/research/new"
                className="text-sm text-muted hover:text-accent"
              >
                New Research
              </Link>
              <Link
                href="/dashboard"
                className="text-sm text-muted hover:text-accent"
              >
                Dashboard
              </Link>
              <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
                <Avatar
                  initials={(session.user.name || session.user.email || 'U').charAt(0).toUpperCase()}
                  size="sm"
                />
                <button
                  onClick={() => signOut()}
                  className="text-xs text-muted hover:text-accent"
                >
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-sm text-muted hover:text-accent"
              >
                Sign In
              </Link>
              <Link href="/auth/register">
                <Button variant="secondary" size="sm">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
