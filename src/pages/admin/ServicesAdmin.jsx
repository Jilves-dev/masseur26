import { useState } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { useCollection } from './hooks/useCollection';
import { useLogout } from './hooks/useLogout';
import Menu from './menu';

export default function ServicesAdmin() {
  const { logout } = useLogout();
  const { documents: services } = useCollection('services');
  const [nameFi, setNameFi]   = useState('');
  const [nameSv, setNameSv]   = useState('');
  const [nameEn, setNameEn]   = useState('');
  const [nameRu, setNameRu]   = useState('');
  const [priceFi, setPriceFi] = useState('');
  const [priceSv, setPriceSv] = useState('');
  const [priceEn, setPriceEn] = useState('');
  const [priceRu, setPriceRu] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, 'services'), {
      nameFi, nameSv, nameEn, nameRu,
      priceFi, priceSv, priceEn, priceRu,
    });
    setNameFi(''); setNameSv(''); setNameEn(''); setNameRu('');
    setPriceFi(''); setPriceSv(''); setPriceEn(''); setPriceRu('');
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'services', id));
  };

  const inputField = (label, value, onChange, placeholder) => (
    <div className="flex flex-col gap-1">
      <label className="font-oswaldVariable text-xs text-[#8e8e90] uppercase tracking-widest">
        {label}
      </label>
      <input
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent border-2 border-[#b9975b] rounded-lg
                   font-oswaldVariable text-sm text-[#333f48] placeholder-[#b9975b]
                   px-4 py-3 outline-none"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#eceef1] flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md bg-transparent border-2 border-[#b9975b]
                      rounded-xl shadow-[0_0_10px_#b9975b] backdrop-blur-sm
                      px-10 py-8 flex flex-col gap-4">

        <p className="font-oswaldVariable text-sm text-[#8e8e90]">Ylläpito</p>
        <h1 className="font-racingSansOne text-4xl text-[#333f48]">Palvelut ja Hinnasto</h1>
        <p className="font-oswaldVariable text-sm text-[#333f48] leading-relaxed">
          Lisää tai poista palveluita ja hintoja. Klikkaa palvelua poistaaksesi sen.
        </p>

        {/* Nykyiset palvelut */}
        <div className="w-full flex flex-col gap-2">
          <p className="font-oswaldVariable text-xs text-[#8e8e90] uppercase tracking-widest">
            Aktiiviset palvelut
          </p>
          {services?.length === 0 && (
            <p className="font-oswaldVariable text-sm text-[#8e8e90] italic">
              Ei palveluita
            </p>
          )}
          {services?.map((s) => (
            <div
              key={s.id}
              onClick={() => handleDelete(s.id)}
              title="Klikkaa poistaaksesi"
              className="flex justify-between items-baseline border-l-2 border-[#b9975b]
                         pl-3 py-1 cursor-pointer hover:text-[#b9975b]
                         hover:line-through transition-all duration-200"
            >
              <div className="flex flex-col">
                <span className="font-oswaldVariable text-sm text-[#333f48]">
                  <span className="text-[#8e8e90] text-xs">FI: </span>{s.nameFi}
                </span>
                <span className="font-oswaldVariable text-sm text-[#333f48]">
                  <span className="text-[#8e8e90] text-xs">SV: </span>{s.nameSv}
                </span>
                {s.nameEn && <span className="font-oswaldVariable text-sm text-[#333f48]">
                  <span className="text-[#8e8e90] text-xs">EN: </span>{s.nameEn}
                </span>}
                {s.nameRu && <span className="font-oswaldVariable text-sm text-[#333f48]">
                  <span className="text-[#8e8e90] text-xs">RU: </span>{s.nameRu}
                </span>}
              </div>
              <div className="flex flex-col text-right">
                <span className="font-oswaldVariable text-sm text-[#333f48]">
                  <span className="text-[#8e8e90] text-xs">FI: </span>{s.priceFi}
                </span>
                <span className="font-oswaldVariable text-sm text-[#333f48]">
                  <span className="text-[#8e8e90] text-xs">SV: </span>{s.priceSv}
                </span>
                {s.priceEn && <span className="font-oswaldVariable text-sm text-[#333f48]">
                  <span className="text-[#8e8e90] text-xs">EN: </span>{s.priceEn}
                </span>}
                {s.priceRu && <span className="font-oswaldVariable text-sm text-[#333f48]">
                  <span className="text-[#8e8e90] text-xs">RU: </span>{s.priceRu}
                </span>}
              </div>
            </div>
          ))}
        </div>

        {/* Lisää uusi palvelu */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-2 w-full">
          <p className="font-oswaldVariable text-xs text-[#8e8e90] uppercase tracking-widest">
            Palvelun nimi
          </p>
          {inputField('Suomeksi (FI)', nameFi, setNameFi, 'esim. Sopimusoikeus')}
          {inputField('På svenska (SV)', nameSv, setNameSv, 't.ex. Avtalsrätt')}
          {inputField('In English (EN)', nameEn, setNameEn, 'e.g. Contract Law')}
          {inputField('На русском (RU)', nameRu, setNameRu, 'напр. Договорное право')}

          <div className="border-t border-[#b9975b]/50 pt-3">
            <p className="font-oswaldVariable text-xs text-[#8e8e90] uppercase tracking-widest mb-3">
              Hinta
            </p>
            {inputField('Suomeksi (FI)', priceFi, setPriceFi, 'esim. 290 € / tunti')}
            {inputField('På svenska (SV)', priceSv, setPriceSv, 't.ex. 290 € / timme')}
            {inputField('In English (EN)', priceEn, setPriceEn, 'e.g. 290 € / hour')}
            {inputField('На русском (RU)', priceRu, setPriceRu, 'напр. 290 € / час')}
          </div>

          <button
            type="submit"
            className="w-full h-11 bg-[#333f48] text-[#eceef1] font-racingSansOne
                       text-base font-bold rounded-full shadow-[0_0_10px_#b9975b]
                       hover:bg-[#b9975b] hover:text-white transition-colors duration-300"
          >
            Lisää palvelu
          </button>
        </form>

        <button
          onClick={logout}
          className="w-full h-11 mt-2 bg-[#333f48] text-[#eceef1] font-racingSansOne
                     text-base font-bold rounded-full shadow-[0_0_10px_#b9975b]
                     hover:bg-[#b9975b] hover:text-white transition-colors duration-300"
        >
          Kirjaudu ulos
        </button>

        <Menu />
      </div>
    </div>
  );
}
