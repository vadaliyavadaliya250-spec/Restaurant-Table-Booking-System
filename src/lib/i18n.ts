export type Lang = 'en' | 'hi' | 'gu'

export const LANG_COOKIE_KEY = 'aurelius_lang'

const dictionaries = {
  en: {
    languageLabel: 'Language',
    searchPlaceholder: 'Search dishes, ingredients...',
    noDishes: 'No dishes found',
    resultsLabel: (count: number, q: string) => `${count} result${count !== 1 ? 's' : ''} for “${q}”`,
    tryDifferentSearch: 'Try a different search term',

    voiceNotSupported: 'Voice search not supported in this browser.',

    chefRecs: "Chef's Recommendations",

    tableAvailabilityTitle: 'Table Availability',
    liveStatus: 'Live status — updated by the host team',
    tapToBook: '👙 Tap to book',
    tapHint: '👁 Tap on any available table to book instantly. For special requests, contact our host at the reception or call',
    allPricesInrHint: 'All prices in INR incl. GST',

    languageEnglish: 'English',
    languageHindi: 'Hindi',
    languageGujarati: 'Gujarati',

    // Booking modal
    bookTablePrefix: 'Book Table',
    theAurelius: 'The Aurelius',
    seatsLabel: (s: number) => `${s} seats`,

    fullNameLabel: 'FULL NAME *',
    phoneNumberLabel: 'PHONE NUMBER *',
    yourFullNamePlaceholder: 'Your full name',
    phonePlaceholder: '+91 XXXX XXXX XX',

    totalPeopleLabel: 'TOTAL PEOPLE *',
    maxPeopleHint: (max: number) => `Max ${max} people per table. This booking needs `,
    bookingNeedsTablesHint: (tables: number) => ` table(s).`,

    selectAdditionalTablesLabel: (count: number) => `Select additional table(s) (${count} needed)`,
    mustSelectAdditionalTablesHint: (count: number) => `You must select ${count} additional table(s).`,

    arrivalTimeLabel: 'ARRIVAL TIME *',
    restaurantLabel: 'RESTAURANT',
    specialRequestsLabel: 'SPECIAL REQUESTS (Optional)',
    anySpecialRequestsPlaceholder: 'Any special requests?',

    sendOtpButton: 'Send OTP',
    sendingOtpButton: 'Sending OTP…',
    resendOtpButton: 'Resend OTP',
    otpInputPlaceholder: 'Enter OTP',

    verifyOtpButton: 'Verify',
    verifyingOtpButton: 'Verifying…',

    otpSendPhoneFirstError: 'Please enter phone number first',
    otpVerifyBeforeBookingError: 'Please verify OTP before confirming booking',
    otpEnterError: 'Please enter OTP',

    cancel: 'Cancel',
    confirm: 'Confirm',
    confirmBooking: 'Confirm Booking',
    bookingLoading: 'Booking...',
    confirmDupText: 'You already booked table(s)',
    bookingSuccessHint: '📞 A confirmation will appear in the admin panel. Your booking is live!',

    prepTimeLabel: 'Prep Time',
    caloriesLabel: 'Calories',
    vegTag: 'Vegetarian',
    spicyTag: 'Spicy',
    glutenFreeTag: 'Gluten Free',
    chefPickTag: "Chef's Pick",
  },
  hi: {
    languageLabel: 'भाषा',
    searchPlaceholder: 'डिश, सामग्री खोजें...',
    noDishes: 'कोई डिश नहीं मिली',
    resultsLabel: (count: number, q: string) => `“${q}” के लिए ${count} परिणाम`,
    tryDifferentSearch: 'कोई और सर्च टर्म आज़माएं',

    voiceNotSupported: 'इस ब्राउज़र में वॉइस खोज उपलब्ध नहीं है।',

    chefRecs: 'शेफ की सिफारिशें',

    tableAvailabilityTitle: 'टेबल उपलब्धता',
    liveStatus: 'लाइव स्थिति — होस्ट टीम द्वारा अपडेटेड',
    tapToBook: '👙 बुक करने के लिए टैप करें',
    tapHint: '👁 उपलब्ध किसी भी टेबल पर तुरंत बुक करने के लिए टैप करें। विशेष अनुरोध के लिए, रिसेप्शन पर हमारे होस्ट से संपर्क करें या कॉल करें',
    allPricesInrHint: 'सभी कीमतें INR में हैं, GST सहित',

    languageEnglish: 'English',
    languageHindi: 'Hindi',
    languageGujarati: 'Gujarati',

    bookTablePrefix: 'टेबल बुक करें',
    theAurelius: 'The Aurelius',
    seatsLabel: (s: number) => `${s} सीटें`,

    fullNameLabel: 'पूरा नाम *',
    phoneNumberLabel: 'फोन नंबर *',
    yourFullNamePlaceholder: 'अपना पूरा नाम',
    phonePlaceholder: '+91 XXXX XXXX XX',

    totalPeopleLabel: 'कुल लोग *',
    maxPeopleHint: (max: number) => `प्रति टेबल अधिकतम ${max} लोग। इस बुकिंग के लिए `,
    bookingNeedsTablesHint: (tables: number) => ` ${tables} टेबल(s).`,

    selectAdditionalTablesLabel: (count: number) => `अतिरिक्त टेबल चुनें (${count} चाहिए)`,
    mustSelectAdditionalTablesHint: (count: number) => `आपको ${count} अतिरिक्त टेबल(s) चुनने होंगे।`,

    arrivalTimeLabel: 'आगमन समय *',
    restaurantLabel: 'रेस्टोरेंट',
    specialRequestsLabel: 'विशेष अनुरोध (Optional)',
    anySpecialRequestsPlaceholder: 'कोई विशेष अनुरोध?',

    sendOtpButton: 'ओटीपी भेजें',
    sendingOtpButton: 'ओटीपी भेजा जा रहा है…',
    resendOtpButton: 'ओटीपी दोबारा भेजें',
    otpInputPlaceholder: 'ओटीपी दर्ज करें',

    verifyOtpButton: 'वेरिफाई',
    verifyingOtpButton: 'वेरिफाई हो रहा है…',

    otpSendPhoneFirstError: 'कृपया पहले फोन नंबर दर्ज करें',
    otpVerifyBeforeBookingError: 'कृपया बुकिंग पुष्टि करने से पहले ओटीपी वेरिफाई करें',
    otpEnterError: 'कृपया ओटीपी दर्ज करें',

    cancel: 'रद्द करें',
    confirm: 'कन्फर्म',
    confirmBooking: 'बुकिंग कन्फर्म करें',
    bookingLoading: 'बुकिंग...',
    confirmDupText: 'आपने पहले से टेबल(s) बुक किए हैं',
    bookingSuccessHint: '📞 एडमिन पैनल में एक पुष्टि दिखाई देगी। आपकी बुकिंग लाइव है!',

    prepTimeLabel: 'तैयारी समय',
    caloriesLabel: 'कैलोरी',
    vegTag: 'शाकाहारी',
    spicyTag: 'मसालेदार',
    glutenFreeTag: 'ग्लूटेन फ्री',
    chefPickTag: 'शेफ की पिक',
  },
  gu: {
    languageLabel: 'ભાષા',
    searchPlaceholder: 'ડિશ, સામગ્રી શોધો...',
    noDishes: 'કોઈ ડિશ મળી નથી',
    resultsLabel: (count: number, q: string) => `“${q}” માટે ${count} પરિણામ`,
    tryDifferentSearch: 'બીજો સર્ચ ટર્મ અજમાવો',

    voiceNotSupported: 'આ બ્રાઉઝરમાં વૉઇસ શોધ ઉપલબ્ધ નથી.',

    chefRecs: 'શેફની ભલામણો',

    tableAvailabilityTitle: 'ટેબલ ઉપલબ્ધતા',
    liveStatus: 'લાઇવ સ્થિતિ — હોસ્ટ ટીમ દ્વારા અપડેટ',
    tapToBook: '👙 બુક કરવા માટે ટેપ કરો',
    tapHint: '👁 ઉપલબ્ધ કોઈ પણ ટેબલ પર તરત બુક કરવા માટે ટેપ કરો. ખાસ વિનંતી માટે, રિસેપ્શન પર અમારા હોસ્ટનો સંપર્ક કરો અથવા કોલ કરો',
    allPricesInrHint: 'બધી કિંમતો INR માં છે, GST સહિત',

    languageEnglish: 'English',
    languageHindi: 'Hindi',
    languageGujarati: 'Gujarati',

    bookTablePrefix: 'ટેબલ બુક કરો',
    theAurelius: 'The Aurelius',
    seatsLabel: (s: number) => `${s} બેઠકો`,

    fullNameLabel: 'પૂર્ણ નામ *',
    phoneNumberLabel: 'ફોન નંબર *',
    yourFullNamePlaceholder: 'તમારું પૂરું નામ',
    phonePlaceholder: '+91 XXXX XXXX XX',

    totalPeopleLabel: 'કુલ લોકો *',
    maxPeopleHint: (max: number) => `પ્રતિ ટેબલ મહત્તમ ${max} લોકો. આ બુકિંગને `,
    bookingNeedsTablesHint: (tables: number) => ` ${tables} ટેબલ(s).`,

    selectAdditionalTablesLabel: (count: number) => `વધુ ટેબલ પસંદ કરો (${count} જોઈએ)`,
    mustSelectAdditionalTablesHint: (count: number) => `તમારે ${count} વધારાના ટેબલ(s) પસંદ કરવા પડશે.`,

    arrivalTimeLabel: 'આગમન સમય *',
    restaurantLabel: 'રેસ્ટોરન્ટ',
    specialRequestsLabel: 'વિશેષ વિનંતી (Optional)',
    anySpecialRequestsPlaceholder: 'કોઈ વિશેષ વિનંતી?',

    sendOtpButton: 'ઓટીપી મોકલો',
    sendingOtpButton: 'ઓટીપી મોકલાઈ રહ્યો છે…',
    resendOtpButton: 'ઓટીપી ફરી મોકલો',
    otpInputPlaceholder: 'ઓટીપી દાખલ કરો',

    verifyOtpButton: 'ચકાસો',
    verifyingOtpButton: 'ચકાસાઈ રહ્યું છે…',

    otpSendPhoneFirstError: 'કૃપયા પહેલા ફોન નંબર દાખલ કરો',
    otpVerifyBeforeBookingError: 'કૃપયા બુકિંગ કન્ફર્મ કરતા પહેલા ઓટીપી ચકાસો',
    otpEnterError: 'કૃપયા ઓટીપી દાખલ કરો',

    cancel: 'રદ કરો',
    confirm: 'કન્ફર્મ',
    confirmBooking: 'બુકિંગ કન્ફર્મ કરો',
    bookingLoading: 'બુકિંગ...',
    confirmDupText: 'તમે પહેલેથી ટેબલ(s) બુક કર્યા છે',
    bookingSuccessHint: '📞 એડમિન પેનલમાં એક પુષ્ટિ દેખાશે. તમારી બુકિંગ લાઇવ છે!',

    prepTimeLabel: 'તૈયારી સમય',
    caloriesLabel: 'કેલરી',
    vegTag: 'શાકાહારી',
    spicyTag: 'મસાલેદાર',
    glutenFreeTag: 'ગ્લૂટેન ફ્રી',
    chefPickTag: 'શેફ ની પિક',
  },
} as const satisfies Record<Lang, any>

export function getT(lang: Lang) {
  return dictionaries[lang]
}

export function getLangFromCookie(cookie: string | null | undefined): Lang {
  if (!cookie) return 'en'
  const m = cookie.match(new RegExp(`${LANG_COOKIE_KEY}=([^;]+)`))
  const value = (m?.[1] || '').trim()
  if (value === 'en' || value === 'hi' || value === 'gu') return value
  return 'en'
}

export function setLangCookie(): string {
  // Client helper; actual cookie write is handled in UI code via document.cookie.
  return LANG_COOKIE_KEY
}

