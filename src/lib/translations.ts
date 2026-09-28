export type Lang = 'en' | 'hi' | 'gu'

export const translations = {
  en: {
    language: {
      label: 'Language',
      english: 'English',
      hindi: 'Hindi',
      gujarati: 'Gujarati',
    },

    home: {
      title: 'The Aurelius',
      tagline: 'Culinary Excellence Since 1923',
      scanToViewMenu: 'Scan to View Menu',
      pointToQr: 'Point your phone camera at the QR code to open the menu',
      openMenu: 'Open Menu',
      adminPanel: 'Admin Panel',
      menuQrCodeAlt: 'Menu QR Code',
    },

    menu: {
      fineDiningLabel: 'Fine Dining',
      categoriesTabMenu: 'Menu',
      categoriesTabTables: 'Tables',

      searchPlaceholder: 'Search dishes, ingredients...',
      voiceNotSupported: 'Voice search not supported in this browser.',
      chefRecs: "Chef's Recommendations",

      noDishes: 'No dishes found',
      tryDifferentSearch: 'Try a different search term',
      resultsPrefix: 'result',
      resultsPrefixPlural: 'results',
      resultsFor: (q: string) => `for "${q}"`,

      tableAvailabilityTitle: 'Table Availability',
      liveStatus: 'Live status — updated by the host team',
      tapToBook: 'Tap to book',
      tapHint:
        'Tap on any available table to book instantly. For special requests, contact our host at the reception or call',
      allPricesInrHint: 'All prices in INR incl. GST',

      categories: {
        breakfast: 'Breakfast',
        breakfastDesc: 'Morning indulgences to start your day',
        starters: 'Starters',
        startersDesc: 'Begin your culinary journey',
        mains: 'Main Course',
        mainsDesc: 'The heart of our kitchen',
        desserts: 'Desserts',
        dessertsDesc: 'Sweet endings crafted with love',
        drinks: 'Beverages',
        drinksDesc: 'Curated drinks for every mood',
      },

      booking: {
        bookTablePrefix: 'Book Table',
        theAurelius: 'The Aurelius',
        seatsLabel: (s: number) => `${s} seats`,

        fullNameLabel: 'FULL NAME *',
        phoneNumberLabel: 'PHONE NUMBER *',
        yourFullNamePlaceholder: 'Your full name',
        phonePlaceholder: '+91 XXXX XXXX XX',

        totalPeopleLabel: 'TOTAL PEOPLE *',
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
        verified: 'Verified',

        otpSendPhoneFirstError: 'Please enter phone number first',
        otpVerifyBeforeBookingError: 'Please verify OTP before confirming booking',
        otpEnterError: 'Please enter OTP',
        otpSent: 'OTP sent. Please check your phone.',

        cancel: 'Cancel',
        confirm: 'Confirm',
        confirmBooking: '✓ Confirm Booking',
        bookingLoading: 'Booking...',

        confirmDupText: 'You already booked table(s)',
        bookingSuccessHint:
          '📞 A confirmation will appear in the admin panel. Your booking is live!',

        maxPeopleHint: (max: number) => `Max ${max} people per table. This booking needs `,
        bookingNeedsTablesHint: (tables: number) => ` table(s).`,

        selectAdditionalTablesLabel: (count: number) =>
          `Select additional table(s) (${count} needed)`,
        mustSelectAdditionalTablesHint: (count: number) =>
          `You must select ${count} additional table(s).`,

        duplicateConfirmPrefix: (numbers: string) =>
          `You already booked table(s) ${numbers} with this phone. Are you sure you want to book table`,

        prepTimeLabel: 'Prep Time',
        caloriesLabel: 'Calories',

        badge: {
          vegTag: 'Vegetarian',
          spicyTag: 'Spicy',
          glutenFreeTag: 'Gluten Free',
          chefPickTag: "Chef's Pick",
        },

        bookingDoneHint:
          '📞 A confirmation will appear in the admin panel. Your booking is live!',

        validation: {
          nameRequired: 'Please enter your name',
          peopleMinError: 'Number of people must be at least 1',
          phoneRequired: 'Please enter a phone number',
          arrivalRequired: 'Please select arrival time',
          additionalTablesRequired: (needed: number) =>
            `Please select ${needed} additional table(s) to match the number of people`,
          duplicateTableSelection: 'Duplicate table selection detected',
          primaryAlreadySelected: 'Primary table is already selected',
          verifyOtpFirst: 'Please verify OTP before confirming booking',
          sendOtpGenericFail: 'Failed to send OTP',
          verifyOtpGenericFail: 'OTP verification failed',
          bookTablesFail: 'Failed to book table(s). Please try again.',
        },

        allergiesInfo: '💁 Please inform your server of any allergies or dietary requirements. Our team is happy to customise dishes where possible.',
      },
    },

    admin: {
      login: {
        title: 'Admin Access',
        staffPortal: 'The Aurelius — Staff Portal',
        usernameLabel: 'Username',
        passwordLabel: 'Password',
        usernamePlaceholder: 'Enter username',
        passwordPlaceholder: 'Enter password',
        invalidCreds: 'Invalid username or password.',
        signIn: 'Sign In',
        authorisedOnly: 'Authorised staff only · The Aurelius Hotel',
      },
      panel: {
        headerLabel: 'Admin Panel',
        menuDashboard: 'Menu Management Dashboard',
        logout: 'Logout',

        tabs: {
          qr: 'QR Code',
          tables: 'Tables',
          stats: 'Menu Items',
        },

        stats: {
          totalDishes: 'Total Dishes',
          chefPicks: "Chef's Picks",
          vegetarian: 'Vegetarian',
          tablesFree: 'Tables Free',
        },

        saveFlash: 'Table status saved successfully',

        usageGuide: 'Usage Guide',
        download: 'Download',
        preview: 'Preview',
        backToHome: 'Back to Home',

        resetTables: 'Reset Tables to Default',
      },

      tableEdit: {
        title: 'Edit Table',
        statusLabel: 'Table Status',
        maxPeopleLimit: 'Max People Limit',
        bookingNameTime: 'Booking Name / Time',
        internalNote: 'Internal Note',
        bookingDetails: 'Booking Details',
        saveChanges: 'Save Changes',
        close: 'Close',
      },
    },
  },

  hi: {
    language: {
      label: 'भाषा',
      english: 'English',
      hindi: 'Hindi',
      gujarati: 'Gujarati',
    },

    home: {
      title: 'The Aurelius',
      tagline: 'Culinary Excellence Since 1923',
      scanToViewMenu: 'मेन्यू देखने के लिए स्कैन करें',
      pointToQr: 'मेन्यू खोलने के लिए QR कोड पर अपने फ़ोन कैमरा को रखें',
      openMenu: 'मेन्यू खोलें',
      adminPanel: 'एडमिन पैनल',
      menuQrCodeAlt: 'मेन्यू QR कोड',
    },

    menu: {
      fineDiningLabel: 'Fine Dining',
      categoriesTabMenu: 'मेनू',
      categoriesTabTables: 'टेबल्स',

      searchPlaceholder: 'डिश, सामग्री खोजें...',
      voiceNotSupported: 'इस ब्राउज़र में वॉइस सर्च समर्थित नहीं है।',
      chefRecs: 'शेफ की सिफारिशें',

      noDishes: 'कोई डिश नहीं मिली',
      tryDifferentSearch: 'कोई और सर्च टर्म आज़माएं',
      resultsPrefix: 'परिणाम',
      resultsPrefixPlural: 'परिणाम',
      resultsFor: (q: string) => `"${q}" के लिए`,

      tableAvailabilityTitle: 'टेबल उपलब्धता',
      liveStatus: 'लाइव स्थिति — होस्ट टीम द्वारा अपडेटेड',
      tapToBook: 'बुक करने के लिए टैप करें',
      tapHint:
        'किसी भी उपलब्ध टेबल पर तुरंत बुक करने के लिए टैप करें। विशेष अनुरोधों के लिए, रिसेप्शन पर हमारे होस्ट से संपर्क करें या कॉल करें',
      allPricesInrHint: 'सभी कीमतें INR में हैं, GST सहित',

      categories: {
        breakfast: 'नाश्ता',
        breakfastDesc: 'अपने दिन को शुरू करने के लिए सुबह के व्यंजन',
        starters: 'स्टार्टर्स',
        startersDesc: 'अपनी पाकशिल्प यात्रा शुरू करें',
        mains: 'मुख्य कोर्स',
        mainsDesc: 'हमारी रसोई का दिल',
        desserts: 'मिठाई',
        dessertsDesc: 'प्यार से बनाई गई मीठी समाप्ति',
        drinks: 'पेय',
        drinksDesc: 'हर मूड के लिए क्यूरेटेड पेय',
      },

      booking: {
        bookTablePrefix: 'टेबल बुक करें',
        theAurelius: 'The Aurelius',
        seatsLabel: (s: number) => `${s} सीटें`,

        fullNameLabel: 'पूरा नाम *',
        phoneNumberLabel: 'फोन नंबर *',
        yourFullNamePlaceholder: 'अपना पूरा नाम',
        phonePlaceholder: '+91 XXXX XXXX XX',

        totalPeopleLabel: 'कुल लोग *',
        arrivalTimeLabel: 'आगमन समय *',
        restaurantLabel: 'रेस्टोरेंट',
        specialRequestsLabel: 'विशेष अनुरोध (वैकल्पिक)',
        anySpecialRequestsPlaceholder: 'कोई विशेष अनुरोध?',

        sendOtpButton: 'OTP भेजें',
        sendingOtpButton: 'OTP भेजा जा रहा है…',
        resendOtpButton: 'OTP फिर से भेजें',
        otpInputPlaceholder: 'OTP दर्ज करें',

        verifyOtpButton: 'सत्यापित करें',
        verifyingOtpButton: 'सत्यापन चल रहा है…',
        verified: 'सत्यापित',

        otpSendPhoneFirstError: 'कृपया पहले फोन नंबर दर्ज करें',
        otpVerifyBeforeBookingError: 'कृपया बुकिंग पुष्टि करने से पहले OTP सत्यापित करें',
        otpEnterError: 'कृपया OTP दर्ज करें',
        otpSent: 'OTP भेजा गया। कृपया अपना फोन चेक करें।',

        cancel: 'रद्द करें',
        confirm: 'पुष्टि करें',
        confirmBooking: '✓ बुकिंग की पुष्टि करें',
        bookingLoading: 'बुकिंग की जा रही है...',

        confirmDupText: 'आपने पहले से टेबल(s) बुक किए हैं',
        bookingSuccessHint:
          '📞 एडमिन पैनल में एक पुष्टि दिखाई देगी। आपकी बुकिंग लाइव है!',

        maxPeopleHint: (max: number) => `प्रति टेबल अधिकतम ${max} लोग। इस बुकिंग के लिए `,
        bookingNeedsTablesHint: (tables: number) => ` ${tables} टेबल(s).`,

        selectAdditionalTablesLabel: (count: number) =>
          `अतिरिक्त टेबल चुनें (${count} चाहिए)`,
        mustSelectAdditionalTablesHint: (count: number) =>
          `आपको ${count} अतिरिक्त टेबल(s) चुनने होंगे।`,

        duplicateConfirmPrefix: (numbers: string) =>
          `आपने पहले से जी टेबल(s) ${numbers} इस फोन से बुक किए हैं। क्या आप टेबल`,

        prepTimeLabel: 'तैयारी समय',
        caloriesLabel: 'कैलोरी',

        badge: {
          vegTag: 'शाकाहारी',
          spicyTag: 'मसालेदार',
          glutenFreeTag: 'ग्लूटेन फ्री',
          chefPickTag: 'शेफ की पिक',
        },

        bookingDoneHint:
          '📞 एडमिन पैनल में एक पुष्टि दिखाई देगी। आपकी बुकिंग लाइव है!',

        validation: {
          nameRequired: 'कृपया अपना नाम दर्ज करें',
          peopleMinError: 'लोगों की संख्या कम से कम 1 होनी चाहिए',
          phoneRequired: 'कृपया फोन नंबर दर्ज करें',
          arrivalRequired: 'कृपया आगमन समय चुनें',
          additionalTablesRequired: (needed: number) =>
            `कृपया ${needed} अतिरिक्त टेबल(s) चुनें`,
          duplicateTableSelection: 'डुप्लिकेट टेबल चयन पाया गया',
          primaryAlreadySelected: 'प्राइमरी टेबल पहले से ही चुनी हुई है',
          verifyOtpFirst: 'कृपया पुष्टि करने से पहले OTP सत्यापित करें',
          sendOtpGenericFail: 'OTP भेजने में असफल',
          verifyOtpGenericFail: 'OTP सत्यापन असफल',
          bookTablesFail: 'टेबल(s) बुक करने में असफल। कृपया पुनः प्रयास करें।',
        },

        allergiesInfo: '💁 कृपया अपने सर्वर को किसी भी एलर्जी या आहार संबंधी आवश्यकताओं के बारे में सूचित करें। हमारी टीम जहां संभव हो डिश को अनुकूलित करने में खुश है।',
      },
    },

    admin: {
      login: {
        title: 'एडमिन एक्सेस',
        staffPortal: 'The Aurelius — स्टाफ पोर्टल',
        usernameLabel: 'यूज़रनेम',
        passwordLabel: 'पासवर्ड',
        usernamePlaceholder: 'यूज़रनेम डालें',
        passwordPlaceholder: 'पासवर्ड डालें',
        invalidCreds: 'गलत यूज़रनेम या पासवर्ड।',
        signIn: 'साइन इन',
        authorisedOnly: 'सिर्फ अधिकृत स्टाफ · The Aurelius Hotel',
      },
      panel: {
        headerLabel: 'एडमिन पैनल',
        menuDashboard: 'मेन्यू मैनेजमेंट डैशबोर्ड',
        logout: 'लॉगआउट',
        tabs: { qr: 'QR कोड', tables: 'टेबल्स', stats: 'मेन्यू आइटम्स' },
        stats: {
          totalDishes: 'कुल डिशेज',
          chefPicks: 'शेफ की पसंद',
          vegetarian: 'शाकाहारी',
          tablesFree: 'फ्री टेबल्स',
        },
        saveFlash: 'टेबल स्टेटस सेव हो गया',
        usageGuide: 'यूसेज गाइड',
        download: 'डाउनलोड',
        preview: 'प्रिव्यू',
        backToHome: 'होम पर वापस',
        resetTables: 'डिफ़ॉल्ट पर रीसेट',
      },
      tableEdit: {
        title: 'टेबल संपादित करें',
        statusLabel: 'टेबल स्टेटस',
        maxPeopleLimit: 'अधिकतम लोग',
        bookingNameTime: 'बुकिंग नाम / समय',
        internalNote: 'आंतरिक नोट',
        bookingDetails: 'बुकिंग डिटेल्स',
        saveChanges: 'सेव बदलाव',
        close: 'बंद करें',
      },
    },
  },

  gu: {
    language: {
      label: 'ભાષા',
      english: 'English',
      hindi: 'Hindi',
      gujarati: 'Gujarati',
    },

    home: {
      title: 'The Aurelius',
      tagline: 'Culinary Excellence Since 1923',
      scanToViewMenu: 'મેનુ જોવા માટે સ્કેન કરો',
      pointToQr: 'મેનુ ખોલવા માટે QR કોડ પર તમારા ફોન કેમેરાને રાખો',
      openMenu: 'મેનુ ખોલો',
      adminPanel: 'એડમિન પેનલ',
      menuQrCodeAlt: 'મેનુ QR કોડ',
    },

    menu: {
      fineDiningLabel: 'Fine Dining',
      categoriesTabMenu: 'મેનુ',
      categoriesTabTables: 'ટેબલ્સ',

      searchPlaceholder: 'ડિશ/સામગ્રી શોધો...',
      voiceNotSupported: 'આ બ્રાઉઝરમાં વોઇસ સર્ચ સપોર્ટેડ નથી.',
      chefRecs: 'શેફની ભલામણો',

      noDishes: 'કોઈ ડિશ નથી મળી',
      tryDifferentSearch: 'બીજો સર્ચ શબ્દ અજમાવો',
      resultsPrefix: 'પરિણામ',
      resultsPrefixPlural: 'પરિણામો',
      resultsFor: (q: string) => `"${q}" માટે`,

      tableAvailabilityTitle: 'ટેબલ ઉપલબ્ધતા',
      liveStatus: 'લાઇવ સ્થિતિ — હોસ્ટ ટીમ દ્વારા અપડેટ',
      tapToBook: 'બુક કરવા માટે ટેપ કરો',
      tapHint:
        'ઝડપથી બુક કરવા માટે કોઈ પણ ઉપલબ્ધ ટેબલ પર ટેપ કરો. ખાસ વિનંતી માટે રિસેપ્શન પર અમારા હોસ્ટનો સંપર્ક કરો અથવા કોલ કરો',
      allPricesInrHint: 'બધી કિંમતો INR માં GST સાથે છે',

      categories: {
        breakfast: 'નાસ્તો',
        breakfastDesc: 'તમારો દિવસ શરૂ કરવા માટે સવારનાં આનંદો',
        starters: 'સ્ટાર્ટર્સ',
        startersDesc: 'તમારી પાકશિલ્પ યાત્રા શરૂ કરો',
        mains: 'મુખ્ય કોર્સ',
        mainsDesc: 'અમારી રસોઈનું હૃદય',
        desserts: 'મીઠાઈ',
        dessertsDesc: 'પ્રેમથી બનાવેલો મીઠો અંત',
        drinks: 'પીણાં',
        drinksDesc: 'દરેક મૂડ માટે ક્યુરેટેડ પીણાં',
      },

      booking: {
        bookTablePrefix: 'ટેબલ બુક કરો',
        theAurelius: 'The Aurelius',
        seatsLabel: (s: number) => `${s} સીટ`,

        fullNameLabel: 'પૂર્ણ નામ *',
        phoneNumberLabel: 'ફોન નંબર *',
        yourFullNamePlaceholder: 'તમારું પૂર્ણ નામ',
        phonePlaceholder: '+91 XXXX XXXX XX',

        totalPeopleLabel: 'કુલ લોકો *',
        arrivalTimeLabel: 'આગમન સમય *',
        restaurantLabel: 'રેસ્ટોરન્ટ',
        specialRequestsLabel: 'વિશેષ વિનંતી (વૈકલ્પિક)',
        anySpecialRequestsPlaceholder: 'કોઈ વિશેષ વિનંતી?',

        sendOtpButton: 'ઓટિપી મોકલો',
        sendingOtpButton: 'ઓટિપી મોકલાઈ રહ્યું છે…',
        resendOtpButton: 'ફરીથી ઓટિપી મોકલો',
        otpInputPlaceholder: 'ઓટિપી દાખલ કરો',

        verifyOtpButton: 'વેરિફાય',
        verifyingOtpButton: 'વેરિફાઈ થઈ રહ્યું છે…',
        verified: 'વેરિફાઈ થયું',

        otpSendPhoneFirstError: 'કૃપયા પહેલા ફોન નંબર દાખલ કરો',
        otpVerifyBeforeBookingError: 'બુકિંગ કન્ફર્મ કરતા પહેલા OTP વેરિફાય કરો',
        otpEnterError: 'કૃપયા OTP દાખલ કરો',
        otpSent: 'ઓટીપી મોકલાયો. કૃપયા તમારો ફોન તપાસો.',

        cancel: 'રદ કરો',
        confirm: 'કન્ફર્મ',
        confirmBooking: '✓ બુકિંગ કન્ફર્મ કરો',
        bookingLoading: 'બુકિંગ ચાલી રહી છે...',

        confirmDupText: 'તમે પહેલાથી ટેબલ(s) બુક કર્યા છે',
        bookingSuccessHint:
          '📞 એડમિન પેનલમાં કન્ફર્મેશન દેખાશે. તમારી બુકિંગ લાઇવ છે!',

        maxPeopleHint: (max: number) => `પ્રતિ ટેબલ મહત્તમ ${max} લોકો. આ બુકિંગને `,
        bookingNeedsTablesHint: (tables: number) => ` ${tables} ટેબલ(s).`,

        selectAdditionalTablesLabel: (count: number) =>
          `વધારાની ટેબલ્સ પસંદ કરો (${count} જરૂરી)`,
        mustSelectAdditionalTablesHint: (count: number) =>
          `તમારે ${count} વધારાના ટેબલ(s) પસંદ કરવા પડશે.`,

        duplicateConfirmPrefix: (numbers: string) =>
          `તમે પહેલાથી જ ટેબલ(s) ${numbers} આ ફોનથી બુક કર્યા છે. શું તમે ટેબલ`,

        prepTimeLabel: 'તૈયારી સમય',
        caloriesLabel: 'કૅલરીઝ',

        badge: {
          vegTag: 'શાકાહારી',
          spicyTag: 'મસાલેદાર',
          glutenFreeTag: 'ગ્લૂટેન ફ્રી',
          chefPickTag: 'શેફની પિક',
        },

        bookingDoneHint:
          '📞 એડમિન પેનલમાં કન્ફર્મેશન દેખાશે. તમારી બુકિંગ લાઇવ છે!',

        validation: {
          nameRequired: 'કૃપયા તમારું નામ દાખલ કરો',
          peopleMinError: 'લોકોની સંખ્યા ઓછામાં ઓછી 1 હોવી જોઈએ',
          phoneRequired: 'કૃપયા ફોન નંબર દાખલ કરો',
          arrivalRequired: 'કૃપયા આગમન સમય પસંદ કરો',
          additionalTablesRequired: (needed: number) =>
            `કૃપયા ${needed} વધારાના ટેબલ(s) પસંદ કરો`,
          duplicateTableSelection: 'ડુપ્લિકેટ ટેબલ પસંદગી મળી',
          primaryAlreadySelected: 'પ્રાઇમરી ટેબલ પહેલેથી જ પસંદ છે',
          verifyOtpFirst: 'કૃપયા કન્ફર્મ કરતા પહેલા OTP વેરિફાય કરો',
          sendOtpGenericFail: 'ઓટિપી મોકલવામાં નિષ્ફળ',
          verifyOtpGenericFail: 'OTP વેરિફિકેશન નિષ્ફળ',
          bookTablesFail: 'ટેબલ(s) બુક કરવામાં નિષ્ફળ. કૃપયા ફરી પ્રયાસ કરો.',
        },

        allergiesInfo: '💁 કૃપયા તમારા સર્વરને કોઈપણ એલર્જી અથવા આહાર આવશ્યકતાઓ વિશે જણાવો. અમારી ટીમ જ્યાં સંભવ હોય ત્યાં ડિશને કસ્ટમાઇઝ કરવામાં ખુશ છે.',
      },
    },

    admin: {
      login: {
        title: 'એડમિન એક્સેસ',
        staffPortal: 'The Aurelius — સ્ટાફ પોર્ટલ',
        usernameLabel: 'યૂઝરનેમ',
        passwordLabel: 'પાસવર્ડ',
        usernamePlaceholder: 'યૂઝરનેમ નાખો',
        passwordPlaceholder: 'પાસવર્ડ નાખો',
        invalidCreds: 'અમાન્ય યુઝરનેમ અથવા પાસવર્ડ।',
        signIn: 'સાઇન ઇન',
        authorisedOnly: 'માત્ર અધિકૃત સ્ટાફ · The Aurelius Hotel',
      },
      panel: {
        headerLabel: 'એડમિન પેનલ',
        menuDashboard: 'મેનુ મેનેજમેન્ટ ડેશબોર્ડ',
        logout: 'લોગઆઉટ',
        tabs: { qr: 'QR કોડ', tables: 'ટેબલ્સ', stats: 'મેનુ આઇટમ્સ' },
        stats: {
          totalDishes: 'કુલ ડિશેજ',
          chefPicks: 'શેફની પસંદ',
          vegetarian: 'શાકાહારી',
          tablesFree: 'ફ્રી ટેબલ્સ',
        },
        saveFlash: 'ટેબલ સ્ટેટસ સેવ થયું',
        usageGuide: 'ઉપયોગ માર્ગદર્શિકા',
        download: 'ડાઉનલોડ',
        preview: 'પ્રિવ્યૂ',
        backToHome: 'હોમ પર પાછા',
        resetTables: 'ડિફોલ્ટ પર રીસેટ',
      },
      tableEdit: {
        title: 'ટેબલ એડિટ કરો',
        statusLabel: 'ટેબલ સ્ટેટસ',
        maxPeopleLimit: 'મહત્તમ લોકો',
        bookingNameTime: 'બુકિંગ નામ / સમય',
        internalNote: 'આંતરિક નોંધ',
        bookingDetails: 'બુકિંગ વિગતો',
        saveChanges: 'ફેરફારો સેવ કરો',
        close: 'બંધ કરો',
      },
    },
  },
} as const