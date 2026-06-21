import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useMotionValue,
  useSpring,
} from 'framer-motion';
import { FaWrench, FaBicycle, FaTools, FaAward } from 'react-icons/fa';
import { BiMenu } from 'react-icons/bi';
import { useMobileMenu } from '../context/MobileMenuContext';

export const fadeUp = (delay) => {
  return {
    hidden: {
      opacity: 0,
      y: 100,
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: delay,
      },
    },
  };
};

const ServicesData = [
  {
    id: 1,
    title: 'Expert Mechanics',
    icon: <FaWrench className="text-5xl" />,
    desc: 'Our certified mechanics have years of experience with all types of bicycles, from city bikes to high-end road and mountain bikes.',
    delay: 0.3,
    color: '#E73725',
  },
  {
    id: 2,
    title: 'Fast Turnaround',
    icon: <FaBicycle className="text-5xl" />,
    desc: 'Most repairs completed same day or within 24 hours. We understand you need your bike back on the road as quickly as possible.',
    delay: 0.5,
    color: '#010000',
  },
  {
    id: 3,
    title: 'Quality Parts',
    icon: <FaTools className="text-5xl" />,
    desc: 'We use only premium components from trusted brands like Shimano, SRAM, and Continental. Quality you can rely on, every ride.',
    delay: 0.7,
    color: '#E73725',
  },
  {
    id: 4,
    title: 'Satisfaction Guaranteed',
    icon: <FaAward className="text-5xl" />,
    desc: "30-day guarantee on all repairs and parts. If you're not completely satisfied with our work, we'll make it right.",
    delay: 0.9,
    color: '#010000',
  },
];

const MilestonesData = [
  {
    year: '2018',
    title: 'The Beginning',
    description:
      'Freewheel Bikes was founded by cycling enthusiasts with a mission to provide honest, expert bicycle repair and quality bikes to the Tampere region.',
    color: '#E73725',
  },
  {
    year: '2019',
    title: 'First Workshop',
    description:
      "Opened our flagship workshop in Tampere's Finlayson district, equipped with professional tools and staffed by certified mechanics.",
    color: '#010000',
  },
  {
    year: '2020',
    title: 'Online Store',
    description:
      'Launched our online store, making quality bike parts, accessories, and service bookings accessible to cyclists across Finland.',
    color: '#E73725',
  },
  {
    year: '2021',
    title: 'Growing Team',
    description:
      'Expanded our team with certified mechanics and specialists, enabling us to handle everything from flat tires to full custom builds.',
    color: '#010000',
  },
  {
    year: '2023',
    title: 'Community Hub',
    description:
      'Became a cycling community hub, hosting group rides, maintenance workshops, and partnering with local cycling clubs.',
    color: '#E73725',
  },
  {
    year: '2025',
    title: 'Today',
    description:
      'Serving thousands of cyclists while staying true to our commitment to quality repairs, fair pricing, and a genuine love for cycling.',
    color: '#010000',
  },
];

// Animoitu laskuri-komponentti
const Counter = ({ value, suffix = '' }) => {
  const ref = React.useRef(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 80,
    stiffness: 150,
  });
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, motionValue, value]);

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      if (ref.current) {
        ref.current.textContent = Math.floor(latest) + suffix;
      }
    });
    return unsubscribe;
  }, [springValue, suffix]);

  return <span ref={ref}>0{suffix}</span>;
};

const About = () => {
  const timelineRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start start', 'end end'],
  });
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  const fromMobileMenu = location.state?.fromMobileMenu || false;
  const { openMobileMenu } = useMobileMenu();

  const handleBackToMenu = () => {
    navigate('/');
    setTimeout(() => {
      openMobileMenu();
    }, 50);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 58) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-[#FFFFFF]">
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

      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <motion.h1
            variants={fadeUp(0.2)}
            initial="hidden"
            whileInView="show"
            className="font-zaslia text-3xl font-semibold text-center mb-12"
          >
            About Us
          </motion.h1>
        </div>

        <div className="container mx-auto px-4">
          <motion.div
            variants={fadeUp(0.2)}
            initial="hidden"
            whileInView="show"
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="font-librecaslon text-3xl font-medium md:text-5xl font-bold mb-6 text-[#E73725]">
              Welcome to Freewheel Bikes
            </h1>
            <p className="font-librecaslon text-lg md:text-xl text-gray-700 leading-relaxed mb-8">
              We are passionate cycling specialists dedicated to expert bicycle
              repairs, premium bikes, and quality components. Our certified
              mechanics are here to keep you riding safely and comfortably,
              no matter what the road throws at you.
            </p>
            <div className="flex justify-center gap-4 flex-wrap font-librecaslon">
              <div className="bg-[#E73725] text-white px-6 py-3 rounded-lg">
                <span className="font-bold text-2xl">
                  <Counter value={7} suffix="+" />
                </span>
                <p className="text-sm">Years Experience</p>
              </div>
              <div className="bg-[#010000] text-white px-6 py-3 rounded-lg">
                <span className="font-bold text-2xl">
                  <Counter value={5000} suffix="+" />
                </span>
                <p className="text-sm">Bikes Repaired</p>
              </div>
              <div className="bg-[#E1E1E1] text-[#010000] px-6 py-3 rounded-lg">
                <span className="font-bold text-2xl">
                  <Counter value={3000} suffix="+" />
                </span>
                <p className="text-sm">Happy Cyclists</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              variants={fadeUp(0.3)}
              initial="hidden"
              whileInView="show"
              className="text-center mb-12"
            >
              <h2 className="font-librecaslon text-3xl md:text-4xl font-medium mb-6 text-[#010000]">
                Our Story
              </h2>
              <p className="font-librecaslon text-gray-700 leading-relaxed text-lg mb-6">
                Freewheel Bikes began with a simple mission: to offer reliable,
                honest bicycle repairs and quality bikes to the people of
                Tampere. What started as a small workshop has grown into a
                full-service bike shop loved by commuters, mountain bikers,
                and road cyclists alike.
              </p>
              <p className="font-librecaslon text-gray-700 leading-relaxed text-lg">
                We work with leading bicycle brands and source only genuine,
                high-quality components. Our commitment goes beyond repairs —
                we're dedicated to building a cycling community, promoting
                sustainable transport, and helping every rider find their
                perfect bike.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <motion.h2
            variants={fadeUp(0.2)}
            initial="hidden"
            whileInView="show"
            className="font-librecaslon text-3xl md:text-4xl font-medium text-center mb-12 text-[#E73725]"
          >
            Why Choose Us
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {ServicesData.map((data) => (
              <motion.div
                key={data.id}
                variants={fadeUp(data.delay)}
                initial="hidden"
                whileInView="show"
                className="flex flex-col items-center justify-start p-6 bg-[#FFFFFF] rounded-xl border border-gray-300 shadow-xl hover:shadow-xl transition-shadow duration-300"
              >
                <div
                  className="mb-4 flex items-center justify-center w-20 h-20 rounded-full"
                  style={{ color: data.color }}
                >
                  {data.icon}
                </div>
                <div className="text-center space-y-3">
                  <h3 className="font-librecaslon text-xl font-bold text-gray-800">
                    {data.title}
                  </h3>
                  <p className="font-librecaslon text-sm text-gray-600 leading-relaxed">
                    {data.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones Timeline Section - Scroll-based Animation */}
      <section ref={timelineRef} className="relative py-12 md:py-20">
        <div className="container mx-auto px-4">
          <motion.h2
            variants={fadeUp(0.2)}
            initial="hidden"
            whileInView="show"
            className="font-librecaslon text-3xl md:text-4xl font-medium text-center mb-16 text-[#010000]"
          >
            Our Journey
          </motion.h2>

          {/* Fixed Animated Ball - Desktop */}
          <div className="hidden md:block fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
            <motion.div
              className="w-24 h-24 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-2xl border-4 border-white pointer-events-auto"
              style={{
                backgroundColor: useTransform(
                  scrollYProgress,
                  MilestonesData.map((_, i) => i / (MilestonesData.length - 1)),
                  MilestonesData.map((m) => m.color)
                ),
                opacity: useTransform(
                  scrollYProgress,
                  [0, 0.05, 0.95, 1],
                  [0, 1, 1, 0]
                ),
              }}
            >
              <motion.div className="font-librecaslon relative w-full h-full flex items-center justify-center">
                {MilestonesData.map((milestone, index) => {
                  const isVisible = useTransform(
                    scrollYProgress,
                    (progress) => {
                      const currentPosition =
                        progress * (MilestonesData.length - 1);
                      const closest = Math.round(currentPosition);
                      return closest === index ? 1 : 0;
                    }
                  );

                  return (
                    <motion.span
                      key={milestone.year}
                      className="absolute font-librecaslon"
                      style={{
                        opacity: isVisible,
                        transition: 'opacity 0.1s ease',
                      }}
                    >
                      {milestone.year}
                    </motion.span>
                  );
                })}
              </motion.div>
            </motion.div>
          </div>

          {/* Fixed Animated Ball - Mobile */}
          <div className="md:hidden fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
            <motion.div
              className="w-16 h-16 rounded-full flex items-center justify-center font-librecaslon text-white font-bold text-sm shadow-2xl border-4 border-white pointer-events-auto"
              style={{
                backgroundColor: useTransform(
                  scrollYProgress,
                  MilestonesData.map((_, i) => i / (MilestonesData.length - 1)),
                  MilestonesData.map((m) => m.color)
                ),
                opacity: useTransform(
                  scrollYProgress,
                  [0, 0.1, 0.9, 1],
                  [0, 1, 1, 0]
                ),
              }}
            >
              <motion.div className="relative w-full h-full flex items-center justify-center font-librecaslon">
                {MilestonesData.map((milestone, index) => {
                  const isVisible = useTransform(
                    scrollYProgress,
                    (progress) => {
                      const currentPosition =
                        progress * (MilestonesData.length - 1);
                      const closest = Math.round(currentPosition);
                      return closest === index ? 1 : 0;
                    }
                  );

                  return (
                    <motion.span
                      key={milestone.year}
                      className="absolute font-librecaslon text-xs"
                      style={{
                        opacity: isVisible,
                        transition: 'opacity 0.1s ease',
                      }}
                    >
                      {milestone.year}
                    </motion.span>
                  );
                })}
              </motion.div>
            </motion.div>
          </div>

          {/* Desktop Timeline */}
          <div className="hidden md:block relative">
            <div
              className="relative font-librecaslon"
              style={{ height: `${MilestonesData.length * 500}px` }}
            >
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-gray-200 via-gray-300 to-gray-200"></div>

              {MilestonesData.map((milestone, index) => (
                <div
                  key={index}
                  className="absolute w-full flex items-center justify-center"
                  style={{
                    top: `${index * 500 + 250}px`,
                  }}
                >
                  <div className="w-full max-w-5xl flex items-center">
                    <motion.div
                      className="w-5/12 pr-8 text-right"
                      initial={{ opacity: 0, x: -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                      viewport={{ once: false, margin: '-200px' }}
                    >
                      {index % 2 === 0 && (
                        <div
                          className="bg-white p-6 rounded-lg shadow-lg border-l-4"
                          style={{ borderColor: milestone.color }}
                        >
                          <h3
                            className="text-2xl font-bold mb-3"
                            style={{ color: milestone.color }}
                          >
                            {milestone.title}
                          </h3>
                          <p className="font-librecaslon text-gray-700 leading-relaxed">
                            {milestone.description}
                          </p>
                        </div>
                      )}
                    </motion.div>

                    <div className="w-2/12 flex justify-center relative">
                      <div
                        className="w-6 h-6 rounded-full border-4 border-white z-10"
                        style={{ backgroundColor: milestone.color }}
                      ></div>
                    </div>

                    <motion.div
                      className="w-5/12 pl-8 text-left"
                      initial={{ opacity: 0, x: 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                      viewport={{ once: false, margin: '-200px' }}
                    >
                      {index % 2 !== 0 && (
                        <div
                          className="bg-white p-6 rounded-lg shadow-lg border-r-4"
                          style={{ borderColor: milestone.color }}
                        >
                          <h3
                            className="text-2xl font-bold mb-3"
                            style={{ color: milestone.color }}
                          >
                            {milestone.title}
                          </h3>
                          <p className="font-librecaslon text-gray-700 leading-relaxed">
                            {milestone.description}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Timeline - Zigzag */}
          <div className="md:hidden relative">
            <div
              className="relative"
              style={{ minHeight: `${MilestonesData.length * 400}px` }}
            >
              <div className="absolute left-1/2 -translate-x-1/2 top-0 w-1 h-full bg-gradient-to-b from-[#E73725] via-[#010000] to-[#E73725] opacity-30"></div>

              {MilestonesData.map((milestone, index) => {
                const isLeft = index % 2 !== 0;

                return (
                  <div
                    key={index}
                    className="absolute w-full"
                    style={{ top: `${index * 400 + 200}px` }}
                  >
                    <div
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white z-10"
                      style={{ backgroundColor: milestone.color }}
                    ></div>

                    <motion.div
                      initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                      viewport={{ once: false, amount: 0.3 }}
                      className={`w-[46%] bg-white p-4 rounded-lg shadow-lg ${
                        isLeft ? 'mr-auto pr-2 border-r-4 text-right' : 'ml-auto pl-2 border-l-4 text-left'
                      }`}
                      style={{ borderColor: milestone.color }}
                    >
                      <h3 className="text-lg font-bold mb-2" style={{ color: milestone.color }}>
                        {milestone.title}
                      </h3>
                      <p className="font-librecaslon text-gray-700 text-sm leading-relaxed">
                        {milestone.description}
                      </p>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* Mission Section */}
      <section className="py-12 md:py-20 bg-[#E73725] text-white">
        <div className="container mx-auto px-4">
          <motion.div
            variants={fadeUp(0.3)}
            initial="hidden"
            whileInView="show"
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="font-librecaslon text-3xl md:text-4xl font-medium mb-6">
              Our Mission
            </h2>
            <p className="font-librecaslon text-lg md:text-xl leading-relaxed">
              To keep cyclists rolling with expert repairs, quality bikes, and
              honest service. We believe cycling is for everyone — whether
              you're commuting to work, hitting the trails, or racing on the
              road. We're committed to sustainable transport, community
              building, and making cycling accessible and enjoyable for all.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            variants={fadeUp(0.3)}
            initial="hidden"
            whileInView="show"
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="font-librecaslon text-3xl md:text-4xl font-medium mb-6 text-[#010000]">
              Visit Our Workshop
            </h2>
            <p className="font-librecaslon text-lg text-gray-700 mb-8">
              Come and visit our workshop in Tampere's Finlayson district.
              Our expert mechanics are ready to help with any repair or to
              help you find your perfect bike.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/shop"
                className="bg-[#E73725] hover:bg-red-700 text-white px-8 py-3 rounded-lg font-librecaslon font-semibold transition-colors duration-300"
              >
                Shop Online
              </a>
              <a
                href="/contact"
                className="bg-[#010000] hover:bg-gray-800 text-white px-8 py-3 rounded-lg font-librecaslon font-semibold transition-colors duration-300"
              >
                Contact Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
