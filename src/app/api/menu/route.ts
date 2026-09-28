import { NextResponse } from 'next/server'
import { menuData } from '@/lib/menuData'

export async function GET() {
  return NextResponse.json(menuData)
}
