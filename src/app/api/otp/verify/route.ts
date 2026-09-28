import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

type VerifyOtpBody = { sessionId?: string; otp?: string }

function normalizeOtp(otp: string) {
  return otp.replace(/\D/g, '')
}

export async function POST(request: Request) {
  const apiKey = process.env.TWO_FACTOR_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'TWO_FACTOR_API_KEY is not configured. Set it in .env.local (local) or your hosting env vars, then restart the server.' },
      { status: 500 },
    )
  }

  let body: VerifyOtpBody = {}
  try {
    body = await request.json()
  } catch {
    body = {}
  }

  const sessionId = typeof body.sessionId === 'string' ? body.sessionId.trim() : ''
  const otp = typeof body.otp === 'string' ? normalizeOtp(body.otp) : ''

  if (!sessionId) return NextResponse.json({ error: 'sessionId is required' }, { status: 400 })
  if (!otp) return NextResponse.json({ error: 'otp is required' }, { status: 400 })

  const url = `https://2factor.in/API/V1/${encodeURIComponent(apiKey)}/SMS/VERIFY/${encodeURIComponent(sessionId)}/${encodeURIComponent(otp)}`

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
        { error: 'Failed to verify OTP', upstreamStatus: upstream.status, upstreamBody: payload },
        { status: 502 },
      )
    }

    if (!payload || typeof payload !== 'object') {
      return NextResponse.json({ error: 'Unexpected OTP verify response', upstreamBody: payload }, { status: 502 })
    }

    const record = payload as Record<string, unknown>
    const status = typeof record.Status === 'string' ? record.Status : ''
    const details = typeof record.Details === 'string' ? record.Details : ''

    const isMatched = status.toLowerCase() === 'success' && details.toLowerCase().includes('matched')
    if (!isMatched) {
      return NextResponse.json({ error: details || 'OTP verification failed', upstreamBody: payload }, { status: 400 })
    }

    return NextResponse.json({ ok: true, details })
  } catch {
    return NextResponse.json({ error: 'Failed to reach OTP provider' }, { status: 502 })
  }
}

