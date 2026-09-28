'use client'

import { useState, useEffect, useCallback, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { QrCode, Download, ExternalLink, Utensils, Star, Coffee, Lock, Eye, EyeOff, LogOut, Grid3X3, Check, Edit3, X } from 'lucide-react'
import Link from 'next/link'
import { menuData } from '@/lib/menuData'
import { STATUS_CONFIG, TableInfo, TableStatus } from '@/lib/tableStore'

type WaitlistEntry = {
  id: string
  name: string
  phoneNumber: string
  totalPeople: number
  additionalNotes: string
  createdAt: string
  status: 'waiting' | 'auto_booked' | 'cancelled'
  autoBookedTableId?: number
  autoBookedAt?: string
}

type AdminSettingsV1 = {
  adminWhatsAppNumber?: string
}

const WAITLIST_KEY = 'aurelius_waitlist'
const ADMIN_SETTINGS_KEY = 'aurelius_admin_settings_v1'


const ADMIN_USERNAME = 'admin'
const ADMIN_PASSWORD = '123'

function safeParseJson<T>(raw: string | null): T | null {
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

function loadWaitlist(): WaitlistEntry[] {
  if (typeof window === 'undefined') return []
  const data = safeParseJson<WaitlistEntry[]>(localStorage.getItem(WAITLIST_KEY))
  return Array.isArray(data) ? data : []
}

function saveWaitlist(list: WaitlistEntry[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(WAITLIST_KEY, JSON.stringify(list))
  } catch {}
}

function loadAdminSettings(): AdminSettingsV1 {
  if (typeof window === 'undefined') return {}
  const data = safeParseJson<AdminSettingsV1>(localStorage.getItem(ADMIN_SETTINGS_KEY))
  return data ?? {}
}

function saveAdminSettings(settings: AdminSettingsV1) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(ADMIN_SETTINGS_KEY, JSON.stringify(settings))
  } catch {}
}

function normalizeE164(phone: string): string {
  // Keep leading + and digits only
  const s = phone.trim()
  const hasPlus = s.startsWith('+')
  const digits = s.replace(/\D/g, '')
  return hasPlus ? `+${digits}` : digits
}

function isValidE164(phone: string): boolean {
  // + followed by 10..15 digits (common global range)
  const p = phone.trim()
  return /^\+[0-9]{10,15}$/.test(p)
}

function formatPhoneForWaMe(phone: string): string {
  // wa.me expects countrycode+number digits without '+ '
  const digits = phone.replace(/\D/g, '')
  return digits
}

function buildWhatsAppMessage(args: {
  customerName: string
  restaurantName: string
  tableNumber: string
  guestCount: number
}): string {
  const { customerName, restaurantName, tableNumber, guestCount } = args
  return (
    `Hello ${customerName} 👋\n\n` +
    `Good news! A table is now available for you at ${restaurantName}.\n\n` +
    `Please arrive soon to confirm your table.\n\n` +
    `Table No: ${tableNumber}\n` +
    `Guests: ${guestCount}\n\n` +
    `Thank you.`
  )
}

function buildWhatsAppUrl(args: {
  customerPhone: string
  message: string
}): string {
  const { customerPhone, message } = args
  const phone = formatPhoneForWaMe(customerPhone)
  const encoded = encodeURIComponent(message)
  return `https://wa.me/${phone}?text=${encoded}`
}


type AdminTab = 'qr' | 'stats' | 'tables'

// ─── Login Screen ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = useCallback(async () => {
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 500))
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      onLogin()
    } else {
      setError('Invalid username or password.')
      setLoading(false)
    }
  }, [username, password, onLogin])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: 'linear-gradient(160deg, #1A0F08 0%, #2C1810 100%)' }}>
      <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, #B8933A, transparent)', transform: 'translate(30%, -30%)' }} />
      <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full"
        style={{ background: 'radial-gradient(circle, #B8933A, transparent)', transform: 'translate(-30%, 30%)', opacity: 0.08 }} />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="w-full max-w-sm relative z-10">

        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #B8933A, #D4AF6A)' }}>
            <Lock size={24} style={{ color: '#1A0F08' }} />
          </div>
          <h1 className="text-3xl font-light" style={{ fontFamily: 'var(--font-cormorant, Georgia, serif)', color: '#FDFAF5' }}>
            Admin Access
          </h1>
          <p className="text-sm opacity-50 mt-1" style={{ color: '#FDFAF5', fontFamily: 'var(--font-dm-sans, sans-serif)' }}>
            The Aurelius — Staff Portal
          </p>
        </div>

        <div className="rounded-3xl p-6" style={{ background: 'rgba(253,250,245,0.06)', border: '1px solid rgba(184,147,58,0.2)', backdropFilter: 'blur(20px)' }}>
          <div className="mb-4">
            <label className="block text-xs font-medium mb-2 tracking-[0.1em] uppercase"
              style={{ color: '#B8933A', fontFamily: 'var(--font-dm-sans, sans-serif)' }}>Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)}
              placeholder="Enter username"
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              className="w-full rounded-xl px-4 py-3 text-sm outline-none"
              style={{ background: 'rgba(253,250,245,0.08)', border: '1px solid rgba(184,147,58,0.25)', color: '#FDFAF5', fontFamily: 'var(--font-dm-sans, sans-serif)' }} />
          </div>

          <div className="mb-5">
            <label className="block text-xs font-medium mb-2 tracking-[0.1em] uppercase"
              style={{ color: '#B8933A', fontFamily: 'var(--font-dm-sans, sans-serif)' }}>Password</label>
            <div className="relative">
              <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                className="w-full rounded-xl px-4 py-3 pr-12 text-sm outline-none"
                style={{ background: 'rgba(253,250,245,0.08)', border: '1px solid rgba(184,147,58,0.25)', color: '#FDFAF5', fontFamily: 'var(--font-dm-sans, sans-serif)' }} />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 transition-opacity">
                {showPw ? <EyeOff size={16} style={{ color: '#B8933A' }} /> : <Eye size={16} style={{ color: '#B8933A' }} />}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="text-xs mb-4 text-center py-2 px-3 rounded-lg"
                style={{ color: '#EF4444', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', fontFamily: 'var(--font-dm-sans, sans-serif)' }}>
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <button type="button" onClick={handleSubmit} disabled={loading || !username || !password}
            className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2"
            style={{
              background: username && password ? 'linear-gradient(135deg, #B8933A, #D4AF6A)' : 'rgba(184,147,58,0.3)',
              color: username && password ? '#1A0F08' : 'rgba(184,147,58,0.5)',
              fontFamily: 'var(--font-dm-sans, sans-serif)',
              cursor: username && password ? 'pointer' : 'not-allowed',
            }}>
            {loading
              ? <span className="inline-block w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
              : <><Lock size={14} /> Sign In</>}
          </button>
        </div>

        <p className="text-center text-xs mt-5 opacity-30" style={{ color: '#FDFAF5', fontFamily: 'var(--font-dm-sans, sans-serif)' }}>
          Authorised staff only · The Aurelius Hotel
        </p>
      </motion.div>
    </div>
  )
}

// ─── Table Edit Modal ─────────────────────────────────────────────────────────
const TableEditModal = memo(function TableEditModal({ table, onSave, onClose }: {
  table: TableInfo, onSave: (updated: TableInfo) => void, onClose: () => void
}) {
  const [status, setStatus] = useState<TableStatus>(table.status)
  const [seats, setSeats] = useState<number>(Number.isFinite(table.seats) ? table.seats : 1)
  const [bookedFor, setBookedFor] = useState(table.bookedFor || '')
  const [note, setNote] = useState(table.note || '')


  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const handleSave = () => {
    onSave({
      ...table,
      seats: Math.max(1, Math.floor(seats)),
      status,
      bookedFor: bookedFor || undefined,
      note: note || undefined,
    })
  }


  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: 'rgba(26,15,8,0.8)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}>
      <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="w-full max-w-lg rounded-t-3xl overflow-hidden"
        style={{ background: '#FDFAF5' }}
        onClick={e => e.stopPropagation()}>

        <div className="px-6 pt-6 pb-4 flex items-center justify-between"
          style={{ borderBottom: '1px solid rgba(184,147,58,0.12)' }}>
          <div>
            <h3 className="text-2xl font-light" style={{ fontFamily: 'var(--font-cormorant, Georgia, serif)', color: '#1A0F08' }}>{table.number}</h3>
            <p className="text-xs opacity-50" style={{ fontFamily: 'var(--font-dm-sans, sans-serif)', color: '#1A0F08' }}>{table.seats}-seat table · Edit status</p>
          </div>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(184,147,58,0.1)' }}>
            <X size={14} style={{ color: '#B8933A' }} />
          </button>
        </div>

        <div className="px-6 py-5">
          <p className="text-xs font-semibold mb-3 tracking-[0.1em] uppercase" style={{ color: '#B8933A', fontFamily: 'var(--font-dm-sans, sans-serif)' }}>Table Status</p>

          <div className="mb-5">
            <label className="block text-xs font-semibold mb-2 tracking-[0.1em] uppercase" style={{ color: '#B8933A', fontFamily: 'var(--font-dm-sans, sans-serif)' }}>
              Max People Limit
            </label>
            <input
              type="number"
              min={1}
              step={1}
              value={seats}
              onChange={(e) => setSeats(parseInt(e.target.value) || 1)}
              className="w-full rounded-xl px-4 py-3 text-sm outline-none"
              style={{ background: 'rgba(184,147,58,0.05)', border: '1px solid rgba(184,147,58,0.2)', color: '#1A0F08', fontFamily: 'var(--font-dm-sans, sans-serif)' }}
            />
            <p className="text-[11px] mt-1 opacity-60" style={{ fontFamily: 'var(--font-dm-sans, sans-serif)', color: '#1A0F08' }}>
              Capacity used for booking validation.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-5">

            {(Object.entries(STATUS_CONFIG) as [TableStatus, typeof STATUS_CONFIG[TableStatus]][]).map(([key, cfg]) => (
              <button type="button" key={key} onClick={() => setStatus(key)}
                className="flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-all duration-150"
                style={{
                  background: status === key ? cfg.bg : 'rgba(44,24,16,0.04)',
                  border: status === key ? `2px solid ${cfg.border}` : '2px solid transparent',
                  color: status === key ? cfg.color : '#1A0F08',
                  fontFamily: 'var(--font-dm-sans, sans-serif)',
                }}>
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: cfg.dot }} />
                {cfg.label}
                {status === key && <Check size={14} className="ml-auto" />}
              </button>
            ))}
          </div>

          <div className="mb-4">
            <label className="block text-xs font-semibold mb-2 tracking-[0.1em] uppercase" style={{ color: '#B8933A', fontFamily: 'var(--font-dm-sans, sans-serif)' }}>Booking Name / Time</label>
            <input type="text" value={bookedFor} onChange={e => setBookedFor(e.target.value)}
              placeholder="e.g. Mr. Sharma — 7:30 PM"
              className="w-full rounded-xl px-4 py-3 text-sm outline-none"
              style={{ background: 'rgba(184,147,58,0.05)', border: '1px solid rgba(184,147,58,0.2)', color: '#1A0F08', fontFamily: 'var(--font-dm-sans, sans-serif)' }} />
          </div>

          <div className="mb-6">
            <label className="block text-xs font-semibold mb-2 tracking-[0.1em] uppercase" style={{ color: '#B8933A', fontFamily: 'var(--font-dm-sans, sans-serif)' }}>Internal Note</label>
            <input type="text" value={note} onChange={e => setNote(e.target.value)}
              placeholder="e.g. Window seat requested"
              className="w-full rounded-xl px-4 py-3 text-sm outline-none"
              style={{ background: 'rgba(184,147,58,0.05)', border: '1px solid rgba(184,147,58,0.2)', color: '#1A0F08', fontFamily: 'var(--font-dm-sans, sans-serif)' }} />
          </div>

          {table.bookingDetails && (
            <div className="mb-6 p-4 rounded-xl" style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.2)' }}>
              <p className="text-xs font-semibold mb-3 tracking-[0.1em] uppercase" style={{ color: '#166534', fontFamily: 'var(--font-dm-sans, sans-serif)' }}>📋 Booking Details</p>
              <div className="space-y-2 text-xs" style={{ color: '#1A0F08', fontFamily: 'var(--font-dm-sans, sans-serif)' }}>
                <div className="flex justify-between"><span className="opacity-60">Name:</span><span className="font-medium">{table.bookingDetails.name}</span></div>
                <div className="flex justify-between"><span className="opacity-60">People:</span><span className="font-medium">{table.bookingDetails.totalPeople}</span></div>
                <div className="flex justify-between"><span className="opacity-60">Phone:</span><span className="font-medium">{table.bookingDetails.phoneNumber}</span></div>
                <div className="flex justify-between"><span className="opacity-60">Arrival:</span><span className="font-medium">{table.bookingDetails.arrivalTime}</span></div>
                {table.bookingDetails.additionalNotes && (
                  <div className="mt-2 pt-2 border-t border-green-200">
                    <span className="opacity-60">Notes:</span>
                    <p className="text-xs mt-1">{table.bookingDetails.additionalNotes}</p>
                  </div>
                )}
                {table.bookedAt && (
                  <div className="text-xs opacity-40 mt-2 pt-2 border-t border-green-200">
                    Booked at: {new Date(table.bookedAt).toLocaleString('en-IN')}
                  </div>
                )}
              </div>
            </div>
          )}

          <button type="button" onClick={handleSave}
            className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #B8933A, #D4AF6A)', color: '#1A0F08', fontFamily: 'var(--font-dm-sans, sans-serif)' }}>
            <Check size={15} /> Save Changes
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
})

// ─── Table Card (memoized — no re-render unless table data changes) ────────────
const TableCard = memo(function TableCard({ table, onEdit }: { table: TableInfo, onEdit: (t: TableInfo) => void }) {
  const cfg = STATUS_CONFIG[table.status]
  return (
    <div className="rounded-2xl p-4 relative"
      style={{ background: cfg.bg, border: `1.5px solid ${cfg.border}` }}>
      <div className="absolute top-3 right-10">
        <span className="relative flex h-2.5 w-2.5">
          {table.status === 'available' && <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ background: cfg.dot }} />}
          <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ background: cfg.dot }} />
        </span>
      </div>
      <button type="button" onClick={() => onEdit(table)}
        className="absolute top-2 right-2 w-7 h-7 rounded-lg flex items-center justify-center"
        style={{ background: `${cfg.dot}15` }}>
        <Edit3 size={11} style={{ color: cfg.color }} />
      </button>
      <div className="text-2xl font-light leading-none mb-1.5"
        style={{ fontFamily: 'var(--font-cormorant, Georgia, serif)', color: cfg.color }}>
        {table.number}
      </div>
      <div className="flex items-center gap-1 mb-2">
        {Array.from({ length: table.seats }).map((_, idx) => (
          <span key={idx} style={{ color: cfg.color, fontSize: '0.4rem', opacity: 0.5 }}>●</span>
        ))}
        <span className="text-xs ml-1 opacity-60" style={{ color: cfg.color, fontFamily: 'var(--font-dm-sans, sans-serif)' }}>{table.seats}</span>
      </div>
      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
        style={{ background: `${cfg.dot}22`, color: cfg.color, fontFamily: 'var(--font-dm-sans, sans-serif)', fontSize: '0.65rem' }}>
        {cfg.label}
      </span>
      {table.bookedFor && (
        <p className="text-xs mt-1.5 leading-snug opacity-70 line-clamp-2"
          style={{ color: cfg.color, fontFamily: 'var(--font-dm-sans, sans-serif)', fontSize: '0.65rem' }}>
          {table.bookedFor}
        </p>
      )}
    </div>
  )
})

// ─── Admin Dashboard ──────────────────────────────────────────────────────────
function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [qrDataUrl, setQrDataUrl] = useState<string>('')
  const [menuUrl, setMenuUrl] = useState<string>('')
  const [activeTab, setActiveTab] = useState<AdminTab>('qr')

  const [adminSettings, setAdminSettings] = useState<AdminSettingsV1>({})
  const [adminWhatsAppError, setAdminWhatsAppError] = useState<string>('')
  const [waitingEntries, setWaitingEntries] = useState<WaitlistEntry[]>([])
  const [lastAvailableTableId, setLastAvailableTableId] = useState<number | null>(null)

      const refreshLocalWaitlist = useCallback(() => {
    setWaitingEntries(loadWaitlist())
  }, [])

  useEffect(() => {
    setAdminSettings(loadAdminSettings())
    refreshLocalWaitlist()
  }, [refreshLocalWaitlist])

  const [tables, setTables] = useState<TableInfo[]>([])

  useEffect(() => {
    // detect newly-available table and refresh local waitlist
    const available = tables.filter(t => t.status === 'available')
    if (available.length === 0) return
    const first = available[0]
    if (lastAvailableTableId !== first.id) {
      setLastAvailableTableId(first.id)
      refreshLocalWaitlist()
    }
  }, [tables, lastAvailableTableId, refreshLocalWaitlist])

  // marker key: admin-side notifications are tracked separately
  const ADMIN_NOTIFY_KEY = 'aurelius_waitlist_notified_v1'

  function loadNotifiedMap(): Record<string, string[]> {
    if (typeof window === 'undefined') return {}
    const raw = safeParseJson<Record<string, string[]>>(localStorage.getItem(ADMIN_NOTIFY_KEY))
    return raw && typeof raw === 'object' ? raw : {}
  }

  function saveNotifiedMap(map: Record<string, string[]>) {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(ADMIN_NOTIFY_KEY, JSON.stringify(map))
    } catch {}
  }

  function markNotified(waitlistId: string, tableId: number) {
    const map = loadNotifiedMap()
    const existing = map[waitlistId] ?? []
    const tableIdStr = String(tableId)
    const next = existing.includes(tableIdStr) ? existing : [...existing, tableIdStr]
    const updated = { ...map, [waitlistId]: next }
    saveNotifiedMap(updated)
  }

  function isNotified(waitlistId: string, tableId: number) {
    const map = loadNotifiedMap()
    const existing = map[waitlistId] ?? []
    return existing.includes(String(tableId))
  }

  const [editingTable, setEditingTable] = useState<TableInfo | null>(null)
  const [saveFlash, setSaveFlash] = useState(false)

  const refreshTables = useCallback(async () => {
    try {
      const res = await fetch('/api/tables', { cache: 'no-store' })
      const data = await res.json().catch(() => null)
      if (!res.ok) throw new Error('Failed to load tables')
      if (!data || typeof data !== 'object') throw new Error('Invalid tables response')

      const record = data as Record<string, unknown>
      if (!Array.isArray(record.tables)) throw new Error('Invalid tables response')
      setTables(record.tables as TableInfo[])
    } catch {
      // no-op (admin will show last known state)
    }
  }, [])

  useEffect(() => {
    void refreshTables()
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
    const url = `${baseUrl}/menu`
    setMenuUrl(url)
    import('qrcode').then((QRCode) => {
      QRCode.toDataURL(url, { errorCorrectionLevel: 'H', width: 500, margin: 3, color: { dark: '#1A0F08', light: '#FDFAF5' } }).then(setQrDataUrl)
    })
  }, [refreshTables])

  useEffect(() => {
    const id = setInterval(() => { void refreshTables() }, 2000)
    return () => clearInterval(id)
  }, [refreshTables])

  const totalItems = menuData.categories.reduce((sum, c) => sum + c.items.length, 0)
  const featuredItems = menuData.categories.flatMap(c => c.items as any[]).filter(i => i.featured).length
  const vegItems = menuData.categories.flatMap(c => c.items as any[]).filter(i => i.vegetarian).length
  const availableTables = tables.filter(t => t.status === 'available').length

  const restaurantName = menuData.hotel.name

  const waitingQueue = waitingEntries
    .filter(e => e.status === 'waiting')
    .slice()
    .sort((a, b) => {
      // FIFO by createdAt
      const ta = new Date(a.createdAt).getTime()
      const tb = new Date(b.createdAt).getTime()
      if (Number.isFinite(ta) && Number.isFinite(tb)) return ta - tb
      return 0
    })

  const availableTableForNotify =
    tables.find(t => t.status === 'available' && (lastAvailableTableId == null || t.id === lastAvailableTableId)) ??
    tables.find(t => t.status === 'available') ??
    null

  const firstEligible = (() => {
    if (!availableTableForNotify) return null
    const tableId = availableTableForNotify.id
    return waitingQueue.find(e => !isNotified(e.id, tableId)) ?? null
  })()


  const notifyTableNumber = availableTableForNotify?.number ?? ''
  const notifyGuestCount = firstEligible?.totalPeople ?? 0

  const firstEligibleIndex = firstEligible ? waitingQueue.findIndex(e => e.id === firstEligible.id) : -1


  const stats = [
    { label: 'Total Dishes', value: totalItems, icon: Utensils, color: '#B8933A' },
    { label: "Chef's Picks", value: featuredItems, icon: Star, color: '#D4AF6A' },
    { label: 'Vegetarian', value: vegItems, icon: Coffee, color: '#2D5016' },
    { label: 'Tables Free', value: availableTables, icon: Grid3X3, color: '#1A4A6B' },
  ]

  const downloadQR = useCallback(() => {
    if (!qrDataUrl) return
    const a = document.createElement('a'); a.href = qrDataUrl; a.download = 'aurelius-menu-qr.png'; a.click()
  }, [qrDataUrl])

  const handleSaveTable = useCallback((updated: TableInfo) => {
    setEditingTable(null)
    setSaveFlash(true)
    setTimeout(() => setSaveFlash(false), 2000)
    setTables(prev => prev.map(t => (t.id === updated.id ? updated : t)))

    void (async () => {
      try {
        const res = await fetch('/api/tables', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: updated.id,
            patch: {
              seats: updated.seats,
              status: updated.status,
              bookedFor: updated.bookedFor,
              note: updated.note,
            },
          }),
          cache: 'no-store',
        })
        const data = await res.json().catch(() => null)
        if (!res.ok) throw new Error('Failed to save table')
        if (data && typeof data === 'object' && Array.isArray((data as Record<string, unknown>).tables)) {
          setTables((data as { tables: TableInfo[] }).tables)
        } else {
          void refreshTables()
        }
      } catch {
        void refreshTables()
      }
    })()
  }, [refreshTables])

  const handleEditTable = useCallback((table: TableInfo) => setEditingTable(table), [])
  const handleCloseModal = useCallback(() => setEditingTable(null), [])

  const handleResetTables = useCallback(() => {
    if (confirm('Reset all tables to default? This cannot be undone.')) {
      void (async () => {
        try {
          const res = await fetch('/api/tables', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reset: true }),
            cache: 'no-store',
          })
          const data = await res.json().catch(() => null)
          if (!res.ok) throw new Error('Failed to reset tables')
          if (data && typeof data === 'object' && Array.isArray((data as Record<string, unknown>).tables)) {
            setTables((data as { tables: TableInfo[] }).tables)
          } else {
            void refreshTables()
          }
        } catch {
          void refreshTables()
        }
      })()
    }
  }, [refreshTables])

  const tableCounts = {
    available: tables.filter(t => t.status === 'available').length,
    booked: tables.filter(t => t.status === 'booked').length,
    reserved: tables.filter(t => t.status === 'reserved').length,
    cleaning: tables.filter(t => t.status === 'cleaning').length,
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--cream)' }}>
      {/* Header */}
      <div className="relative overflow-hidden px-6 pt-14 pb-12"
        style={{ background: 'linear-gradient(160deg, #1A0F08, #2C1810)' }}>
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #B8933A, transparent)' }} />
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1200 40" className="w-full" style={{ fill: 'var(--cream)' }}>
            <path d="M0,40 C300,0 900,0 1200,40 L1200,40 L0,40 Z" />
          </svg>
        </div>
        <div className="flex items-start justify-between relative z-10">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase mb-2" style={{ color: '#B8933A', fontFamily: 'var(--font-dm-sans, sans-serif)' }}>Admin Panel</p>
            <h1 className="text-4xl font-light" style={{ fontFamily: 'var(--font-cormorant, Georgia, serif)', color: '#FDFAF5' }}>The Aurelius</h1>
            <p className="text-sm opacity-50 mt-1" style={{ color: '#FDFAF5', fontFamily: 'var(--font-dm-sans, sans-serif)' }}>Menu Management Dashboard</p>
          </div>
          {/* ✅ FIXED LOGOUT — z-50, type=button, no animation wrapper blocking clicks */}
          <button
            type="button"
            onClick={onLogout}
            className="relative z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold mt-1 active:scale-95 transition-transform"
            style={{
              background: 'rgba(253,250,245,0.15)',
              border: '1px solid rgba(253,250,245,0.3)',
              color: '#FDFAF5',
              fontFamily: 'var(--font-dm-sans, sans-serif)',
              cursor: 'pointer',
              WebkitTapHighlightColor: 'rgba(255,255,255,0.1)',
            }}>
            <LogOut size={13} /> Logout
          </button>
        </div>
      </div>

      <div className="px-4 py-6 max-w-2xl mx-auto">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="rounded-2xl p-4" style={{ background: '#FFF', border: '1px solid rgba(184,147,58,0.1)' }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: `${stat.color}15` }}>
                  <Icon size={16} style={{ color: stat.color }} />
                </div>
                <p className="text-3xl font-light mb-0.5" style={{ fontFamily: 'var(--font-cormorant, Georgia, serif)', color: '#1A0F08' }}>{stat.value}</p>
                <p className="text-xs opacity-50" style={{ fontFamily: 'var(--font-dm-sans, sans-serif)', color: '#1A0F08' }}>{stat.label}</p>
              </div>
            )
          })}
        </div>

        {/* Save Flash */}
        <AnimatePresence>
          {saveFlash && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mb-4 px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-medium"
              style={{ background: '#F0FDF4', border: '1px solid #86EFAC', color: '#166534', fontFamily: 'var(--font-dm-sans, sans-serif)' }}>
              <Check size={15} /> Table status saved successfully
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab Nav */}
        <div className="flex gap-2 mb-5 p-1 rounded-xl" style={{ background: 'rgba(184,147,58,0.08)' }}>
          {(['qr', 'tables', 'stats'] as const).map(tab => (
            <button type="button" key={tab} onClick={() => setActiveTab(tab)}
              className="flex-1 py-2.5 rounded-lg text-xs font-medium capitalize transition-all duration-200"
              style={{
                background: activeTab === tab ? '#FFF' : 'transparent',
                color: activeTab === tab ? '#1A0F08' : '#B8933A',
                fontFamily: 'var(--font-dm-sans, sans-serif)',
                boxShadow: activeTab === tab ? '0 1px 4px rgba(0,0,0,0.06)' : 'none',
              }}>
              {tab === 'qr' ? '📱 QR Code' : tab === 'tables' ? '🪑 Tables' : '📊 Menu Items'}
            </button>
          ))}
        </div>

        {/* Waiting List WhatsApp Notifications */}
        <div className="mb-5 rounded-2xl p-4" style={{ background: 'rgba(184,147,58,0.06)', border: '1px solid rgba(184,147,58,0.15)' }}>
          <p className="text-xs font-semibold mb-3 tracking-[0.1em] uppercase" style={{ color: '#B8933A', fontFamily: 'var(--font-dm-sans, sans-serif)' }}>Waiting List — WhatsApp Notification</p>

          {availableTableForNotify && firstEligible ? (
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium" style={{ color: '#1A0F08', fontFamily: 'var(--font-dm-sans, sans-serif)' }}>
                    Next in FIFO: <span style={{ color: '#B45309', fontWeight: 700 }}>#{firstEligibleIndex + 1}</span> — {firstEligible.name}
                  </p>
                  <p className="text-xs opacity-60 mt-0.5" style={{ color: '#1A0F08', fontFamily: 'var(--font-dm-sans, sans-serif)' }}>
                    Customer phone: {firstEligible.phoneNumber}
                  </p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full font-semibold"
                  style={{ background: 'rgba(34,197,94,0.12)', color: '#166534', fontFamily: 'var(--font-dm-sans, sans-serif)' }}>
                  Table Available: {availableTableForNotify.number}
                </span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    const adminWa = (adminSettings.adminWhatsAppNumber ?? '').trim()
                    if (!adminWa || !isValidE164(adminWa)) {
                      alert('Set a valid Admin WhatsApp Number first (e.g. +91XXXXXXXXXX).')
                      return
                    }
                    const message = buildWhatsAppMessage({
                      customerName: firstEligible.name,
                      restaurantName,
                      tableNumber: notifyTableNumber,
                      guestCount: notifyGuestCount,
                    })
                    const url = buildWhatsAppUrl({ customerPhone: firstEligible.phoneNumber, message })
                    window.open(url, '_blank')

                    // mark as notified so FIFO can move forward (manual confirm handled by admin by skipping)
                    if (availableTableForNotify) {
                      markNotified(firstEligible.id, availableTableForNotify.id)
                      refreshLocalWaitlist()
                    }
                  }}
                  className="px-4 py-2.5 rounded-xl font-semibold text-xs"
                  style={{ background: 'linear-gradient(135deg, #B8933A, #D4AF6A)', color: '#1A0F08', fontFamily: 'var(--font-dm-sans, sans-serif)' }}
                >
                  Send WhatsApp Notification
                </button>

                {/* manual notify next customer (customer 2+) */}
              </div>
            </div>
          ) : (
            <p className="text-xs opacity-60" style={{ color: '#1A0F08', fontFamily: 'var(--font-dm-sans, sans-serif)' }}>
              No available table or waiting customers.
            </p>
          )}
        </div>

        {/* Admin WhatsApp Settings */}
        <div className="mb-5 rounded-2xl p-4" style={{ background: 'rgba(184,147,58,0.06)', border: '1px solid rgba(184,147,58,0.15)' }}>
          <div>
            <p className="text-xs font-semibold mb-2 tracking-[0.1em] uppercase" style={{ color: '#B8933A', fontFamily: 'var(--font-dm-sans, sans-serif)' }}>
              WhatsApp Notification Settings
            </p>
            <p className="text-[11px] opacity-60" style={{ color: '#1A0F08', fontFamily: 'var(--font-dm-sans, sans-serif)' }}>
              Admin WhatsApp number for sending notifications (no API used)
            </p>
          </div>

          <div className="mt-4">
            <label className="block text-xs font-semibold mb-2 tracking-[0.1em] uppercase" style={{ color: '#B8933A', fontFamily: 'var(--font-dm-sans, sans-serif)' }}>
              Admin WhatsApp Number
            </label>
            <input
              type="tel"
              value={adminSettings.adminWhatsAppNumber ?? ''}
              placeholder="+91XXXXXXXXXX"
              onChange={(e) => {
                const raw = e.target.value
                setAdminSettings(prev => ({ ...prev, adminWhatsAppNumber: raw }))
              }}
              onBlur={() => {
                const raw = (adminSettings.adminWhatsAppNumber ?? '').trim()
                if (!raw) {
                  saveAdminSettings({ ...adminSettings, adminWhatsAppNumber: undefined })
                  setAdminWhatsAppError('')
                  return
                }
                if (!isValidE164(raw)) {
                  setAdminWhatsAppError('Invalid format. Use +91XXXXXXXXXX (10-15 digits).')
                  return
                }
                saveAdminSettings({ ...adminSettings, adminWhatsAppNumber: normalizeE164(raw) })
                setAdminWhatsAppError('')
              }}
              className="w-full rounded-xl px-4 py-3 text-sm outline-none"
              style={{ background: 'rgba(44,24,16,0.05)', border: '1px solid rgba(184,147,58,0.2)', color: '#1A0F08', fontFamily: 'var(--font-dm-sans, sans-serif)' }}
            />
            {adminWhatsAppError && (
              <p className="text-xs mt-2" style={{ color: '#EF4444', fontFamily: 'var(--font-dm-sans, sans-serif)' }}>
                {adminWhatsAppError}
              </p>
            )}
          </div>
        </div>


        {/* QR Tab */}
        {activeTab === 'qr' && (
          <div>
            <div className="rounded-2xl p-6 text-center mb-4" style={{ background: '#FFF', border: '1px solid rgba(184,147,58,0.1)' }}>
              <p className="text-xs tracking-[0.25em] uppercase mb-5 font-medium" style={{ color: '#B8933A', fontFamily: 'var(--font-dm-sans, sans-serif)' }}>Digital Menu QR Code</p>
              {qrDataUrl ? (
                <div className="inline-block p-4 rounded-2xl mb-5" style={{ background: '#F5E8D0' }}>
                  <img src={qrDataUrl} alt="Menu QR" className="w-52 h-52" />
                </div>
              ) : (
                <div className="w-52 h-52 mx-auto mb-5 rounded-2xl animate-pulse flex items-center justify-center" style={{ background: '#F5E8D0' }}>
                  <QrCode size={32} style={{ color: '#B8933A' }} className="opacity-40" />
                </div>
              )}
              <div className="p-3 rounded-xl mb-5" style={{ background: 'rgba(184,147,58,0.06)' }}>
                <p className="font-mono break-all" style={{ color: '#B8933A', fontSize: '0.65rem' }}>{menuUrl}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={downloadQR}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium"
                  style={{ background: 'linear-gradient(135deg, #B8933A, #D4AF6A)', color: '#1A0F08', fontFamily: 'var(--font-dm-sans, sans-serif)' }}>
                  <Download size={14} /> Download
                </button>
                <Link href="/menu"
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium"
                  style={{ background: 'rgba(184,147,58,0.1)', color: '#B8933A', border: '1px solid rgba(184,147,58,0.2)', fontFamily: 'var(--font-dm-sans, sans-serif)' }}>
                  <ExternalLink size={14} /> Preview
                </Link>
              </div>
            </div>
            <div className="rounded-2xl p-4" style={{ background: 'rgba(184,147,58,0.06)', border: '1px solid rgba(184,147,58,0.15)' }}>
              <p className="text-xs font-semibold mb-2" style={{ color: '#B8933A', fontFamily: 'var(--font-dm-sans, sans-serif)' }}>💡 Usage Guide</p>
              <ul className="text-xs space-y-1 opacity-70" style={{ color: '#1A0F08', fontFamily: 'var(--font-dm-sans, sans-serif)' }}>
                <li>• Print and place on each table</li>
                <li>• Display at reception and room doors</li>
                <li>• Include in room information booklets</li>
                <li>• Share digitally via WhatsApp on check-in</li>
              </ul>
            </div>
          </div>
        )}

        {/* Tables Tab */}
        {activeTab === 'tables' && (
          <div>
            <div className="flex gap-2 overflow-x-auto pb-1 mb-4" style={{ scrollbarWidth: 'none' }}>
              {(Object.entries(tableCounts) as [keyof typeof tableCounts, number][]).map(([status, count]) => {
                const cfg = STATUS_CONFIG[status]
                return (
                  <div key={status} className="flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium"
                    style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color, fontFamily: 'var(--font-dm-sans, sans-serif)' }}>
                    <span className="w-2 h-2 rounded-full" style={{ background: cfg.dot }} />
                    {count} {cfg.label}
                  </div>
                )
              })}
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {tables.map((table) => (
                <TableCard key={table.id} table={table} onEdit={handleEditTable} />
              ))}
            </div>
            <button type="button" onClick={handleResetTables}
              className="w-full py-3 rounded-xl text-sm font-medium opacity-50 hover:opacity-80 transition-opacity"
              style={{ background: 'rgba(44,24,16,0.06)', color: '#1A0F08', border: '1px solid rgba(44,24,16,0.1)', fontFamily: 'var(--font-dm-sans, sans-serif)' }}>
              Reset Tables to Default
            </button>
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div className="space-y-3">
            {menuData.categories.map((cat) => (
              <div key={cat.id} className="rounded-2xl p-4" style={{ background: '#FFF', border: '1px solid rgba(184,147,58,0.1)' }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{cat.icon}</span>
                    <div>
                      <h3 className="font-medium" style={{ color: '#1A0F08', fontFamily: 'var(--font-cormorant, Georgia, serif)', fontSize: '1.1rem' }}>{cat.name}</h3>
                      <p className="text-xs opacity-50" style={{ fontFamily: 'var(--font-dm-sans, sans-serif)', color: '#1A0F08' }}>{cat.items.length} items</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs opacity-40 mb-0.5" style={{ fontFamily: 'var(--font-dm-sans, sans-serif)', color: '#1A0F08' }}>Avg. Price</p>
                    <p className="font-semibold text-sm" style={{ color: '#B8933A', fontFamily: 'var(--font-dm-sans, sans-serif)' }}>
                      ₹{Math.round(cat.items.reduce((s, item) => s + item.price, 0) / cat.items.length).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {cat.items.map(item => (
                    <span key={item.id} className="text-xs px-2.5 py-1 rounded-full"
                      style={{
                        background: item.featured ? 'rgba(184,147,58,0.12)' : 'rgba(44,24,16,0.05)',
                        color: item.featured ? '#B8933A' : '#2C1810',
                        border: item.featured ? '1px solid rgba(184,147,58,0.2)' : 'none',
                        fontFamily: 'var(--font-dm-sans, sans-serif)',
                      }}>
                      {item.featured && '⭐ '}{item.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <Link href="/" className="mt-6 flex items-center justify-center gap-2 py-3 text-sm opacity-40 hover:opacity-70 transition-opacity"
          style={{ color: '#1A0F08', fontFamily: 'var(--font-dm-sans, sans-serif)' }}>
          ← Back to Home
        </Link>
      </div>

      <AnimatePresence>
        {editingTable && <TableEditModal table={editingTable} onSave={handleSaveTable} onClose={handleCloseModal} />}
      </AnimatePresence>
    </div>
  )
}

// ─── Root Export ──────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const saved = sessionStorage.getItem('aurelius_admin_auth')
    if (saved === 'true') setIsLoggedIn(true)
    setChecked(true)
  }, [])

  const handleLogin = useCallback(() => {
    sessionStorage.setItem('aurelius_admin_auth', 'true')
    setIsLoggedIn(true)
  }, [])

  const handleLogout = useCallback(() => {
    sessionStorage.removeItem('aurelius_admin_auth')
    setIsLoggedIn(false)
  }, [])

  if (!checked) return null

  // ✅ No AnimatePresence wrapping — was causing pointer-event blocking on logout button
  return isLoggedIn
    ? <AdminDashboard onLogout={handleLogout} />
    : <LoginScreen onLogin={handleLogin} />
}
