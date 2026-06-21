import { useState } from 'react';
import { db } from '../../firebase/firebase';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { useCollection } from '../../hooks/useCollection';
import AdminMobileHeader from '../../common/AdminMobileHeader';
import Header from '../../common/Header';

const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year, month) => (new Date(year, month, 1).getDay() + 6) % 7;

const toDateString = (year, month, day) =>
  `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

const MONTH_NAMES = [
  'Tammikuu','Helmikuu','Maaliskuu','Huhtikuu','Toukokuu','Kesäkuu',
  'Heinäkuu','Elokuu','Syyskuu','Lokakuu','Marraskuu','Joulukuu',
];
const DAY_NAMES = ['Ma','Ti','Ke','To','Pe','La','Su'];

const DEFAULT_SLOTS = [
  '08:00','09:00','10:00','11:00','12:00',
  '13:00','14:00','15:00','16:00','17:00',
];

function DayModal({ dateStr, existingDoc, onClose }) {
  const existing = existingDoc ?? { slots: [], blocked: false };
  const [blocked, setBlocked] = useState(existing.blocked ?? false);
  const [slots, setSlots] = useState(existing.slots ?? []);
  const [saving, setSaving] = useState(false);

  const toggleSlot = (slot) => {
    setSlots(prev =>
      prev.includes(slot) ? prev.filter(s => s !== slot) : [...prev, slot].sort()
    );
  };

  const handleSave = async () => {
    setSaving(true);
    if (!blocked && slots.length === 0) {
      await deleteDoc(doc(db, 'availability', dateStr));
    } else {
      await setDoc(doc(db, 'availability', dateStr), {
        date: dateStr,
        blocked,
        slots: blocked ? [] : slots,
      });
    }
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      onClick={onClose}>
      <div className="absolute inset-0 bg-[#010000]/40 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-sm bg-[#FFFFFF] border border-gray-200
          rounded-xl shadow-xl px-6 py-6 flex flex-col gap-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-zaslia text-2xl text-[#010000]">{dateStr}</h3>
          <button onClick={onClose}
            className="font-librecaslon text-gray-400 hover:text-[#E73725] text-xl">
            ✕
          </button>
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <div
            onClick={() => { setBlocked(b => !b); if (!blocked) setSlots([]); }}
            className={`w-10 h-6 rounded-full transition-colors duration-200 relative
              ${blocked ? 'bg-red-400' : 'bg-gray-200'}`}
          >
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow
              transition-transform duration-200
              ${blocked ? 'translate-x-5' : 'translate-x-1'}`} />
          </div>
          <span className="font-librecaslon text-sm text-[#010000]">
            Estä koko päivä
          </span>
        </label>

        {!blocked && (
          <>
            <p className="font-librecaslon text-xs text-gray-500 uppercase tracking-widest">
              Vapaat ajat
            </p>
            <div className="grid grid-cols-4 gap-2">
              {DEFAULT_SLOTS.map(slot => (
                <button
                  key={slot}
                  onClick={() => toggleSlot(slot)}
                  className={`py-2 rounded-lg font-zaslia text-sm transition-all duration-150
                    ${slots.includes(slot)
                      ? 'bg-[#E73725] text-white'
                      : 'border border-gray-200 text-[#010000] hover:border-[#E73725]/60'}`}
                >
                  {slot}
                </button>
              ))}
            </div>
            <p className="font-librecaslon text-xs text-gray-500">
              {slots.length} aikaa valittu
            </p>
          </>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full h-11 bg-[#010000] text-white font-zaslia
            text-base rounded-full shadow-xl
            hover:bg-[#E73725] transition-colors duration-300
            disabled:opacity-50"
        >
          {saving ? 'Tallennetaan...' : 'Tallenna'}
        </button>
      </div>
    </div>
  );
}

export default function AvailabilityAdmin() {
  const { documents: availability } = useCollection('availability');

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(null);

  const availMap = {};
  availability?.forEach(a => { availMap[a.date] = a; });

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };

  const isPast = (day) => {
    const d = new Date(viewYear, viewMonth, day);
    d.setHours(0, 0, 0, 0);
    const t = new Date(); t.setHours(0, 0, 0, 0);
    return d < t;
  };

  const getDayState = (day) => {
    const key = toDateString(viewYear, viewMonth, day);
    const avDoc = availMap[key];
    if (!avDoc) return 'empty';
    if (avDoc.blocked) return 'blocked';
    if (avDoc.slots?.length > 0) return 'available';
    return 'empty';
  };

  return (
    <div>
      <AdminMobileHeader pageTitle="Kalenteri" />
      <div className="hidden md:block"><Header /></div>

      {selectedDate && (
        <DayModal
          dateStr={selectedDate}
          existingDoc={availMap[selectedDate] ?? null}
          onClose={() => setSelectedDate(null)}
        />
      )}

      <div className="min-h-screen bg-[#FFFFFF] flex flex-col items-center px-4 py-12">
        <div className="w-full max-w-md bg-[#FFFFFF] border border-gray-200
          rounded-xl shadow-xl px-6 py-8 flex flex-col gap-4">

          <p className="font-librecaslon text-sm text-gray-500">Ylläpito</p>
          <h1 className="font-zaslia text-4xl text-[#010000]">Kalenteri</h1>
          <p className="font-librecaslon text-sm text-[#010000] leading-relaxed">
            Klikkaa päivää lisätäksesi tai muokataksesi vapaita aikoja.
          </p>

          <div className="flex gap-4 flex-wrap">
            {[
              { color: 'bg-[#E73725]/20 border border-[#E73725]/50', label: 'Vapaita aikoja' },
              { color: 'bg-red-100 border border-red-300', label: 'Estetty' },
              { color: 'bg-gray-50 border border-gray-200', label: 'Ei määritetty' },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded ${color}`} />
                <span className="font-librecaslon text-xs text-gray-500">{label}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-2">
            <button onClick={prevMonth}
              className="font-librecaslon text-gray-400 hover:text-[#E73725] text-2xl px-2">
              ‹
            </button>
            <span className="font-zaslia text-[#010000] text-lg">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>
            <button onClick={nextMonth}
              className="font-librecaslon text-gray-400 hover:text-[#E73725] text-2xl px-2">
              ›
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {DAY_NAMES.map(d => (
              <div key={d}
                className="font-librecaslon text-xs text-gray-500 text-center py-1">
                {d}
              </div>
            ))}

            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`e${i}`} />
            ))}

            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
              const past = isPast(day);
              const state = getDayState(day);
              const dateStr = toDateString(viewYear, viewMonth, day);

              const colors = {
                available: 'bg-[#E73725]/20 border border-[#E73725]/50 text-[#010000] hover:bg-[#E73725]/35',
                blocked:   'bg-red-100 border border-red-300 text-red-500 hover:bg-red-200',
                empty:     'bg-gray-50 border border-gray-200 text-gray-400 hover:bg-gray-100',
              };

              return (
                <button
                  key={day}
                  onClick={() => !past && setSelectedDate(dateStr)}
                  disabled={past}
                  className={`aspect-square rounded-lg font-librecaslon text-sm
                    flex flex-col items-center justify-center transition-all duration-150
                    ${past ? 'opacity-25 cursor-not-allowed bg-transparent border border-gray-100 text-gray-400'
                           : colors[state]}
                  `}
                >
                  <span>{day}</span>
                  {!past && state === 'available' && (
                    <span className="text-[8px] text-[#E73725] leading-none">
                      {availMap[dateStr]?.slots?.length}
                    </span>
                  )}
                  {!past && state === 'blocked' && (
                    <span className="text-[8px] text-red-400 leading-none">✕</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
