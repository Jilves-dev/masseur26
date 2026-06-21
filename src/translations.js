export const translations = {
  fi: {
    // Navigaatio
    palvelut: 'Palvelut & Hinnasto',
    gallery: 'Galleria',
    about: 'Meistä',
    contact: 'Yhteydenotto',
    frontPage: 'Etusivu',
    aboutPage: 'Meistä',
    galleryPage: 'Galleria',
    booking: 'Ajanvaraus',
    shop: 'Lahjakortit',
    blog: 'Blogi',

    // Hero
    hey: 'Hei, me olemme',
    role: 'Urheiluhieroja',
    heroDescription:
      'Urheiluhieroja on kahden kokeneen hierojan yritys Tampereen sydämessä. Yhdistämme ammattitaitoisen urheiluhieronnan, modernin osaamisen ja aidosti henkilökohtaisen palvelun. Autamme sinua palautumaan nopeammin, ehkäisemään vammoja ja voimaan paremmin — ilman turhia mutkia.',
    contactMe: 'Varaa hierontaaika',

    // Palvelukortit (hero-grid)
    service1: 'Urheiluhieronta',
    service2: 'Syvähieronta',
    service3: 'Kuppaushoito',
    service4: 'Venyttely & liikkuvuus',
    service5: 'Hyvinvointihieronta',

    // Hinnasto (fallback, Firebase services käytössä)
    services: [
      { name: 'Urheiluhieronta 30 min',             price: '39 €' },
      { name: 'Urheiluhieronta 60 min',             price: '65 €' },
      { name: 'Urheiluhieronta 90 min',             price: '89 €' },
      { name: 'Syvähieronta 60 min',                price: '70 €' },
      { name: 'Kuppaushoito',                       price: '45 €' },
      { name: 'Liikkuvuus- ja venyttelyhoito',      price: '49 €' },
    ],

    // Hinnasto-osion otsikko
    technologiesTitle: 'Palvelut ja hinnasto',

    // Yhteydenotto
    contactText: 'Ota yhteyttä alla olevalla lomakkeella, käytä ajanvarauskalenteriamme tai käytä ',
    whatsapp: 'WhatsApp',
    namePlaceholder: 'Nimi',
    emailPlaceholder: 'Sähköposti',
    messagePlaceholder: 'Kuvaile asiasi lyhyesti...',
    collaborate: 'Lähetä viesti',

    // InfoFooter
    openingHours: 'Aukioloajat',
    contactInfo: 'Yhteystiedot',
    findUs: 'Löydä meidät',
    closed: 'Suljettu',
    footerCopyright: 'Kaikki oikeudet pidätetään',
    hours: [
      { day: 'Maanantai',   time: '10:00 – 19:00' },
      { day: 'Tiistai',     time: '10:00 – 19:00' },
      { day: 'Keskiviikko', time: '10:00 – 19:00' },
      { day: 'Torstai',     time: '10:00 – 19:00' },
      { day: 'Perjantai',   time: '10:00 – 19:00' },
      { day: 'Lauantai',    time: '10:00 – 17:00' },
      { day: 'Sunnuntai',   time: '12:00 – 16:00' },
    ],

    // About — hero
    aboutTagline: 'Kaksi hierojaa, yksi tavoite: parempi olo',
    aboutHeroTitle: 'Hierontaa ammattitaidolla',
    aboutHeroText:
      'Urheiluhieroja on kahden kokeneen hierojan perustama yritys Tampereen sydämessä. Uskomme, että jokainen ansaitsee ammattitaitoista hoitoa kehon hyvinvointiin — ilman turhaa monimutkaisuutta. Meille asiakkaan palautuminen ja hyvinvointi on aina pääasia.',

    // About — aikajana
    historyTitle: 'Tarinamme',
    timeline: [
      {
        year: '2019',
        title: 'Yhteinen kiinnostus urheiluun ja hyvinvointiin',
        text: 'Sofia Laine ja Mikael Ström tutustuvat toisiinsa hierojan koulutuksessa Tampereella. Yhteinen tausta kilpaurheilussa ja into auttaa muita palautumisessa alkaa muotoutua yhteiseksi visioksi.',
      },
      {
        year: '2021',
        title: 'Urheiluhierojan perustaminen',
        text: 'Valmistuttuaan Sofia ja Mikael perustavat Urheiluhierojan Tampereen keskustaan. Tavoitteena on tarjota ammattitaitoista urheiluhierontaa sekä kilpaurheilijoille että arkiliikkujille.',
      },
      {
        year: '2022',
        title: 'Ensimmäiset vakioasiakkaat',
        text: 'Yritys saa ensimmäiset vakioasiakkaansa paikallisista urheiluseuroista, ja maine luotettavana ja taitavana hierojaparina alkaa levitä suosittelujen kautta.',
      },
      {
        year: '2023',
        title: 'Kasvua ja uusia palveluja',
        text: 'Palveluvalikoima laajenee kuppaushoitoihin ja liikkuvuusharjoitteluun. Yritys muuttaa tilavampiin hierontatiloihin Tampereen keskustassa.',
      },
      {
        year: '2024',
        title: 'Tänään',
        text: 'Urheiluhieroja palvelee kymmeniä asiakkaita viikoittain. Yritys tunnetaan ammattitaidostaan, ystävällisestä palvelustaan ja aidosti asiakaslähtöisestä otteesta.',
      },
    ],

    // About — tiimi
    teamTitle: 'Hierojat',
    team: [
      {
        name: 'Mikael Ström',
        role: 'Hieroja & yrittäjä',
        text: 'Mikael on erikoistunut urheiluhierontaan, syvähierontaan ja kuppaushoitoihin. Hänellä on tausta kilpaurheilussa, minkä ansiosta hän ymmärtää urheilijan kehon erityistarpeet. Mikael palvelee asiakkaita sekä suomeksi että ruotsiksi.',
      },
      {
        name: 'Sofia Laine',
        role: 'Hieroja & yrittäjä',
        text: 'Sofia on erikoistunut liikkuvuusharjoitteluun, venyttelyyn ja hyvinvointihierontaan. Hän valmistui hierojaksi 2020 ja on täydentänyt osaamistaan urheiluhieronnan erikoiskursseilla. Sofia tunnetaan kyvystään räätälöidä hoito juuri asiakkaan tarpeisiin.',
      }
    ],

    // About — arvot
    valuesTitle: 'Arvomme',
    values: [
      {
        otsikko: 'Asiantuntemus',
        teksti: 'Hieronnan ei tarvitse olla arvailua. Räätälöimme aina hoidon kehosi ja tarpeesi mukaan.',
      },
      {
        otsikko: 'Luottamus',
        teksti: 'Asiakassuhde rakentuu luottamukselle. Kuuntelemme ja huomioimme toiveesi joka käynnillä.',
      },
      {
        otsikko: 'Palautuminen',
        teksti: 'Tavoitteemme on aina auttaa sinua palautumaan nopeammin ja voimaan paremmin.',
      },
    ],

    // Galleria
    images: [
      { caption: 'Hierontatilamme' },
      { caption: 'Hoitohuone' },
      { caption: 'Urheiluhieronta' },
      { caption: 'Hierontavälineet' },
      { caption: 'Hierojamme' },
      { caption: 'Urheiluhieroja-tiimi' },
    ],

    // Ajanvaraus
    bookingTagline: 'Varaa hierontaaika helposti verkossa',
    bookingSelectService: 'Valitse palvelu',
    bookingSelectServiceSub: 'Valitse haluamasi hierontapalvelu alta',
    bookingSelectDate: 'Valitse päivä',
    bookingSelectDateSub: 'Merkityt päivät ovat varattavissa',
    bookingSelectTime: 'Valitse aika',
    bookingSelectTimeSub: 'Vapaat ajat päivälle',
    bookingNoSlots: 'Ei vapaita aikoja tälle päivälle.',
    bookingContact: 'Yhteystiedot',
    bookingContactSub: 'Täytä tietosi varauksen vahvistamista varten',
    bookingConfirm: 'Tarkista varaus',
    bookingConfirmSub: 'Tarkista tiedot ja vahvista varaus',
    bookingNext: 'Jatka →',
    bookingBack: '← Takaisin',
    bookingSubmit: 'Vahvista varaus',
    bookingSubmitting: 'Lähetetään...',
    bookingDone: 'Varaus lähetetty!',
    bookingDoneSub: 'Vahvistusviesti on lähetetty osoitteeseen',
    bookingDoneContact: ' Otamme sinuun pian yhteyttä.',
    bookingBackHome: 'Takaisin etusivulle',
    bookingError: 'Jokin meni pieleen. Yritä uudelleen.',
    bookingLabelService: 'Palvelu',
    bookingLabelPrice: 'Hinta-arvio',
    bookingLabelDate: 'Päivä',
    bookingLabelTime: 'Kellonaika',
    bookingLabelName: 'Nimi',
    bookingLabelEmail: 'Sähköposti',
    bookingLabelPhone: 'Puhelin',
    bookingLabelNote: 'Lisätiedot',
    bookingLabelOptional: '(vapaaehtoinen)',
    bookingNamePlaceholder: 'Etunimi Sukunimi',
    bookingEmailPlaceholder: 'sinun@email.fi',
    bookingPhonePlaceholder: '040 123 4567',
    bookingNotePlaceholder: 'Kuvaile toivomuksesi lyhyesti tai mainitse toivottu hieroja...',
    bookingSlots: 'aikaa valittu',
    bookingLegendAvailable: 'Vapaita aikoja',
    bookingStep1: 'Palvelu',
    bookingStep2: 'Päivä',
    bookingStep3: 'Aika',
    bookingStep4: 'Tiedot',
    bookingStep5: 'Vahvistus',
  },

  sv: {
    // Navigaatio
    palvelut: 'Tjänster & prislista',
    gallery: 'Galleri',
    about: 'Om oss',
    contact: 'Kontakt',
    frontPage: 'Startsida',
    aboutPage: 'Om oss',
    galleryPage: 'Galleri',
    booking: 'Tidsbokning',
    shop: 'Presentkort',
    blog: 'Blogg',

    // Hero
    hey: 'Hej, vi är',
    role: 'Urheiluhieroja',
    heroDescription:
      'Urheiluhieroja är ett företag grundat av två erfarna massörer i hjärtat av Tammerfors. Vi kombinerar professionell idrottsmassage, modern kunskap och genuint personlig service. Vi hjälper dig återhämta dig snabbare, förebygga skador och må bättre.',
    contactMe: 'Boka massagetid',

    // Tjänstkort (hero-grid)
    service1: 'Idrottsmassage',
    service2: 'Djupmassage',
    service3: 'Cupping-behandling',
    service4: 'Stretching & rörlighet',
    service5: 'Avkopplande massage',

    // Prislista (fallback)
    services: [
      { name: 'Idrottsmassage 30 min',              price: '39 €' },
      { name: 'Idrottsmassage 60 min',              price: '65 €' },
      { name: 'Idrottsmassage 90 min',              price: '89 €' },
      { name: 'Djupmassage 60 min',                 price: '70 €' },
      { name: 'Cupping-behandling',                 price: '45 €' },
      { name: 'Rörlighets- och stretchbehandling',  price: '49 €' },
    ],

    // Prislista-rubrik
    technologiesTitle: 'Tjänster och prislista',

    // Kontakt
    contactText: 'Kontakta oss via formuläret nedan, använd vår bokningskalender eller  ',
    whatsapp: 'WhatsApp',
    namePlaceholder: 'Namn',
    emailPlaceholder: 'E-post',
    messagePlaceholder: 'Beskriv ditt ärende kortfattat...',
    collaborate: 'Skicka meddelande',

    // InfoFooter
    openingHours: 'Öppettider',
    contactInfo: 'Kontaktuppgifter',
    findUs: 'Hitta oss',
    closed: 'Stängt',
    footerCopyright: 'Alla rättigheter förbehållna',
    hours: [
      { day: 'Måndag',   time: '10:00 – 19:00' },
      { day: 'Tisdag',   time: '10:00 – 19:00' },
      { day: 'Onsdag',   time: '10:00 – 19:00' },
      { day: 'Torsdag',  time: '10:00 – 19:00' },
      { day: 'Fredag',   time: '10:00 – 19:00' },
      { day: 'Lördag',   time: '10:00 – 17:00' },
      { day: 'Söndag',   time: '12:00 – 16:00' },
    ],

    // About — hero
    aboutTagline: 'Två massörer, ett mål: bättre mående',
    aboutHeroTitle: 'Massage med yrkeskunskap',
    aboutHeroText:
      'Urheiluhieroja grundades av två erfarna massörer i hjärtat av Tammerfors. Vi tror att alla förtjänar professionell vård för kroppens välmående — utan onödig komplexitet. För oss är din återhämtning och ditt välmående alltid i centrum.',

    // About — tidslinje
    historyTitle: 'Vår historia',
    timeline: [
      {
        year: '2019',
        title: 'Gemensamt intresse för idrott och välmående',
        text: 'Sofia Laine och Mikael Ström träffas under massageutbildningen i Tammerfors. En gemensam bakgrund inom tävlingsidrott och en vilja att hjälpa andra att återhämta sig växer till en gemensam vision.',
      },
      {
        year: '2021',
        title: 'Grundandet av Urheiluhieroja',
        text: 'Efter examen grundar Sofia och Mikael Urheiluhieroja i centrala Tammerfors. Målet är att erbjuda professionell idrottsmassage för både tävlingsidrottare och vardagsmotionärer.',
      },
      {
        year: '2022',
        title: 'Första stamkunderna',
        text: 'Företaget får sina första stamkunder från lokala idrottsföreningar, och ryktet om ett kunnigt och pålitligt massörpar sprids genom rekommendationer.',
      },
      {
        year: '2023',
        title: 'Tillväxt och nya tjänster',
        text: 'Utbudet växer med cupping-behandlingar och rörlighetsträning. Företaget flyttar till rymligare lokaler i centrala Tammerfors.',
      },
      {
        year: '2024',
        title: 'Idag',
        text: 'Urheiluhieroja betjänar dussintals kunder varje vecka. Företaget är känt för sin yrkeskunskap, vänliga service och genuint kundorienterade arbetssätt.',
      },
    ],

    // About — team
    teamTitle: 'Massörerna',
    team: [
      {
        name: 'Mikael Ström',
        role: 'Massör & företagare',
        text: 'Mikael är specialiserad på idrottsmassage, djupmassage och cupping-behandlingar. Han har en bakgrund inom tävlingsidrott, vilket ger honom förståelse för idrottarens kropp. Mikael betjänar kunder på både finska och svenska.',
      },
      {
        name: 'Sofia Laine',
        role: 'Massör & företagare',
        text: 'Sofia är specialiserad på rörlighetsträning, stretching och avkopplande massage. Hon utbildade sig till massör 2020 och har kompletterat sin kompetens med specialkurser i idrottsmassage. Sofia är känd för sin förmåga att skräddarsy behandlingen efter kundens behov.',
      }
    ],

    // About — värderingar
    valuesTitle: 'Våra värderingar',
    values: [
      {
        otsikko: 'Sakkunskap',
        teksti: 'Massage ska inte vara en gissningslek. Vi anpassar alltid behandlingen efter din kropp och dina behov.',
      },
      {
        otsikko: 'Förtroende',
        teksti: 'Kundrelationen bygger på förtroende. Vi lyssnar och tar hänsyn till dina önskemål vid varje besök.',
      },
      {
        otsikko: 'Återhämtning',
        teksti: 'Vårt mål är alltid att hjälpa dig återhämta dig snabbare och må bättre.',
      },
    ],

    // Galleri
    images: [
      { caption: 'Vår behandlingslokal' },
      { caption: 'Behandlingsrum' },
      { caption: 'Idrottsmassage' },
      { caption: 'Massageutrustning' },
      { caption: 'Våra massörer' },
      { caption: 'Urheiluhieroja-teamet' },
    ],

    // Tidsbokning
    bookingTagline: 'Boka massagetid enkelt online',
    bookingSelectService: 'Välj tjänst',
    bookingSelectServiceSub: 'Välj önskad massagetjänst nedan',
    bookingSelectDate: 'Välj dag',
    bookingSelectDateSub: 'Markerade dagar är tillgängliga',
    bookingSelectTime: 'Välj tid',
    bookingSelectTimeSub: 'Lediga tider för',
    bookingNoSlots: 'Inga lediga tider för denna dag.',
    bookingContact: 'Kontaktuppgifter',
    bookingContactSub: 'Fyll i dina uppgifter för att bekräfta bokningen',
    bookingConfirm: 'Granska bokning',
    bookingConfirmSub: 'Kontrollera uppgifterna och bekräfta bokningen',
    bookingNext: 'Fortsätt →',
    bookingBack: '← Tillbaka',
    bookingSubmit: 'Bekräfta bokning',
    bookingSubmitting: 'Skickar...',
    bookingDone: 'Bokning skickad!',
    bookingDoneSub: 'Bekräftelse har skickats till',
    bookingDoneContact: ' Vi kontaktar dig snart.',
    bookingBackHome: 'Tillbaka till startsidan',
    bookingError: 'Något gick fel. Försök igen.',
    bookingLabelService: 'Tjänst',
    bookingLabelPrice: 'Prisuppskattning',
    bookingLabelDate: 'Dag',
    bookingLabelTime: 'Klockslag',
    bookingLabelName: 'Namn',
    bookingLabelEmail: 'E-post',
    bookingLabelPhone: 'Telefon',
    bookingLabelNote: 'Tilläggsinfo',
    bookingLabelOptional: '(frivillig)',
    bookingNamePlaceholder: 'Förnamn Efternamn',
    bookingEmailPlaceholder: 'din@email.fi',
    bookingPhonePlaceholder: '040 123 4567',
    bookingNotePlaceholder: 'Beskriv dina önskemål kortfattat eller ange önskad massör...',
    bookingSlots: 'tider valda',
    bookingLegendAvailable: 'Lediga tider',
    bookingStep1: 'Tjänst',
    bookingStep2: 'Dag',
    bookingStep3: 'Tid',
    bookingStep4: 'Uppgifter',
    bookingStep5: 'Bekräftelse',
  },

  en: {
    // Navigation
    palvelut: 'Services & Pricing',
    gallery: 'Gallery',
    about: 'About Us',
    contact: 'Contact',
    frontPage: 'Home',
    aboutPage: 'About Us',
    galleryPage: 'Gallery',
    booking: 'Booking',
    shop: 'Gift Cards',
    blog: 'Blog',

    // Hero
    hey: 'Hello, we are',
    role: 'Urheiluhieroja',
    heroDescription:
      'Urheiluhieroja is a company founded by two experienced massage therapists in the heart of Tampere. We combine professional sports massage, modern expertise and genuinely personal service. We help you recover faster, prevent injuries and feel better.',
    contactMe: 'Book a Massage',

    // Service cards
    service1: 'Sports Massage',
    service2: 'Deep Tissue Massage',
    service3: 'Cupping Therapy',
    service4: 'Stretching & Mobility',
    service5: 'Relaxation Massage',

    // Pricing (fallback)
    services: [
      { name: 'Sports Massage 30 min',            price: '€39' },
      { name: 'Sports Massage 60 min',            price: '€65' },
      { name: 'Sports Massage 90 min',            price: '€89' },
      { name: 'Deep Tissue Massage 60 min',       price: '€70' },
      { name: 'Cupping Therapy',                  price: '€45' },
      { name: 'Mobility & Stretching Treatment',  price: '€49' },
    ],

    technologiesTitle: 'Services and Pricing',

    // Contact
    contactText: 'Contact us via the form below, use our booking calendar or ',
    whatsapp: 'WhatsApp',
    namePlaceholder: 'Name',
    emailPlaceholder: 'Email',
    messagePlaceholder: 'Briefly describe your matter...',
    collaborate: 'Send Message',

    // InfoFooter
    openingHours: 'Opening Hours',
    contactInfo: 'Contact Information',
    findUs: 'Find Us',
    closed: 'Closed',
    footerCopyright: 'All rights reserved',
    hours: [
      { day: 'Monday',    time: '10:00 – 19:00' },
      { day: 'Tuesday',   time: '10:00 – 19:00' },
      { day: 'Wednesday', time: '10:00 – 19:00' },
      { day: 'Thursday',  time: '10:00 – 19:00' },
      { day: 'Friday',    time: '10:00 – 19:00' },
      { day: 'Saturday',  time: '10:00 – 17:00' },
      { day: 'Sunday',    time: '12:00 – 16:00' },
    ],

    // About — hero
    aboutTagline: 'Two therapists, one goal: feeling better',
    aboutHeroTitle: 'Massage with expertise',
    aboutHeroText:
      "Urheiluhieroja was founded by two experienced massage therapists in the heart of Tampere. We believe everyone deserves professional care for their body's wellbeing — without unnecessary complexity. For us, your recovery and wellbeing always come first.",

    // About — timeline
    historyTitle: 'Our Story',
    timeline: [
      {
        year: '2019',
        title: 'A Shared Passion for Sport and Wellbeing',
        text: 'Sofia Laine and Mikael Ström meet during their massage therapy training in Tampere. A shared background in competitive sport and a drive to help others recover grows into a common vision.',
      },
      {
        year: '2021',
        title: 'Founding of Urheiluhieroja',
        text: 'After graduating, Sofia and Mikael found Urheiluhieroja in central Tampere, aiming to offer professional sports massage for both competitive athletes and everyday active people.',
      },
      {
        year: '2022',
        title: 'First Regular Clients',
        text: 'The company gains its first regular clients from local sports clubs, and a reputation as a skilled and reliable duo of therapists spreads through recommendations.',
      },
      {
        year: '2023',
        title: 'Growth and New Services',
        text: 'The range of services grows to include cupping therapy and mobility training. The company moves to more spacious treatment premises in central Tampere.',
      },
      {
        year: '2024',
        title: 'Today',
        text: 'Urheiluhieroja serves dozens of clients every week. The company is known for its expertise, friendly service and genuinely client-centred approach.',
      },
    ],

    // About — team
    teamTitle: 'The Therapists',
    team: [
      {
        name: 'Mikael Ström',
        role: 'Massage Therapist & Co-founder',
        text: "Mikael specialises in sports massage, deep tissue massage and cupping therapy. His background in competitive sport gives him a deep understanding of an athlete's body. Mikael serves clients in both Finnish and Swedish.",
      },
      {
        name: 'Sofia Laine',
        role: 'Massage Therapist & Co-founder',
        text: "Sofia specialises in mobility training, stretching and relaxation massage. She qualified as a massage therapist in 2020 and has completed further training in sports massage. Sofia is known for tailoring every treatment to the client's needs.",
      },
    ],

    // About — values
    valuesTitle: 'Our Values',
    values: [
      {
        otsikko: 'Expertise',
        teksti: "Massage shouldn't be guesswork. We always tailor the treatment to your body and your needs.",
      },
      {
        otsikko: 'Trust',
        teksti: 'The client relationship is built on trust. We listen and take your wishes into account at every visit.',
      },
      {
        otsikko: 'Recovery',
        teksti: 'Our goal is always to help you recover faster and feel better.',
      },
    ],

    // Gallery
    images: [
      { caption: 'Our Treatment Space' },
      { caption: 'Treatment Room' },
      { caption: 'Sports Massage' },
      { caption: 'Massage Equipment' },
      { caption: 'Our Therapists' },
      { caption: 'The Urheiluhieroja Team' },
    ],

    // Booking
    bookingTagline: 'Book your massage appointment online — quick and easy',
    bookingSelectService: 'Select Massage Service',
    bookingSelectServiceSub: 'Choose the massage service you need',
    bookingSelectDate: 'Select Date',
    bookingSelectDateSub: 'Marked dates are available',
    bookingSelectTime: 'Select Time',
    bookingSelectTimeSub: 'Available times for',
    bookingNoSlots: 'No available times for this day.',
    bookingContact: 'Contact Details',
    bookingContactSub: 'Fill in your details to confirm the booking',
    bookingConfirm: 'Review Booking',
    bookingConfirmSub: 'Check the details and confirm your booking',
    bookingNext: 'Continue →',
    bookingBack: '← Back',
    bookingSubmit: 'Confirm Booking',
    bookingSubmitting: 'Sending...',
    bookingDone: 'Booking Sent!',
    bookingDoneSub: 'A confirmation has been sent to',
    bookingDoneContact: ' We will contact you shortly.',
    bookingBackHome: 'Back to Home',
    bookingError: 'Something went wrong. Please try again.',
    bookingLabelService: 'Service',
    bookingLabelPrice: 'Price Estimate',
    bookingLabelDate: 'Date',
    bookingLabelTime: 'Time',
    bookingLabelName: 'Name',
    bookingLabelEmail: 'Email',
    bookingLabelPhone: 'Phone',
    bookingLabelNote: 'Additional Information',
    bookingLabelOptional: '(optional)',
    bookingNamePlaceholder: 'First Last',
    bookingEmailPlaceholder: 'your@email.com',
    bookingPhonePlaceholder: '+358 40 123 4567',
    bookingNotePlaceholder: 'Briefly describe your needs or mention your preferred therapist...',
    bookingSlots: 'times selected',
    bookingLegendAvailable: 'Available times',
    bookingStep1: 'Service',
    bookingStep2: 'Date',
    bookingStep3: 'Time',
    bookingStep4: 'Details',
    bookingStep5: 'Confirmation',
  },

  ru: {
    // Навигация
    palvelut: 'Услуги',
    gallery: 'Галерея',
    about: 'О нас',
    contact: 'Контакт',
    frontPage: 'Главная',
    aboutPage: 'О нас',
    galleryPage: 'Галерея',
    booking: 'Запись на приём',
    shop: 'Подарочные карты',
    blog: 'Блог',

    // Герой
    hey: 'Здравствуйте, мы —',
    role: 'Urheiluhieroja',
    heroDescription:
      'Urheiluhieroja — компания, основанная двумя опытными массажистами в центре Тампере. Мы объединяем профессиональный спортивный массаж, современный подход и подлинно персональный сервис. Мы помогаем вам быстрее восстановиться, предотвратить травмы и чувствовать себя лучше.',
    contactMe: 'Записаться на массаж',

    // Карточки услуг
    service1: 'Спортивный массаж',
    service2: 'Глубокий массаж',
    service3: 'Баночный массаж',
    service4: 'Растяжка и подвижность',
    service5: 'Расслабляющий массаж',

    // Прайс-лист (запасной)
    services: [
      { name: 'Спортивный массаж 30 мин',   price: '39 €' },
      { name: 'Спортивный массаж 60 мин',   price: '65 €' },
      { name: 'Спортивный массаж 90 мин',   price: '89 €' },
      { name: 'Глубокий массаж 60 мин',     price: '70 €' },
      { name: 'Баночный массаж',            price: '45 €' },
      { name: 'Растяжка и подвижность',     price: '49 €' },
    ],

    technologiesTitle: 'Услуги и цены',

    // Контакт
    contactText: 'Свяжитесь с нами через форму ниже, используйте наш календарь записи или ',
    whatsapp: 'WhatsApp',
    namePlaceholder: 'Имя',
    emailPlaceholder: 'Электронная почта',
    messagePlaceholder: 'Кратко опишите ваш вопрос...',
    collaborate: 'Отправить сообщение',

    // Нижний колонтитул
    openingHours: 'Часы работы',
    contactInfo: 'Контактная информация',
    findUs: 'Найдите нас',
    closed: 'Закрыто',
    footerCopyright: 'Все права защищены',
    hours: [
      { day: 'Понедельник', time: '10:00 – 19:00' },
      { day: 'Вторник',     time: '10:00 – 19:00' },
      { day: 'Среда',       time: '10:00 – 19:00' },
      { day: 'Четверг',     time: '10:00 – 19:00' },
      { day: 'Пятница',     time: '10:00 – 19:00' },
      { day: 'Суббота',     time: '10:00 – 17:00' },
      { day: 'Воскресенье', time: '12:00 – 16:00' },
    ],

    // О нас — герой
    aboutTagline: 'Два массажиста, одна цель: самочувствие лучше',
    aboutHeroTitle: 'Массаж с профессионализмом',
    aboutHeroText:
      'Urheiluhieroja основана двумя опытными массажистами в центре Тампере. Мы убеждены, что каждый заслуживает профессионального ухода за телом — без лишней сложности. Для нас восстановление и самочувствие клиента всегда на первом месте.',

    // О нас — хронология
    historyTitle: 'Наша история',
    timeline: [
      {
        year: '2019',
        title: 'Общий интерес к спорту и хорошему самочувствию',
        text: 'София Лайне и Микаэль Стрём знакомятся во время обучения на массажистов в Тампере. Общий опыт в спорте высоких достижений и желание помогать другим восстанавливаться формируют общее видение.',
      },
      {
        year: '2021',
        title: 'Основание Urheiluhieroja',
        text: 'После окончания учёбы София и Микаэль основывают компанию Urheiluhieroja в центре Тампере. Цель — предлагать профессиональный спортивный массаж как для спортсменов, так и для тех, кто просто активно занимается спортом.',
      },
      {
        year: '2022',
        title: 'Первые постоянные клиенты',
        text: 'Компания получает первых постоянных клиентов из местных спортивных клубов, и репутация умелого и надёжного дуэта массажистов распространяется через рекомендации.',
      },
      {
        year: '2023',
        title: 'Рост и новые услуги',
        text: 'Перечень услуг расширяется баночным массажем и тренировкой подвижности. Компания переезжает в более просторное помещение в центре Тампере.',
      },
      {
        year: '2024',
        title: 'Сегодня',
        text: 'Urheiluhieroja обслуживает десятки клиентов каждую неделю. Компания известна своим профессионализмом, дружелюбным сервисом и подлинно клиентоориентированным подходом.',
      },
    ],

    // О нас — команда
    teamTitle: 'Наши массажисты',
    team: [
      {
        name: 'Микаэль Стрём',
        role: 'Массажист и совладелец',
        text: 'Микаэль специализируется на спортивном массаже, глубоком массаже и баночной терапии. Его опыт в спорте высоких достижений помогает понимать особенности тела спортсмена. Микаэль обслуживает клиентов на финском и шведском языках.',
      },
      {
        name: 'София Лайне',
        role: 'Массажист и совладелец',
        text: 'София специализируется на тренировке подвижности, растяжке и расслабляющем массаже. Она получила квалификацию массажиста в 2020 году и прошла дополнительное обучение по спортивному массажу. София известна умением подбирать процедуру индивидуально под потребности клиента.',
      },
    ],

    // О нас — ценности
    valuesTitle: 'Наши ценности',
    values: [
      {
        otsikko: 'Профессионализм',
        teksti: 'Массаж — это не догадки. Мы всегда подбираем процедуру под ваше тело и потребности.',
      },
      {
        otsikko: 'Доверие',
        teksti: 'Отношения с клиентом строятся на доверии. Мы слушаем и учитываем ваши пожелания при каждом визите.',
      },
      {
        otsikko: 'Восстановление',
        teksti: 'Наша цель — всегда помочь вам быстрее восстановиться и чувствовать себя лучше.',
      },
    ],

    // Галерея
    images: [
      { caption: 'Наше помещение' },
      { caption: 'Кабинет процедур' },
      { caption: 'Спортивный массаж' },
      { caption: 'Массажное оборудование' },
      { caption: 'Наши массажисты' },
      { caption: 'Команда Urheiluhieroja' },
    ],

    // Запись на приём
    bookingTagline: 'Запишитесь на массаж онлайн легко и быстро',
    bookingSelectService: 'Выберите услугу',
    bookingSelectServiceSub: 'Выберите нужную услугу массажа ниже',
    bookingSelectDate: 'Выберите дату',
    bookingSelectDateSub: 'Отмеченные даты доступны для записи',
    bookingSelectTime: 'Выберите время',
    bookingSelectTimeSub: 'Доступное время на',
    bookingNoSlots: 'На этот день нет свободного времени.',
    bookingContact: 'Контактные данные',
    bookingContactSub: 'Заполните данные для подтверждения записи',
    bookingConfirm: 'Проверьте запись',
    bookingConfirmSub: 'Проверьте данные и подтвердите запись',
    bookingNext: 'Далее →',
    bookingBack: '← Назад',
    bookingSubmit: 'Подтвердить запись',
    bookingSubmitting: 'Отправка...',
    bookingDone: 'Запись отправлена!',
    bookingDoneSub: 'Подтверждение отправлено на адрес',
    bookingDoneContact: ' Мы свяжемся с вами в ближайшее время.',
    bookingBackHome: 'На главную страницу',
    bookingError: 'Что-то пошло не так. Попробуйте снова.',
    bookingLabelService: 'Услуга',
    bookingLabelPrice: 'Ориентировочная стоимость',
    bookingLabelDate: 'Дата',
    bookingLabelTime: 'Время',
    bookingLabelName: 'Имя',
    bookingLabelEmail: 'Электронная почта',
    bookingLabelPhone: 'Телефон',
    bookingLabelNote: 'Дополнительная информация',
    bookingLabelOptional: '(необязательно)',
    bookingNamePlaceholder: 'Имя Фамилия',
    bookingEmailPlaceholder: 'ваш@email.com',
    bookingPhonePlaceholder: '+358 40 123 4567',
    bookingNotePlaceholder: 'Кратко опишите ваши пожелания или укажите предпочтительного массажиста...',
    bookingSlots: 'выбрано времён',
    bookingLegendAvailable: 'Свободное время',
    bookingStep1: 'Услуга',
    bookingStep2: 'Дата',
    bookingStep3: 'Время',
    bookingStep4: 'Данные',
    bookingStep5: 'Подтверждение',
  },
};
