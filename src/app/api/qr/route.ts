import { NextResponse } from 'next/server'
import { generateQRCode } from '@/lib/qrcode'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'URL parameter required' }, { status: 400 })
  }

  try {
    const qrDataUrl = await generateQRCode(url)
    return NextResponse.json({ qr: qrDataUrl, url })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate QR code' }, { status: 500 })
  }
}
