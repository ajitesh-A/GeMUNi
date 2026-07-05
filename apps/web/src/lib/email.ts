const RESEND_API_KEY = process.env.RESEND_API_KEY || ''
const FROM_EMAIL = 'GeMUNi <onboarding@resend.dev>'

export async function sendVerificationEmail(to: string, token: string) {
  const baseUrl = process.env.AUTH_URL || 'http://localhost:3000'
  const link = `${baseUrl}/api/auth/verify-email?token=${token}`

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to,
      subject: 'Verify your GeMUNi account',
      html: `
        <h1>Welcome to GeMUNi!</h1>
        <p>Click the link below to verify your email address:</p>
        <a href="${link}" style="display:inline-block;padding:12px 24px;background:#4361ee;color:#fff;text-decoration:none;border-radius:8px;margin:16px 0;">Verify Email</a>
        <p>If you didn't create an account, you can ignore this email.</p>
      `,
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    console.error('Resend error:', res.status, body)
  }
}
