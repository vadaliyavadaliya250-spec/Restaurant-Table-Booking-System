import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { phone, message } = await request.json()

    const apiKey = process.env.FAST2SMS_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: 'FAST2SMS_API_KEY missing' },
        { status: 500 }
      )
    }

    const cleanPhone = phone
      .replace(/\D/g, '')
      .replace(/^91/, '')
      .slice(-10)

    const smsRes = await fetch(
      'https://www.fast2sms.com/dev/bulkV2',
      {
        method: 'POST',
        headers: {
          authorization: apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          route: 'q',
          message,
          language: 'english',
          flash: 0,
          numbers: cleanPhone,
        }),
      }
    )

    const data = await smsRes.json()

    if (!data.return) {
      return NextResponse.json(
        { error: 'SMS failed', detail: data },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      data,
    })

  } catch (err) {
    return NextResponse.json(
      { error: String(err) },
      { status: 500 }
    )
  }
}