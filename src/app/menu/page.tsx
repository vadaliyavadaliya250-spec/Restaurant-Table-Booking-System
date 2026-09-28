'use client'

import { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Leaf, Flame, Wheat, Star, Clock, Zap, UtensilsCrossed, Grid3X3, Clock3, Users } from 'lucide-react'
import { menuData } from '@/lib/menuData'
import { MenuItem } from '@/types/menu'
import { loadTables, STATUS_CONFIG, TableInfo, BookingDetails } from '@/lib/tableStore'
import { useLanguage } from '@/lib/useLanguage'
import { useT } from '@/lib/translate'

type PageTab = 'menu' | 'tables'

// ─── WAITLIST TYPES ───────────────────────────────────────────────────────────
export interface WaitlistEntry {
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

// ─── TRANSLATIONS ───────────────────────────────────────────────────────────
const TRANSLATIONS = {
  en: {
    languageLabel: 'Language',
    languageEnglish: 'English',
    languageHindi: 'हिंदी',
    languageGujarati: 'ગુજરાતી',
    menu: 'Menu',
    tables: 'Tables',
    searchPlaceholder: 'Search dishes...',
    voiceNotSupported: 'Voice search not supported',
    noDishes: 'No dishes found',
    allPricesInrHint: 'All prices in INR',
    tableAvailabilityTitle: 'Table Availability',
    liveStatus: 'Live status of all tables',
    tapToBook: 'Tap to book',
    tapHint: 'Need help? Call us at ',
    chefRecommendations: "Chef's Recommendations",
    vegetarian: 'Vegetarian',
    spicy: 'Spicy',
    glutenFree: 'Gluten Free',
    chefPick: "Chef's Pick",
    prepTime: 'Prep Time',
    calories: 'Calories',
    bookTable: 'Book Table',
    fullName: 'FULL NAME',
    phoneNumber: 'PHONE NUMBER',
    totalPeople: 'TOTAL PEOPLE',
    arrivalTime: 'ARRIVAL TIME',
    restaurant: 'RESTAURANT',
    specialRequests: 'SPECIAL REQUESTS (Optional)',
    sendOtp: 'Send OTP',
    resendOtp: 'Resend OTP',
    sendingOtp: 'Sending OTP…',
    otpSent: 'OTP sent. Please check your phone.',
    enterOtp: 'Enter OTP',
    verify: 'Verify',
    verifying: 'Verifying…',
    verified: 'Verified',
    otpVerified: 'OTP verified',
    cancel: 'Cancel',
    confirmBooking: '✓ Confirm Booking',
    booking: 'Booking...',
    selectAdditionalTables: 'Select additional table(s)',
    needed: 'needed',
    seats: 'seats',
    selectTablesHint: 'You must select',
    additionalTables: 'additional table(s).',
    maxPerTable: 'Max',
    perTableInfo: 'people per table. This booking needs',
    tables_unit: 'table(s).',
    pleaseEnterName: 'Please enter your name',
    pleaseEnterPhone: 'Please enter a phone number',
    pleaseSelectArrival: 'Please select arrival time',
    selectTablesMatch: 'Please select additional table(s) to match people',
    perTable: 'per table',
    duplicateTable: 'Primary table is already selected',
    duplicateTableSelection: 'Duplicate table selection detected',
    verifyOtpBefore: 'Please verify OTP before confirming booking',
    placeholder_name: 'Your full name',
    placeholder_phone: '+91 XXXX XXXX XX',
    placeholder_specialRequests: 'Any special requests?',
    confirmationText: 'A confirmation will appear in the admin panel. Your booking is live!',
    allergiesInfo: '💁 Please inform your server of any allergies or dietary requirements. Our team is happy to customise dishes where possible.',
    confirmBookingTitle: 'Book Table',
    selectSeats: 'seats',
    joinWaitlist: 'Join Waitlist',
    waitlistTitle: 'Join Waiting List',
    waitlistSubtitle: 'All tables are currently booked. Join the waitlist and we\'ll automatically book a table for you when one becomes available.',
    waitlistPosition: 'Your position',
    waitlistCount: 'people waiting',
    waitlistSuccess: 'You\'re on the waitlist!',
    waitlistSuccessMsg: 'We\'ll automatically book a table for you as soon as one becomes available. You are #',
    waitlistSuccessMsg2: ' in the queue.',
    waitlistAutoBooked: '🎉 Auto-booked!',
    waitlistAutoBookedMsg: 'A table became available and was automatically booked for you!',
    viewWaitlist: 'View Waitlist',
    waitlistEmpty: 'No one is waiting',
    waitlistEmptyMsg: 'All guests have been seated or waitlist is empty.',
    inQueue: 'in queue',
    addedAt: 'Added',
    autoBookedAt: 'Booked',
    waitingStatus: 'Waiting',
    autoBookedStatus: 'Seated',
    confirmWaitlist: '+ Join Waitlist',
    joiningWaitlist: 'Joining...',
    allTablesBooked: 'All Tables Booked',
    allTablesBookedMsg: 'No tables available right now.',
    waitlistNote: 'You\'ll receive automatic confirmation when a table is assigned.',
  },
  hi: {
    languageLabel: 'भाषा',
    languageEnglish: 'English',
    languageHindi: 'हिंदी',
    languageGujarati: 'ગુજરાતી',
    menu: 'मेनू',
    tables: 'टेबल',
    searchPlaceholder: 'डिश खोजें...',
    voiceNotSupported: 'वॉयस सर्च समर्थित नहीं है',
    noDishes: 'कोई डिश नहीं मिली',
    allPricesInrHint: 'सभी कीमतें INR में हैं',
    tableAvailabilityTitle: 'टेबल उपलब्धता',
    liveStatus: 'सभी टेबल की लाइव स्थिति',
    tapToBook: 'बुक करने के लिए टैप करें',
    tapHint: 'सहायता चाहिए? हमें कॉल करें ',
    chefRecommendations: 'शेफ की सिफारिशें',
    vegetarian: 'शाकाहारी',
    spicy: 'मसालेदार',
    glutenFree: 'ग्लूटेन फ्री',
    chefPick: 'शेफ का पिक',
    prepTime: 'तैयारी का समय',
    calories: 'कैलोरी',
    bookTable: 'टेबल बुक करें',
    fullName: 'पूरा नाम',
    phoneNumber: 'फोन नंबर',
    totalPeople: 'कुल लोग',
    arrivalTime: 'आगमन का समय',
    restaurant: 'रेस्तरां',
    specialRequests: 'विशेष अनुरोध (वैकल्पिक)',
    sendOtp: 'OTP भेजें',
    resendOtp: 'OTP फिर से भेजें',
    sendingOtp: 'OTP भेजा जा रहा है…',
    otpSent: 'OTP भेजा गया। कृपया अपना फोन चेक करें।',
    enterOtp: 'OTP दर्ज करें',
    verify: 'सत्यापित करें',
    verifying: 'सत्यापन चल रहा है…',
    verified: 'सत्यापित',
    otpVerified: 'OTP सत्यापित',
    cancel: 'रद्द करें',
    confirmBooking: '✓ बुकिंग की पुष्टि करें',
    booking: 'बुकिंग की जा रही है...',
    selectAdditionalTables: 'अतिरिक्त टेबल चुनें',
    needed: 'आवश्यक',
    seats: 'सीटें',
    selectTablesHint: 'आपको चुनना होगा',
    additionalTables: 'अतिरिक्त टेबल।',
    maxPerTable: 'अधिकतम',
    perTableInfo: 'लोग प्रति टेबल। इस बुकिंग को चाहिए',
    tables_unit: 'टेबल।',
    pleaseEnterName: 'कृपया अपना नाम दर्ज करें',
    pleaseEnterPhone: 'कृपया फोन नंबर दर्ज करें',
    pleaseSelectArrival: 'कृपया आगमन का समय चुनें',
    selectTablesMatch: 'कृपया लोगों से मेल खाने के लिए अतिरिक्त टेबल चुनें',
    perTable: 'प्रति टेबल',
    duplicateTable: 'प्राथमिक टेबल पहले से चयनित है',
    duplicateTableSelection: 'डुप्लिकेट टेबल चयन पाया गया',
    verifyOtpBefore: 'बुकिंग की पुष्टि करने से पहले OTP सत्यापित करें',
    placeholder_name: 'आपका पूरा नाम',
    placeholder_phone: '+91 XXXX XXXX XX',
    placeholder_specialRequests: 'कोई विशेष अनुरोध?',
    confirmationText: 'एक पुष्टिकरण व्यवस्थापक पैनल में दिखाई देगा। आपकी बुकिंग सक्रिय है!',
    allergiesInfo: '💁 कृपया अपने सर्वर को किसी भी एलर्जी या आहार संबंधी आवश्यकताओं के बारे में सूचित करें। हमारी टीम जहां संभव हो डिश को अनुकूलित करने में खुश है।',
    confirmBookingTitle: 'टेबल बुक करें',
    selectSeats: 'सीटें',
    joinWaitlist: 'प्रतीक्षा सूची में जुड़ें',
    waitlistTitle: 'प्रतीक्षा सूची में जुड़ें',
    waitlistSubtitle: 'सभी टेबल बुक हैं। प्रतीक्षा सूची में जुड़ें और जैसे ही कोई टेबल उपलब्ध होगी, आपके लिए स्वचालित रूप से बुक कर दी जाएगी।',
    waitlistPosition: 'आपकी स्थिति',
    waitlistCount: 'लोग प्रतीक्षा में',
    waitlistSuccess: 'आप प्रतीक्षा सूची में हैं!',
    waitlistSuccessMsg: 'जैसे ही टेबल उपलब्ध होगी, स्वचालित रूप से बुक कर दी जाएगी। आप #',
    waitlistSuccessMsg2: ' नंबर पर हैं।',
    waitlistAutoBooked: '🎉 स्वचालित बुकिंग!',
    waitlistAutoBookedMsg: 'एक टेबल उपलब्ध हुई और आपके लिए स्वचालित रूप से बुक कर दी गई!',
    viewWaitlist: 'प्रतीक्षा सूची देखें',
    waitlistEmpty: 'कोई प्रतीक्षा नहीं',
    waitlistEmptyMsg: 'प्रतीक्षा सूची खाली है।',
    inQueue: 'प्रतीक्षा में',
    addedAt: 'जोड़ा गया',
    autoBookedAt: 'बुक किया गया',
    waitingStatus: 'प्रतीक्षा',
    autoBookedStatus: 'बैठाया गया',
    confirmWaitlist: '+ प्रतीक्षा में जुड़ें',
    joiningWaitlist: 'जोड़ा जा रहा है...',
    allTablesBooked: 'सभी टेबल बुक',
    allTablesBookedMsg: 'अभी कोई टेबल उपलब्ध नहीं।',
    waitlistNote: 'टेबल मिलने पर स्वचालित पुष्टि होगी।',
  },
  gu: {
    languageLabel: 'ભાષા',
    languageEnglish: 'English',
    languageHindi: 'हिंदी',
    languageGujarati: 'ગુજરાતી',
    menu: 'મેનુ',
    tables: 'ટેબલ્સ',
    searchPlaceholder: 'ડિશ શોધો...',
    voiceNotSupported: 'વોઇસ સર્ચ સપોર્ટેડ નથી',
    noDishes: 'કોઈ ડિશ મળી નથી',
    allPricesInrHint: 'તમામ ભાવ INR માં છે',
    tableAvailabilityTitle: 'ટેબલ ઉપલબ્ધતા',
    liveStatus: 'બધી ટેબલ્સની લાઇવ સ્થિતિ',
    tapToBook: 'બુક કરવા માટે ટેપ કરો',
    tapHint: 'મદદ જોઈએ? આપણને કૉલ કરો ',
    chefRecommendations: 'શેફની ભલામણો',
    vegetarian: 'શાકાહારી',
    spicy: 'મસાલેદાર',
    glutenFree: 'ગ્લુટેન ફ્રી',
    chefPick: 'શેફનો પિક',
    prepTime: 'તૈયારીનો સમય',
    calories: 'કેલોરી',
    bookTable: 'ટેબલ બુક કરો',
    fullName: 'પૂરું નામ',
    phoneNumber: 'ફોન નંબર',
    totalPeople: 'કુલ લોકો',
    arrivalTime: 'આગમનનો સમય',
    restaurant: 'રેસ્તોરાં',
    specialRequests: 'વિશેષ વિનંતીઓ (વૈકલ્પિક)',
    sendOtp: 'OTP મોકલો',
    resendOtp: 'OTP ફરીથી મોકલો',
    sendingOtp: 'OTP મોકલવામાં આવી રહ્યો છે…',
    otpSent: 'OTP મોકલાયો. કૃપયા તમારો ફોન તપાસો.',
    enterOtp: 'OTP દાખલ કરો',
    verify: 'ચકાસો',
    verifying: 'ચકાસણી ચાલી રહી છે…',
    verified: 'ચકાસાયું',
    otpVerified: 'OTP ચકાસાયું',
    cancel: 'રદ કરો',
    confirmBooking: '✓ બુકિંગ પુષ્ટિ કરો',
    booking: 'બુકિંગ ચાલી રહી છે...',
    selectAdditionalTables: 'વધારાની ટેબલ્સ પસંદ કરો',
    needed: 'જરૂરી',
    seats: 'બેઠક',
    selectTablesHint: 'તમારે પસંદ કરવું જોઈએ',
    additionalTables: 'વધારાની ટેબલ્સ',
    maxPerTable: 'મહત્તમ',
    perTableInfo: 'લોકો પ્રતિ ટેબલ. આ બુકિંગને જરૂર છે',
    tables_unit: 'ટેબલ્સ.',
    pleaseEnterName: 'કૃપયા તમારું નામ દાખલ કરો',
    pleaseEnterPhone: 'કૃપયા ફોન નંબર દાખલ કરો',
    pleaseSelectArrival: 'કૃપયા આગમનનો સમય પસંદ કરો',
    selectTablesMatch: 'કૃપયા લોકોને મેળવવા માટે વધારાની ટેબલ્સ પસંદ કરો',
    perTable: 'પ્રતિ ટેબલ',
    duplicateTable: 'પ્રાથમિક ટેબલ પહેલેથી જ પસંદ છે',
    duplicateTableSelection: 'ડુપ્લિકેટ ટેબલ નિર્વાચન મળ્યું',
    verifyOtpBefore: 'બુકિંગ પુષ્ટિ કરતા પહેલે OTP ચકાસો',
    placeholder_name: 'તમારું પૂરું નામ',
    placeholder_phone: '+91 XXXX XXXX XX',
    placeholder_specialRequests: 'કોઈ વિશેષ વિનંતી?',
    confirmationText: 'એક પુષ્ટિ વહીવટ પેનલમાં દેખાશે. તમારી બુકિંગ લાઇવ છે!',
    allergiesInfo: '💁 કૃપયા તમારા સર્વરને કોઈપણ એલર્જી અથવા આહાર આવશ્યકતાઓ વિશે જણાવો. અમારી ટીમ જ્યાં સંભવ હોય ત્યાં ડિશને કસ્ટમાઇઝ કરવામાં ખુશ છે.',
    confirmBookingTitle: 'ટેબલ બુક કરો',
    selectSeats: 'બેઠક',
    joinWaitlist: 'પ્રતીક્ષા સૂચિમાં જોડાઓ',
    waitlistTitle: 'પ્રતીક્ષા સૂચિ',
    waitlistSubtitle: 'બધી ટેબલ્સ બુક છે. પ્રતીક્ષા સૂચિમાં જોડાઓ અને ટેબલ ઉપલબ્ધ થાય ત્યારે આપોઆપ બુક થઈ જશે.',
    waitlistPosition: 'તમારી સ્થિતિ',
    waitlistCount: 'લોકો રાહ જોઈ રહ્યા છે',
    waitlistSuccess: 'તમે પ્રતીક્ષા સૂચિમાં છો!',
    waitlistSuccessMsg: 'ટેબલ ઉપલબ્ધ થતાં આપોઆપ બુક થઈ જશે. તમે #',
    waitlistSuccessMsg2: ' નંબર પર છો.',
    waitlistAutoBooked: '🎉 આપોઆપ બુક!',
    waitlistAutoBookedMsg: 'ટેબલ ઉપલબ્ધ થઈ અને તમારા માટે આપોઆપ બુક થઈ ગઈ!',
    viewWaitlist: 'પ્રતીક્ષા સૂચિ જુઓ',
    waitlistEmpty: 'કોઈ રાહ નથી',
    waitlistEmptyMsg: 'પ્રતીક્ષા સૂચિ ખાલી છે.',
    inQueue: 'રાહ જોઈ રહ્યા છે',
    addedAt: 'ઉમેર્યું',
    autoBookedAt: 'બુક થયું',
    waitingStatus: 'રાહ',
    autoBookedStatus: 'બેઠા',
    confirmWaitlist: '+ પ્રતીક્ષામાં જોડાઓ',
    joiningWaitlist: 'જોડવામાં આવી રહ્યું છે...',
    allTablesBooked: 'બધી ટેબલ્સ બુક',
    allTablesBookedMsg: 'હવે કોઈ ટેબલ ઉપલબ્ધ નથી.',
    waitlistNote: 'ટેબલ મળ્યા પછી આપોઆપ પુષ્ટિ મળશે.',
  },
} as const

// ─── WAITLIST HELPERS ─────────────────────────────────────────────────────────
const WAITLIST_KEY = 'aurelius_waitlist'

function loadWaitlist(): WaitlistEntry[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(WAITLIST_KEY)
    if (!raw) return []
    return JSON.parse(raw) as WaitlistEntry[]
  } catch {
    return []
  }
}

function saveWaitlist(list: WaitlistEntry[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(WAITLIST_KEY, JSON.stringify(list))
  } catch {}
}

// ─── WAITLIST WHATSAPP HELPER (no API key) ────────────────────────────────────
function normalizePhoneForWaMe(phone: string): string {
  // wa.me expects digits only, WITHOUT '+'
  return phone.replace(/\D/g, '')
} 

function buildWaitlistWhatsAppMessage(args: {
  guestName: string
  tableNumber: string | number
  restaurantName: string
}): string {
  const { guestName, tableNumber, restaurantName } = args
  return (
    `Hello ${guestName} 👋\n\n` +
    `Good news! Your table No. ${tableNumber} at ${restaurantName} is ready.\n` +
    `Please come to your table now.`
  )
}

async function sendWaitlistWhatsApp(
  phoneNumber: string,
  guestName: string,
  tableNumber: string | number,
  restaurantName: string
): Promise<void> {
  const waPhone = normalizePhoneForWaMe(phoneNumber)
  if (!waPhone) return

  const message = buildWaitlistWhatsAppMessage({ guestName, tableNumber, restaurantName })
  const url = `https://wa.me/${waPhone}?text=${encodeURIComponent(message)}`
  window.open(url, '_blank', 'noopener,noreferrer')
}


// ─── WAITLIST MODAL ───────────────────────────────────────────────────────────
function WaitlistModal({
  onClose,
  onSuccess,
  waitingCount,
  t,
}: {
  onClose: () => void
  onSuccess: (entry: WaitlistEntry) => void
  waitingCount: number
  t: any
}) {
  const [form, setForm] = useState({ name: '', phoneNumber: '', totalPeople: 2, additionalNotes: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const handleJoin = async () => {
    if (!form.name.trim()) { setError(t.pleaseEnterName); return }
    if (!form.phoneNumber.trim()) { setError(t.pleaseEnterPhone); return }
    if (form.totalPeople < 1) { setError('Please enter valid number of people'); return }

    setLoading(true)
    setError('')
    await new Promise(r => setTimeout(r, 500))

    const entry: WaitlistEntry = {
      id: `wl_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      name: form.name.trim(),
      phoneNumber: form.phoneNumber.trim(),
      totalPeople: form.totalPeople,
      additionalNotes: form.additionalNotes.trim(),
      createdAt: new Date().toISOString(),
      status: 'waiting',
    }

    const existing = loadWaitlist()
    const updated = [...existing, entry]
    saveWaitlist(updated)

    setLoading(false)
    onSuccess(entry)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: 'rgba(26,15,8,0.82)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="w-full max-w-lg rounded-t-3xl overflow-hidden"
        style={{ background: '#FDFAF5', maxHeight: '90vh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="px-6 pt-6 pb-4 flex items-center justify-between"
          style={{ borderBottom: '1px solid rgba(184,147,58,0.12)' }}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Clock3 size={16} style={{ color: '#B8933A' }} />
              <h3 className="font-medium text-lg" style={{ color: '#1A0F08', fontFamily: 'var(--font-cormorant, Georgia, serif)' }}>
                {t.waitlistTitle}
              </h3>
            </div>
            <p className="text-xs opacity-50 mt-0.5 leading-snug" style={{ fontFamily: 'var(--font-dm-sans, sans-serif)' }}>
              {t.waitlistSubtitle}
            </p>
          </div>
          <button type="button" onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ml-3"
            style={{ background: 'rgba(184,147,58,0.1)' }}>
            <X size={16} style={{ color: '#B8933A' }} />
          </button>
        </div>

        {waitingCount > 0 && (
          <div className="mx-6 mt-4 rounded-xl px-4 py-3 flex items-center gap-3"
            style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
            <Users size={14} style={{ color: '#B45309' }} />
            <span className="text-xs font-medium" style={{ color: '#B45309', fontFamily: 'var(--font-dm-sans, sans-serif)' }}>
              {waitingCount} {t.waitlistCount}
            </span>
          </div>
        )}

        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1.5"
              style={{ color: '#B8933A', fontFamily: 'var(--font-dm-sans, sans-serif)', letterSpacing: '0.1em' }}>
              {t.fullName} *
            </label>
            <input
              type="text" placeholder={t.placeholder_name} value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: 'rgba(44,24,16,0.05)', border: '1px solid rgba(184,147,58,0.15)', color: '#1A0F08', fontFamily: 'var(--font-dm-sans, sans-serif)' }}
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5"
              style={{ color: '#B8933A', fontFamily: 'var(--font-dm-sans, sans-serif)', letterSpacing: '0.1em' }}>
              {t.phoneNumber} *
            </label>
            <input
              type="tel" placeholder={t.placeholder_phone} value={form.phoneNumber}
              onChange={e => setForm({ ...form, phoneNumber: e.target.value })}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: 'rgba(44,24,16,0.05)', border: '1px solid rgba(184,147,58,0.15)', color: '#1A0F08', fontFamily: 'var(--font-dm-sans, sans-serif)' }}
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5"
              style={{ color: '#B8933A', fontFamily: 'var(--font-dm-sans, sans-serif)', letterSpacing: '0.1em' }}>
              {t.totalPeople} *
            </label>
            <input
              type="number" min={1} step={1} value={form.totalPeople}
              onChange={e => setForm({ ...form, totalPeople: parseInt(e.target.value) || 1 })}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: 'rgba(44,24,16,0.05)', border: '1px solid rgba(184,147,58,0.15)', color: '#1A0F08', fontFamily: 'var(--font-dm-sans, sans-serif)' }}
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5"
              style={{ color: '#B8933A', fontFamily: 'var(--font-dm-sans, sans-serif)', letterSpacing: '0.1em' }}>
              {t.specialRequests}
            </label>
            <textarea
              placeholder={t.placeholder_specialRequests} value={form.additionalNotes}
              onChange={e => setForm({ ...form, additionalNotes: e.target.value })}
              rows={2} className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
              style={{ background: 'rgba(44,24,16,0.05)', border: '1px solid rgba(184,147,58,0.15)', color: '#1A0F08', fontFamily: 'var(--font-dm-sans, sans-serif)' }}
            />
          </div>

          <div className="rounded-xl p-3" style={{ background: 'rgba(184,147,58,0.06)', border: '1px solid rgba(184,147,58,0.15)' }}>
            <p className="text-xs" style={{ color: '#B8933A', fontFamily: 'var(--font-dm-sans, sans-serif)', lineHeight: 1.5 }}>
              🔔 {t.waitlistNote}
            </p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="text-xs px-3 py-2 rounded-lg text-center"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444', fontFamily: 'var(--font-dm-sans, sans-serif)' }}>
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 rounded-xl font-medium text-sm"
              style={{ background: 'rgba(44,24,16,0.06)', color: '#1A0F08', border: '1px solid rgba(44,24,16,0.1)', fontFamily: 'var(--font-dm-sans, sans-serif)' }}>
              {t.cancel}
            </button>
            <button type="button" onClick={handleJoin} disabled={loading}
              className="flex-1 py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #B8933A, #D4AF6A)', color: '#1A0F08', fontFamily: 'var(--font-dm-sans, sans-serif)', opacity: loading ? 0.7 : 1 }}>
              {loading
                ? <><span className="inline-block w-3 h-3 rounded-full border-2 border-current border-t-transparent animate-spin" /> {t.joiningWaitlist}</>
                : t.confirmWaitlist}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── WAITLIST VIEW MODAL ──────────────────────────────────────────────────────
function WaitlistViewModal({ onClose, t }: { onClose: () => void; t: any }) {
  const [list, setList] = useState<WaitlistEntry[]>([])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    setList(loadWaitlist())
    const id = setInterval(() => setList(loadWaitlist()), 2000)
    return () => { document.body.style.overflow = ''; clearInterval(id) }
  }, [])

  const waitingList = list.filter(e => e.status === 'waiting')

  const formatTime = (iso: string) => {
    try {
      return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
    } catch { return '' }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: 'rgba(26,15,8,0.82)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="w-full max-w-lg rounded-t-3xl overflow-hidden"
        style={{ background: '#FDFAF5', maxHeight: '85vh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="px-6 pt-6 pb-4 flex items-center justify-between"
          style={{ borderBottom: '1px solid rgba(184,147,58,0.12)' }}>
          <div>
            <h3 className="font-medium text-lg" style={{ color: '#1A0F08', fontFamily: 'var(--font-cormorant, Georgia, serif)' }}>
              {t.viewWaitlist}
            </h3>
            <p className="text-xs opacity-50 mt-0.5" style={{ fontFamily: 'var(--font-dm-sans, sans-serif)' }}>
              {waitingList.length} {t.inQueue}
            </p>
          </div>
          <button type="button" onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(184,147,58,0.1)' }}>
            <X size={16} style={{ color: '#B8933A' }} />
          </button>
        </div>

        <div className="px-6 py-4 pb-10">
          {waitingList.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">⏳</div>
              <p className="font-medium" style={{ color: '#1A0F08', fontFamily: 'var(--font-cormorant, Georgia, serif)', fontSize: '1.2rem' }}>
                {t.waitlistEmpty}
              </p>
              <p className="text-sm opacity-40 mt-1" style={{ fontFamily: 'var(--font-dm-sans, sans-serif)' }}>
                {t.waitlistEmptyMsg}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {waitingList.map((entry, idx) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="rounded-2xl p-4"
                  style={{ background: 'rgba(184,147,58,0.06)', border: '1px solid rgba(184,147,58,0.15)' }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: 'rgba(184,147,58,0.15)' }}>
                        <span className="text-xs font-bold"
                          style={{ color: '#B8933A', fontFamily: 'var(--font-dm-sans, sans-serif)' }}>
                          {idx + 1}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-sm" style={{ color: '#1A0F08', fontFamily: 'var(--font-dm-sans, sans-serif)' }}>
                          {entry.name}
                        </p>
                        <p className="text-xs opacity-50" style={{ color: '#1A0F08', fontFamily: 'var(--font-dm-sans, sans-serif)' }}>
                          {entry.phoneNumber} • {entry.totalPeople} {t.seats}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full font-semibold"
                      style={{ background: 'rgba(245,158,11,0.15)', color: '#B45309', fontFamily: 'var(--font-dm-sans, sans-serif)' }}>
                      {t.waitingStatus}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-2 pl-11">
                    <span className="text-xs opacity-40" style={{ color: '#1A0F08', fontFamily: 'var(--font-dm-sans, sans-serif)' }}>
                      {t.addedAt} {formatTime(entry.createdAt)}
                    </span>
                  </div>
                  {entry.additionalNotes && (
                    <p className="text-xs mt-2 pl-11 opacity-50 italic"
                      style={{ color: '#1A0F08', fontFamily: 'var(--font-dm-sans, sans-serif)' }}>
                      "{entry.additionalNotes}"
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── WAITLIST SUCCESS TOAST ───────────────────────────────────────────────────
function WaitlistSuccessToast({ entry, position, onClose, t }: {
  entry: WaitlistEntry; position: number; onClose: () => void; t: any
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 40, scale: 0.9 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      className="fixed bottom-24 left-4 right-4 z-50 max-w-sm mx-auto rounded-2xl p-4 shadow-2xl"
      style={{ background: 'linear-gradient(135deg, #1A0F08, #2C1810)', border: '1px solid rgba(184,147,58,0.3)' }}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(184,147,58,0.2)' }}>
          <Clock3 size={18} style={{ color: '#D4AF6A' }} />
        </div>
        <div className="flex-1">
          <p className="font-medium text-sm" style={{ color: '#FDFAF5', fontFamily: 'var(--font-cormorant, Georgia, serif)', fontSize: '1rem' }}>
            {t.waitlistSuccess}
          </p>
          <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'rgba(253,250,245,0.6)', fontFamily: 'var(--font-dm-sans, sans-serif)' }}>
            {t.waitlistSuccessMsg}<strong style={{ color: '#D4AF6A' }}>#{position}</strong>{t.waitlistSuccessMsg2}
          </p>
        </div>
        <button type="button" onClick={onClose} className="flex-shrink-0">
          <X size={14} style={{ color: 'rgba(253,250,245,0.4)' }} />
        </button>
      </div>
    </motion.div>
  )
}

// ─── AUTO BOOK TOAST ──────────────────────────────────────────────────────────
function AutoBookedToast({ tableNumber, onClose, t }: { tableNumber: number | string; onClose: () => void; t: any }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 6000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 40, scale: 0.9 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      className="fixed bottom-24 left-4 right-4 z-50 max-w-sm mx-auto rounded-2xl p-4 shadow-2xl"
      style={{ background: 'linear-gradient(135deg, #14532d, #166534)', border: '1px solid rgba(34,197,94,0.3)' }}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">🎉</span>
        <div className="flex-1">
          <p className="font-medium" style={{ color: '#FDFAF5', fontFamily: 'var(--font-cormorant, Georgia, serif)', fontSize: '1rem' }}>
            {t.waitlistAutoBooked}
          </p>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(253,250,245,0.7)', fontFamily: 'var(--font-dm-sans, sans-serif)' }}>
            Table {tableNumber} — {t.waitlistAutoBookedMsg}
          </p>
        </div>
        <button type="button" onClick={onClose}><X size={14} style={{ color: 'rgba(253,250,245,0.4)' }} /></button>
      </div>
    </motion.div>
  )
}

// ─── Menu Item Card ────────────────────────────────────────────────────────
const MenuItemCard = memo(function MenuItemCard({ item, onSelect, formatPrice, t }: {
  item: MenuItem, onSelect: (item: MenuItem) => void, formatPrice: (p: number) => string, t: any
}) {
  return (
    <div
      onClick={() => onSelect(item)}
      className="flex gap-4 rounded-2xl p-4 cursor-pointer active:scale-[0.98] transition-transform duration-150"
      style={{ background: '#FFFFFF', border: '1px solid rgba(184,147,58,0.08)', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>
      <div className="flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden relative">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
        {item.featured && <div className="absolute top-1 right-1"><Star size={12} fill="#B8933A" style={{ color: '#B8933A' }} /></div>}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium leading-tight" style={{ color: '#1A0F08', fontFamily: 'var(--font-cormorant, Georgia, serif)', fontSize: '1.1rem' }}>{item.name}</h3>
          <span className="flex-shrink-0 font-semibold text-sm" style={{ color: '#B8933A', fontFamily: 'var(--font-dm-sans, sans-serif)' }}>₹{item.price.toLocaleString('en-IN')}</span>
        </div>
        <p className="text-xs leading-relaxed mt-1 line-clamp-2 opacity-60" style={{ color: '#1A0F08', fontFamily: 'var(--font-dm-sans, sans-serif)' }}>{item.description}</p>
        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
          {item.vegetarian && <span className="badge-veg text-xs px-1.5 py-0.5 rounded-full flex items-center gap-0.5" style={{ fontSize: '0.6rem', letterSpacing: '0.05em' }}><Leaf size={8} />{t.vegetarian}</span>}
          {item.spicy && <span className="badge-spicy text-xs px-1.5 py-0.5 rounded-full flex items-center gap-0.5" style={{ fontSize: '0.6rem', letterSpacing: '0.05em' }}><Flame size={8} />{t.spicy}</span>}
          {item.glutenFree && <span className="badge-gf text-xs px-1.5 py-0.5 rounded-full flex items-center gap-0.5" style={{ fontSize: '0.6rem', letterSpacing: '0.05em' }}><Wheat size={8} />{t.glutenFree}</span>}
          {item.prepTime && <span className="flex items-center gap-0.5 opacity-40" style={{ fontSize: '0.6rem', color: '#1A0F08', fontFamily: 'var(--font-dm-sans, sans-serif)' }}><Clock size={8} />{item.prepTime}</span>}
          {item.calories && <span className="flex items-center gap-0.5 opacity-40" style={{ fontSize: '0.6rem', color: '#1A0F08', fontFamily: 'var(--font-dm-sans, sans-serif)' }}><Zap size={8} />{item.calories} cal</span>}
        </div>
      </div>
    </div>
  )
})

// ─── Featured Section ─────────────────────────────────────────────────────
const FeaturedSection = memo(function FeaturedSection({ items, onSelect, t }: { items: MenuItem[], onSelect: (item: MenuItem) => void, t: any }) {
  return (
    <div className="mb-4 px-4">
      <div className="flex items-center gap-2 mb-3 px-2">
        <Star size={12} style={{ color: '#B8933A' }} />
        <span className="text-xs tracking-[0.2em] uppercase font-medium" style={{ color: '#B8933A', fontFamily: 'var(--font-dm-sans, sans-serif)' }}>{t.chefRecommendations}</span>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
        {items.map((item) => (
          <div key={item.id}
            onClick={() => onSelect(item)}
            className="flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer active:scale-95 transition-transform duration-150"
            style={{ width: '200px', background: '#2C1810' }}>
            <div className="relative h-28">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover opacity-80" loading="lazy" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(26,15,8,0.8) 0%, transparent 50%)' }} />
              <div className="absolute bottom-2 left-3 right-3">
                <p className="text-white text-sm font-medium leading-tight" style={{ fontFamily: 'var(--font-cormorant, Georgia, serif)' }}>{item.name}</p>
              </div>
            </div>
            <div className="px-3 py-2 flex items-center justify-between">
              <span className="text-xs font-semibold" style={{ color: '#D4AF6A', fontFamily: 'var(--font-dm-sans, sans-serif)' }}>₹{item.price.toLocaleString('en-IN')}</span>
              {item.prepTime && <span className="text-xs opacity-40 flex items-center gap-1" style={{ color: '#FDFAF5' }}><Clock size={10} />{item.prepTime}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
})

// ─── Item Detail Modal ────────────────────────────────────────────────────────
const ItemModal = memo(function ItemModal({ item, onClose, formatPrice, language, t }: { item: MenuItem, onClose: () => void, formatPrice: (p: number) => string, language: 'en' | 'hi' | 'gu', t: any }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: 'rgba(26,15,8,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}>
      <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="w-full max-w-lg rounded-t-3xl overflow-hidden"
        style={{ background: '#FDFAF5', maxHeight: '90vh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}>
        <div className="relative h-64">
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(26,15,8,0.6) 0%, transparent 60%)' }} />
          <button type="button" onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(253,250,245,0.9)', backdropFilter: 'blur(8px)' }}>
            <X size={16} style={{ color: '#1A0F08' }} />
          </button>
          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
            <h2 className="text-2xl font-light text-white leading-tight" style={{ fontFamily: 'var(--font-cormorant, Georgia, serif)' }}>{item.name}</h2>
            <span className="text-xl font-bold" style={{ color: '#D4AF6A', fontFamily: 'var(--font-dm-sans, sans-serif)' }}>₹{item.price.toLocaleString('en-IN')}</span>
          </div>
        </div>
        <div className="px-6 py-6">
          <div className="flex flex-wrap gap-2 mb-5">
            {item.vegetarian && <span className="badge-veg text-xs px-3 py-1 rounded-full flex items-center gap-1.5 font-medium"><Leaf size={10} /> {t.vegetarian}</span>}
            {item.spicy && <span className="badge-spicy text-xs px-3 py-1 rounded-full flex items-center gap-1.5 font-medium"><Flame size={10} /> {t.spicy}</span>}
            {item.glutenFree && <span className="badge-gf text-xs px-3 py-1 rounded-full flex items-center gap-1.5 font-medium"><Wheat size={10} /> {t.glutenFree}</span>}
            {item.featured && <span className="text-xs px-3 py-1 rounded-full flex items-center gap-1.5 font-medium" style={{ background: 'rgba(184,147,58,0.15)', color: '#B8933A' }}><Star size={10} fill="currentColor" /> {t.chefPick}</span>}
          </div>
          <p className="leading-relaxed mb-6" style={{ color: '#2C1810', fontFamily: 'var(--font-dm-sans, sans-serif)', fontSize: '0.95rem', opacity: 0.8 }}>{item.description}</p>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {item.prepTime && (
              <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(184,147,58,0.06)', border: '1px solid rgba(184,147,58,0.12)' }}>
                <Clock size={18} style={{ color: '#B8933A' }} className="mx-auto mb-1" />
                <p className="text-xs opacity-50 font-medium" style={{ fontFamily: 'var(--font-dm-sans, sans-serif)' }}>{t.prepTime}</p>
                <p className="text-sm font-semibold mt-0.5" style={{ color: '#1A0F08', fontFamily: 'var(--font-dm-sans, sans-serif)' }}>{item.prepTime}</p>
              </div>
            )}
            {item.calories && (
              <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(184,147,58,0.06)', border: '1px solid rgba(184,147,58,0.12)' }}>
                <Zap size={18} style={{ color: '#B8933A' }} className="mx-auto mb-1" />
                <p className="text-xs opacity-50 font-medium" style={{ fontFamily: 'var(--font-dm-sans, sans-serif)' }}>{t.calories}</p>
                <p className="text-sm font-semibold mt-0.5" style={{ color: '#1A0F08', fontFamily: 'var(--font-dm-sans, sans-serif)' }}>{item.calories} kcal</p>
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2 mb-6">
            {item.tags.map(tag => (
              <span key={tag} className="text-xs px-3 py-1 rounded-full capitalize"
                style={{ background: 'rgba(44,24,16,0.06)', color: '#2C1810', fontFamily: 'var(--font-dm-sans, sans-serif)' }}>{tag}</span>
            ))}
          </div>
          <div className="rounded-xl p-4" style={{ background: 'rgba(184,147,58,0.06)', border: '1px solid rgba(184,147,58,0.15)' }}>
            <p className="text-xs" style={{ color: '#B8933A', fontFamily: 'var(--font-dm-sans, sans-serif)' }}>
              {t.allergiesInfo}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
})

// ─── Table Booking Modal ──────────────────────────────────────────────────────
function TableBookingModal({
  table, onClose, onSuccess, availableTables, t,
}: {
  table: TableInfo; onClose: () => void; onSuccess: () => void; availableTables: TableInfo[]; t: any
}) {
  const DEFAULT_CAPACITY_PER_TABLE = 5
  const [formData, setFormData] = useState<BookingDetails>({
    name: '', totalPeople: 1, phoneNumber: '', restaurant: menuData.hotel.name, arrivalTime: '', additionalNotes: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [otpStatus, setOtpStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [otpMessage, setOtpMessage] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [otpSessionId, setOtpSessionId] = useState('')
  const [otpVerifyStatus, setOtpVerifyStatus] = useState<'idle' | 'verifying' | 'verified' | 'error'>('idle')
  const [otpVerifyMessage, setOtpVerifyMessage] = useState('')
  const otpInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => { document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = '' } }, [])
  useEffect(() => {
    setOtpStatus(prev => (prev === 'sending' ? prev : 'idle'))
    setOtpMessage(''); setOtpCode(''); setOtpSessionId(''); setOtpVerifyStatus('idle'); setOtpVerifyMessage('')
  }, [formData.phoneNumber])
  useEffect(() => { if (otpStatus === 'sent') otpInputRef.current?.focus() }, [otpStatus])

  const requiredTablesCount = useMemo(() => {
    const people = Number.isFinite(formData.totalPeople) ? formData.totalPeople : 1
    if (people <= DEFAULT_CAPACITY_PER_TABLE) return 1
    const remaining = people - DEFAULT_CAPACITY_PER_TABLE
    return 1 + Math.ceil(remaining / Math.max(1, DEFAULT_CAPACITY_PER_TABLE))
  }, [formData.totalPeople])

  const [selectedAdditionalTableIds, setSelectedAdditionalTableIds] = useState<number[]>([])
  const selectedTablesForBooking = useMemo(() => {
    const additional = selectedAdditionalTableIds.map((id) => availableTables.find((t) => t.id === id)).filter(Boolean) as TableInfo[]
    return [table, ...additional]
  }, [availableTables, selectedAdditionalTableIds, table])

  const validateForm = () => {
    if (!formData.name.trim()) return t.pleaseEnterName
    if (!formData.phoneNumber.trim()) return t.pleaseEnterPhone
    if (!formData.arrivalTime) return t.pleaseSelectArrival
    const totalNeeded = requiredTablesCount
    if (selectedAdditionalTableIds.length !== Math.max(0, totalNeeded - 1))
      return `${t.selectTablesHint} ${Math.max(0, totalNeeded - 1)} ${t.additionalTables}`
    const unique = new Set(selectedAdditionalTableIds)
    if (unique.size !== selectedAdditionalTableIds.length) return t.duplicateTableSelection
    if (selectedAdditionalTableIds.includes(table.id)) return t.duplicateTable
    return ''
  }

  const handleSendOtp = async () => {
    if (!formData.phoneNumber.trim()) { setOtpStatus('error'); setOtpMessage('Please enter phone number first'); return }
    setOtpStatus('sending'); setOtpMessage(''); setOtpCode('')
    try {
      const res = await fetch('/api/otp/send', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ phone: formData.phoneNumber }) })
      const data = await res.json().catch(() => null)
      if (!res.ok) { let message = 'Failed to send OTP'; if (data?.error) message = data.error; throw new Error(message) }
      let sessionId = ''
      if (data?.sessionId) sessionId = data.sessionId
      if (!sessionId) throw new Error('Failed to start OTP session. Please try again.')
      setOtpSessionId(sessionId); setOtpVerifyStatus('idle'); setOtpVerifyMessage(''); setOtpStatus('sent'); setOtpMessage(t.otpSent)
    } catch (e) { setOtpStatus('error'); setOtpMessage(e instanceof Error ? e.message : 'Failed to send OTP') }
  }

  const handleVerifyOtp = async () => {
    if (otpStatus !== 'sent' || !otpSessionId) { setOtpVerifyStatus('error'); setOtpVerifyMessage('Please send OTP first'); return }
    if (otpCode.trim().length < 4) { setOtpVerifyStatus('error'); setOtpVerifyMessage('Please enter OTP'); return }
    setOtpVerifyStatus('verifying'); setOtpVerifyMessage('')
    try {
      const res = await fetch('/api/otp/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sessionId: otpSessionId, otp: otpCode }) })
      const data = await res.json().catch(() => null)
      if (!res.ok) { let message = 'OTP verification failed'; if (data?.error) message = data.error; throw new Error(message) }
      setOtpVerifyStatus('verified'); setOtpVerifyMessage(t.otpVerified)
    } catch (e) { setOtpVerifyStatus('error'); setOtpVerifyMessage(e instanceof Error ? e.message : 'OTP verification failed') }
  }

  const normalizePhone = (phone: string) => phone.replace(/\D/g, '')
  const [duplicateConfirm, setDuplicateConfirm] = useState<{ open: boolean; message: string }>({ open: false, message: '' })

  const bookTables = async () => {
    setError(''); setLoading(true)
    await new Promise(r => setTimeout(r, 600))
    try {
      for (const tbl of selectedTablesForBooking) {
        const res = await fetch('/api/tables', {
          method: 'PATCH', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: tbl.id, patch: { status: 'booked', bookedFor: formData.name, bookingDetails: { ...formData, totalPeople: formData.totalPeople }, bookedAt: new Date().toISOString() } }),
          cache: 'no-store',
        })
        const data = await res.json().catch(() => null)
        if (!res.ok) { let message = 'Failed to book table'; if (data?.error) message = data.error; throw new Error(`${message} (${tbl.number})`) }
      }
      setLoading(false); onSuccess()
    } catch (e) { setError(e instanceof Error ? e.message : 'Failed to book table(s).'); setLoading(false) }
  }

  const handleSubmit = async () => {
    const validationError = validateForm()
    if (validationError) { setError(validationError); return }
    if (otpVerifyStatus !== 'verified') { setError(t.verifyOtpBefore); return }
    const normalizedInputPhone = normalizePhone(formData.phoneNumber)
    const existingBookedTables = availableTables
      .filter((tbl) => tbl.id !== table.id)
      .filter((tbl) => (tbl.status === 'booked' || tbl.status === 'reserved') && !!tbl.bookingDetails?.phoneNumber)
      .filter((tbl) => normalizePhone(tbl.bookingDetails!.phoneNumber) === normalizedInputPhone)
    if (existingBookedTables.length > 0) {
      const existingNumbers = Array.from(new Set(existingBookedTables.map(tbl => tbl.number))).join(', ')
      setDuplicateConfirm({ open: true, message: `You already booked table(s) ${existingNumbers} with this phone. Are you sure you want to book table ${table.number}?` })
      return
    }
    setDuplicateConfirm({ open: false, message: '' })
    await bookTables()
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: 'rgba(26,15,8,0.8)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}>
      <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="w-full max-w-lg rounded-t-3xl overflow-hidden"
        style={{ background: '#FDFAF5', maxHeight: '90vh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}>
        <div className="px-6 pt-6 pb-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(184,147,58,0.12)' }}>
          <div>
            <h3 className="font-medium text-lg" style={{ color: '#1A0F08', fontFamily: 'var(--font-cormorant, Georgia, serif)' }}>{t.bookTable} {table.number}</h3>
            <p className="text-xs opacity-50 mt-0.5" style={{ fontFamily: 'var(--font-dm-sans, sans-serif)' }}>{table.seats} {t.selectSeats} • The Aurelius</p>
          </div>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(184,147,58,0.1)' }}>
            <X size={16} style={{ color: '#B8933A' }} />
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">
          {[
            { label: t.fullName, type: 'text', placeholder: t.placeholder_name, key: 'name' as const, value: formData.name },
            { label: t.phoneNumber, type: 'tel', placeholder: t.placeholder_phone, key: 'phoneNumber' as const, value: formData.phoneNumber },
          ].map(field => (
            <div key={field.key}>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#B8933A', fontFamily: 'var(--font-dm-sans, sans-serif)', letterSpacing: '0.1em' }}>{field.label} *</label>
              <input type={field.type} placeholder={field.placeholder} value={field.value}
                onChange={e => setFormData({ ...formData, [field.key]: e.target.value })}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{ background: 'rgba(44,24,16,0.05)', border: '1px solid rgba(184,147,58,0.15)', color: '#1A0F08', fontFamily: 'var(--font-dm-sans, sans-serif)' }} />
              {field.key === 'phoneNumber' && (
                <div className="mt-2 space-y-2">
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={handleSendOtp} disabled={otpStatus === 'sending' || !formData.phoneNumber.trim()}
                      className="px-4 py-2 rounded-lg text-xs font-medium"
                      style={{ background: 'rgba(184,147,58,0.12)', border: '1px solid rgba(184,147,58,0.25)', color: '#B8933A', fontFamily: 'var(--font-dm-sans, sans-serif)', opacity: otpStatus === 'sending' || !formData.phoneNumber.trim() ? 0.6 : 1 }}>
                      {otpStatus === 'sending' ? t.sendingOtp : otpStatus === 'sent' ? t.resendOtp : t.sendOtp}
                    </button>
                    {!!otpMessage && <span className="text-xs" style={{ color: otpStatus === 'error' ? '#EF4444' : '#1A0F08', opacity: otpStatus === 'error' ? 1 : 0.6, fontFamily: 'var(--font-dm-sans, sans-serif)' }}>{otpMessage}</span>}
                  </div>
                  {otpStatus === 'sent' && (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input ref={otpInputRef} type="text" inputMode="numeric" pattern="[0-9]*" maxLength={4} placeholder={t.enterOtp} value={otpCode}
                          disabled={otpVerifyStatus === 'verifying' || otpVerifyStatus === 'verified'}
                          onChange={(e) => { if (otpVerifyStatus === 'error') { setOtpVerifyStatus('idle'); setOtpVerifyMessage('') } setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 4)) }}
                          className="flex-1 px-4 py-3 rounded-xl text-sm outline-none"
                          style={{ background: otpVerifyStatus === 'verified' ? 'rgba(34,197,94,0.06)' : otpVerifyStatus === 'error' ? 'rgba(239,68,68,0.06)' : 'rgba(44,24,16,0.05)', border: otpVerifyStatus === 'verified' ? '1px solid rgba(34,197,94,0.45)' : otpVerifyStatus === 'error' ? '1px solid rgba(239,68,68,0.45)' : '1px solid rgba(184,147,58,0.15)', color: '#1A0F08', fontFamily: 'var(--font-dm-sans, sans-serif)' }} />
                        <button type="button" onClick={handleVerifyOtp} disabled={otpVerifyStatus === 'verifying' || otpVerifyStatus === 'verified' || !otpSessionId || otpCode.trim().length < 4}
                          className="px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap"
                          style={{ background: otpVerifyStatus === 'verified' ? 'linear-gradient(135deg, #22C55E, #86EFAC)' : otpVerifyStatus === 'error' ? 'linear-gradient(135deg, #EF4444, #FCA5A5)' : 'linear-gradient(135deg, #B8933A, #D4AF6A)', color: '#1A0F08', fontFamily: 'var(--font-dm-sans, sans-serif)', opacity: otpVerifyStatus === 'verifying' || otpVerifyStatus === 'verified' || !otpSessionId || otpCode.trim().length < 4 ? 0.7 : 1 }}>
                          {otpVerifyStatus === 'verifying' ? t.verifying : otpVerifyStatus === 'verified' ? t.verified : t.verify}
                        </button>
                      </div>
                      <AnimatePresence>
                        {!!otpVerifyMessage && (
                          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="text-xs"
                            style={{ color: otpVerifyStatus === 'verified' ? '#166534' : '#EF4444', fontFamily: 'var(--font-dm-sans, sans-serif)' }}>
                            {otpVerifyMessage}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#B8933A', fontFamily: 'var(--font-dm-sans, sans-serif)', letterSpacing: '0.1em' }}>{t.totalPeople} *</label>
            <input type="number" min={1} step={1} value={formData.totalPeople} onChange={(e) => setFormData({ ...formData, totalPeople: parseInt(e.target.value) || 1 })}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: 'rgba(44,24,16,0.05)', border: '1px solid rgba(184,147,58,0.15)', color: '#1A0F08', fontFamily: 'var(--font-dm-sans, sans-serif)' }} />
            <p className="text-[11px] mt-1 opacity-60" style={{ color: '#1A0F08', fontFamily: 'var(--font-dm-sans, sans-serif)' }}>
              {t.maxPerTable} {DEFAULT_CAPACITY_PER_TABLE} {t.perTableInfo} <strong>{requiredTablesCount}</strong> {t.tables_unit}
            </p>
          </div>
          {requiredTablesCount > 1 && (
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#B8933A', fontFamily: 'var(--font-dm-sans, sans-serif)', letterSpacing: '0.1em' }}>
                {t.selectAdditionalTables} ({Math.max(0, requiredTablesCount - 1)} {t.needed})
              </label>
              <div className="grid grid-cols-2 gap-2">
                {availableTables.filter((tbl) => tbl.status === 'available' && tbl.id !== table.id).map((tbl) => {
                  const checked = selectedAdditionalTableIds.includes(tbl.id)
                  return (
                    <button key={tbl.id} type="button"
                      onClick={() => setSelectedAdditionalTableIds((prev) => {
                        const limit = Math.max(0, requiredTablesCount - 1)
                        if (checked) return prev.filter((id) => id !== tbl.id)
                        return [...prev, tbl.id].slice(0, limit)
                      })}
                      className="rounded-xl px-3 py-3 text-xs font-semibold border transition-all duration-150"
                      style={{ background: checked ? 'rgba(34,197,94,0.08)' : 'rgba(44,24,16,0.04)', borderColor: checked ? '#22C55E' : 'rgba(184,147,58,0.18)', color: '#1A0F08', fontFamily: 'var(--font-dm-sans, sans-serif)' }}>
                      {tbl.number}
                      <div className="text-[11px] opacity-60 mt-1">{tbl.seats} {tbl.seats === 1 ? 'seat' : 'seats'}</div>
                    </button>
                  )
                })}
              </div>
              <div className="mt-2 text-[11px] opacity-70" style={{ color: '#1A0F08', fontFamily: 'var(--font-dm-sans, sans-serif)' }}>
                {t.selectTablesHint} {Math.max(0, requiredTablesCount - 1)} {t.additionalTables}
              </div>
            </div>
          )}
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#B8933A', fontFamily: 'var(--font-dm-sans, sans-serif)', letterSpacing: '0.1em' }}>{t.arrivalTime} *</label>
            <input type="time" value={formData.arrivalTime} onChange={e => setFormData({ ...formData, arrivalTime: e.target.value })}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: 'rgba(44,24,16,0.05)', border: '1px solid rgba(184,147,58,0.15)', color: '#1A0F08', fontFamily: 'var(--font-dm-sans, sans-serif)' }} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#B8933A', fontFamily: 'var(--font-dm-sans, sans-serif)', letterSpacing: '0.1em' }}>{t.restaurant}</label>
            <input type="text" disabled value={formData.restaurant} className="w-full px-4 py-3 rounded-xl text-sm outline-none opacity-60"
              style={{ background: 'rgba(44,24,16,0.05)', border: '1px solid rgba(184,147,58,0.15)', color: '#1A0F08', fontFamily: 'var(--font-dm-sans, sans-serif)' }} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#B8933A', fontFamily: 'var(--font-dm-sans, sans-serif)', letterSpacing: '0.1em' }}>{t.specialRequests}</label>
            <textarea placeholder={t.placeholder_specialRequests} value={formData.additionalNotes} onChange={e => setFormData({ ...formData, additionalNotes: e.target.value })}
              rows={3} className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
              style={{ background: 'rgba(44,24,16,0.05)', border: '1px solid rgba(184,147,58,0.15)', color: '#1A0F08', fontFamily: 'var(--font-dm-sans, sans-serif)' }} />
          </div>
          <AnimatePresence>
            {error && (
              <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="text-xs px-3 py-2 rounded-lg text-center"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444', fontFamily: 'var(--font-dm-sans, sans-serif)' }}>
                {error}
              </motion.p>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {duplicateConfirm.open && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                className="rounded-xl p-3" style={{ background: 'rgba(245,158,11,0.10)', border: '1px solid rgba(245,158,11,0.25)' }}>
                <p className="text-[12px]" style={{ color: '#B45309', fontFamily: 'var(--font-dm-sans, sans-serif)', lineHeight: 1.5 }}>{duplicateConfirm.message}</p>
                <div className="flex gap-2 mt-3">
                  <button type="button" onClick={() => setDuplicateConfirm({ open: false, message: '' })} disabled={loading}
                    className="flex-1 py-2 rounded-xl font-medium text-xs"
                    style={{ background: 'rgba(44,24,16,0.06)', color: '#1A0F08', border: '1px solid rgba(44,24,16,0.1)', fontFamily: 'var(--font-dm-sans, sans-serif)', opacity: loading ? 0.7 : 1 }}>
                    {t.cancel}
                  </button>
                  <button type="button" onClick={async () => { setDuplicateConfirm({ open: false, message: '' }); await bookTables() }} disabled={loading}
                    className="flex-1 py-2 rounded-xl font-medium text-xs flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #F59E0B, #FBBF24)', color: '#1A0F08', fontFamily: 'var(--font-dm-sans, sans-serif)', opacity: loading ? 0.7 : 1 }}>
                    Confirm
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="rounded-xl p-3" style={{ background: 'rgba(184,147,58,0.06)', border: '1px solid rgba(184,147,58,0.15)' }}>
            <p className="text-xs" style={{ color: '#B8933A', fontFamily: 'var(--font-dm-sans, sans-serif)', lineHeight: 1.5 }}>📞 {t.confirmationText}</p>
          </div>
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl font-medium text-sm"
              style={{ background: 'rgba(44,24,16,0.06)', color: '#1A0F08', border: '1px solid rgba(44,24,16,0.1)', fontFamily: 'var(--font-dm-sans, sans-serif)' }}>
              {t.cancel}
            </button>
            <button type="button" onClick={handleSubmit} disabled={loading}
              className="flex-1 py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #B8933A, #D4AF6A)', color: '#1A0F08', fontFamily: 'var(--font-dm-sans, sans-serif)', opacity: loading ? 0.7 : 1 }}>
              {loading ? <><span className="inline-block w-3 h-3 rounded-full border-2 border-current border-t-transparent animate-spin" /> {t.booking}</> : <>{t.confirmBooking}</>}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Table Availability View ──────────────────────────────────────────────────
function TableAvailabilityView({
  tables, refreshTables, t,
  onWaitlistJoin, waitlist,
}: {
  tables: TableInfo[]; refreshTables: () => void; t: any;
  onWaitlistJoin: () => void; waitlist: WaitlistEntry[];
}) {
  const [selectedTable, setSelectedTable] = useState<TableInfo | null>(null)
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [showWaitlistView, setShowWaitlistView] = useState(false)

  const counts = useMemo(() => ({
    available: tables.filter(t => t.status === 'available').length,
    booked: tables.filter(t => t.status === 'booked').length,
    reserved: tables.filter(t => t.status === 'reserved').length,
    cleaning: tables.filter(t => t.status === 'cleaning').length,
  }), [tables])

  const allTablesBooked = counts.available === 0
  const waitingCount = waitlist.filter(e => e.status === 'waiting').length

  const handleTableClick = useCallback((table: TableInfo) => {
    if (table.status === 'available') { setSelectedTable(table); setShowBookingForm(true) }
  }, [])

  return (
    <div className="px-4 pt-4 pb-28">
      <div className="mb-4">
        <h2 className="text-3xl font-light" style={{ fontFamily: 'var(--font-cormorant, Georgia, serif)', color: '#1A0F08' }}>{t.tableAvailabilityTitle}</h2>
        <p className="text-sm opacity-50 mt-0.5" style={{ fontFamily: 'var(--font-dm-sans, sans-serif)', color: '#1A0F08' }}>{t.liveStatus}</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 mb-4" style={{ scrollbarWidth: 'none' }}>
        {(Object.entries(counts) as [keyof typeof counts, number][]).map(([status, count]) => {
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

      {allTablesBooked && (
        <motion.div
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="mb-4 rounded-2xl p-4"
          style={{ background: 'linear-gradient(135deg, rgba(26,15,8,0.96), rgba(44,24,16,0.95))', border: '1px solid rgba(184,147,58,0.3)' }}
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(184,147,58,0.2)' }}>
              <Clock3 size={16} style={{ color: '#D4AF6A' }} />
            </div>
            <div className="flex-1">
              <p className="font-medium" style={{ color: '#FDFAF5', fontFamily: 'var(--font-cormorant, Georgia, serif)', fontSize: '1rem' }}>
                {t.allTablesBooked}
              </p>
              <p className="text-xs mt-0.5 opacity-60" style={{ color: '#FDFAF5', fontFamily: 'var(--font-dm-sans, sans-serif)' }}>
                {t.allTablesBookedMsg}
                {waitingCount > 0 && <> {waitingCount} {t.waitlistCount}.</>}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onWaitlistJoin}
            className="mt-3 w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg, #B8933A, #D4AF6A)', color: '#1A0F08', fontFamily: 'var(--font-dm-sans, sans-serif)' }}
          >
            <Clock3 size={14} />
            {t.joinWaitlist}
          </button>
        </motion.div>
      )}

      {waitingCount > 0 && (
        <button
          type="button"
          onClick={() => setShowWaitlistView(true)}
          className="mb-4 w-full py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', color: '#B45309', fontFamily: 'var(--font-dm-sans, sans-serif)' }}
        >
          <Users size={14} />
          {t.viewWaitlist} — {waitingCount} {t.inQueue}
        </button>
      )}

      <div className="grid grid-cols-2 gap-3">
        {tables.map((table) => {
          const cfg = STATUS_CONFIG[table.status]
          const isClickable = table.status === 'available'
          return (
            <div key={table.id}
              onClick={() => handleTableClick(table)}
              className={`rounded-2xl p-4 relative ${isClickable ? 'cursor-pointer active:scale-95 transition-transform duration-150' : ''}`}
              style={{ background: cfg.bg, border: `1.5px solid ${cfg.border}` }}>
              <div className="absolute top-3 right-3 flex items-center">
                <span className="relative flex h-2.5 w-2.5">
                  {table.status === 'available' && <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ background: cfg.dot }} />}
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ background: cfg.dot }} />
                </span>
              </div>
              <div className="text-3xl font-light leading-none mb-2" style={{ fontFamily: 'var(--font-cormorant, Georgia, serif)', color: cfg.color }}>
                {table.number}
              </div>
              <div className="flex items-center gap-1 mb-2">
                {Array.from({ length: table.seats }).map((_, idx) => (
                  <span key={idx} style={{ color: cfg.color, fontSize: '0.45rem', opacity: 0.5 }}>●</span>
                ))}
                <span className="text-xs ml-1 opacity-60" style={{ color: cfg.color, fontFamily: 'var(--font-dm-sans, sans-serif)' }}>{table.seats} {t.seats}</span>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{ background: `${cfg.dot}22`, color: cfg.color, fontFamily: 'var(--font-dm-sans, sans-serif)' }}>
                {cfg.label}
              </span>
              {table.bookedFor && (
                <p className="text-xs mt-2 leading-snug opacity-70 line-clamp-2" style={{ color: cfg.color, fontFamily: 'var(--font-dm-sans, sans-serif)' }}>
                  {table.bookedFor}
                </p>
              )}
              {isClickable && <p className="text-xs mt-2 font-medium" style={{ color: cfg.color }}>{t.tapToBook}</p>}
            </div>
          )
        })}
      </div>

      {!allTablesBooked && (
        <div className="mt-4">
          <button
            type="button"
            onClick={onWaitlistJoin}
            className="w-full py-3 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            style={{ background: 'rgba(184,147,58,0.06)', border: '1px solid rgba(184,147,58,0.18)', color: '#B8933A', fontFamily: 'var(--font-dm-sans, sans-serif)' }}
          >
            <Clock3 size={12} />
            {t.joinWaitlist}
          </button>
        </div>
      )}

      <div className="mt-4 rounded-2xl p-4" style={{ background: 'rgba(184,147,58,0.06)', border: '1px solid rgba(184,147,58,0.15)' }}>
        <p className="text-xs" style={{ color: '#B8933A', fontFamily: 'var(--font-dm-sans, sans-serif)' }}>
          {t.tapHint} <strong>{menuData.hotel.phone}</strong>.
        </p>
      </div>

      <AnimatePresence>
        {showBookingForm && selectedTable && (
          <TableBookingModal
            table={selectedTable}
            onClose={() => { setShowBookingForm(false); setSelectedTable(null) }}
            onSuccess={() => { setShowBookingForm(false); setSelectedTable(null); refreshTables() }}
            availableTables={tables}
            t={t}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showWaitlistView && <WaitlistViewModal onClose={() => setShowWaitlistView(false)} t={t} />}
      </AnimatePresence>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function MenuPage() {
  const [pageTab, setPageTab] = useState<PageTab>('menu')
  const [activeCategory, setActiveCategory] = useState(menuData.categories[0].id)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [tables, setTables] = useState<TableInfo[]>([])
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([])

  const [showWaitlistModal, setShowWaitlistModal] = useState(false)
  const [waitlistSuccessEntry, setWaitlistSuccessEntry] = useState<WaitlistEntry | null>(null)
  const [waitlistSuccessPosition, setWaitlistSuccessPosition] = useState(0)
  const [autoBookedToast, setAutoBookedToast] = useState<{ tableNumber: number | string } | null>(null)

  const { lang: language, setLang: setLanguage } = useLanguage()
  const [isListening, setIsListening] = useState(false)
  const [voiceError, setVoiceError] = useState('')
  const [voiceMaxPrice, setVoiceMaxPrice] = useState<number | null>(null)

  // ── KEY FIX: use a ref to track which waitlist IDs have already been processed
  // This prevents the auto-booking from firing multiple times on re-renders
  const processingWaitlistIds = useRef<Set<string>>(new Set())

  const voiceSupported = typeof window !== 'undefined' &&
    (((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition) as unknown)

  const t = TRANSLATIONS[language]

  const refreshWaitlist = useCallback(() => {
    setWaitlist(loadWaitlist())
  }, [])

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
      setTables(loadTables())
    }
  }, [])

  useEffect(() => { refreshTables() }, [refreshTables])
  useEffect(() => { refreshWaitlist() }, [refreshWaitlist])
  useEffect(() => { if (pageTab === 'tables') { refreshTables(); refreshWaitlist() } }, [pageTab, refreshTables, refreshWaitlist])

  // Poll tables every 3 seconds when on tables tab
  useEffect(() => {
    if (pageTab !== 'tables') return
    const id = setInterval(async () => {
      await refreshTables()
      refreshWaitlist()
    }, 3000)
    return () => clearInterval(id)
  }, [pageTab, refreshTables, refreshWaitlist])

  // ─── FIXED Auto-booking logic ─────────────────────────────────────────────
  // Runs whenever tables change. Uses a ref-based lock to prevent
  // double-firing on re-renders. SMS is sent AFTER the table is booked.
  useEffect(() => {
    const availableTables = tables.filter(tbl => tbl.status === 'available')
    if (availableTables.length === 0) return

    // Always read fresh from localStorage — React state may be stale
    const currentWaitlist = loadWaitlist()
    const firstWaiting = currentWaitlist.find(e => e.status === 'waiting')
    if (!firstWaiting) return

    // ── LOCK: skip if we're already processing this entry ──
    if (processingWaitlistIds.current.has(firstWaiting.id)) return
    processingWaitlistIds.current.add(firstWaiting.id)

    const tableToBook = availableTables[0]

    // Optimistically mark as auto_booked in localStorage to prevent race
    const updatedWaitlist = currentWaitlist.map(e =>
      e.id === firstWaiting.id
        ? { ...e, status: 'auto_booked' as const, autoBookedTableId: tableToBook.id, autoBookedAt: new Date().toISOString() }
        : e
    )
    saveWaitlist(updatedWaitlist)
    setWaitlist(updatedWaitlist)

    console.log(`[AutoBook] Booking table ${tableToBook.number} for ${firstWaiting.name} (${firstWaiting.phoneNumber})`)

    // Book the table via API
    fetch('/api/tables', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: tableToBook.id,
        patch: {
          status: 'booked',
          bookedFor: firstWaiting.name,
          bookingDetails: {
            name: firstWaiting.name,
            phoneNumber: firstWaiting.phoneNumber,
            totalPeople: firstWaiting.totalPeople,
            additionalNotes: firstWaiting.additionalNotes,
            restaurant: menuData.hotel.name,
            arrivalTime: '',
          },
          bookedAt: new Date().toISOString(),
        },
      }),
      cache: 'no-store',
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('Table booking API failed')

        console.log(`[AutoBook] ✅ Table ${tableToBook.number} booked. Now sending WhatsApp...`)

        // ── Send WhatsApp AFTER successful booking (no API key) ─────────
        await sendWaitlistWhatsApp(
          firstWaiting.phoneNumber,
          firstWaiting.name,
          tableToBook.number,
          menuData.hotel.name
        )


        refreshTables()
        setAutoBookedToast({ tableNumber: tableToBook.number })
      })
      .catch((err) => {
        
        console.error('[AutoBook] ❌ Failed:', err)

        // Remove lock so it can retry
        processingWaitlistIds.current.delete(firstWaiting.id)

        // Revert waitlist entry so guest stays in queue
        const revertedWaitlist = loadWaitlist().map(e =>
          e.id === firstWaiting.id
            ? { ...e, status: 'waiting' as const, autoBookedTableId: undefined, autoBookedAt: undefined }
            : e
        )
        saveWaitlist(revertedWaitlist)
        setWaitlist(revertedWaitlist)
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tables])

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    const baseItems: MenuItem[] = q
      ? menuData.categories.flatMap(c => c.items as MenuItem[]).filter(item =>
          item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q) || item.tags.some(tag => tag.toLowerCase().includes(q))
        )
      : [...(menuData.categories.find(c => c.id === activeCategory)?.items as MenuItem[] || [])]
    return voiceMaxPrice == null ? baseItems : baseItems.filter((item) => item.price <= voiceMaxPrice)
  }, [searchQuery, activeCategory, voiceMaxPrice])

  const formatPrice = useCallback((price: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price), [])

  const availableCount = useMemo(() => tables.filter(tbl => tbl.status === 'available').length, [tables])
  const waitingCount = useMemo(() => waitlist.filter(e => e.status === 'waiting').length, [waitlist])

  const handleSelectItem = useCallback((item: MenuItem) => setSelectedItem(item), [])
  const handleCloseItem = useCallback(() => setSelectedItem(null), [])

  const currentCategory = useMemo(() => menuData.categories.find(c => c.id === activeCategory), [activeCategory])
  const featuredMains = useMemo(() => menuData.categories.find(c => c.id === 'mains')?.items.filter(i => i.featured) || [], [])

  const handleWaitlistSuccess = useCallback((entry: WaitlistEntry) => {
    setShowWaitlistModal(false)
    refreshWaitlist()
    const list = loadWaitlist()
    const position = list.filter(e => e.status === 'waiting').findIndex(e => e.id === entry.id) + 1
    setWaitlistSuccessEntry(entry)
    setWaitlistSuccessPosition(position || list.length)
  }, [refreshWaitlist])

  return (
    <div className="min-h-screen" style={{ background: 'var(--cream)' }}>

      {/* Hero Header */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #1A0F08 0%, #2C1810 100%)', minHeight: '200px' }}>
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #B8933A, transparent)' }} />
        <div className="absolute -bottom-8 -left-8 w-48 h-48 rounded-full opacity-5" style={{ background: 'radial-gradient(circle, #B8933A, transparent)' }} />
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1200 60" className="w-full" style={{ fill: 'var(--cream)' }}>
            <path d="M0,60 C300,20 900,20 1200,60 L1200,60 L0,60 Z" />
          </svg>
        </div>
        <div className="relative z-10 px-6 pt-10 pb-16">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="h-px w-8" style={{ background: '#B8933A' }} />
              <span className="text-xs tracking-[0.3em] uppercase" style={{ color: '#B8933A', fontFamily: 'var(--font-dm-sans, sans-serif)' }}>Fine Dining</span>
            </div>
            <h1 className="text-4xl font-light" style={{ fontFamily: 'var(--font-cormorant, Georgia, serif)', color: '#FDFAF5', lineHeight: 1.1 }}>The Aurelius</h1>
            <p className="text-sm font-light mt-1 opacity-60" style={{ color: '#FDFAF5', fontFamily: 'var(--font-dm-sans, sans-serif)' }}>{menuData.hotel.address}</p>
          </div>

          <div className="mt-5 flex gap-2 p-1 rounded-xl" style={{ background: 'rgba(253,250,245,0.1)', border: '1px solid rgba(184,147,58,0.25)' }}>
            {(['menu', 'tables'] as const).map(tab => (
              <button type="button" key={tab} onClick={() => setPageTab(tab)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
                style={{
                  background: pageTab === tab ? 'linear-gradient(135deg, #B8933A, #D4AF6A)' : 'transparent',
                  color: pageTab === tab ? '#1A0F08' : 'rgba(253,250,245,0.7)',
                  fontFamily: 'var(--font-dm-sans, sans-serif)',
                }}>
                {tab === 'menu' ? (
                  <><UtensilsCrossed size={14} /> {t.menu}</>
                ) : (
                  <><Grid3X3 size={14} /> {t.tables}
                    {availableCount > 0 && (
                      <span className="text-xs px-1.5 py-0.5 rounded-full font-bold"
                        style={{ background: pageTab === 'tables' ? 'rgba(26,15,8,0.2)' : 'rgba(34,197,94,0.3)', color: pageTab === 'tables' ? '#1A0F08' : '#16a34a', fontSize: '0.6rem' }}>
                        {availableCount}
                      </span>
                    )}
                    {availableCount === 0 && waitingCount > 0 && (
                      <span className="text-xs px-1.5 py-0.5 rounded-full font-bold"
                        style={{ background: 'rgba(245,158,11,0.3)', color: '#B45309', fontSize: '0.6rem' }}>
                        {waitingCount}⏳
                      </span>
                    )}
                  </>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {pageTab === 'menu' ? (
        <div>
          <div className="px-4 pt-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-2 rounded-xl px-3 py-2"
                style={{ background: 'rgba(253,250,245,0.9)', border: '1px solid rgba(184,147,58,0.15)' }}>
                <span className="text-[11px] opacity-70" style={{ color: '#B8933A', fontFamily: 'var(--font-dm-sans, sans-serif)' }}>{t.languageLabel}</span>
                {(['en', 'hi', 'gu'] as const).map((lang) => (
                  <button key={lang} type="button" onClick={() => setLanguage(lang)}
                    className="text-xs font-semibold px-2.5 py-1 rounded-lg transition"
                    style={{ background: language === lang ? 'linear-gradient(135deg, #B8933A, #D4AF6A)' : 'transparent', color: language === lang ? '#1A0F08' : 'rgba(184,147,58,0.95)', border: language === lang ? 'none' : '1px solid rgba(184,147,58,0.25)', fontFamily: 'var(--font-dm-sans, sans-serif)', opacity: language === lang ? 1 : 0.95 }}>
                    {lang === 'en' ? 'EN' : lang === 'hi' ? 'हि' : 'ગુ'}
                  </button>
                ))}
              </div>
            </div>
            <div className="relative flex items-center rounded-xl px-4 py-3"
              style={{ background: '#FFF', border: '1px solid rgba(184,147,58,0.15)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
              <Search size={15} style={{ color: '#B8933A' }} className="mr-3 flex-shrink-0" />
              <input type="text" placeholder={t.searchPlaceholder} value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setVoiceMaxPrice(null) }}
                className="flex-1 bg-transparent text-sm outline-none"
                style={{ color: '#1A0F08', fontFamily: 'var(--font-dm-sans, sans-serif)' }} />
              <button type="button" onClick={() => {
                if (!voiceSupported) { setVoiceError(t.voiceNotSupported); return }
                try {
                  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
                  const recognition = new SpeechRecognition()
                  recognition.continuous = false; recognition.interimResults = false; recognition.maxAlternatives = 1
                  recognition.lang = language === 'hi' ? 'hi-IN' : language === 'gu' ? 'gu-IN' : 'en-IN'
                  setVoiceError(''); setIsListening(true)
                  recognition.onresult = (event: any) => {
                    const transcript = (event?.results?.[0]?.[0]?.transcript || '').toString().trim()
                    setIsListening(false)
                    if (!transcript) return
                    const lowered = transcript.toLowerCase()
                    const priceTrigger = /(under|below|upto|less than|less|maximum|max|up to)/i.test(lowered) || /(ज्यादा नहीं|से कम|तक|अधिकतम|उतना)/.test(transcript) || /(થી ઓછી|નીચું|સુધી|અધિકતમ|મહત્તમ|ઉપરની મર્યાદા)/.test(transcript)
                    const numberMatch = transcript.match(/(\d[\d,]*)/)
                    let parsedMaxPrice: number | null = null
                    if (priceTrigger && numberMatch?.[1]) { parsedMaxPrice = parseInt(numberMatch[1].replace(/,/g, ''), 10); if (!Number.isFinite(parsedMaxPrice)) parsedMaxPrice = null }
                    setVoiceMaxPrice(parsedMaxPrice); setActiveCategory('mains'); setSearchQuery(transcript)
                  }
                  recognition.onerror = () => { setIsListening(false); setVoiceError(t.voiceNotSupported) }
                  recognition.onend = () => { setIsListening(false) }
                  recognition.start()
                } catch { setIsListening(false); setVoiceError(t.voiceNotSupported) }
              }}
                className="ml-3 w-9 h-9 rounded-full flex items-center justify-center"
                style={{ background: isListening ? 'rgba(184,147,58,0.22)' : 'rgba(184,147,58,0.10)', border: '1px solid rgba(184,147,58,0.25)', transition: 'transform 120ms ease, background 200ms ease' }}>
                {isListening
                  ? <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: '#B8933A', boxShadow: '0 0 0 3px rgba(184,147,58,0.18)' }} />
                  : <span style={{ color: '#B8933A', fontSize: 14, lineHeight: 1 }}>🎙️</span>}
              </button>
              {searchQuery && (
                <button type="button" onClick={() => { setSearchQuery(''); setVoiceMaxPrice(null) }} className="ml-2">
                  <X size={14} style={{ color: '#B8933A' }} />
                </button>
              )}
            </div>
            {!!voiceError && <div className="mt-2 text-xs" style={{ color: '#EF4444', fontFamily: 'var(--font-dm-sans, sans-serif)' }}>{voiceError}</div>}
          </div>

          {!searchQuery && (
            <div className="sticky top-0 z-40 px-4 py-3 flex gap-2 overflow-x-auto"
              style={{ background: 'rgba(253,250,245,0.97)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(184,147,58,0.1)', scrollbarWidth: 'none', transform: 'translateZ(0)' }}>
              {menuData.categories.map((cat) => (
                <button type="button" key={cat.id} onClick={() => setActiveCategory(cat.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 transition-all duration-200"
                  style={{ background: activeCategory === cat.id ? 'linear-gradient(135deg, #B8933A, #D4AF6A)' : 'rgba(184,147,58,0.08)', color: activeCategory === cat.id ? '#1A0F08' : '#B8933A', border: activeCategory === cat.id ? 'none' : '1px solid rgba(184,147,58,0.2)', fontFamily: 'var(--font-dm-sans, sans-serif)' }}>
                  <span>{cat.icon}</span>{cat.name}
                </button>
              ))}
            </div>
          )}

          {!searchQuery && currentCategory && (
            <div className="px-6 py-5">
              <h2 className="text-3xl font-light mb-1" style={{ fontFamily: 'var(--font-cormorant, Georgia, serif)', color: '#1A0F08' }}>{currentCategory.name}</h2>
              <p className="text-sm opacity-50" style={{ fontFamily: 'var(--font-dm-sans, sans-serif)', color: '#1A0F08' }}>{currentCategory.description}</p>
            </div>
          )}

          {searchQuery && (
            <div className="px-6 py-4">
              <p className="text-sm opacity-50" style={{ color: '#1A0F08', fontFamily: 'var(--font-dm-sans, sans-serif)' }}>
                {filteredItems.length} result{filteredItems.length !== 1 ? 's' : ''} for <strong>&quot;{searchQuery}&quot;</strong>
              </p>
            </div>
          )}

          {!searchQuery && activeCategory === 'mains' && featuredMains.length > 0 && (
            <FeaturedSection items={featuredMains} onSelect={handleSelectItem} t={t} />
          )}

          <div className="px-4 pb-28 space-y-3">
            {filteredItems.map((item) => (
              <MenuItemCard key={item.id} item={item} onSelect={handleSelectItem} formatPrice={formatPrice} t={t} />
            ))}
            {filteredItems.length === 0 && (
              <div className="text-center py-20">
                <div className="text-4xl mb-3">🍽️</div>
                <p className="font-medium" style={{ color: '#1A0F08', fontFamily: 'var(--font-cormorant, Georgia, serif)', fontSize: '1.3rem' }}>{t.noDishes}</p>
                <p className="text-sm opacity-50 mt-1" style={{ fontFamily: 'var(--font-dm-sans, sans-serif)' }}>Try a different search term</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <TableAvailabilityView
          tables={tables}
          refreshTables={() => { void refreshTables() }}
          t={t}
          onWaitlistJoin={() => setShowWaitlistModal(true)}
          waitlist={waitlist}
        />
      )}

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 px-6 py-4"
        style={{ background: 'rgba(253,250,245,0.97)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderTop: '1px solid rgba(184,147,58,0.15)' }}>
        <div className="flex items-center justify-between text-xs" style={{ fontFamily: 'var(--font-dm-sans, sans-serif)' }}>
          <span style={{ color: '#B8933A' }}>📞 {menuData.hotel.phone}</span>
          <span className="opacity-30" style={{ color: '#1A0F08' }}>{t.allPricesInrHint}</span>
        </div>
      </div>

      {/* Modals & Toasts */}
      <AnimatePresence>
        {selectedItem && <ItemModal item={selectedItem} onClose={handleCloseItem} formatPrice={formatPrice} language={language} t={t} />}
      </AnimatePresence>

      <AnimatePresence>
        {showWaitlistModal && (
          <WaitlistModal
            onClose={() => setShowWaitlistModal(false)}
            onSuccess={handleWaitlistSuccess}
            waitingCount={waitingCount}
            t={t}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {waitlistSuccessEntry && (
          <WaitlistSuccessToast
            entry={waitlistSuccessEntry}
            position={waitlistSuccessPosition}
            onClose={() => setWaitlistSuccessEntry(null)}
            t={t}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {autoBookedToast && (
          <AutoBookedToast
            tableNumber={autoBookedToast.tableNumber}
            onClose={() => setAutoBookedToast(null)}
            t={t}
          />
        )}
      </AnimatePresence>
    </div>
  )
}