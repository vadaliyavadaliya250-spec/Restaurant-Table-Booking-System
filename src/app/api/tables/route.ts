import { NextResponse } from 'next/server'
import { DEFAULT_TABLES, TableInfo, TableStatus } from '@/lib/tableStore'
import { getTablesRecord, setTablesRecord, updateTableById } from '@/lib/tablesStore'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function jsonNoStore(data: unknown, init?: { status?: number }) {
  return NextResponse.json(data, {
    status: init?.status,
    headers: { 'Cache-Control': 'no-store, max-age=0' },
  })
}

function isTableStatus(value: unknown): value is TableStatus {
  return value === 'available' || value === 'booked' || value === 'reserved' || value === 'cleaning'
}

function parseTable(input: unknown): TableInfo | null {
  if (!input || typeof input !== 'object') return null
  const record = input as Record<string, unknown>

  if (typeof record.id !== 'number' || !Number.isFinite(record.id)) return null
  if (typeof record.number !== 'string') return null
  if (typeof record.seats !== 'number' || !Number.isFinite(record.seats)) return null
  if (!isTableStatus(record.status)) return null

  const table: TableInfo = {
    id: record.id,
    number: record.number,
    seats: record.seats,
    status: record.status,
  }

  if (typeof record.note === 'string' && record.note.trim()) table.note = record.note
  if (typeof record.bookedFor === 'string' && record.bookedFor.trim()) table.bookedFor = record.bookedFor
  if (typeof record.bookedAt === 'string' && record.bookedAt.trim()) table.bookedAt = record.bookedAt
  if (record.bookingDetails && typeof record.bookingDetails === 'object') {
    table.bookingDetails = record.bookingDetails as TableInfo['bookingDetails']
  }

  return table
}

function parseTables(input: unknown): TableInfo[] | null {
  if (!Array.isArray(input)) return null
  const tables: TableInfo[] = []
  for (const item of input) {
    const table = parseTable(item)
    if (!table) return null
    tables.push(table)
  }
  return tables
}

export async function GET() {
  const record = await getTablesRecord()
  return jsonNoStore(record)
}

export async function PUT(request: Request) {
  let body: unknown = null
  try {
    body = await request.json()
  } catch {
    body = null
  }

  const record = body && typeof body === 'object' ? (body as Record<string, unknown>) : {}
  const reset = record.reset === true

  const tables = reset ? DEFAULT_TABLES : parseTables(record.tables)
  if (!tables) return jsonNoStore({ error: 'Invalid tables payload' }, { status: 400 })

  const updated = await setTablesRecord(tables)
  return jsonNoStore(updated)
}

export async function PATCH(request: Request) {
  let body: unknown = null
  try {
    body = await request.json()
  } catch {
    body = null
  }

  if (!body || typeof body !== 'object') return jsonNoStore({ error: 'Invalid payload' }, { status: 400 })
  const record = body as Record<string, unknown>

  const id = record.id
  if (typeof id !== 'number' || !Number.isFinite(id)) return jsonNoStore({ error: 'id is required' }, { status: 400 })

  const patch = record.patch
  if (!patch || typeof patch !== 'object') return jsonNoStore({ error: 'patch is required' }, { status: 400 })
  const patchRecord = patch as Record<string, unknown>

  if ('status' in patchRecord && !isTableStatus(patchRecord.status)) {
    return jsonNoStore({ error: 'Invalid status' }, { status: 400 })
  }

  if ('seats' in patchRecord) {
    const seats = patchRecord.seats
    if (typeof seats !== 'number' || !Number.isFinite(seats)) {
      return jsonNoStore({ error: 'Invalid seats' }, { status: 400 })
    }
    // guardrails: avoid crazy values
    if (seats < 1 || seats > 50) {
      return jsonNoStore({ error: 'seats must be between 1 and 50' }, { status: 400 })
    }
  }

  const updated = await updateTableById(id, patchRecord as Partial<Omit<TableInfo, 'id'>>)

  return jsonNoStore(updated)
}

