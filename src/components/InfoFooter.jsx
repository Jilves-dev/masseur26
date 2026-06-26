import React from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import { useTranslation } from '../context/LanguageContext';

export default function InfoFooter() {
  const { t } = useTranslation();

  return (
    <footer className="w-full bg-[#333f48]">
      <div className="max-w-4xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-12">

        {/* Aukioloajat */}
        <div>
          <div className="flex items-center gap-2 mb-5">
            <FaClock className="text-[#b9975b] text-lg" />
            <h3 className="font-racingSansOne text-xl text-white">{t('openingHours')}</h3>
          </div>
          <ul className="font-oswaldVariable text-white text-sm space-y-2">
            {t('hours').map(({ day, time }) => (
              <li key={day} className="flex justify-between border-b border-[#b9975b] pb-1">
                <span>{day}</span>
                <span className={time === t('closed') ? 'text-[#888]' : 'text-white'}>
                  {time}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Yhteystiedot */}
        <div>
          <h3 className="font-racingSansOne text-xl text-white mb-5">{t('contactInfo')}</h3>
          <ul className="font-oswaldVariable text-sm space-y-4">
            <li className="flex items-start gap-3">
              <FaMapMarkerAlt className="text-[#b9975b] mt-0.5 shrink-0" />
              <span className="text-white">
                Aleksanterinkatu 15<br />
                00100 Helsinki
              </span>
            </li>
            <li className="flex items-center gap-3 text-white">
              <FaPhone className="text-[#b9975b] shrink-0" />
              <a href="tel:+358401234567" className="hover:text-[#E97B52] transition-colors">
                +358 40 123 4567
              </a>
            </li>
            <li className="flex items-center gap-3 text-white">
              <FaEnvelope className="text-[#b9975b] shrink-0" />
              <a href="mailto:werner&jasmin@urheiluhieroja.fi" className="hover:text-[#E97B52] transition-colors">
                werner&jasmin@urheiluhieroja.fi
              </a>
            </li>
          </ul>
        </div>

        {/* Google Maps */}
        <div>
          <h3 className="font-racingSansOne text-xl text-white mb-5">{t('findUs')}</h3>
          <div className="rounded-md overflow-hidden shadow-lg border border-[#3a3a3a]">
            <iframe
              title="werner&jasmin@urheiluhieroja.fi Google Maps-sijainti"
              src="https://maps.google.com/maps?q=Aleksanterinkatu+15,+00100+Helsinki&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="200"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

      </div>

      {/* Alakapea */}
      <div className="border-t border-[#3a3a3a] py-4 text-center font-oswaldVariable text-xs text-[#666]">
        © {new Date().getFullYear()} werner&jasmin@urheiluhieroja.fi &mdash; {t('footerCopyright')}
      </div>
    </footer>
  );
}
