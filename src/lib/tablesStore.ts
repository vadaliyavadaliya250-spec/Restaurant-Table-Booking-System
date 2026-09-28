import { DEFAULT_TABLES, TableInfo } from '@/lib/tableStore'

export const TABLES_KEY = 'aurelius_tables_v1'

type TablesRecord = {
  tables: TableInfo[]
  updatedAt: string
  version: 1
}

type UpstashConfig = { url: string; token: string }

function getUpstashConfig(): UpstashConfig | null {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  return { url, token }
}

async function upstashCommand(command: unknown[]) {
  const cfg = getUpstashConfig()
  if (!cfg) throw new Error('Upstash is not configured')

  const res = await fetch(cfg.url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${cfg.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command),
    cache: 'no-store',
  })

  const data = await res.json().catch(() => null)
  if (!res.ok) {
    const message =
      data && typeof data === 'object' && typeof (data as Record<string, unknown>).error === 'string'
        ? String((data as Record<string, unknown>).error)
        : 'Upstash command failed'
    throw new Error(message)
  }

  if (!data || typeof data !== 'object') return null
  return (data as Record<string, unknown>).result ?? null
}

type GlobalTablesState = typeof globalThis & { __AURELIUS_TABLES__?: TablesRecord }

function getMemoryRecord(): TablesRecord | null {
  const record = (globalThis as GlobalTablesState).__AURELIUS_TABLES__
  return record ?? null
}

function setMemoryRecord(record: TablesRecord) {
  ;(globalThis as GlobalTablesState).__AURELIUS_TABLES__ = record
}

async function readRecord(): Promise<TablesRecord | null> {
  const cfg = getUpstashConfig()
  if (cfg) {
    const raw = await upstashCommand(['GET', TABLES_KEY])
    if (typeof raw !== 'string' || !raw) return null
    try {
      return JSON.parse(raw) as TablesRecord
    } catch {
      return null
    }
  }

  return getMemoryRecord()
}

async function writeRecord(record: TablesRecord): Promise<void> {
  const cfg = getUpstashConfig()
  if (cfg) {
    await upstashCommand(['SET', TABLES_KEY, JSON.stringify(record)])
    return
  }

  setMemoryRecord(record)
}

export async function getTablesRecord(): Promise<TablesRecord> {
  const existing = await readRecord()
  if (existing && existing.version === 1 && Array.isArray(existing.tables)) return existing

  const record: TablesRecord = { tables: DEFAULT_TABLES, updatedAt: new Date().toISOString(), version: 1 }
  await writeRecord(record)
  return record
}

export async function setTablesRecord(tables: TableInfo[]): Promise<TablesRecord> {
  const record: TablesRecord = { tables, updatedAt: new Date().toISOString(), version: 1 }
  await writeRecord(record)
  return record
}

export async function updateTableById(
  id: number,
  patch: Partial<Omit<TableInfo, 'id'>>,
): Promise<TablesRecord> {
  const current = await getTablesRecord()
  const tables = current.tables.map((t) => (t.id === id ? { ...t, ...patch, id: t.id } : t))
  return setTablesRecord(tables)
}

