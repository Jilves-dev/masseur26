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
            title: 'Urheiluhieroja',
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
                <h3 style="margin: 0 0 8px 0; color: #b9975b; font-size: 16px;">Urheiluhieroja</h3>
                <p style="margin: 4px 0; font-size: 14px;"><strong>📍 Osoite:</strong><br>Finlaysoninkatu 25<br>33210 Tampere</p>
                <p style="margin: 4px 0; font-size: 14px;"><strong>📞 Puhelin:</strong> +358 50 123 4567</p>
                <p style="margin: 4px 0; font-size: 14px;"><strong>🕒 Aukioloajat:</strong><br>Ma-Pe: 10-19<br>La: 10-17<br>Su: 12-16</p>
                <div style="margin-top: 10px;">
                  <a href="https://maps.google.com/dir/?api=1&destination=Finlaysoninkatu+25,+33210+Tampere"
                     target="_blank"
                     style="color: #b9975b; text-decoration: none; font-weight: bold;">
                    🧭 Reittiohjeet →
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
      title: 'Puhelin',
      info: '+358 50 123 4567',
      description: 'Ma-Pe, 10-19',
    },
    {
      icon: <FaEnvelope />,
      title: 'Sähköposti',
      info: 'info@urheiluhieroja.fi',
      description: 'Vastaamme 24 tunnin sisällä',
    },
    {
      icon: <FaMapMarkerAlt />,
      title: 'Osoite',
      info: 'Finlaysoninkatu 25',
      description: '33210 Tampere',
    },
    {
      icon: <FaClock />,
      title: 'Aukioloajat',
      info: 'Ma-Pe: 10-19, La: 10-17',
      description: 'Su: 12-16',
    },
  ];

  return (
    <div className="bg-[#eceef1]">
      <button
        onClick={handleBackToMenu}
        className={`md:hidden fixed left-4 z-50 w-10 h-10 bg-[#eceef1] rounded-full
          shadow-xl flex items-center justify-center text-[#333f48] hover:text-[#b9975b]
          transition-all duration-300 ease-in-out 
          ${isScrolled ? 'top-4' : 'top-22'}`}
        aria-label="Takaisin valikkoon"
      >
        <BiMenu size={20} />
      </button>

      <section className="py-12 min-h-screen font-oswaldVariable">
        <div className="container mx-auto px-4">
          {/* OTSIKKO - Skrollaa muun sisällön mukana */}
          <motion.h1
            variants={fadeUp(0.2)}
            initial="hidden"
            whileInView="show"
            className="font-racingSansOne text-3xl font-medium sm:font-medium text-center mb-12"
          >
            Ota yhteyttä
          </motion.h1>

          {/* Contact Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((item, index) => (
              <motion.div
                key={index}
                variants={fadeUp(0.3 + index * 0.1)}
                initial="hidden"
                whileInView="show"
                className="bg-[#eceef1] p-6 rounded-xl border border-[#b9975b]/30 shadow-xl text-center hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-center mb-4">
                  <div className="text-2xl text-[#b9975b]">{item.icon}</div>
                </div>
                <h3 className="text-xl font-racingSansOne font-medium sm:font-medium mb-2">
                  {item.title}
                </h3>
                <p className="font-oswaldVariable font-medium mb-1">{item.info}</p>
                <p className="font-oswaldVariable text-sm">{item.description}</p>
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
              className="bg-[#eceef1] p-8 rounded-xl border border-[#b9975b]/30 shadow-xl"
            >
              <h2 className="text-2xl font-oswaldVariable font-normal mb-6">
                Yhteydenottolomake
              </h2>

              {isSubmitted ? (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6">
                  <strong className="font-oswaldVariable font-bold">
                    Kiitos!
                  </strong>
                  <span className="font-oswaldVariable block sm:inline">
                    {' '}
                    Viestisi on lähetetty onnistuneesti.
                  </span>
                </div>
              ) : null}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="block text-gray-500 font-oswaldVariable font-medium mb-2"
                  >
                    Nimesi
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="bg-white font-oswaldVariable w-full px-4 py-2 border border-[#b9975b]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#b9975b]"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="font-oswaldVariable block text-gray-500 font-medium mb-2"
                  >
                    Sähköpostisi
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="bg-white w-full px-4 py-2 border border-[#b9975b]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#b9975b]"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="subject"
                    className="block font-oswaldVariable text-gray-500 font-medium mb-2"
                  >
                    Aihe
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="bg-white w-full px-4 py-2 border border-[#b9975b]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#b9975b]"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="message"
                    className="block font-oswaldVariable text-gray-500 font-medium mb-2"
                  >
                    Viesti
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    className="bg-white w-full px-4 py-2 border border-[#b9975b]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#b9975b]"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="bg-[#b9975b] font-oswaldVariable text-[#eceef1] text-lg px-6 py-3 rounded-md hover:bg-[#333f48] transition-colors focus:outline-none focus:ring-2 focus:ring-[#b9975b] focus:ring-offset-2 w-full"
                >
                  Lähetä viesti
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
              <div className="bg-[#eceef1] p-2 rounded-xl border border-[#b9975b]/30 shadow-md overflow-hidden h-[400px]">
                {mapError ? (
                  // Fallback jos Google Maps ei lataudu
                  <div className="w-full h-full bg-gray-200 rounded-lg flex flex-col items-center justify-center text-center p-4">
                    <FaMapMarkerAlt className="text-[#b9975b] text-4xl mb-4" />
                    <h3 className="font-oswaldVariable font-bold text-[#333f48] mb-2">
                      Tervetuloa hierontaamme
                    </h3>
                    <p className="font-oswaldVariable text-gray-500 mb-2">
                      Finlaysoninkatu 25
                      <br />
                      33210 Tampere
                    </p>
                    <a
                      href="https://maps.google.com/dir/?api=1&destination=Finlaysoninkatu+25,+33210+Tampere"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#b9975b] font-oswaldVariable text-[#eceef1] px-4 py-2 rounded-md hover:bg-[#333f48] transition-colors text-sm"
                    >
                      🧭 Reittiohjeet →
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

              <div className="bg-[#333f48] text-[#eceef1] text-2xl p-4 text-center mt-4 rounded-md border border-[#b9975b]/30 shadow-xl">
                <h3 className="font-oswaldVariable font-medium mb-1">
                  Käy hierontatilassamme
                </h3>
                <p className="font-oswaldVariable text-2xl">
                  Finlaysoninkatu 25, 33210 Tampere
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
              className="font-oswaldVariable text-3xl font-medium text-center mb-10"
            >
              Usein kysytyt kysymykset
            </motion.h2>

            <div className="max-w-3xl mx-auto">
              <motion.div
                variants={fadeUp(0.3)}
                initial="hidden"
                whileInView="show"
                className="space-y-6"
              >
                <div className="bg-[#eceef1] p-6 rounded-xl border border-[#b9975b]/30 shadow-md">
                  <h3 className="font-oswaldVariable text-xl font-medium mb-2">
                    Kuinka pitkiä hierontoja tarjoatte?
                  </h3>
                  <p className="font-oswaldVariable text-gray-500">
                    Tarjoamme 30, 60 ja 90 minuutin urheiluhierontoja sekä
                    syvähierontaa ja kuppaushoitoja. Voit valita sinulle
                    parhaiten sopivan vaihtoehdon ajanvarauksen yhteydessä.
                  </p>
                </div>

                <div className="bg-[#eceef1] p-6 rounded-xl border border-[#b9975b]/30 shadow-md">
                  <h3 className="font-oswaldVariable text-xl font-medium mb-2">
                    Tarvitseeko ajan varata etukäteen?
                  </h3>
                  <p className="font-oswaldVariable text-gray-500">
                    Suosittelemme varaamaan ajan etukäteen verkosta tai
                    puhelimitse, jotta saat varmasti sinulle sopivan ajan.
                    Otamme vastaan myös kävijöitä, jos kalenterista löytyy tilaa.
                  </p>
                </div>

                <div className="bg-[#eceef1] p-6 rounded-xl border border-[#b9975b]/30 shadow-md">
                  <h3 className="font-oswaldVariable text-xl font-medium mb-2">
                    Myyttekö lahjakortteja?
                  </h3>
                  <p className="font-oswaldVariable text-gray-500">
                    Kyllä, verkkokaupastamme löydät hierontalahjakortteja
                    eri kestoisiin hoitoihin sekä muutaman valikoidun
                    lisäravinnetuotteen.
                  </p>
                </div>

                <div className="bg-[#eceef1] p-6 rounded-xl border border-[#b9975b]/30 shadow-md">
                  <h3 className="font-oswaldVariable text-xl font-medium mb-2">
                    Onko hierontatilan lähellä pysäköintimahdollisuus?
                  </h3>
                  <p className="font-oswaldVariable text-gray-500">
                    Kyllä, Finlaysoninkadun läheisyydessä on pysäköintitilaa
                    asiakkaillemme.
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
