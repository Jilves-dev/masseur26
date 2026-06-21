import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaWrench,
  FaBicycle,
  FaTools,
  FaCalendarAlt,
  FaCheckCircle,
  FaPhone,
} from 'react-icons/fa';
import { BiMenu } from 'react-icons/bi';
import { useMobileMenu } from '../context/MobileMenuContext';

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
    icon: <FaTools className="text-3xl" />,
    title: 'Full Service Package',
    desc: 'Complete overhaul: cleaning, lubrication, brake and gear adjustment, full safety check.',
    price: '€79.99',
    highlight: true,
    tag: 'MOST POPULAR',
  },
  {
    icon: <FaWrench className="text-3xl" />,
    title: 'Flat Tire Repair',
    desc: 'Quick professional flat tire repair with tube replacement included. In and out fast.',
    price: '€14.99',
    highlight: false,
  },
  {
    icon: <FaWrench className="text-3xl" />,
    title: 'Brake Adjustment',
    desc: 'Professional brake adjustment and cable replacement for optimal stopping power.',
    price: '€24.99',
    highlight: false,
  },
  {
    icon: <FaTools className="text-3xl" />,
    title: 'Gear Tuning',
    desc: 'Full derailleur and shifter adjustment for smooth, precise gear changes every ride.',
    price: '€29.99',
    highlight: false,
  },
  {
    icon: <FaBicycle className="text-3xl" />,
    title: 'Chain Replacement',
    desc: 'New chain fitted and drivetrain cleaned for a smooth and efficient ride.',
    price: '€34.99',
    highlight: false,
  },
  {
    icon: <FaCheckCircle className="text-3xl" />,
    title: 'Safety Inspection',
    desc: 'Full safety check: brakes, tyres, lights, frame, and all components inspected.',
    price: '€19.99',
    highlight: false,
  },
];

const steps = [
  {
    number: '01',
    title: 'Book Online',
    desc: 'Choose a time that suits you using our online booking calendar or give us a call.',
    icon: <FaCalendarAlt className="text-4xl" />,
  },
  {
    number: '02',
    title: 'Drop Off Your Bike',
    desc: 'Bring your bike to our workshop in Tampere. Walk-ins are also welcome for smaller jobs.',
    icon: <FaBicycle className="text-4xl" />,
  },
  {
    number: '03',
    title: 'Pick Up & Ride',
    desc: 'Most repairs are done the same day. We call you when your bike is ready to collect.',
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
    <div className="bg-[#FFFFFF]">
      {/* Mobile back button */}
      <button
        onClick={handleBackToMenu}
        className={`md:hidden fixed left-4 z-50 w-10 h-10 bg-[#FFFFFF] rounded-full
          shadow-2xl flex items-center justify-center text-black hover:text-[#E73725]
          transition-all duration-300 ease-in-out
          ${isScrolled ? 'top-4' : 'top-22'}`}
        aria-label="Back to menu"
      >
        <BiMenu size={20} />
      </button>

      {/* ====================================
          HERO
          ==================================== */}
      <section className="relative overflow-hidden">
        <div
          className="h-72 md:h-96 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/repair3.jpg')" }}
        >
          <div className="absolute inset-0 bg-[#010000]/60" />
          <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 text-center">
            <motion.h1
              variants={fadeUp(0.1)}
              initial="hidden"
              animate="show"
              className="font-zaslia text-4xl md:text-6xl text-white font-bold mb-4"
            >
              Bike Repairs
            </motion.h1>
            <motion.p
              variants={fadeUp(0.25)}
              initial="hidden"
              animate="show"
              className="font-librecaslon text-white text-lg md:text-xl mb-8 max-w-xl"
            >
              Fast, honest, and expert repairs by certified mechanics in Tampere.
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
                className="flex items-center gap-3 bg-[#E73725] hover:bg-red-700 text-white
                  font-librecaslon font-semibold text-lg md:text-xl
                  px-8 py-4 rounded-lg shadow-2xl
                  transition-all duration-300 hover:scale-105 hover:shadow-red-400/40"
              >
                <FaCalendarAlt className="text-xl" />
                Book an Appointment
              </button>
              <p className="font-librecaslon text-white/70 text-sm mt-3">
                Online booking calendar coming soon — contact us to book now
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ====================================
          HOW IT WORKS
          ==================================== */}
      <section className="py-16 bg-[#010000]">
        <div className="container mx-auto px-4">
          <motion.h2
            variants={fadeUp(0.1)}
            initial="hidden"
            whileInView="show"
            className="font-zaslia text-3xl md:text-4xl text-white text-center mb-12"
          >
            How It Works
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
                <div className="w-20 h-20 rounded-full bg-[#E73725] flex items-center justify-center text-white mb-4 shadow-lg">
                  {step.icon}
                </div>
                <span className="font-librecaslon text-[#E73725] text-sm font-bold tracking-widest mb-1">
                  STEP {step.number}
                </span>
                <h3 className="font-zaslia text-white text-xl mb-2">{step.title}</h3>
                <p className="font-librecaslon text-white/70 text-sm leading-relaxed">
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
      <section className="py-16 bg-[#FFFFFF]">
        <div className="container mx-auto px-4">
          <motion.h2
            variants={fadeUp(0.1)}
            initial="hidden"
            whileInView="show"
            className="font-zaslia text-3xl md:text-4xl text-[#010000] text-center mb-4"
          >
            Services & Pricing
          </motion.h2>
          <motion.p
            variants={fadeUp(0.2)}
            initial="hidden"
            whileInView="show"
            className="font-librecaslon text-gray-500 text-center mb-12 max-w-xl mx-auto"
          >
            Transparent pricing with no hidden costs. Most repairs completed same day.
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
                    ? 'bg-[#E73725] text-white border-[#E73725]'
                    : 'bg-[#FFFFFF] text-[#010000] border-[#E1E1E1]'
                  }`}
              >
                {service.tag && (
                  <span className="absolute -top-3 left-4 bg-[#010000] text-white text-xs font-bold px-3 py-1 rounded-full tracking-wide">
                    {service.tag}
                  </span>
                )}

                <div className={`mb-4 ${service.highlight ? 'text-white' : 'text-[#E73725]'}`}>
                  {service.icon}
                </div>

                <h3 className={`font-zaslia text-xl mb-2 ${service.highlight ? 'text-white' : 'text-[#010000]'}`}>
                  {service.title}
                </h3>

                <p className={`font-librecaslon text-sm leading-relaxed mb-4
                  ${service.highlight ? 'text-white/85' : 'text-gray-500'}`}>
                  {service.desc}
                </p>

                <div className={`font-librecaslon text-2xl font-bold
                  ${service.highlight ? 'text-white' : 'text-[#E73725]'}`}>
                  {service.price}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.p
            variants={fadeUp(0.2)}
            initial="hidden"
            whileInView="show"
            className="font-librecaslon text-gray-400 text-center text-sm mt-8"
          >
            Prices include labour. Parts are charged separately at cost.
            Contact us for a free estimate on larger repairs.
          </motion.p>
        </div>
      </section>

      {/* ====================================
          GALLERY
          ==================================== */}
      <section className="py-16 bg-[#E1E1E1]">
        <div className="container mx-auto px-4">
          <motion.h2
            variants={fadeUp(0.1)}
            initial="hidden"
            whileInView="show"
            className="font-zaslia text-3xl md:text-4xl text-[#010000] text-center mb-12"
          >
            Our Workshop
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
            {['/images/r1.jpg', '/images/r2.jpg', '/images/r3.jpg'].map(
              (src, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp(0.1 + i * 0.1)}
                  initial="hidden"
                  whileInView="show"
                  className="aspect-square overflow-hidden rounded-xl shadow-lg group"
                >
                  <img
                    src={src}
                    alt={`Workshop ${i + 1}`}
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
      <section className="py-16 bg-[#E73725]">
        <div className="container mx-auto px-4">
          <motion.div
            variants={fadeUp(0.1)}
            initial="hidden"
            whileInView="show"
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="font-zaslia text-3xl md:text-4xl text-white mb-4">
              Ready to get your bike fixed?
            </h2>
            <p className="font-librecaslon text-white/85 text-lg mb-8">
              Book an appointment online or drop by our workshop in Tampere.
              Walk-ins welcome for smaller repairs.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/booking')}
                className="flex items-center justify-center gap-2 bg-white text-[#E73725]
                  font-librecaslon font-bold text-lg px-8 py-4 rounded-lg
                  hover:bg-[#010000] hover:text-white transition-all duration-300 shadow-lg"
              >
                <FaCalendarAlt />
                Book an Appointment
              </button>

              <a
                href="tel:+358501234567"
                className="flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white
                  font-librecaslon font-semibold text-lg px-8 py-4 rounded-lg
                  hover:bg-white hover:text-[#E73725] transition-all duration-300"
              >
                <FaPhone />
                +358 50 123 4567
              </a>
            </div>

            <p className="font-librecaslon text-white/70 text-sm mt-6">
              Mon–Fri: 10–19 &nbsp;·&nbsp; Sat: 10–17 &nbsp;·&nbsp; Sun: 12–16
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Repairs;
