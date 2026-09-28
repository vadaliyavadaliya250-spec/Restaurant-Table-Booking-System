export type TableStatus = 'available' | 'booked' | 'reserved' | 'cleaning'

export interface BookingDetails {
  name: string
  totalPeople: number
  phoneNumber: string
  restaurant: string
  arrivalTime: string
  additionalNotes?: string
  bookingDate?: string
}

export interface TableInfo {
  id: number
  number: string
  seats: number
  status: TableStatus
  note?: string
  bookedFor?: string
  bookingDetails?: BookingDetails
  bookedAt?: string
}

export const DEFAULT_TABLES: TableInfo[] = [
  { id: 1, number: 'T1', seats: 2, status: 'available' },
  { id: 2, number: 'T2', seats: 2, status: 'available' },
  { id: 3, number: 'T3', seats: 4, status: 'booked', bookedFor: 'Mr. Sharma — 7:30 PM' },
  { id: 4, number: 'T4', seats: 4, status: 'available' },
  { id: 5, number: 'T5', seats: 4, status: 'reserved', bookedFor: 'Patel Family — 8:00 PM' },
  { id: 6, number: 'T6', seats: 6, status: 'available' },
  { id: 7, number: 'T7', seats: 6, status: 'booked', bookedFor: 'Corporate Dinner — 7:00 PM' },
  { id: 8, number: 'T8', seats: 6, status: 'cleaning' },
  { id: 9, number: 'T9', seats: 8, status: 'available' },
  { id: 10, number: 'T10', seats: 8, status: 'booked', bookedFor: 'Anniversary — 8:30 PM' },
  { id: 11, number: 'T11', seats: 2, status: 'available' },
  { id: 12, number: 'T12', seats: 4, status: 'reserved', bookedFor: 'Dr. Mehta — 9:00 PM' },
]

const STORAGE_KEY = 'aurelius_tables'

export function loadTables(): TableInfo[] {
  if (typeof window === 'undefined') return DEFAULT_TABLES
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch {}
  return DEFAULT_TABLES
}

export function saveTables(tables: TableInfo[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tables))
  } catch {}
}

export const STATUS_CONFIG: Record<TableStatus, { label: string; color: string; bg: string; border: string; dot: string }> = {
  available: {
    label: 'Available',
    color: '#166534',
    bg: '#F0FDF4',
    border: '#86EFAC',
    dot: '#22C55E',
  },
  booked: {
    label: 'Booked',
    color: '#9A1515',
    bg: '#FEF2F2',
    border: '#FECACA',
    dot: '#EF4444',
  },
  reserved: {
    label: 'Reserved',
    color: '#92400E',
    bg: '#FFFBEB',
    border: '#FCD34D',
    dot: '#F59E0B',
  },
  cleaning: {
    label: 'Cleaning',
    color: '#1E40AF',
    bg: '#EFF6FF',
    border: '#93C5FD',
    dot: '#3B82F6',
  },
}
