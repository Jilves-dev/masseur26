import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaTimes,
} from 'react-icons/fa';
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

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [mapError, setMapError] = useState(false);
  const mapRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const mapInstance = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const { openMobileMenu } = useMobileMenu(); // ⭐ Hae contexista

  // Tarkista tuleeko mobiilivalikosta
  const fromMobileMenu = location.state?.fromMobileMenu || false;

  // ✅ Paluu mobile menuun + avaa menu
  const handleBackToMenu = () => {
    navigate('/'); // Palaa etusivulle
    setTimeout(() => {
      openMobileMenu(); // Avaa mobile menu
    }, 50); // Pieni viive että navigointi ehtii tapahtua
  };

  // ⭐ Scroll listener - seuraa TopBar:n katoamista
  useEffect(() => {
    const handleScroll = () => {
      // TopBar height ~58px -> kun scrollattu yli, nappi top-2
      if (window.scrollY > 58) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Tarkista heti alussa

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    console.log(
      'Google Maps API Key:',
      import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    );
    console.log('Environment:', import.meta.env.MODE);
  }, []);

  // Google Maps initialisointi
  useEffect(() => {
    const initializeMap = async () => {
      try {
        // Lataa Google Maps API
        const { Loader } = await import('@googlemaps/js-api-loader');

        const loader = new Loader({
          apiKey:
            import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY_HERE', // Lisää .env tiedostoon
          version: 'weekly',
          libraries: ['places', 'geometry'],
        });

        const google = await loader.load();

        // Finlaysoninkatu 25, Tampere koordinaatit
        const storeLocation = { lat: 61.4981, lng: 23.7608 };

        // Kartan asetukset
        const mapOptions = {
          center: storeLocation,
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          styles: [
            // Modernit tummat tyylit
            /*{
              "featureType": "all",
              "elementType": "geometry",
              "stylers": [{"color": "#242f3e"}]
            },
            {
              "featureType": "all",
              "elementType": "labels.text.stroke",
              "stylers": [{"lightness": -80}]
            },
            {
              "featureType": "administrative",
              "elementType": "labels.text.fill",
              "stylers": [{"color": "#746855"}]
            },
            {
              "featureType": "road",
              "elementType": "geometry.fill",
              "stylers": [{"color": "#2b3544"}]
            },
            {
              "featureType": "water",
              "elementType": "geometry",
              "stylers": [{"color": "#17263c"}]
            }*/
          ],
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: true,
          fullscreenControl: true,
          gestureHandling: 'cooperative',
        };

        // Luo kartta
        if (mapRef.current) {
          mapInstance.current = new google.maps.Map(mapRef.current, mapOptions);

          // Lisää merkki kauppaan
          const marker = new google.maps.Marker({
            position: storeLocation,
            map: mapInstance.current,
            title: 'Freewheel Bikes Workshop',
            icon: {
              url:
                'data:image/svg+xml;base64,' +
                btoa(`
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40">
                  <circle cx="12" cy="12" r="10" fill="#dc2626" stroke="#ffffff" stroke-width="2"/>
                  <circle cx="12" cy="12" r="4" fill="#ffffff"/>
                </svg>
              `),
              scaledSize: new google.maps.Size(40, 40),
              anchor: new google.maps.Point(20, 20),
            },
            animation: google.maps.Animation.DROP,
          });

          // Info ikkuna
          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div style="padding: 10px; font-family: Arial, sans-serif; max-width: 250px;">
                <h3 style="margin: 0 0 8px 0; color: #E73725; font-size: 16px;">Freewheel Bikes Workshop</h3>
                <p style="margin: 4px 0; font-size: 14px;"><strong>📍 Osoite:</strong><br>Finlaysoninkatu 25<br>33210 Tampere</p>
                <p style="margin: 4px 0; font-size: 14px;"><strong>📞 Phone:</strong> +358 50 123 4567</p>
                <p style="margin: 4px 0; font-size: 14px;"><strong>🕒 Opening hours:</strong><br>Mo-Fr: 10-19<br>Sa: 10-17<br>Su: 12-16</p>
                <div style="margin-top: 10px;">
                  <a href="https://maps.google.com/dir/?api=1&destination=Finlaysoninkatu+25,+33210+Tampere" 
                     target="_blank" 
                     style="color: #E73725; text-decoration: none; font-weight: bold;">
                    🧭 Route map →
                  </a>
                </div>
              </div>
            `,
          });

          // Avaa info ikkuna klikkauksella
          marker.addListener('click', () => {
            infoWindow.open(mapInstance.current, marker);
          });

          // Avaa info ikkuna automaattisesti pienen viiveen jälkeen
          setTimeout(() => {
            infoWindow.open(mapInstance.current, marker);
          }, 1000);
        }
      } catch (error) {
        console.error('Error loading Google Maps:', error);
        setMapError(true);
      }
    };

    initializeMap();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
      setIsSubmitted(false);
    }, 3000);
  };

  const contactInfo = [
    {
      icon: <FaPhone />,
      title: 'Phone',
      info: '+358 50 123 4567',
      description: 'Mo-Fr, 10-19',
    },
    {
      icon: <FaEnvelope />,
      title: 'Email',
      info: 'info@freewheelbikes.fi',
      description: 'We reply within 24 hours',
    },
    {
      icon: <FaMapMarkerAlt />,
      title: 'Adresse',
      info: 'Finlaysoninkatu 25',
      description: '33210 Tampere, Finland',
    },
    {
      icon: <FaClock />,
      title: 'Opening Hours',
      info: 'Mo-Fr: 10-19, Sa: 10-17',
      description: 'Su: 12-16',
    },
  ];

  return (
    <div className="bg-[#FFFFFF]">
      <button
        onClick={handleBackToMenu}
        className={`md:hidden fixed left-4 z-50 w-10 h-10 bg-[#FFFFFF] rounded-full 
          shadow-xl flex items-center justify-center text-black hover:text-[#E73725] 
          transition-all duration-300 ease-in-out 
          ${isScrolled ? 'top-4' : 'top-22'}`}
        aria-label="Back to menu"
      >
        <BiMenu size={20} />
      </button>

      <section className="py-12 min-h-screen font-varela">
        <div className="container mx-auto px-4">
          {/* OTSIKKO - Skrollaa muun sisällön mukana */}
          <motion.h1
            variants={fadeUp(0.2)}
            initial="hidden"
            whileInView="show"
            className="font-zaslia text-3xl font-semibold sm:font-semibold text-center mb-12"
          >
            Contact Us
          </motion.h1>

          {/* Contact Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((item, index) => (
              <motion.div
                key={index}
                variants={fadeUp(0.3 + index * 0.1)}
                initial="hidden"
                whileInView="show"
                className="bg-[#FFFFFF] p-6 rounded-xl border border-gray-300 shadow-xl text-center hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-center mb-4">
                  <div className="text-2xl text-[#E73725]">{item.icon}</div>
                </div>
                <h3 className="text-xl font-zaslia font-semibold sm:font-medium mb-2">
                  {item.title}
                </h3>
                <p className="font-librecaslon font-medium mb-1">{item.info}</p>
                <p className="font-librecaslon text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Contact Form and Map Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Contact Form */}
            <motion.div
              variants={fadeUp(0.4)}
              initial="hidden"
              whileInView="show"
              className="bg-[#FFFFFF] p-8 rounded-xl border border-gray-300 shadow-xl"
            >
              <h2 className="text-2xl font-librecaslon font-normal mb-6">
                Contact Form
              </h2>

              {isSubmitted ? (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6">
                  <strong className="font-librecaslon font-bold">
                    Thank you
                  </strong>
                  <span className="font-librecaslon block sm:inline">
                    {' '}
                    Your message has been sent successfully.
                  </span>
                </div>
              ) : null}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="block text-gray-700 font-librecaslon font-medium mb-2"
                  >
                    Your name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="bg-white font-librecaslon w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="font-librecaslon block text-gray-700 font-medium mb-2"
                  >
                    Your email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="bg-white w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="subject"
                    className="block font-librecaslon text-gray-700 font-medium mb-2"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="bg-white w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="message"
                    className="block font-librecaslon text-gray-700 font-medium mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    className="bg-white w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="bg-[#E73725] font-librecaslon text-white text-lg px-6 py-3 rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 w-full"
                >
                  Send Message
                </button>
              </form>
            </motion.div>

            {/* Google Maps */}
            <motion.div
              variants={fadeUp(0.5)}
              initial="hidden"
              whileInView="show"
              className="relative"
            >
              <div className="bg-[#FEFDFC] p-2 rounded-xl border border-gray-300 shadow-md overflow-hidden h-[400px]">
                {mapError ? (
                  // Fallback jos Google Maps ei lataudu
                  <div className="w-full h-full bg-gray-200 rounded-lg flex flex-col items-center justify-center text-center p-4">
                    <FaMapMarkerAlt className="text-red-600 text-4xl mb-4" />
                    <h3 className="font-librecaslon font-bold text-gray-800 mb-2">
                      Visit Our Flagship Store
                    </h3>
                    <p className="font-librecaslon text-gray-600 mb-2">
                      Finlaysoninkatu 25
                      <br />
                      33210 Tampere
                    </p>
                    <a
                      href="https://maps.google.com/dir/?api=1&destination=Finlaysoninkatu+25,+33210+Tampere"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-red-600 font-librecaslon text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors text-sm"
                    >
                      🧭 Route map →
                    </a>
                  </div>
                ) : (
                  // Google Maps container
                  <div
                    ref={mapRef}
                    className="w-full h-full rounded-lg"
                    style={{ minHeight: '396px' }}
                  />
                )}
              </div>

              <div className="bg-primary/90 text-2xl p-4 text-center mt-4 rounded-md border border-gray-300 shadow-xl">
                <h3 className="font-librecaslon font-medium mb-1">
                  Visit Our Workshop
                </h3>
                <p className="font-librecaslon text-2xl">
                  Finlaysoninkatu 25, 33210 Tampere, Finland
                </p>
              </div>
            </motion.div>
          </div>

          {/* FAQ Section */}
          <div className="mt-20">
            <motion.h2
              variants={fadeUp(0.2)}
              initial="hidden"
              whileInView="show"
              className="font-librecaslon text-3xl font-medium text-center mb-10"
            >
              Frequently Asked Questions
            </motion.h2>

            <div className="max-w-3xl mx-auto">
              <motion.div
                variants={fadeUp(0.3)}
                initial="hidden"
                whileInView="show"
                className="space-y-6"
              >
                <div className="bg-[#FFFFFF] p-6 rounded-xl border border-gray-300 shadow-md">
                  <h3 className="font-librecaslon text-xl font-medium mb-2">
                    How long does a repair take?
                  </h3>
                  <p className="font-librecaslon text-gray-700">
                    Most repairs are completed the same day or within 24 hours.
                    For larger overhauls we will give you an estimated time when
                    you drop off your bike.
                  </p>
                </div>

                <div className="bg-[#FFFFFF] p-6 rounded-xl border border-gray-300 shadow-md">
                  <h3 className="font-librecaslon text-xl font-medium mb-2">
                    Do I need to book an appointment?
                  </h3>
                  <p className="font-librecaslon text-gray-700">
                    Walk-ins are welcome for smaller repairs. For full service
                    packages we recommend booking in advance to guarantee a
                    quick turnaround.
                  </p>
                </div>

                <div className="bg-[#FFFFFF] p-6 rounded-xl border border-gray-300 shadow-md">
                  <h3 className="font-librecaslon text-xl font-medium mb-2">
                    Do you ship parts and accessories?
                  </h3>
                  <p className="font-librecaslon text-gray-700">
                    Yes, we ship orders across Finland and to most EU countries.
                    Orders placed before 14:00 are dispatched the same day.
                  </p>
                </div>

                <div className="bg-[#FFFFFF] p-6 rounded-xl border border-gray-300 shadow-md">
                  <h3 className="font-librecaslon text-xl font-medium mb-2">
                    Is there parking available at the workshop?
                  </h3>
                  <p className="font-librecaslon text-gray-700">
                    Yes, there is free parking directly outside our workshop on
                    Finlaysoninkatu. Bike racks are also available at the entrance.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
