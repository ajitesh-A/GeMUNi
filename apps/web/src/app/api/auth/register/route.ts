import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { randomUUID } from 'node:crypto'
import { prisma } from '@/lib/prisma'
import { sendVerificationEmail } from '@/lib/email'
import { z } from 'zod'

const registerSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(100),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, password } = registerSchema.parse(body)

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 },
      )
    }

    const passwordHash = await hash(password, 12)
    const verificationToken = randomUUID()

    await prisma.user.create({
      data: { name, email, passwordHash, verificationToken },
    })

    await sendVerificationEmail(email, verificationToken)

    return NextResponse.json(
      { message: 'Verification email sent' },
      { status: 201 },
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
