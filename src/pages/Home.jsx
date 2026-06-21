import './Home.css';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import heroImage from '../assets/h1.png';
import Contact from './Contact';
{/*import About from './About';*/}
import palvelut2 from '../assets/p2.png';
import palvelut3 from '../assets/p3.png';
import palvelut4 from '../assets/p4.png';
import palvelut1 from '../assets/p1.png';
import ArrowDown from '../assets/arrow-down.svg';
import Maintenance from '../components/Maintenance';
import { useTranslation } from '../context/LanguageContext';
import UnitedKingdom48 from '../assets/United Kingdom48.png';
import finland from '../assets/finland_round_icon_64.png';
import {
  FaWhatsapp,
  FaFacebook,
  FaInstagram
} from 'react-icons/fa';
import { HiOutlineMail } from 'react-icons/hi';
import { BsFillPersonLinesFill } from 'react-icons/bs';
import { HiArrowNarrowRight } from 'react-icons/hi';
//import BackgroundVideo from './components/BackgroundVideo';
import InfoFooter from '../components/InfoFooter';
import { useCollection } from '../hooks/useCollection';

function App() {
  const { documents: items } = useCollection('items');
  const { t, language, setLanguage, toggleLanguage } = useTranslation();
  const navigate = useNavigate();
  const [scrolling, setScrolling] = useState(false);
  const [arrowRotated, setArrowRotated] = useState(false);

  const { documents: services } = useCollection('services');

  const predefinedMessage = 'Hello, how can I help you?';
  const encodedMessage = encodeURIComponent(predefinedMessage);

    useEffect(() => {
    const onPageScroll = () => {
      if (window.pageYOffset > 200) {
        setScrolling(true);
      } else {
        setScrolling(false);
        setArrowRotated(false);
      }
    };
    window.addEventListener('scroll', onPageScroll);
    return () => window.removeEventListener('scroll', onPageScroll);
  }, []);

    const isMaintenanceMode = import.meta.env.VITE_MAINTENANCE_MODE === 'true';
  // Jos maintenance-tila on päällä, näytä vain maintenance-sivu
  if (isMaintenanceMode) {
    return <Maintenance />;
  }

  const handleButtonClick = (e) => {
    setArrowRotated(true);
    setTimeout(() => {
      // Reset arrow after navigation starts
      setArrowRotated(false);
      document
        .getElementById('contact')
        .scrollIntoView({ behavior: 'smooth' });
    }, 300); // 300ms delay for the rotation animation
  };

  return (
    <div className="w-full flex flex-col items-center overflow-x-hidden">
      <header
        className={`${scrolling ? 'border-b border-[#D8C3A5]' : ''} fixed left-0 right-0 top-0 z-40 bg-[#bd8c7d]`}
        id="home"
      >
        <div className="w-full px-6 py-6 bg-[#49494b]">
          <div className="flex flex-col items-center text-center gap-4 px-4 w-full sm:flex-row sm:justify-between relative">
            
              <div>
              <h1 className="font-euphorigenic text-4xl sm:text-4xl text-[#d1bfa7]">
                {t('role')}
              </h1>
              </div>

            <div>
              <ul className="flex flex-row gap-2 font-euphorigenic font-normal text-sm sm:text-xl sm:flex-row sm:gap-10">
                <li className="hidden sm:block">
                  <a
                    href="#palvelut"
                    onClick={() => setArrowRotated(false)}
                    className="text-[#d1bfa7] hover:text-[#FFFFFF]"
                  >
                    {t('palvelut')}
                  </a>
                </li>
                <li>
                   <Link
                    to="/about"
                    className="text-[#d1bfa7] hover:text-[#FFFFFF] font-euphorigenic"
                  >
                    {t('about')}
                  </Link>
                 </li>
                <li>
                <Link to="/booking" className="text-[#d1bfa7] hover:text-[#FFFFFF] font-euphorigenic">
                    {t('booking')}
                  </Link>
                </li>
                {/*<li>
                   <Link
                    to="/gallery"
                    className="text-[#d1bfa7] hover:text-[#FFFFFF] font-euphorigenic"
                  >
                    {t('gallery')}
                  </Link>
                </li>
               
                <li>
                <Link to="/blog" className="text-[#d1bfa7] hover:text-[#FFFFFF] font-euphorigenic">
                  {t('blog')}
                </Link>
              </li>*/}
                <li>
                  <a
                    href="#contact"
                    className="text-[#d1bfa7] hover:text-[#FFFFFF]"
                  >
                    {t('contact')}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <main className={`relative ${language === 'ru' ? 'mt-40 sm:mt-16' : 'mt-28 sm:mt-16'} w-full`}>
     {/*  <main className="relative mt-28 sm:mt-16 w-full">
          <section className="flex flex-col-reverse max-w-4xl m-auto sm:flex-row items-center w-full">*/}
          <section className="flex flex-col-reverse max-w-4xl m-auto sm:flex-row items-center w-full px-4 gap-x-4">
           {/*<div className="container m-auto pt-0 sm:pt-16 px-4 pb-4 sm:pb-4 text-center sm:text-left sm:pt-6">
           <div className="flex-1 min-w-0 pt-0 sm:pt-6 px-4 pb-4 text-center sm:text-left">*/}
            <div className="w-full max-w-2xl sm:max-w-none sm:flex-1 px-4 pt-8 sm:pt-16 text-center sm:text-left">
            <div className="mb-4 sm:mb-0">
              <h2 className="font-wintersolace text-sm sm:text-xl text-[#49494b]">
                {t('hey')}
              </h2>
              <h2 className="font-euphorigenic font-normal text-4xl sm:text-7xl mt-1 text-[#8e8e90]">
                {t('role')}
              </h2>

                {items && items.length > 0 && (
                <div className="mt-4 space-y-2">
                  {items.map((item) => {
                    const S = language.charAt(0).toUpperCase() + language.slice(1);
                    return (
                      <div key={item.id}
                        className="font-wintersolace text-sm sm:text-base text-[#49494b]
                                  border-l-2 border-[#d1bfa7] pl-3 py-1">
                        {item[`title${S}`] || item.titleFi}
                      </div>
                    );
                  })}
                </div>
              )}

              <p className="mt-4 font-wintersolace text-[#49494b] text-sm sm:text-lg leading-relaxed">
                {t('heroDescription')}
              </p>
              {/* Hero 2 section */}
              <div className="hidden md:flex">
                    <a
                    href="/booking"
                    className="inline-block"
                    onClick={(e) => {
                      e.preventDefault();
                      setArrowRotated(true);
                      setTimeout(() => { setArrowRotated(false); navigate('/booking'); }, 300);
                    }}
                  >
                    <button
                      className="px-4 shadow-md shadow-[#8E8D8A] py-3 mt-6 group
                      flex items-center border border-[#d1bfa7] rounded-md font-dmserif
                      text-base text-[#3C403D] hover:bg-[#F0EEE6] hover:border-[#FFFFFF]"
                    >
                      {t('contactMe')}
                      <span
                        className={`inline-block transition-transform duration-300 ${arrowRotated ? 'rotate-90' : ''}`}
                      >
                        <HiArrowNarrowRight className="text-xl ml-2 text-[#bd8c7d]" />
                      </span>
                    </button>
                  </a>
                </div>

              {/* contact linkki mobiiliversioon *
              <div className="text-center mt-8 md:hidden">
                <a
                  href="#contact"
                  className="inline-block"
                  onClick={(e) => {
                    e.preventDefault();
                    handleButtonClick();
                  }}
                >
                  <button className="font-wintersolace text-base text-[#E85A4F] underline hover:text-[#E98074] transition-colors duration-300">
                    {t('contactMe')}
                  </button>
                </a>
              </div>*/}
            </div>
          </div>

          {/* Kuva-div: lisää koristympyrä position:absolute taustalle */}
          <div className="relative shrink-0 w-80 sm:w-80 md:w-[450px] md:-mr-20">
  
              {/* Koristympyrä portfolion tapaan 
              <div className="absolute inset-0 rounded-full bg-[#D8C3A5]/50 
      scale-90 blur-sm pointer-events-none" />*/}
      {/* Koristympyrä portfolion tapaan */}
              <div className="absolute inset-0 rounded-full" />

              <img
                src={heroImage}
                alt="Hero Image"
                className="relative w-full h-auto object-cover"
                loading="eager"
              />
          </div>
        </section>

        {/* Services 1 section */}
        <section
          className="pb-8 sm:pb-14 max-w-4xl mx-auto px-4 text-center sm:text-left"
          id="palvelut"
        >
          <div className="container px-4">
            <div className="mt-2 md:mt-18">
              <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-4 font-euphorigenic text-[#49494b] text-base text-center pt-4 sm:py-8">
                <div className="shadow-md shadow-[#8e8e90] hover:scale-110 duration-500">
                    <img className="w-42 mx-auto" src={palvelut1} alt="Mustat kengät" loading="lazy" />
                  <p className="my-4"> {t('service1')}</p>
                </div>
                <div className="shadow-md shadow-[#8e8e90] hover:scale-110 duration-500">
                  <img className="w-42 mx-auto" src={palvelut2} alt="KIILOITUS" loading="lazy" />
                  <p className="my-4"> {t('service2')}</p>
                </div>
                <div className="shadow-md shadow-[#8e8e90] hover:scale-110 duration-500">
                  <img
                    className="w-41 mx-auto"
                    src={palvelut3}
                    alt="ENTISÖINTI"
                    loading="lazy"
                  />
                  <p className="my-4"> {t('service3')}</p>
                </div>
                <div className="shadow-md shadow-[#8e8e90] hover:scale-110 duration-500">
                  <img className="w-42 mx-auto" src={palvelut4} alt="TUOTTEET" loading="lazy" />
                  <p className="my-4"> {t('service4')}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      
        <section className="sm:mb-14 py-10 max-w-4xl m-auto">
          <div className="container px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

            {/* Vasen: hinnasto */}
            <div>
              <h2 className="font-euphorigenic text-[#49494b] text-3xl sm:text-3xl font-normal mb-8">
                {t('technologiesTitle')}
              </h2>
              <div className="font-wintersolace space-y-3">
                {services?.map((s) => {
                  const S = language.charAt(0).toUpperCase() + language.slice(1);
                  return (
                    <div
                      key={s.id}
                      className="flex justify-between items-baseline pb-2 border-b border-[#d1bfa7]/40"
                    >
                      <h2 className="text-[#49494b] text-sm sm:text-lg">
                        {s[`name${S}`] || s.nameFi}
                      </h2>
                      <p className="text-[#bd8c7d] text-sm sm:text-base ml-4 shrink-0">
                        {s[`price${S}`] || s.priceFi}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

              {/* Oikea: kuva  */}
              <div className="flex justify-center">
                <img
                  src={palvelut3}
                  alt="Suutarin työ"
                  className="w-full max-w-sm h-100 object-cover 
                  rounded-md shadow-md shadow-[#8E8D8A]"
                  loading="lazy"
                />
              </div>

            </div>
          </div>
        </section>

        {/*  <section className="sm:mb-14 py-10 max-w-4xl m-auto">
  <div className="container px-4">
    <div className="grid grid-cols-1 gap-10 items-center">  {/* poistettu md:grid-cols-2 *

      {/* Vasen: hinnasto *
      <div>
        <h2 className="font-euphorigenic text-[#49494b] text-3xl sm:text-3xl font-normal mb-8">
          {t('technologiesTitle')}
        </h2>
        <div className="font-wintersolace space-y-3">
          {services?.map((s) => (
            <div
              key={s.id}
              className="flex justify-between items-baseline pb-2 border-b border-[#d1bfa7]/40"
            >
              <h2 className="text-[#49494b] text-sm sm:text-lg">
                {language === 'sv' ? s.nameSv : s.nameFi}
              </h2>
              <p className="text-[#bd8c7d] text-sm sm:text-base ml-4 shrink-0">
                {language === 'sv' ? s.priceSv : s.priceFi}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Oikea: kuva — piilotetaan md+ näytöillä *
      <div className="flex justify-center md:hidden">
        <img
          src={palvelut3}
          alt="Suutarin työ"
          className="w-full max-w-sm h-100 object-cover 
          rounded-md shadow-md shadow-[#8E8D8A]"
          loading="lazy"
        />
      </div>

    </div>
  </div>
</section>*/}



        <Contact />
        <InfoFooter />
      </main>

      {scrolling && (
        <button
          className="fixed block right-8 bottom-0 w-34"
          onClick={() => {
            window.scrollTo(0, 0);
          }}
        >
          <img src={ArrowDown} />
        </button>
      )}

     {/* Social icons 
      <div className="hidden md:flex fixed flex-col top-[44%] left-0 gap-0 z-50">
        {[
          { icon: <FaWhatsapp size={34} />, label: 'Whatsapp', href: '', color: 'text-[#8e8e90]' },
          { icon: <FaFacebook size={34} />, label: 'Facebook', href: '', color: 'text-[#8e8e90]' },
          { icon: <HiOutlineMail size={34} />, label: 'Email', href: '#contact', color: 'text-[#8e8e90]' },
          { icon: <FaInstagram size={34} />, label: 'Instagram', href: '', color: 'text-[#8e8e90]' },
        ].map(({ icon, label, href, color }) => (
          <a
            key={label}
            href={href}
            className={`group flex flex-row items-center ${color}
        transition-transform duration-300 hover:translate-x-2`}
          >
            
            <span className="font-wintersolace text-sm whitespace-nowrap
          max-w-0 overflow-hidden opacity-0 pl-3
          group-hover:max-w-[120px] group-hover:opacity-100 group-hover:pr-2
          transition-all duration-500 ease-in-out">
              {label}
            </span>

              {/* Ikoni — aina näkyvissä, pieni taustaväri helpottaa klikkaamista *
      <div className="p-1
        transition-colors duration-300">
        {icon}
      </div>
          </a>
        ))}
      </div>*/}

{/* Language flag icons */}
<div className="hidden md:flex fixed flex-col top-[44%] left-0 gap-2 z-50 p-1">
  {[
    { code: 'fi', label: 'Suomi',    lang: 'fi' },
    { code: 'se', label: 'Svenska',  lang: 'sv' },
    { code: 'gb', label: 'English',  lang: 'en' },
    { code: 'ru', label: 'Русский',  lang: 'ru' },
  ].map(({ code, label, lang }) => (
    <div
      key={code}
      onClick={() => setLanguage(lang)}
      className={`group flex flex-row items-center cursor-pointer
      transition-transform duration-300 hover:translate-x-2`}
    >
      <span className="font-wintersolace text-xs whitespace-nowrap
        max-w-0 overflow-hidden opacity-0 pl-2
        group-hover:max-w-[100px] group-hover:opacity-100 group-hover:pr-2
        transition-all duration-500 ease-in-out text-[#49494b]">
        {label}
      </span>
      <div className={`w-9 h-9 rounded-full overflow-hidden shadow-md
        border-2 transition-all duration-300 flex-shrink-0
        ${language === lang ? 'border-[#bd8c7d]' : 'border-[#d1bfa7]/50 hover:border-[#d1bfa7]'}`}>
        <img
          src={`https://flagcdn.com/w40/${code}.png`}
          alt={label}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  ))}
</div>

    </div>
  );
}

export default App;

