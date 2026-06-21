import { useState } from 'react';
import { db } from '../firebase/firebase';
import {
  collection, addDoc, serverTimestamp,
  doc, updateDoc, arrayRemove,
} from 'firebase/firestore';
import { useCollection } from '../hooks/useCollection';
import { useTranslation } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaCheckCircle, FaWrench } from 'react-icons/fa';

// Static repair services shown when Firestore 'services' collection is empty
const REPAIR_SERVICES = [
  { id: 'full-service', nameEn: 'Full Service Package', priceEn: '€79.99', nameFi: 'Täyshuolto', priceFi: '€79.99' },
  { id: 'flat-tire',   nameEn: 'Flat Tire Repair',      priceEn: '€14.99', nameFi: 'Rengasrikko', priceFi: '€14.99' },
  { id: 'brake-adj',   nameEn: 'Brake Adjustment',      priceEn: '€24.99', nameFi: 'Jarrusäätö',  priceFi: '€24.99' },
  { id: 'gear-tuning', nameEn: 'Gear Tuning',           priceEn: '€29.99', nameFi: 'Vaihdesäätö', priceFi: '€29.99' },
  { id: 'chain',       nameEn: 'Chain Replacement',     priceEn: '€34.99', nameFi: 'Ketjun vaihto', priceFi: '€34.99' },
  { id: 'safety',      nameEn: 'Safety Inspection',     priceEn: '€19.99', nameFi: 'Turvatarkistus', priceFi: '€19.99' },
];

// Get a localised field from a Firestore service document
const getLang = (obj, field, lang) =>
  obj?.[`${field}${lang.charAt(0).toUpperCase() + lang.slice(1)}`] ?? obj?.[`${field}En`];

// ── Calendar helpers ─────────────────────────────────────────
const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();
const toDateString = (year, month, day) =>
  `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

const MONTH_NAMES = {
  fi: ['Tammikuu','Helmikuu','Maaliskuu','Huhtikuu','Toukokuu','Kesäkuu',
       'Heinäkuu','Elokuu','Syyskuu','Lokakuu','Marraskuu','Joulukuu'],
  sv: ['Januari','Februari','Mars','April','Maj','Juni',
       'Juli','Augusti','September','Oktober','November','December'],
  en: ['January','February','March','April','May','June',
       'July','August','September','October','November','December'],
  ru: ['Январь','Февраль','Март','Апрель','Май','Июнь',
       'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
};
const DAY_NAMES = {
  fi: ['Ma','Ti','Ke','To','Pe','La','Su'],
  sv: ['Må','Ti','On','To','Fr','Lö','Sö'],
  en: ['Mo','Tu','We','Th','Fr','Sa','Su'],
  ru: ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'],
};

// ── Shared style tokens ──────────────────────────────────────
const btnPrimary = `w-full h-11 bg-[#E73725] text-white font-librecaslon font-bold
  text-base rounded-lg shadow hover:bg-[#c92516] transition-colors duration-200
  disabled:opacity-40 disabled:cursor-not-allowed`;

const btnSecondary = `flex-1 h-11 border border-[#E1E1E1] text-gray-500
  font-librecaslon text-base rounded-lg hover:border-[#E73725]
  hover:text-[#E73725] transition-colors duration-200`;

const inputClass = `w-full bg-white border border-[#E1E1E1] rounded-lg
  font-librecaslon text-sm text-[#010000] placeholder-gray-400
  px-4 py-3 outline-none focus:border-[#E73725] transition-colors duration-200`;

const labelClass = 'font-librecaslon text-xs text-gray-500 uppercase tracking-wider';

// ── Step indicator ───────────────────────────────────────────
function StepIndicator({ step }) {
  const { t } = useTranslation();
  const steps = [
    t('bookingStep1'), t('bookingStep2'), t('bookingStep3'),
    t('bookingStep4'), t('bookingStep5'),
  ];
  return (
    <div className="flex items-center justify-center gap-1 mb-8 flex-wrap">
      {steps.map((label, i) => {
        const num = i + 1;
        const active = step === num;
        const done = step > num;
        return (
          <div key={i} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center
                font-librecaslon text-sm font-bold transition-all duration-300
                ${done   ? 'bg-[#E73725] text-white'
                : active ? 'bg-[#010000] text-white'
                         : 'bg-[#E1E1E1] text-gray-400'}`}>
                {done ? '✓' : num}
              </div>
              <span className={`font-librecaslon text-xs mt-1
                ${active ? 'text-[#010000] font-semibold' : 'text-gray-400'}`}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-5 h-px mx-1 mb-5 transition-all duration-300
                ${done ? 'bg-[#E73725]' : 'bg-[#E1E1E1]'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Step 1: Service selection ────────────────────────────────
function StepServiceSelect({ onNext, language }) {
  const { documents } = useCollection('services');
  const { t } = useTranslation();
  const [selected, setSelected] = useState(null);

  // Use Firestore services if available, otherwise fall back to static list
  const services = documents?.length > 0 ? documents : REPAIR_SERVICES;

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-zaslia text-2xl text-[#010000]">{t('bookingSelectService')}</h2>
      <p className="font-librecaslon text-sm text-gray-500">{t('bookingSelectServiceSub')}</p>

      <div className="flex flex-col gap-2 mt-2">
        {!documents && (
          <p className="font-librecaslon text-sm text-gray-400 italic">Loading...</p>
        )}
        {services.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelected(s)}
            className={`w-full flex justify-between items-center px-4 py-3
              border rounded-lg font-librecaslon text-sm transition-all duration-200
              ${selected?.id === s.id
                ? 'border-[#E73725] bg-[#E73725]/8 text-[#010000]'
                : 'border-[#E1E1E1] text-[#010000] hover:border-[#E73725]/60'}`}
          >
            <span>{getLang(s, 'name', language)}</span>
            <span className="text-[#E73725] ml-4 font-bold shrink-0">
              {getLang(s, 'price', language)}
            </span>
          </button>
        ))}
      </div>

      <button
        disabled={!selected}
        onClick={() => onNext({ service: selected })}
        className={`${btnPrimary} mt-2`}
      >
        {t('bookingNext')}
      </button>
    </div>
  );
}

// ── Step 2: Date picker ──────────────────────────────────────
function StepDatePicker({ onNext, onBack, language }) {
  const { documents: availability } = useCollection('availability');
  const { t } = useTranslation();
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selected, setSelected] = useState(null);

  const monthNames = MONTH_NAMES[language] ?? MONTH_NAMES.en;
  const dayNames   = DAY_NAMES[language]   ?? DAY_NAMES.en;

  const availMap = {};
  availability?.forEach((a) => { availMap[a.date] = a; });

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay    = (getFirstDayOfMonth(viewYear, viewMonth) + 6) % 7;

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear((y) => y - 1); setViewMonth(11); }
    else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear((y) => y + 1); setViewMonth(0); }
    else setViewMonth((m) => m + 1);
  };

  const isPast = (day) => {
    const d = new Date(viewYear, viewMonth, day);
    d.setHours(0, 0, 0, 0);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return d < now;
  };

  const hasSlots = (day) => {
    const key = toDateString(viewYear, viewMonth, day);
    const entry = availMap[key];
    return entry && !entry.blocked && entry.slots?.length > 0;
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-zaslia text-2xl text-[#010000]">{t('bookingSelectDate')}</h2>
      <p className="font-librecaslon text-sm text-gray-500">{t('bookingSelectDateSub')}</p>

      {/* Month navigation */}
      <div className="flex items-center justify-between mt-2">
        <button onClick={prevMonth}
          className="font-librecaslon text-gray-400 hover:text-[#E73725] text-2xl px-2 transition-colors">
          ‹
        </button>
        <span className="font-zaslia text-[#010000] text-lg">
          {monthNames[viewMonth]} {viewYear}
        </span>
        <button onClick={nextMonth}
          className="font-librecaslon text-gray-400 hover:text-[#E73725] text-2xl px-2 transition-colors">
          ›
        </button>
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {dayNames.map((d) => (
          <div key={d} className="font-librecaslon text-xs text-gray-400 py-1">{d}</div>
        ))}
        {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
          const past      = isPast(day);
          const available = hasSlots(day);
          const dateStr   = toDateString(viewYear, viewMonth, day);
          const isSel     = selected === dateStr;
          return (
            <button
              key={day}
              disabled={past || !available}
              onClick={() => setSelected(dateStr)}
              className={`aspect-square rounded-lg font-librecaslon text-sm
                transition-all duration-200 flex items-center justify-center
                ${isSel
                  ? 'bg-[#E73725] text-white font-bold'
                  : available && !past
                    ? 'bg-[#E73725]/10 text-[#010000] hover:bg-[#E73725]/20 border border-[#E73725]/30'
                    : 'text-gray-300 cursor-not-allowed'}`}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 text-xs font-librecaslon text-gray-400">
        <div className="w-3 h-3 rounded bg-[#E73725]/20 border border-[#E73725]/30" />
        {t('bookingLegendAvailable')}
      </div>

      <div className="flex gap-3 mt-2">
        <button onClick={onBack} className={btnSecondary}>{t('bookingBack')}</button>
        <button
          disabled={!selected}
          onClick={() => onNext({ date: selected, availDoc: availMap[selected] })}
          className={`flex-1 h-11 bg-[#E73725] text-white font-librecaslon font-bold
            text-base rounded-lg hover:bg-[#c92516] transition-colors duration-200
            disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          {t('bookingNext')}
        </button>
      </div>
    </div>
  );
}

// ── Step 3: Time slot picker ─────────────────────────────────
function StepTimePicker({ booking, onNext, onBack }) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState(null);
  const slots = booking.availDoc?.slots || [];

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-zaslia text-2xl text-[#010000]">{t('bookingSelectTime')}</h2>
      <p className="font-librecaslon text-sm text-gray-500">
        {t('bookingSelectTimeSub')} {booking.date}
      </p>

      {slots.length === 0 && (
        <p className="font-librecaslon text-sm text-gray-400 italic mt-2">
          {t('bookingNoSlots')}
        </p>
      )}

      <div className="grid grid-cols-3 gap-2 mt-2">
        {slots.map((slot) => (
          <button
            key={slot}
            onClick={() => setSelected(slot)}
            className={`py-3 rounded-lg font-librecaslon text-sm font-medium
              transition-all duration-200
              ${selected === slot
                ? 'bg-[#E73725] text-white shadow'
                : 'border border-[#E1E1E1] text-[#010000] hover:border-[#E73725]/60 hover:bg-[#E73725]/8'}`}
          >
            {slot}
          </button>
        ))}
      </div>

      <div className="flex gap-3 mt-4">
        <button onClick={onBack} className={btnSecondary}>{t('bookingBack')}</button>
        <button
          disabled={!selected}
          onClick={() => onNext({ time: selected })}
          className={`flex-1 h-11 bg-[#E73725] text-white font-librecaslon font-bold
            text-base rounded-lg hover:bg-[#c92516] transition-colors duration-200
            disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          {t('bookingNext')}
        </button>
      </div>
    </div>
  );
}

// ── Step 4: Contact form ─────────────────────────────────────
function StepContactForm({ onNext, onBack }) {
  const { t } = useTranslation();
  const [name,  setName]  = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [note,  setNote]  = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !phone) return;
    onNext({ name, email, phone, note });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <h2 className="font-zaslia text-2xl text-[#010000]">{t('bookingContact')}</h2>
      <p className="font-librecaslon text-sm text-gray-500 mb-1">{t('bookingContactSub')}</p>

      <label className={labelClass}>{t('bookingLabelName')} *</label>
      <input required value={name} onChange={(e) => setName(e.target.value)}
        placeholder={t('bookingNamePlaceholder')} className={inputClass} />

      <label className={labelClass}>{t('bookingLabelEmail')} *</label>
      <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
        placeholder={t('bookingEmailPlaceholder')} className={inputClass} />

      <label className={labelClass}>{t('bookingLabelPhone')} *</label>
      <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
        placeholder={t('bookingPhonePlaceholder')} className={inputClass} />

      <label className={labelClass}>
        {t('bookingLabelNote')} <span className="normal-case text-gray-400">{t('bookingLabelOptional')}</span>
      </label>
      <textarea value={note} onChange={(e) => setNote(e.target.value)}
        rows={3} placeholder={t('bookingNotePlaceholder')}
        className={`${inputClass} resize-none`} />

      <div className="flex gap-3 mt-2">
        <button type="button" onClick={onBack} className={btnSecondary}>{t('bookingBack')}</button>
        <button type="submit"
          className={`flex-1 h-11 bg-[#E73725] text-white font-librecaslon font-bold
            text-base rounded-lg hover:bg-[#c92516] transition-colors duration-200`}>
          {t('bookingNext')}
        </button>
      </div>
    </form>
  );
}

// ── Step 5: Confirm & submit ─────────────────────────────────
function StepConfirmation({ booking, language, onBack, onDone }) {
  const { t } = useTranslation();
  const [submitting, setSubmitting] = useState(false);
  const [done,       setDone]       = useState(false);
  const [error,      setError]      = useState(null);

  const serviceName  = getLang(booking.service, 'name',  language);
  const servicePrice = getLang(booking.service, 'price', language);

  const handleConfirm = async () => {
    setSubmitting(true);
    setError(null);
    try {
      // 1. Save booking to Firestore
      await addDoc(collection(db, 'bookings'), {
        serviceId:    booking.service.id,
        serviceName,
        servicePrice,
        date:         booking.date,
        time:         booking.time,
        name:         booking.name,
        email:        booking.email,
        phone:        booking.phone,
        note:         booking.note || '',
        status:       'pending',
        createdAt:    serverTimestamp(),
      });

      // 2. Remove the booked slot from availability
      await updateDoc(doc(db, 'availability', booking.date), {
        slots: arrayRemove(booking.time),
      });

      // 3. Confirmation email to customer
      await addDoc(collection(db, 'mail'), {
        to: booking.email,
        message: {
          subject: 'Your booking is confirmed – Freewheel Bikes🚴',
          html: `
            <div style="font-family: Georgia, serif; max-width: 520px; color: #010000;">
              <h2 style="font-size: 24px; color: #E73725; margin-bottom: 8px;">Freewheel Bikes🚴</h2>
              <p>Hi <strong>${booking.name}</strong>,</p>
              <p>Your repair booking has been received. Here is your summary:</p>
              <table style="border-collapse: collapse; width: 100%; margin: 16px 0;">
                <tr><td style="padding: 6px 0; color: #6b7280;">Service</td>
                    <td style="padding: 6px 0;"><strong>${serviceName}</strong></td></tr>
                <tr><td style="padding: 6px 0; color: #6b7280;">Date</td>
                    <td style="padding: 6px 0;"><strong>${booking.date}</strong></td></tr>
                <tr><td style="padding: 6px 0; color: #6b7280;">Time</td>
                    <td style="padding: 6px 0;"><strong>${booking.time}</strong></td></tr>
                <tr><td style="padding: 6px 0; color: #6b7280;">Price estimate</td>
                    <td style="padding: 6px 0;"><strong>${servicePrice}</strong></td></tr>
                ${booking.note ? `<tr><td style="padding: 6px 0; color: #6b7280;">Note</td>
                    <td style="padding: 6px 0;">${booking.note}</td></tr>` : ''}
              </table>
              <p style="color: #6b7280; font-size: 13px;">
                We will contact you shortly to confirm your appointment.<br/>
                Finlaysoninkatu 25, Tampere — <a href="tel:+358501234567">+358 50 123 4567</a>
              </p>
              <p style="color: #E73725; font-size: 13px;">– Freewheel Bikes🚴Team</p>
            </div>
          `,
        },
      });

      // 4. Admin notification
      await addDoc(collection(db, 'mail'), {
        to: 'jukka.ilveskorpi@gmail.com',
        message: {
          subject: `New booking: ${booking.name} — ${booking.date} at ${booking.time}`,
          html: `
            <div style="font-family: Georgia, serif; max-width: 520px; color: #010000;">
              <h2 style="font-size: 22px; color: #E73725; margin-bottom: 4px;">New Repair Booking📆</h2>
              <table style="border-collapse: collapse; width: 100%; margin: 16px 0;">
                <tr><td style="padding: 6px 0; color: #6b7280; width: 110px;">Customer</td>
                    <td><strong>${booking.name}</strong></td></tr>
                <tr><td style="padding: 6px 0; color: #6b7280;">Phone</td>
                    <td>${booking.phone}</td></tr>
                <tr><td style="padding: 6px 0; color: #6b7280;">Email</td>
                    <td>${booking.email}</td></tr>
                <tr><td style="padding: 6px 0; color: #6b7280;">Service</td>
                    <td><strong>${serviceName}</strong></td></tr>
                <tr><td style="padding: 6px 0; color: #6b7280;">Date</td>
                    <td><strong>${booking.date}</strong></td></tr>
                <tr><td style="padding: 6px 0; color: #6b7280;">Time</td>
                    <td><strong>${booking.time}🕑</strong></td></tr>
                ${booking.note ? `<tr><td style="padding: 6px 0; color: #6b7280;">Note</td>
                    <td>${booking.note}</td></tr>` : ''}
              </table>
            </div>
          `,
        },
      });

      setDone(true);
    } catch (err) {
      console.error(err);
      setError(t('bookingError'));
    } finally {
      setSubmitting(false);
    }
  };

  // Success view
  if (done) {
    return (
      <div className="flex flex-col items-center gap-4 py-6 text-center">
        <div className="w-16 h-16 rounded-full bg-[#E73725]/15 flex items-center justify-center">
          <FaCheckCircle className="text-3xl text-[#E73725]" />
        </div>
        <h2 className="font-zaslia text-3xl text-[#010000]">{t('bookingDone')}</h2>
        <p className="font-librecaslon text-sm text-gray-600 leading-relaxed max-w-xs">
          {t('bookingDoneSub')} <strong>{booking.email}</strong>.{t('bookingDoneContact')}
        </p>
        <button onClick={onDone} className={`${btnPrimary} max-w-xs mt-2`}>
          {t('bookingBackHome')}
        </button>
      </div>
    );
  }

  // Summary before submit
  const rows = [
    [t('bookingLabelService'), serviceName],
    [t('bookingLabelPrice'),   servicePrice],
    [t('bookingLabelDate'),    booking.date],
    [t('bookingLabelTime'),    booking.time],
    [t('bookingLabelName'),    booking.name],
    [t('bookingLabelEmail'),   booking.email],
    [t('bookingLabelPhone'),   booking.phone],
    ...(booking.note ? [[t('bookingLabelNote'), booking.note]] : []),
  ];

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-zaslia text-2xl text-[#010000]">{t('bookingConfirm')}</h2>
      <p className="font-librecaslon text-sm text-gray-500">{t('bookingConfirmSub')}</p>

      <div className="flex flex-col gap-2 mt-2 border border-[#E1E1E1] rounded-lg p-4">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between items-start gap-4
            border-b border-[#E1E1E1]/60 pb-2 last:border-0 last:pb-0">
            <span className="font-librecaslon text-xs text-gray-400 shrink-0 pt-0.5 uppercase tracking-wide">
              {label}
            </span>
            <span className="font-librecaslon text-sm text-[#010000] text-right font-medium">
              {value}
            </span>
          </div>
        ))}
      </div>

      {error && (
        <p className="font-librecaslon text-sm text-red-600 text-center">{error}</p>
      )}

      <div className="flex gap-3 mt-2">
        <button onClick={onBack} disabled={submitting} className={btnSecondary}>
          {t('bookingBack')}
        </button>
        <button
          onClick={handleConfirm}
          disabled={submitting}
          className={`flex-1 h-11 bg-[#E73725] text-white font-librecaslon font-bold
            text-base rounded-lg hover:bg-[#c92516] transition-colors duration-200
            disabled:opacity-60 disabled:cursor-not-allowed`}
        >
          {submitting ? t('bookingSubmitting') : t('bookingSubmit')}
        </button>
      </div>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────
export default function BookingPage() {
  const { t, language } = useTranslation();
  const navigate = useNavigate();
  const [step,    setStep]    = useState(1);
  const [booking, setBooking] = useState({});

  const next = (data) => {
    setBooking((prev) => ({ ...prev, ...data }));
    setStep((s) => s + 1);
  };
  const back  = () => setStep((s) => s - 1);
  const reset = () => { setBooking({}); setStep(1); window.scrollTo(0, 0); };

  return (
    <div className="bg-[#FFFFFF] min-h-screen py-12">
      {/* Hero strip */}
      <div className="bg-[#010000] py-10 px-4 text-center mb-10">
        <div className="flex items-center justify-center gap-3 mb-2">
          <FaWrench className="text-[#E73725] text-2xl" />
          <h1 className="font-zaslia text-4xl text-white">{t('booking')}</h1>
          <FaCalendarAlt className="text-[#E73725] text-2xl" />
        </div>
        <p className="font-librecaslon text-white/70 text-base max-w-md mx-auto">
          {t('bookingTagline')}
        </p>
      </div>

      {/* Form card */}
      <div className="max-w-md mx-auto px-4 pb-16">
        <div className="bg-white border border-[#E1E1E1] rounded-xl shadow-lg px-6 py-8">
          <StepIndicator step={step} />

          {step === 1 && <StepServiceSelect  onNext={next} language={language} />}
          {step === 2 && <StepDatePicker     onNext={next} onBack={back} language={language} />}
          {step === 3 && <StepTimePicker     booking={booking} onNext={next} onBack={back} />}
          {step === 4 && <StepContactForm    onNext={next} onBack={back} />}
          {step === 5 && (
            <StepConfirmation
              booking={booking}
              language={language}
              onBack={back}
              onDone={() => { reset(); navigate('/'); }}
            />
          )}
        </div>

        <p className="font-librecaslon text-center text-sm text-gray-400 mt-6">
          Need help? Call us: <a href="tel:+358501234567" className="text-[#E73725] hover:underline">+358 50 123 4567</a>
        </p>
      </div>
    </div>
  );
}
