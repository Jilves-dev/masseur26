import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ms from '../assets/w.jpg';
import mr from '../assets/m.jpg';
import InfoFooter from '../components/InfoFooter';
import { useTranslation } from '../context/LanguageContext';
import { useMobileMenu } from '../context/MobileMenuContext';
import { BiMenu } from 'react-icons/bi';

export default function About() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { openMobileMenu } = useMobileMenu();
  const [isScrolled, setIsScrolled] = useState(false);
  const ms_lawyer = ms;
  const mr_lawyer = mr;

  const handleBackToMenu = () => {
    navigate('/');
    setTimeout(() => {
      openMobileMenu();
    }, 50);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 58);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Tiimikuvat lisätään käännösten päälle tässä
  const teamWithPhotos = t('team').map((member, i) => ({
    ...member,
    img: i === 0 ? mr_lawyer : ms_lawyer,
  }));

  return (
    <div className="w-full flex flex-col items-center overflow-x-hidden">
      {/* Mobile back button */}
      <button
        onClick={handleBackToMenu}
        className={`md:hidden fixed left-4 z-50 w-10 h-10 bg-[#fcefc8] rounded-full
          shadow-2xl flex items-center justify-center text-[#2e3538] hover:text-[#b07d54]
          transition-all duration-300 ease-in-out
          ${isScrolled ? 'top-4' : 'top-22'}`}
        aria-label="Takaisin valikkoon"
      >
        <BiMenu size={20} />
      </button>

      <main className="relative w-full">
        {/* Hero */}
        <section className="bg-[#e1e3e7] py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <p className="font-oswaldVariable text-sm text-[#b07d54] uppercase tracking-widest mb-3">
              {t('aboutTagline')}
            </p>
            <h2 className="font-racingSansOne text-5xl sm:text-7xl text-[#2e3538] leading-tight">
              {t('aboutHeroTitle')}
            </h2>
            <p className="mt-6 font-oswaldVariable text-gray-500 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              {t('aboutHeroText')}
            </p>
          </div>
        </section>

        {/* Aikajana */}
        <section className="py-16 px-6 bg-[#b7bcc1]">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-racingSansOne text-3xl sm:text-4xl text-[#2e3538] mb-12 text-center">
              {t('historyTitle')}
            </h2>
            <div className="relative border-l-2 border-[#b07d54]/40 pl-8 space-y-10">
              {t('timeline').map(({ year, title, text }) => (
                <div key={year} className="relative">
                  <span className="absolute -left-[41px] top-1 w-4 h-4 rounded-full bg-[#b07d54] border-2 border-[#b7bcc1]" />
                  <p className="font-oswaldVariable text-xs text-[#b07d54] uppercase tracking-widest mb-1">{year}</p>
                  <h3 className="font-racingSansOne text-xl text-[#2e3538] mb-1">{title}</h3>
                  <p className="font-oswaldVariable text-sm sm:text-base text-gray-500 leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tiimi */}
        <section className="py-16 px-6 bg-[#e1e3e7]">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-racingSansOne text-3xl sm:text-4xl text-[#2e3538] mb-12 text-center">
              {t('teamTitle')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {teamWithPhotos.map(({ name, role, text, img }) => (
                <div key={name} className="flex flex-col">
                  <div className="overflow-hidden rounded-md shadow-md shadow-[#b7bcc1] mb-5">
                    <img src={img} alt={name}
                     className="w-full h-96 object-cover object-top hover:scale-105 transition-transform duration-500" />
                  </div>
                  <p className="font-oswaldVariable text-xs text-[#b07d54] uppercase tracking-widest mb-1">{role}</p>
                  <h3 className="font-racingSansOne text-2xl text-[#2e3538] mb-2">{name}</h3>
                  <p className="font-oswaldVariable text-sm sm:text-base text-gray-500 leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Arvot */}
        <section className="py-16 px-6 bg-[#b7bcc1]">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-racingSansOne text-3xl sm:text-4xl text-[#2e3538] mb-10">
              {t('valuesTitle')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {t('values').map(({ otsikko, teksti }) => (
                <div key={otsikko} className="border-t-2 border-[#b07d54]/50 pt-5">
                  <h3 className="font-racingSansOne text-xl text-[#2e3538] mb-2">{otsikko}</h3>
                  <p className="font-oswaldVariable text-sm text-gray-500 leading-relaxed">{teksti}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <InfoFooter />
      </main>
    </div>
  );
}
