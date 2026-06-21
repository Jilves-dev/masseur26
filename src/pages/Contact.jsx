import React, { useState, useRef, useEffect } from 'react';
import './Contact.css';
import whatsappz from '../assets/whatsappz.png';
import paytrailkumppani from '../assets/paytrailkumppani.png';
import { useTranslation } from '../context/LanguageContext';
import { FaWhatsapp, FaFacebook, FaInstagram } from 'react-icons/fa';
import linkedin from '../assets/linkedin-logo-png-2026.png';

const Footer = ({ title }) => {
  const isArray = Array.isArray(title);
  return (
    <div
      className="footer font-librecaslontext italic text-sm font-light text-center text-[#FFFFFF] p-4"
      style={{
        backgroundImage: "url('/subtle-prism.svg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <br></br>
      {isArray ? (
        title.map((line, index) => (
          <p key={`footer-line-${index}`}>
            <em>{line}</em>
          </p>
        ))
      ) : (
        <p>
          <em>
            {title.split(' ').map((word, i) => (
              <React.Fragment key={`word-${i}`}>
                {word}
                {i === Math.floor(title.split(' ').length / 2) && (
                  <br className="block sm:hidden" />
                )}{' '}
              </React.Fragment>
            ))}
          </em>
        </p>
      )}
      <br />
      <br />
      <br />
      <br />
    </div>
  );
};

const PageHeader = ({ title }) => (
  <div className="container mx-auto px-4">
    <div className="text-left pb-2">
      <h2 className="font-euphorigenic text-3xl sm:text-3xl text-[#93a29d5] font-normal">
        {title}
      </h2>
    </div>
  </div>
);

const Contact = () => {
  const formRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const { t, language, toggleLanguage } = useTranslation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const onPageShow = (event) => {
      // event.persisted on tosi, kun sivu ladataan selaimen välimuistista (bfcache)
      if (event.persisted) {
        setFormData({ name: '', email: '', message: '' });
      }
    };

    window.addEventListener('pageshow', onPageShow);
    return () => {
      window.removeEventListener('pageshow', onPageShow);
    };
  }, []); // Tyhjä taulukko varmistaa, että tämä ajetaan vain kerran

  return (
    <>
      <section id="contact" className="max-w-4xl mx-auto">
        <div
          style={{ minHeight: '75vh' }}
          className="bg-[#F5F2EE] flex flex-col justify-between"
        >
          <div
            name="contact"
            className="container pt-4 pb-0 mx-auto max-w-4xl px-4"
          >
            <form
              ref={formRef}
              action="https://formspree.io/f/mreekkeq"
              method="POST"
              className="flex flex-col"
              autoComplete="off"
            >
              <PageHeader title={t('contactMe')} />
              <p className="text-left py-4 pl-2 font-wintersolace text-sm sm:text-lg text-[#49494b]">
                {t('contactText')}{' '}
                <a
                  className="wa inline border-b-2 border-[#bd8c7d] font-wintersolace text-sm sm:text-lg"
                  href="https://wa.me/358405142954?text=How%20can%20I%20help%20you%3F"
                >
                  {t('whatsapp')}
                </a>
              </p>
              <input
                className="bg-[#FFFFFF] p-2 border border-[#d1bfa7] rounded-md text-[#49494b] font-wintersolace text-sm sm:text-base"
                type="text"
                placeholder={t('namePlaceholder')}
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              <input
                className="my-4 p-2 bg-[#FFFFFF] border border-[#d1bfa7] rounded-md text-[#49494b] font-wintersolace text-sm sm:text-base"
                type="email"
                placeholder={t('emailPlaceholder')}
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              <textarea
                className="bg-[#FFFFFF] p-2 border border-[#d1bfa7] rounded-md text-[#49494b] font-wintersolace text-sm sm:text-base"
                name="message"
                rows="10"
                placeholder={t('messagePlaceholder')}
                value={formData.message}
                onChange={handleChange}
              ></textarea>
              <button
                className="group border-[#d1bfa7] border-1 shadow-[#8E8D8A] shadow px-6 py-3 my-8 rounded-md text-[#504930] 
                           hover:bg-[#F0EEE6] !hover:border-[#E85A4F] mx-auto flex items-center font-dmserif text-base sm:text-lg"
              >
                {t('collaborate')}
              </button>
            </form>
          </div>
        </div>
      </section>

      <div className="flex justify-center md:hidden w-full">
              <div className="grid grid-cols-3 gap-6 w-fit mx-auto">
                <div className="flex items-center justify-center text-[#bd8c7d]">
                  <a href="https://wa.me/358405142954?text=How%20can%20I%20help%20you%3F">
                    <FaWhatsapp size={38} />
                  </a>
                </div>
                    <div className="flex items-center justify-center text-[#bd8c7d]">
                  <a href="https://www.paytrail.com/">
                    <FaFacebook size={38} />
                  </a>
                </div>
                <div className="flex items-center justify-center text-[#bd8c7d]">
                  <a href="www.linkedin.com/in/jukka-i-6204533b0">
                    <FaInstagram size={38} />
                  </a>
                </div>
              </div>
            </div>


      <br></br>
    </>
  );
};

export default Contact;
