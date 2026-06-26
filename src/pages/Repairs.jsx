import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaHandHoldingHeart,
  FaSpa,
  FaRunning,
  FaDumbbell,
  FaCalendarAlt,
  FaCheckCircle,
  FaPhone,
} from 'react-icons/fa';
import { BiMenu } from 'react-icons/bi';
import { useMobileMenu } from '../context/MobileMenuContext';
import heroImage from '../assets/p6.png';
import place1 from '../assets/place4.jpg';
import place2 from '../assets/place2.jpg';
import place3 from '../assets/place3.jpg';

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 60 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay },
  },
});

const services = [
  {
    icon: <FaHandHoldingHeart className="text-3xl" />,
    title: 'Urheiluhieronta 60 min',
    desc: 'Tehokas koko kehon urheiluhieronta, joka parantaa verenkiertoa, vähentää lihasjäykkyyttä ja nopeuttaa palautumista.',
    price: '€65',
    highlight: true,
    tag: 'SUOSITUIN',
  },
  {
    icon: <FaSpa className="text-3xl" />,
    title: 'Urheiluhieronta 30 min',
    desc: 'Nopea ja kohdennettu hieronta esimerkiksi jalkoihin, niska-hartiaseutuun tai selkään.',
    price: '€39',
    highlight: false,
  },
  {
    icon: <FaDumbbell className="text-3xl" />,
    title: 'Syvähieronta 60 min',
    desc: 'Voimakas, syvältä lihaksistosta vapauttava hieronta krooniseen jännitykseen ja kipupisteisiin.',
    price: '€70',
    highlight: false,
  },
  {
    icon: <FaHandHoldingHeart className="text-3xl" />,
    title: 'Urheiluhieronta 90 min',
    desc: 'Pitkäkestoinen hoito koko kehon huoltoon ennen kilpailukautta tai sen jälkeen.',
    price: '€89',
    highlight: false,
  },
  {
    icon: <FaSpa className="text-3xl" />,
    title: 'Kuppaushoito',
    desc: 'Perinteinen kuppaushoito edistää verenkiertoa ja vapauttaa pinttyneitä lihasjännityksiä.',
    price: '€45',
    highlight: false,
  },
  {
    icon: <FaRunning className="text-3xl" />,
    title: 'Liikkuvuus- ja venyttelyhoito',
    desc: 'Ohjattu venyttely ja liikkuvuusharjoittelu parantaa nivelten liikelaajuutta ja ehkäisee vammoja.',
    price: '€49',
    highlight: false,
  },
];

const steps = [
  {
    number: '01',
    title: 'Varaa aika',
    desc: 'Valitse sinulle sopiva aika online-ajanvarauskalenterista tai soita meille.',
    icon: <FaCalendarAlt className="text-4xl" />,
  },
  {
    number: '02',
    title: 'Saavu hierontaan',
    desc: 'Tule hierontatilaamme Tampereella. Otamme vastaan myös kävijöitä pienempiin hoitoihin.',
    icon: <FaRunning className="text-4xl" />,
  },
  {
    number: '03',
    title: 'Rentoudu ja palaudu',
    desc: 'Lähdet hieronnasta rentoutuneena ja palautuneena, valmiina seuraavaan suoritukseen.',
    icon: <FaCheckCircle className="text-4xl" />,
  },
];

const Repairs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const { openMobileMenu } = useMobileMenu();

  const handleBackToMenu = () => {
    navigate('/');
    setTimeout(() => {
      openMobileMenu();
    }, 50);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 58);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-[#e1e3e7]">
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

      {/* ====================================
          HERO
          ==================================== */}
      <section className="relative overflow-hidden">
        <div
          className="h-72 md:h-100 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-[#2e3538]/35" />
          <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 text-center">
            <motion.h1
              variants={fadeUp(0.1)}
              initial="hidden"
              animate="show"
              className="font-racingSansOne text-4xl md:text-6xl text-[#e1e3e7] font-medium mb-4"
            >
              Urheiluhieroja
            </motion.h1>
            <motion.p
              variants={fadeUp(0.25)}
              initial="hidden"
              animate="show"
              className="font-oswaldVariable text-[#e1e3e7] text-lg md:text-xl mb-8 max-w-xl"
            >
              Kahden ammattilaisen urheiluhierontaa Tampereella — palautumiseen, vammojen ehkäisyyn ja suorituskyvyn tukemiseen.
            </motion.p>

            {/* ==============================
                VARAA AIKA — PÄÄNAPPI
                ============================== */}
            <motion.div
              variants={fadeUp(0.4)}
              initial="hidden"
              animate="show"
              className="flex flex-col items-center"
            >
              <button
                onClick={() => navigate('/booking')}
                className="flex items-center gap-3 bg-[#b07d54] hover:bg-[#2e3538] text-[#e1e3e7]
                  font-oswaldVariable font-medium text-lg md:text-xl
                  px-8 py-4 rounded-lg shadow-2xl
                  transition-all duration-300 hover:scale-105 hover:shadow-[#b07d54]/40"
              >
                <FaCalendarAlt className="text-xl" />
                Varaa hierontaaika
              </button>
              <p className="font-oswaldVariable text-[#e1e3e7]/70 text-sm mt-3">
                Online-ajanvarauskalenteri tulossa pian — ota yhteyttä ja varaa aika nyt
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ====================================
          HOW IT WORKS
          ==================================== */}
      <section className="py-16 bg-[#2e3538]">
        <div className="container mx-auto px-4">
          <motion.h2
            variants={fadeUp(0.1)}
            initial="hidden"
            whileInView="show"
            className="font-racingSansOne text-3xl md:text-4xl text-[#e1e3e7] text-center mb-12"
          >
            Näin se toimii
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                variants={fadeUp(0.1 + i * 0.15)}
                initial="hidden"
                whileInView="show"
                className="flex flex-col items-center text-center"
              >
                <div className="w-20 h-20 rounded-full bg-[#e1e3e7] flex items-center justify-center text-[#b07d54] mb-4 shadow-lg">
                  {step.icon}
                </div>
                <span className="font-oswaldVariable text-[#e1e3e7] text-sm font-bold tracking-widest mb-1">
                  VAIHE {step.number}
                </span>
                <h3 className="font-racingSansOne text-[#e1e3e7] text-xl mb-2">{step.title}</h3>
                <p className="font-oswaldVariable text-[#e1e3e7]/70 text-sm leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================
          SERVICES & PRICES
          ==================================== */}
      <section className="py-16 bg-[#e1e3e7]">
        <div className="container mx-auto px-4">
          <motion.h2
            variants={fadeUp(0.1)}
            initial="hidden"
            whileInView="show"
            className="font-racingSansOne text-3xl md:text-4xl text-[#2e3538] text-center mb-4"
          >
            Palvelut ja hinnat
          </motion.h2>
          <motion.p
            variants={fadeUp(0.2)}
            initial="hidden"
            whileInView="show"
            className="font-oswaldVariable text-gray-500 text-center mb-12 max-w-xl mx-auto"
          >
            Avoimet hinnat ilman piilokuluja. Useimmiten aikoja vapaana samalla viikolla.
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {services.map((service, i) => (
              <motion.div
                key={i}
                variants={fadeUp(0.1 + (i % 3) * 0.1)}
                initial="hidden"
                whileInView="show"
                className={`relative p-6 rounded-xl border shadow-lg transition-shadow hover:shadow-xl
                  ${service.highlight
                    ? 'bg-[#b07d54] text-[#e1e3e7] border-[#b07d54]'
                    : 'bg-[#fcefc8] text-[#2e3538] border-[#b7bcc1]'
                  }`}
              >
                {service.tag && (
                  <span className="absolute -top-3 left-4 bg-[#e1e3e7] text-[#fcefc8] text-xs font-bold px-3 py-1 rounded-full tracking-wide">
                    {service.tag}
                  </span>
                )}

                <div className={`mb-4 ${service.highlight ? 'text-[#fcefc8]' : 'text-[#b07d54]'}`}>
                  {service.icon}
                </div>

                <h3 className={`font-racingSansOne text-xl mb-2 ${service.highlight ? 'text-[#fcefc8]' : 'text-[#2e3538]'}`}>
                  {service.title}
                </h3>

                <p className={`font-oswaldVariable text-sm leading-relaxed mb-4
                  ${service.highlight ? 'text-[#fcefc8]/85' : 'text-gray-500'}`}>
                  {service.desc}
                </p>

                <div className={`font-oswaldVariable text-2xl font-bold
                  ${service.highlight ? 'text-[#fcefc8]' : 'text-[#b07d54]'}`}>
                  {service.price}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.p
            variants={fadeUp(0.2)}
            initial="hidden"
            whileInView="show"
            className="font-oswaldVariable text-gray-400 text-center text-sm mt-8"
          >
            Hinnat sisältävät hieronnan ja tilan käytön.
            Kysy tarjous ryhmä- tai yrityshieronnoista.
          </motion.p>
        </div>
      </section>

      {/* ====================================
          GALLERY
          ==================================== */}
      <section className="py-16 bg-[#b7bcc1]">
        <div className="container mx-auto px-4">
          <motion.h2
            variants={fadeUp(0.1)}
            initial="hidden"
            whileInView="show"
            className="font-racingSansOne text-3xl md:text-4xl text-[#2e3538] text-center mb-12"
          >
            Hierontatilamme
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
            {[place1, place2, place3].map(
              (src, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp(0.1 + i * 0.1)}
                  initial="hidden"
                  whileInView="show"
                  className="aspect-[3/2] overflow-hidden rounded-xl shadow-lg group"
                >
                  <img
                    src={src}
                    alt={`Hierontatila ${i + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </motion.div>
              )
            )}
          </div>
        </div>
      </section>

      {/* ====================================
          BOTTOM CTA
          ==================================== */}
      <section className="py-16 bg-[#b07d54]">
        <div className="container mx-auto px-4">
          <motion.div
            variants={fadeUp(0.1)}
            initial="hidden"
            whileInView="show"
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="font-racingSansOne text-3xl md:text-4xl text-[#fcefc8] mb-4">
              Valmis rentoutumaan ja palautumaan?
            </h2>
            <p className="font-oswaldVariable text-[#fcefc8]/85 text-lg mb-8">
              Varaa aika verkossa tai tule käymään hierontatilassamme Tampereella.
              Otamme vastaan myös kävijöitä pienempiin hoitoihin.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/booking')}
                className="flex items-center justify-center gap-2 bg-[#fcefc8] text-[#b07d54]
                  font-oswaldVariable font-bold text-lg px-8 py-4 rounded-lg
                  hover:bg-[#2e3538] hover:text-[#fcefc8] transition-all duration-300 shadow-lg"
              >
                <FaCalendarAlt />
                Varaa hierontaaika
              </button>

              <a
                href="tel:+358501234567"
                className="flex items-center justify-center gap-2 bg-transparent border-2 border-[#fcefc8] text-[#fcefc8]
                  font-oswaldVariable font-semibold text-lg px-8 py-4 rounded-lg
                  hover:bg-[#fcefc8] hover:text-[#b07d54] transition-all duration-300"
              >
                <FaPhone />
                +358 50 123 4567
              </a>
            </div>

            <p className="font-oswaldVariable text-[#fcefc8]/70 text-sm mt-6">
              Ma–Pe: 10–19 &nbsp;·&nbsp; La: 10–17 &nbsp;·&nbsp; Su: 12–16
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Repairs;
