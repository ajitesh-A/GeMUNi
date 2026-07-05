import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get('token')

  if (!token) {
    return NextResponse.json(
      { error: 'Missing verification token' },
      { status: 400 },
    )
  }

  const user = await prisma.user.findUnique({
    where: { verificationToken: token },
  })

  if (!user) {
    return NextResponse.json(
      { error: 'Invalid or expired verification token' },
      { status: 404 },
    )
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: new Date(), verificationToken: null },
  })

  return NextResponse.redirect(
    new URL('/auth/login?verified=true', req.url),
  )
}
