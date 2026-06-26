import { useState } from 'react';
import { db } from '../../firebase/firebase';
import { doc, updateDoc, addDoc, collection, arrayUnion } from 'firebase/firestore';
import { useCollection } from '../../hooks/useCollection';
import AdminMobileHeader from '../../common/AdminMobileHeader';
import Header from '../../common/Header';

const STATUS_LABELS = {
  pending:   { fi: 'Odottaa',     color: 'bg-amber-100 text-amber-700 border-amber-300' },
  confirmed: { fi: 'Vahvistettu', color: 'bg-green-100 text-green-700 border-green-300' },
  cancelled: { fi: 'Peruutettu',  color: 'bg-red-100 text-red-600 border-red-300' },
};

function StatusBadge({ status }) {
  const s = STATUS_LABELS[status] ?? STATUS_LABELS.pending;
  return (
    <span className={`font-oswaldVariable text-xs px-2 py-0.5 rounded-full border ${s.color}`}>
      {s.fi}
    </span>
  );
}

function BookingCard({ b }) {
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const update = async (status) => {
    setLoading(true);
    await updateDoc(doc(db, 'bookings', b.id), { status });

    if (status === 'cancelled') {
      try {
        await updateDoc(doc(db, 'availability', b.date), {
          slots: arrayUnion(b.time),
        });
      } catch {
        console.warn('availability-dokumenttia ei löydy päivälle', b.date);
      }

      await addDoc(collection(db, 'mail'), {
        to: b.email,
        message: {
          subject: 'Varauksesi on peruutettu – Urheiluhieroja',
          html: `
            <div style="font-family: Georgia, serif; max-width: 520px; color: #333f48;">
              <h2 style="font-size: 22px; margin-bottom: 4px;">Urheiluhieroja</h2>
              <p>Hei <strong>${b.name}</strong>,</p>
              <p>Valitettavasti varauksesi on peruutettu.</p>
              <table style="border-collapse: collapse; width: 100%; margin: 16px 0;">
                <tr><td style="padding: 6px 0; color: #e31837; width: 100px;">Palvelu</td>
                    <td><strong>${b.serviceName}</strong></td></tr>
                <tr><td style="padding: 6px 0; color: #e31837;">Päivä</td>
                    <td><strong>${b.date}</strong></td></tr>
                <tr><td style="padding: 6px 0; color: #e31837;">Kellonaika</td>
                    <td><strong>${b.time}</strong></td></tr>
              </table>
              <p>Voit tehdä uuden varauksen osoitteessa:</p>
              <a href="https://bike26-2ffd8.web.app/booking"
                 style="display:inline-block; background:#e31837; color:#eceef1;
                        padding: 10px 24px; border-radius: 999px; font-size: 14px;
                        text-decoration: none; margin-top: 4px;">
                Varaa uusi aika →
              </a>
              <p style="color: #e31837; font-size: 13px; margin-top: 16px;">
                Pahoittelemme aiheutunutta haittaa.<br/>
                Urheiluhieroja
              </p>
            </div>
          `,
        },
      });
    }
    setLoading(false);
  };

  return (
    <div
      className={`border rounded-lg transition-all duration-200
        ${b.status === 'cancelled' ? 'border-gray-100 opacity-60' :
          b.status === 'confirmed' ? 'border-green-200' : 'border-[#e31837]/40'}`}
    >
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center justify-between px-4 py-3 text-left gap-2"
      >
        <div className="flex flex-col min-w-0">
          <span className="font-racingSansOne text-base text-[#333f48] truncate">
            {b.name}
          </span>
          <span className="font-oswaldVariable text-xs text-gray-500">
            {b.date} · {b.time}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <StatusBadge status={b.status} />
          <span className="text-gray-400 text-sm">{expanded ? '▲' : '▼'}</span>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 flex flex-col gap-3 border-t border-gray-100 pt-3">
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            {[
              ['Palvelu', b.serviceName],
              ['Hinta', b.servicePrice],
              ['Puhelin', b.phone],
              ['Sähköposti', b.email],
              ...(b.note ? [['Lisätiedot', b.note]] : []),
            ].map(([label, value]) => (
              <div key={label} className="col-span-2 flex gap-2 items-baseline">
                <span className="font-oswaldVariable text-xs text-gray-500 shrink-0 w-20">
                  {label}
                </span>
                <span className="font-oswaldVariable text-sm text-[#333f48]">{value}</span>
              </div>
            ))}
          </div>

          {b.status !== 'cancelled' && (
            <div className="flex gap-2 mt-1">
              {b.status !== 'confirmed' && (
                <button
                  disabled={loading}
                  onClick={() => update('confirmed')}
                  className="flex-1 h-9 bg-green-600 text-white font-racingSansOne
                    text-sm rounded-full hover:bg-green-700 transition-colors duration-200
                    disabled:opacity-50"
                >
                  ✓ Vahvista
                </button>
              )}
              <button
                disabled={loading}
                onClick={() => update('cancelled')}
                className="flex-1 h-9 border border-red-400 text-red-500 font-racingSansOne
                  text-sm rounded-full hover:bg-red-50 transition-colors duration-200
                  disabled:opacity-50"
              >
                ✕ Peruuta
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function BookingsAdmin() {
  const { documents: bookings } = useCollection('bookings');
  const [filter, setFilter] = useState('all');

  const sorted = bookings
    ? [...bookings].sort((a, b) => {
        const da = `${a.date} ${a.time}`;
        const db_ = `${b.date} ${b.time}`;
        return da.localeCompare(db_);
      })
    : [];

  const filtered = filter === 'all'
    ? sorted
    : sorted.filter(b => b.status === filter);

  const counts = {
    all: sorted.length,
    pending: sorted.filter(b => b.status === 'pending').length,
    confirmed: sorted.filter(b => b.status === 'confirmed').length,
    cancelled: sorted.filter(b => b.status === 'cancelled').length,
  };

  const filterBtns = [
    { key: 'all',       label: 'Kaikki' },
    { key: 'pending',   label: 'Odottaa' },
    { key: 'confirmed', label: 'Vahvistettu' },
    { key: 'cancelled', label: 'Peruutettu' },
  ];

  return (
    <div>
      <AdminMobileHeader pageTitle="Varaukset" />
      <div className="hidden md:block"><Header /></div>

      <div className="min-h-screen bg-[#eceef1] flex flex-col items-center px-4 py-12">
        <div className="w-full max-w-md bg-[#eceef1] border border-gray-200
          rounded-xl shadow-xl px-6 py-8 flex flex-col gap-4">

          <p className="font-oswaldVariable text-sm text-gray-500">Ylläpito</p>
          <h1 className="font-racingSansOne text-4xl text-[#333f48]">Varaukset</h1>

          <div className="flex gap-2 flex-wrap">
            {filterBtns.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`font-oswaldVariable text-xs px-3 py-1.5 rounded-full border
                  transition-colors duration-200
                  ${filter === key
                    ? 'bg-[#e31837] text-white border-[#e31837]'
                    : 'border-gray-200 text-gray-500 hover:border-[#e31837] hover:text-[#e31837]'}`}
              >
                {label}
                <span className="ml-1 opacity-70">({counts[key]})</span>
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2 mt-1">
            {!bookings && (
              <p className="font-oswaldVariable text-sm text-gray-500 italic">Ladataan...</p>
            )}
            {bookings && filtered.length === 0 && (
              <p className="font-oswaldVariable text-sm text-gray-500 italic">
                Ei varauksia tässä kategoriassa.
              </p>
            )}
            {filtered.map(b => (
              <BookingCard key={b.id} b={b} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
