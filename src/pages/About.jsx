import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ms from '../assets/w.jpg';
import mr from '../assets/m.jpg';
import InfoFooter from '../components/InfoFooter';
import { useTranslation } from '../context/LanguageContext';

export default function About() {
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const [scrolling, setScrolling] = useState(false);
  const ms_lawyer = ms;
  const mr_lawyer = mr;


  useEffect(() => {
  window.scrollTo(0, 0);
}, []);

  useEffect(() => {
    const onScroll = () => setScrolling(window.pageYOffset > 100);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handlePalvelutClick = () => {
    navigate('/');
    setTimeout(() => {
      document.getElementById('palvelut')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleContactClick = () => {
    navigate('/');
    setTimeout(() => {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Tiimikuvat lisätään käännösten päälle tässä
  const teamWithPhotos = t('team').map((member, i) => ({
    ...member,
    img: i === 0 ? mr_lawyer : ms_lawyer,
  }));

  return (
    <div className="w-full flex flex-col items-center overflow-x-hidden">

      {/* Navbar */}
      <header className={`${scrolling ? 'border-b border-[#D8C3A5]' : ''} fixed left-0 right-0 top-0 z-40 bg-[#bd8c7d]`}>
        <div className="w-full px-6 py-6 bg-[#49494b]">
          <div className="flex flex-col items-center text-center gap-4 px-4 w-full sm:flex-row sm:justify-between">
            <Link to="/">
              <h1 className="font-euphorigenic text-4xl text-[#d1bfa7] hover:opacity-80 transition-opacity">
                {t('role')}
              </h1>
            </Link>
            <ul className="flex flex-row gap-2 font-euphorigenic text-sm sm:text-xl sm:gap-10">
              <li><Link to="/" className="text-[#d1bfa7] hover:text-white">{t('frontPage')}</Link></li>
              {/*<li className="hidden sm:block"><a href="/#palvelut" onClick={(e) => { e.preventDefault(); handlePalvelutClick(); }} className="text-[#d1bfa7] hover:text-[#FFFFFF]">{t('palvelut')}</a></li>*/}
              <li><span className="text-[#d1bfa7] border-b border-[#d1bfa7]">{t('aboutPage')}</span></li>
              <li><Link to="/booking" className="text-[#d1bfa7] hover:text-[#FFFFFF] font-euphorigenic">{t('booking')}</Link></li>
              <li><Link to="/gallery" className="text-[#d1bfa7] hover:text-white">{t('gallery')}</Link></li>
              <li><Link to="/blog" className="text-[#d1bfa7] hover:text-[#FFFFFF] font-euphorigenic">{t('blog')}</Link></li>
              {/*<li>
                <a href="/#contact" onClick={(e) => { e.preventDefault(); handleContactClick(); }}
                  className="text-[#d1bfa7] hover:text-white">{t('contact')}
                </a>
              </li>*/}
            </ul>
          </div>
        </div>
      </header>

      <main className={`relative ${language === 'ru' ? 'mt-40 sm:mt-16' : 'mt-28 sm:mt-16'} w-full`}>
        {/* Hero */}
        <section className="bg-[#F5F2EE] py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <p className="font-wintersolace text-sm text-[#bd8c7d] uppercase tracking-widest mb-3">
              {t('aboutTagline')}
            </p>
            <h2 className="font-euphorigenic text-5xl sm:text-7xl text-[#49494b] leading-tight">
              {t('aboutHeroTitle')}
            </h2>
            <p className="mt-6 font-wintersolace text-[#49494b] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              {t('aboutHeroText')}
            </p>
          </div>
        </section>

        {/* Aikajana */}
        <section className="py-16 px-6 bg-[#EDEAE6]">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-euphorigenic text-3xl sm:text-4xl text-[#49494b] mb-12 text-center">
              {t('historyTitle')}
            </h2>
            <div className="relative border-l-2 border-[#bd8c7d]/40 pl-8 space-y-10">
              {t('timeline').map(({ year, title, text }) => (
                <div key={year} className="relative">
                  <span className="absolute -left-[41px] top-1 w-4 h-4 rounded-full bg-[#bd8c7d] border-2 border-[#EDEAE6]" />
                  <p className="font-wintersolace text-xs text-[#bd8c7d] uppercase tracking-widest mb-1">{year}</p>
                  <h3 className="font-euphorigenic text-xl text-[#49494b] mb-1">{title}</h3>
                  <p className="font-wintersolace text-sm sm:text-base text-[#49494b] leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tiimi */}
        <section className="py-16 px-6 bg-[#F5F2EE]">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-euphorigenic text-3xl sm:text-4xl text-[#49494b] mb-12 text-center">
              {t('teamTitle')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {teamWithPhotos.map(({ name, role, text, img }) => (
                <div key={name} className="flex flex-col">
                  <div className="overflow-hidden rounded-md shadow-md shadow-[#8E8D8A] mb-5">
                    <img src={img} alt={name}
                     className="w-full h-96 object-cover object-top hover:scale-105 transition-transform duration-500" />
                  </div>
                  <p className="font-wintersolace text-xs text-[#bd8c7d] uppercase tracking-widest mb-1">{role}</p>
                  <h3 className="font-euphorigenic text-2xl text-[#49494b] mb-2">{name}</h3>
                  <p className="font-wintersolace text-sm sm:text-base text-[#49494b] leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Arvot */}
        <section className="py-16 px-6 bg-[#EDEAE6]">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-euphorigenic text-3xl sm:text-4xl text-[#49494b] mb-10">
              {t('valuesTitle')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {t('values').map(({ otsikko, teksti }) => (
                <div key={otsikko} className="border-t-2 border-[#bd8c7d]/50 pt-5">
                  <h3 className="font-euphorigenic text-xl text-[#49494b] mb-2">{otsikko}</h3>
                  <p className="font-wintersolace text-sm text-[#49494b] leading-relaxed">{teksti}</p>
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
