import { NextResponse } from 'next/server'
import { randomInt } from 'crypto'

export const runtime = 'nodejs'

type SendOtpBody = { phone?: string }

function normalizePhone(phone: string) {
  return phone.replace(/\D/g, '')
}

export async function POST(request: Request) {
  const apiKey = process.env.TWO_FACTOR_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'TWO_FACTOR_API_KEY is not configured. Set it in .env.local (local) or your hosting env vars, then restart the server.' },
      { status: 500 },
    )
  }

  let body: SendOtpBody = {}
  try {
    body = await request.json()
  } catch {
    body = {}
  }

  const rawPhone = typeof body.phone === 'string' ? body.phone : ''
  const phone = normalizePhone(rawPhone)
  if (!phone) {
    return NextResponse.json({ error: 'Phone number is required' }, { status: 400 })
  }

  if (phone.length < 10 || phone.length > 15) {
    return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 })
  }

  const otp = String(randomInt(1000, 10000))
  const template = (process.env.TWO_FACTOR_SMS_TEMPLATE ?? 'anyhelp').trim()

  const url = template
    ? `https://2factor.in/API/V1/${encodeURIComponent(apiKey)}/SMS/${encodeURIComponent(phone)}/${encodeURIComponent(otp)}/${encodeURIComponent(template)}`
    : `https://2factor.in/API/V1/${encodeURIComponent(apiKey)}/SMS/${encodeURIComponent(phone)}/${encodeURIComponent(otp)}`

  try {
    const upstream = await fetch(url, { method: 'POST', cache: 'no-store' })
    const text = await upstream.text()

    let payload: unknown = text
    try {
      payload = JSON.parse(text)
    } catch {
      // ignore
    }

    if (!upstream.ok) {
      return NextResponse.json(
        { error: 'Failed to send OTP', upstreamStatus: upstream.status, upstreamBody: payload },
        { status: 502 },
      )
    }

    let sessionId: string | null = null
    if (payload && typeof payload === 'object') {
      const record = payload as Record<string, unknown>
      if (typeof record.Details === 'string') sessionId = record.Details
    }

    return NextResponse.json({ ok: true, phone, sessionId, upstreamBody: payload })
  } catch {
    return NextResponse.json({ error: 'Failed to reach OTP provider' }, { status: 502 })
  }
}
