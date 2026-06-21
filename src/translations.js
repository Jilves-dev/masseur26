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
    blog: 'Blogi',

    // Hero
    hey: 'Hei, me olemme',
    role: 'Asianajotoimisto Advocatus',
    heroDescription:
      'Advocatus on kahden nuoren asianajajan perustama toimisto Helsingin sydämessä. Yhdistämme oikeudellisen asiantuntemuksen, modernin ajattelun ja aidosti henkilökohtaisen palvelun. Jokainen asiakkaamme saa selkeät vastaukset — ilman turhaa juridiikkaa.',
    contactMe: 'Varaa konsultaatio',

    // Palvelukortit (hero-grid)
    service1: 'Perheasiat',
    service2: 'Perintö & testamentti',
    service3: 'Sopimukset',
    service4: 'Yritysjuridiikka',
    service5: 'Työ- ja virkamiesasiat',

    // Hinnasto (fallback, Firebase services käytössä)
    services: [
      { name: 'Konsultaatio',             price: '120 € / h' },
      { name: 'Perheasiat & avioero',     price: '150 € / h' },
      { name: 'Perintö & testamentti',    price: '150 € / h' },
      { name: 'Sopimusasiat',             price: '180 € / h' },
      { name: 'Työ- ja virkamiesasiat',   price: '150 € / h' },
      { name: 'Yritysjuridiikka',         price: '200 € / h' },
    ],

    // Hinnasto-osion otsikko
    technologiesTitle: 'Palvelut ja Hinnasto',

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
      { day: 'Maanantai',   time: '08:30 – 17:00' },
      { day: 'Tiistai',     time: '08:30 – 17:00' },
      { day: 'Keskiviikko', time: '08:30 – 17:00' },
      { day: 'Torstai',     time: '08:30 – 17:00' },
      { day: 'Perjantai',   time: '08:30 – 16:00' },
      { day: 'Lauantai',    time: 'Suljettu' },
      { day: 'Sunnuntai',   time: 'Suljettu' },
    ],

    // About — hero
    aboutTagline: 'Nuoret juristit, selkeät ratkaisut',
    aboutHeroTitle: 'Laki selkokielellä',
    aboutHeroText:
      'Asianajotoimisto Advocatus on kahden nuoren asianajajan perustama toimisto Helsingin sydämessä. Uskomme, että jokainen ansaitsee ammattitaitoisen oikeudellisen neuvon — ilman turhaa monimutkaisuutta. Meille asiakkaan asia on aina pääasia.',

    // About — aikajana
    historyTitle: 'Tarinamme',
    timeline: [
      {
        year: '2019',
        title: 'Opintovuodet & verkostot',
        text: 'Sofia Laine ja Mikael Ström tutustuvat toisiinsa Helsingin yliopiston oikeustieteellisessä tiedekunnassa. Yhteinen visio selkeästä ja saavutettavasta oikeusavusta alkaa muotoutua.',
      },
      {
        year: '2021',
        title: 'Advocatusin perustaminen',
        text: 'Valmistuttuaan Sofia ja Mikael perustavat Asianajotoimisto Advocatusin Kampin lähelle. Toimiston nimi tulee latinan sanasta "lupus" — mutta ennen kaikkea se symbolisoi tarmokasta asiakkaan puolustamista.',
      },
      {
        year: '2022',
        title: 'Ensimmäiset suuret tapaukset',
        text: 'Toimisto menestyi useissa perheoikeus- ja sopimusriidoissa, ja maine hyvänä sekä reiluna neuvonantajana alkoi levitä. Asiakaskunta kasvoi suosittelujen kautta.',
      },
      {
        year: '2023',
        title: 'Kasvua ja uusia palveluja',
        text: 'Yritysjuridiikan palvelut laajennivat startup-yritysten kasvun myötä. Toimisto rekrytoi ensimmäisen harjoittelijan ja muutti tilavampiin toimistotiloihin Aleksanterinkadulla.',
      },
      {
        year: '2024',
        title: 'Tänään',
        text: 'Advocatus palvelee useita kymmeniä asiakkaita kuukausittain. Toimisto tunnetaan asiantuntijuudestaan, selkeästä viestinnästä ja aidosti asiakaslähtöisestä toimintatavasta.',
      },
    ],

    // About — tiimi
    teamTitle: 'Ihmiset takana',
    team: [
      {
        name: 'Mikael Ström',
        role: 'Osakas & asianajaja',
        text: 'Mikael on erikoistunut yritysjuridiikkaan, työ- ja virkamiesasioihin sekä sopimusneuvotteluihin. Hän on kaksikielinen ja palvelee asiakkaita sekä suomeksi että ruotsiksi. Mikael on suorittanut osan opinnoistaan Tukholmassa.',
      },
        {
        name: 'Sofia Laine',
        role: 'Osakas & asianajaja',
        text: 'Sofia on erikoistunut perheoikeuteen, perintöasioihin ja sopimusjuridiikkaan. Hän valmistui oikeusnotaariksi Helsingin yliopistosta 2020 ja suoritti OTM-tutkinnon 2021. Sofia tunnetaan kyvystään selittää monimutkaiset asiat ymmärrettävästi.',
      }
    ],

    // About — arvot
    valuesTitle: 'Arvomme',
    values: [
      {
        otsikko: 'Selkeys',
        teksti: 'Juridiikan ei tarvitse olla sekavaa. Kerromme aina tilanteesi rehellisesti ja ymmärrettävästi.',
      },
      {
        otsikko: 'Luottamus',
        teksti: 'Asiakassuhde rakentuu luottamukselle. Jokainen asia käsitellään täydellä salassapitovelvollisuudella.',
      },
      {
        otsikko: 'Tuloksellisuus',
        teksti: 'Tavoitteemme on aina paras mahdollinen lopputulos asiakkaalle — nopeasti ja kustannustehokkaasti.',
      },
    ],

    // Galleria
    images: [
      { caption: 'Toimistomme' },
      { caption: 'Neuvotteluhuone' },
      { caption: 'Sopimustyö' },
      { caption: 'Lakikirjasto' },
      { caption: 'Asiantuntijat' },
      { caption: 'Advocatus-tiimi' },
    ],

    // Ajanvaraus
    bookingTagline: 'Varaa konsultaatioaika helposti verkossa',
    bookingSelectService: 'Valitse palvelu',
    bookingSelectServiceSub: 'Valitse haluamasi palvelu alta',
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
    bookingNotePlaceholder: 'Kuvaile asiasi lyhyesti tai mainitse toivottu asianajaja...',
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
    blog: 'Blogg',

    // Hero
    hey: 'Hej, vi är',
    role: 'Advokatbyrå Advocatus',
    heroDescription:
      'Advocatus är en advokatbyrå grundad av två unga jurister i hjärtat av Helsingfors. Vi kombinerar juridisk expertis, modernt tänkande och genuint personlig service. Varje kund får tydliga svar — utan onödig juridisk jargong.',
    contactMe: 'Boka konsultation',

    // Tjänstkort (hero-grid)
    service1: 'Familjeärenden',
    service2: 'Arv & testamente',
    service3: 'Avtal',
    service4: 'Bolagsjuridik',
    service5: 'Arbetsrätt',

    // Prislista (fallback)
    services: [
      { name: 'Konsultation',              price: '120 € / h' },
      { name: 'Familjeärenden & skilsmässa', price: '150 € / h' },
      { name: 'Arv & testamente',          price: '150 € / h' },
      { name: 'Avtalsärenden',             price: '180 € / h' },
      { name: 'Arbetsrättsliga ärenden',   price: '150 € / h' },
      { name: 'Bolagsjuridik',             price: '200 € / h' },
    ],

    // Prislista-rubrik
    technologiesTitle: 'Tjänster och prislista',

    // Kontakt
    contactText: 'Kontakta oss via formuläret nedan, använd vår möteskalender eller  ',
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
      { day: 'Måndag',   time: '08:30 – 17:00' },
      { day: 'Tisdag',   time: '08:30 – 17:00' },
      { day: 'Onsdag',   time: '08:30 – 17:00' },
      { day: 'Torsdag',  time: '08:30 – 17:00' },
      { day: 'Fredag',   time: '08:30 – 16:00' },
      { day: 'Lördag',   time: 'Stängt' },
      { day: 'Söndag',   time: 'Stängt' },
    ],

    // About — hero
    aboutTagline: 'Unga jurister, tydliga lösningar',
    aboutHeroTitle: 'Juridik på klarspråk',
    aboutHeroText:
      'Advokatbyrå Advocatus grundades 2021 av två unga jurister i Helsingfors. Vi tror att alla förtjänar professionell juridisk rådgivning — utan onödig komplexitet. För oss är klientens ärende alltid i centrum.',

    // About — tidslinje
    historyTitle: 'Vår historia',
    timeline: [
      {
        year: '2019',
        title: 'Studier & nätverk',
        text: 'Sofia Laine och Mikael Ström träffas vid juridiska fakulteten vid Helsingfors universitet. En gemensam vision om tydlig och tillgänglig juridisk hjälp börjar ta form.',
      },
      {
        year: '2021',
        title: 'Grundandet av Advocatus',
        text: 'Efter examen grundar Sofia och Mikael Advokatbyrå Advocatus nära Kampen. Byråns namn hämtar inspiration från latin — framför allt symboliserar det ett envist försvar av klientens intressen.',
      },
      {
        year: '2022',
        title: 'Första stora uppdragen',
        text: 'Byrån nådde framgång i flera familjerätts- och avtalsärenden, och ryktet som en kompetent och rättvis rådgivare spred sig. Klientbasen växte genom rekommendationer.',
      },
      {
        year: '2023',
        title: 'Tillväxt och nya tjänster',
        text: 'Bolagsjuridiktjänsterna expanderade i takt med startup-tillväxten. Byrån rekryterade sin första praktikant och flyttade till rymligare lokaler på Alexandersgatan.',
      },
      {
        year: '2024',
        title: 'Idag',
        text: 'Advocatus betjänar ett flertal klienter varje månad. Byrån är känd för sin expertis, tydliga kommunikation och genuint klientorienterade arbetssätt.',
      },
    ],

    // About — team
    teamTitle: 'Människorna bakom',
    team: [
      {
        name: 'Mikael Ström',
        role: 'Delägare & advokat',
        text: 'Mikael är specialiserad på bolagsjuridik, arbetsrätt och avtalsförhandlingar. Han är tvåspråkig och betjänar klienter på både finska och svenska. Mikael har genomfört en del av sina studier i Stockholm.',
      },
        {
        name: 'Sofia Laine',
        role: 'Delägare & advokat',
        text: 'Sofia är specialiserad på familjerätt, arvsärenden och avtalsrätt. Hon avlade juristkandidatexamen vid Helsingfors universitet 2020 och JM-examen 2021. Sofia är känd för sin förmåga att förklara komplexa frågor på ett begripligt sätt.',
      }
    ],

    // About — värderingar
    valuesTitle: 'Våra värderingar',
    values: [
      {
        otsikko: 'Tydlighet',
        teksti: 'Juridik behöver inte vara krångligt. Vi berättar alltid din situation ärligt och begripligt.',
      },
      {
        otsikko: 'Förtroende',
        teksti: 'Klientrelationen bygger på förtroende. Varje ärende hanteras med full sekretess.',
      },
      {
        otsikko: 'Resultat',
        teksti: 'Vårt mål är alltid bästa möjliga utfall för klienten — snabbt och kostnadseffektivt.',
      },
    ],

    // Galleri
    images: [
      { caption: 'Vårt kontor' },
      { caption: 'Förhandlingsrum' },
      { caption: 'Avtalsarbete' },
      { caption: 'Juridisk litteratur' },
      { caption: 'Experterna' },
      { caption: 'Advocatus-teamet' },
    ],

    // Tidsbokning
    bookingTagline: 'Boka konsultationstid enkelt online',
    bookingSelectService: 'Välj tjänst',
    bookingSelectServiceSub: 'Välj önskad tjänst nedan',
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
    bookingNotePlaceholder: 'Beskriv ditt ärende kortfattat eller ange önskad advokat...',
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
    booking: 'Book a Repair',
    blog: 'Blog',

    // Hero
    hey: 'Hello, we are',
    role: 'Law Firm Advocatus',
    heroDescription:
      'Advocatus is a law firm founded by two young lawyers in the heart of Helsinki. We combine legal expertise, modern thinking and genuinely personal service. Every client receives clear answers — without unnecessary legal jargon.',
    contactMe: 'Book a Consultation',
 
    // Service cards
    service1: 'Family Law',
    service2: 'Inheritance & Wills',
    service3: 'Contracts',
    service4: 'Corporate Law',
    service5: 'Employment Law',
 
    // Pricing (fallback)
    services: [
      { name: 'Consultation',          price: '120 € / h' },
      { name: 'Family Law & Divorce',  price: '150 € / h' },
      { name: 'Inheritance & Wills',   price: '150 € / h' },
      { name: 'Contract Matters',      price: '180 € / h' },
      { name: 'Employment Law',        price: '150 € / h' },
      { name: 'Corporate Law',         price: '200 € / h' },
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
      { day: 'Monday',    time: '08:30 – 17:00' },
      { day: 'Tuesday',   time: '08:30 – 17:00' },
      { day: 'Wednesday', time: '08:30 – 17:00' },
      { day: 'Thursday',  time: '08:30 – 17:00' },
      { day: 'Friday',    time: '08:30 – 16:00' },
      { day: 'Saturday',  time: 'Closed' },
      { day: 'Sunday',    time: 'Closed' },
    ],
 
    // About — hero
    aboutTagline: 'Young lawyers, clear solutions',
    aboutHeroTitle: 'Law in plain language',
    aboutHeroText:
      'Law Firm Advocatus was founded in 2021 by two young lawyers in the heart of Helsinki. We believe everyone deserves professional legal advice — without unnecessary complexity. For us, the client\'s matter is always the priority.',
 
    // About — timeline
    historyTitle: 'Our Story',
    timeline: [
      {
        year: '2019',
        title: 'Studies & Networks',
        text: 'Sofia Laine and Mikael Ström meet at the Faculty of Law at the University of Helsinki. A shared vision of clear and accessible legal help begins to take shape.',
      },
      {
        year: '2021',
        title: 'Founding of Advocatus',
        text: 'After graduating, Sofia and Mikael establish Law Firm Advocatus near Kamppi. The firm\'s name draws from Latin — above all it symbolises a determined defence of the client\'s interests.',
      },
      {
        year: '2022',
        title: 'First Major Cases',
        text: 'The firm succeeded in several family law and contract disputes, and a reputation as a competent and fair adviser began to spread. The client base grew through recommendations.',
      },
      {
        year: '2023',
        title: 'Growth and New Services',
        text: 'Corporate law services expanded alongside startup growth. The firm recruited its first trainee and moved to more spacious offices on Aleksanterinkatu.',
      },
      {
        year: '2024',
        title: 'Today',
        text: 'Advocatus serves dozens of clients every month. The firm is known for its expertise, clear communication and genuinely client-centred approach.',
      },
    ],
 
    // About — team
    teamTitle: 'The People Behind',
    team: [
      {
        name: 'Mikael Ström',
        role: 'Partner & Attorney',
        text: 'Mikael specialises in corporate law, employment law and contract negotiations. He is bilingual and serves clients in both Finnish and Swedish. Mikael completed part of his studies in Stockholm.',
      },
      {
        name: 'Sofia Laine',
        role: 'Partner & Attorney',
        text: 'Sofia specialises in family law, inheritance matters and contract law. She graduated with a Bachelor of Laws from the University of Helsinki in 2020 and completed her Master of Laws in 2021. Sofia is known for her ability to explain complex matters clearly.',
      },
    ],
 
    // About — values
    valuesTitle: 'Our Values',
    values: [
      {
        otsikko: 'Clarity',
        teksti: 'Law does not have to be confusing. We always explain your situation honestly and understandably.',
      },
      {
        otsikko: 'Trust',
        teksti: 'The client relationship is built on trust. Every matter is handled with full confidentiality.',
      },
      {
        otsikko: 'Results',
        teksti: 'Our goal is always the best possible outcome for the client — quickly and cost-effectively.',
      },
    ],
 
    // Gallery
    images: [
      { caption: 'Our Office' },
      { caption: 'Conference Room' },
      { caption: 'Contract Work' },
      { caption: 'Legal Library' },
      { caption: 'Our Experts' },
      { caption: 'The Advocatus Team' },
    ],
 
    // Booking
    bookingTagline: 'Book your bike repair online — quick and easy',
    bookingSelectService: 'Select Repair Service',
    bookingSelectServiceSub: 'Choose the repair service you need',
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
    bookingNotePlaceholder: 'Describe what needs fixing on your bike (optional)...',
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
    booking: 'встреча',
    blog: 'Блог',

    // Герой
    hey: 'Здравствуйте, мы —',
    role: 'Адвокатское бюро Адвокатус',
    heroDescription:
      'Адвокатус — адвокатское бюро, основанное двумя молодыми юристами в центре Хельсинки. Мы сочетаем юридический профессионализм, современный подход и подлинно персональный сервис. Каждый клиент получает чёткие ответы — без лишней юридической терминологии.',
    contactMe: 'Записаться на консультацию',
 
    // Карточки услуг
    service1: 'Семейное право',
    service2: 'Наследство и завещания',
    service3: 'Договоры',
    service4: 'Корпоративное право',
    service5: 'Трудовое право',
 
    // Прайс-лист (запасной)
    services: [
      { name: 'Консультация',              price: '120 € / ч' },
      { name: 'Семейные дела и развод',    price: '150 € / ч' },
      { name: 'Наследство и завещания',    price: '150 € / ч' },
      { name: 'Договорные вопросы',        price: '180 € / ч' },
      { name: 'Трудовое право',            price: '150 € / ч' },
      { name: 'Корпоративное право',       price: '200 € / ч' },
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
      { day: 'Понедельник', time: '08:30 – 17:00' },
      { day: 'Вторник',     time: '08:30 – 17:00' },
      { day: 'Среда',       time: '08:30 – 17:00' },
      { day: 'Четверг',     time: '08:30 – 17:00' },
      { day: 'Пятница',     time: '08:30 – 16:00' },
      { day: 'Суббота',     time: 'Закрыто' },
      { day: 'Воскресенье', time: 'Закрыто' },
    ],
 
    // О нас — герой
    aboutTagline: 'Молодые юристы, чёткие решения',
    aboutHeroTitle: 'Право простым языком',
    aboutHeroText:
      'Адвокатское бюро Адвокатус основано в 2021 году двумя молодыми юристами в сердце Хельсинки. Мы убеждены, что каждый заслуживает профессиональной юридической консультации — без лишней сложности. Для нас дело клиента всегда на первом месте.',
 
    // О нас — хронология
    historyTitle: 'Наша история',
    timeline: [
      {
        year: '2019',
        title: 'Учёба и связи',
        text: 'София Лайне и Микаэль Стрём встречаются на юридическом факультете Хельсинкского университета. Общее видение доступной и понятной юридической помощи начинает формироваться.',
      },
      {
        year: '2021',
        title: 'Основание Адвокатус',
        text: 'После окончания учёбы София и Микаэль основывают адвокатское бюро Адвокатус вблизи Кампи. Название бюро восходит к латыни — прежде всего оно символизирует упорную защиту интересов клиента.',
      },
      {
        year: '2022',
        title: 'Первые крупные дела',
        text: 'Бюро добилось успеха в нескольких делах в области семейного права и договорных споров, и репутация компетентного и честного советника начала распространяться. Клиентская база росла благодаря рекомендациям.',
      },
      {
        year: '2023',
        title: 'Рост и новые услуги',
        text: 'Услуги в области корпоративного права расширились вместе с ростом стартапов. Бюро приняло первого стажёра и переехало в более просторный офис на Александерской улице.',
      },
      {
        year: '2024',
        title: 'Сегодня',
        text: 'Advocatus обслуживает десятки клиентов ежемесячно. Бюро известно своим профессионализмом, чёткой коммуникацией и подлинно клиентоориентированным подходом.',
      },
    ],
 
    // О нас — команда
    teamTitle: 'Люди за бюро',
    team: [
      {
        name: 'Микаэль Стрём',
        role: 'Партнёр и адвокат',
        text: 'Микаэль специализируется на корпоративном праве, трудовом праве и договорных переговорах. Он двуязычен и обслуживает клиентов на финском и шведском языках. Часть обучения Микаэль прошёл в Стокгольме.',
      },
      {
        name: 'София Лайне',
        role: 'Партнёр и адвокат',
        text: 'София специализируется на семейном праве, наследственных делах и договорном праве. Она окончила Хельсинкский университет в 2020 году и получила степень магистра права в 2021 году. София известна умением объяснять сложные вопросы простым языком.',
      },
    ],
 
    // О нас — ценности
    valuesTitle: 'Наши ценности',
    values: [
      {
        otsikko: 'Ясность',
        teksti: 'Право не должно быть запутанным. Мы всегда объясняем вашу ситуацию честно и понятно.',
      },
      {
        otsikko: 'Доверие',
        teksti: 'Отношения с клиентом строятся на доверии. Каждое дело ведётся с полным соблюдением конфиденциальности.',
      },
      {
        otsikko: 'Результат',
        teksti: 'Наша цель — всегда наилучший исход для клиента: быстро и экономично.',
      },
    ],
 
    // Галерея
    images: [
      { caption: 'Наш офис' },
      { caption: 'Переговорная комната' },
      { caption: 'Договорная работа' },
      { caption: 'Юридическая библиотека' },
      { caption: 'Наши эксперты' },
      { caption: 'Команда Advocatus' },
    ],
 
    // Запись на приём
    bookingTagline: 'Запишитесь на консультацию онлайн легко и быстро',
    bookingSelectService: 'Выберите услугу',
    bookingSelectServiceSub: 'Выберите нужную услугу ниже',
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
    bookingNotePlaceholder: 'Кратко опишите ваше дело или укажите предпочтительного адвоката...',
    bookingSlots: 'выбрано времён',
    bookingLegendAvailable: 'Свободное время',
    bookingStep1: 'Услуга',
    bookingStep2: 'Дата',
    bookingStep3: 'Время',
    bookingStep4: 'Данные',
    bookingStep5: 'Подтверждение',
  },
};
