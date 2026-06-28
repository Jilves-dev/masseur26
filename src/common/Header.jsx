import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { IoMdArrowRoundBack } from 'react-icons/io';
import {
  BiSearch,
  BiShoppingBag,
  BiUser,
  BiLogOut,
  BiMenu,
  BiX,
} from 'react-icons/bi';
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaTiktok,
} from 'react-icons/fa';
import Icon_mobile from '../components/Icon_mobile';
import { FaSignInAlt } from 'react-icons/fa';
import Sidebar from './Sidebar';
import { useSelector } from 'react-redux';
import { useAuth } from '../context/AuthContext';
import { useMobileMenu } from '../context/MobileMenuContext';
import { CATEGORIES } from '../services/productService';

const Header = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  //const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  //const [isClosing, setIsClosing] = useState(false); // ✅ UUSI: Animaation hallinta
  const { currentUser, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Header.jsx - Lisää tämä funktiokomponentin alkuun, location-muuttujien yhteyteen
  const isShopPage =
    location.pathname === '/shop' || location.pathname.startsWith('/shop?');
  const isContactOrAboutPage =
    location.pathname === '/contact' ||
    location.pathname === '/about' ||
    location.pathname === '/repairs';

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const {
    isMobileMenuOpen,
    isClosing,
    toggleMobileMenu,
    closeMobileMenu,
    setIsClosing,
    setIsMobileMenuOpen,
  } = useMobileMenu();

  {
    /*const toggleMobileMenu = () => {
    if (isMobileMenuOpen) {
      // Suljetaan - käynnistä animaatio
      setIsClosing(true);
      setTimeout(() => {
        setIsMobileMenuOpen(false);
        setIsClosing(false);
      }, 200); // 200ms = fadeOut animaation kesto
    } else {
      // Avataan
      setIsMobileMenuOpen(true);
    }
  };*/
  }

  // ✅ UUSI: Sulje menu sujuvasti ja navigoi
  const closeMenuAndNavigate = (path) => {
    setIsClosing(true);
    setTimeout(() => {
      setIsMobileMenuOpen(false);
      setIsClosing(false);
      navigate(path, { state: { fromMobileMenu: true } });
    }, 200); // Odota animaation loppuminen
  };

  const toggleCategoryMenu = () => {
    setShowCategoryMenu(!showCategoryMenu);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const { totalItems } = useSelector((state) => state.cart);

  // Tarkista onko Shop-sivulla
  //const isShopPage = location.pathname === '/shop' || location.pathname.startsWith('/shop?');

  return (
    <>
      <div
        className={`${isSticky ? 'sticky top-0 z-50 bg-[#eceef1] shadow-xl' : ''} ${(isShopPage || isContactOrAboutPage) ? 'hidden md:block' : ''}`}
      >
        {/* ====================================
          MOBILE HEADER - YKSINKERTAISTETTU
          PIILOTETAAN Shop-sivulla ja näytetään muilla sivuilla
          ==================================== */}
        <div
          className={`md:hidden ${isShopPage || isContactOrAboutPage ? 'hidden' : 'block'}`}
        >
          <div className="mobile-header-simple bg-[#eceef1]">
            {/* VASEN: Hamburger */}
            <button
              onClick={toggleMobileMenu}
              className="mobile-hamburger-simple"
              aria-label="Open menu"
            >
              <BiMenu />
            </button>

            {/* KESKI: Logo */}
            <Link className="mobile-logo-center font-racingSansOne" to="/">
              <span className="font-medium text-2xl text-[#b9975b]">URHEILU</span>
              <span className="font-medium text-2xl text-[#333f48]">HIEROJAT</span>
            </Link>

            {/* OIKEA: Ostoskori */}
            <div className="mobile-cart-simple">
              <button
                onClick={toggleSidebar}
                className="mobile-cart-button"
                aria-label="Shopping cart"
              >
                <BiShoppingBag />
                {totalItems > 0 && (
                  <span className="mobile-cart-badge-simple">{totalItems}</span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ============
          DESKTOP HEADER
          ==============*/}
        <div className="hidden md:block hero-bg">
          <div className="flex flex-wrap justify-between items-center pt-4 pb-0 w-10/12 mx-auto">
            <div className="ml-6">
              <Link
                className="desktop-logo font-racingSansOne text-2xl flex items-center"
                to="/"
              >
                <span className="text-[#b9975b]"> URHEILU</span>
                <span className="text-[#333f48]">HIEROJAT </span>
              </Link>
            </div>

            <ul className="desktop-menu flex flex-wrap font-racingSansOne text-[#333f48] text-lg font-medium">
              <li className="mr-5">
                <Link className="hover:text-[#333f48]" to="/">
                  ETUSIVU
                </Link>
              </li>

              <li className="mr-5">
                <Link className="hover:text-[#333f48]" to="/repairs">
                  AJANVARAUS
                </Link>
              </li>

              {/*<li className="mr-5 relative">
                <button
                  className="hover:text-[#e31837] flex items-center"
                  onClick={toggleCategoryMenu}
                >
                  KATEGORIAT
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {showCategoryMenu && (
                  <div className="absolute top-full left-0 mt-1 bg-[#eceef1] shadow-lg rounded-md py-2 w-48 z-50">
                    <Link
                      to="/shop"
                      className="font-racingSansOne text-base font-medium block px-4 py-2 hover:text-[#e31837]"
                      onClick={() => setShowCategoryMenu(false)}
                    >
                      KAIKKI TUOTTEET
                    </Link>

                    <Link
                      to={`/shop?category=${CATEGORIES.GIFT_CARDS}`}
                      className="font-racingSansOne text-lg font-medium  block px-4 py-2 hover:text-[#e31837]"
                      onClick={() => setShowCategoryMenu(false)}
                    >
                      LAHJAKORTIT
                    </Link>

                    <Link
                      to={`/shop?category=${CATEGORIES.SUPPLEMENTS}`}
                      className="font-racingSansOne text-lg font-medium  block px-4 py-2 hover:text-[#e31837]"
                      onClick={() => setShowCategoryMenu(false)}
                    >
                      LISÄRAVINTEET
                    </Link>
                  </div>
                )}
              </li>*/}

              <li className="mr-5">
                <Link className="hover:text-[#333f48]" to="/shop">
                  KAUPPA
                </Link>
              </li>

              <li className="mr-5">
                <Link className="hover:text-[#333f48]" to="/about">
                  MEISTÄ
                </Link>
              </li>

              <li className="mr-5">
                <Link className="hover:text-[#333f48]" to="/contact">
                  YHTEYSTIEDOT
                </Link>
              </li>
            </ul>

            <div className="flex flex-wrap text-2xl items-center text-[#333f48]">
              <Link to="/shop" className="mr-4 hover:text-[#333f48]">
                <BiSearch />
              </Link>

              {currentUser ? (
                <>
                  <Link
                    to={isAdmin() ? '/admin' : '/profile'}
                    className="mr-2 hover:text-[#333f48]"
                    title={isAdmin() ? 'Hallintapaneeli' : 'Käyttäjäprofiili'}
                  >
                    <BiUser />
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="mr-4 hover:text-[#333f48]"
                    title="Kirjaudu ulos"
                  >
                    <BiLogOut />
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="mr-4 hover:text-[#333f48]"
                  title="Kirjaudu sisään"
                >
                  <FaSignInAlt />
                </Link>
              )}

              <div className="relative">
                <Link to="/cart" className="hover:text-[#333f48]">
                  <BiShoppingBag />
                </Link>
                {totalItems > 0 && (
                  <div className="items_count">
                    <span className="text-white">{totalItems}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ====================================
        MOBILE MENU OVERLAY - ANIMAATIOILLA
        ==================================== */}
      {isMobileMenuOpen && (
        <div
          className={`fixed inset-0 z-50 bg-[#eceef1] flex flex-col ${isClosing ? 'mobile-menu-closing' : 'mobile-menu-overlay'}`}
        >
          {/* ====================================
            MENU HEADER - FIXED YLHÄÄLLÄ
            ==================================== */}
          <div className="flex-shrink-0 flex p-4 bg-[#eceef1]">
            {/* Takaisin-nappi */}
            <button
              onClick={() => closeMenuAndNavigate('/')}
              className="text-lg text-[#333f48] hover:text-[#e31837] p-2 -ml-2"
              aria-label="Close menu"
            >
              <IoMdArrowRoundBack />
            </button>

            {/* Logo menussa */}
            <Link
              className="modal-logotext-xl font-racingSansOne font-medium flex items-center pl-2"
              to="/"
              onClick={() => closeMenuAndNavigate('/')}
            >
              <span className="text-[#e31837] text-3xl">URHEILU</span>
              <span className="text-[#333f48] text-3xl">HIEROJA</span>
            </Link>
          </div>

          {/* ====================================
            IKONIT - FIXED HEADERIN ALLA
            ==================================== */}
          <div className="flex-1 overflow-y-auto bg-[#eceef1]">
            <div className="flex-shrink-0 flex items-center justify-center p-4 bg-[#eceef1]">
              <div className="flex items-center justify-center w-full max-w-xs gap-2">
                {/* Haku */}
                <Link
                  to="/shop"
                  className="text-xl text-[#333f48] hover:text-[#e31837]"
                  onClick={() => closeMenuAndNavigate('/shop')}
                  aria-label="Search"
                >
                  <BiSearch />
                </Link>

                {/* Käyttäjä / Kirjautuminen */}
                {currentUser ? (
                  <Link
                    to={isAdmin() ? '/admin' : '/profile'}
                    className="text-xl text-[#333f48] hover:text-[#e31837]"
                    onClick={() =>
                      closeMenuAndNavigate(isAdmin() ? '/admin' : '/profile')
                    }
                    aria-label={isAdmin() ? 'Admin' : 'Profile'}
                  >
                    <BiUser />
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className="text-xl text-[#333f48] hover:text-[#e31837]"
                    onClick={() => closeMenuAndNavigate('/login')}
                    aria-label="Login"
                  >
                    <FaSignInAlt />
                  </Link>
                )}

                {/* Ostoskori */}
                <div className="relative">
                  <button
                    onClick={() => {
                      toggleSidebar();
                      toggleMobileMenu();
                    }}
                    className="text-xl text-[#333f48] hover:text-[#e31837]"
                    aria-label="Shopping cart"
                  >
                    <BiShoppingBag />
                    {totalItems > 0 && (
                      <span className="absolute -top-2 -right-2 bg-[#e31837] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                        {totalItems}
                      </span>
                    )}
                  </button>
                </div>

                {/* Uloskirjautuminen (jos kirjautunut) */}
                {currentUser && (
                  <>
                    <div className="h-6 w-px bg-gray-300"></div>
                    <button
                      onClick={() => {
                        handleLogout();
                        toggleMobileMenu();
                      }}
                      className="text-xl text-[#333f48] hover:text-[#e31837]"
                      aria-label="Logout"
                    >
                      <BiLogOut />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* VIIVA - erillinen elementti paddingilla */}
            <div className="px-4">
              <div className="border-b border-[#e31837]"></div>
            </div>

            {/* ====================================
            SKROLLAAVA SISÄLTÖ - KORJATTU
            flex-1 + overflow-y-auto = toimii!
            ==================================== */}
            <div className="p-6 pb-24">
              {/* ✅ UUSI: Admin Dashboard -linkit (näkyy vain admineille) */}
              {isAdmin() && (
                <div className="mb-8 font-racingSansOne border-b border-[#e31837] pb-6">
                  <h3 className="font-oswaldVariable text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                    Hallintapaneeli
                  </h3>
                  <nav className="space-y-3">
                    <Link
                      to="/admin"
                      className="block text-xl font-oswaldVariable text-[#333f48] hover:text-[#e31837] py-2 transition-colors"
                      onClick={() => closeMenuAndNavigate('/admin')}
                    >
                      Hallintapaneeli
                    </Link>

                    <Link
                      to="/admin/orders"
                      className="block text-xl font-oswaldVariable text-[#333f48] hover:text-[#e31837] py-2 transition-colors"
                      onClick={() => closeMenuAndNavigate('/admin/orders')}
                    >
                      Tilaustenhallinta
                    </Link>

                    <Link
                      to="/admin/products"
                      className="block text-xl font-oswaldVariable text-[#333f48] hover:text-[#e31837] py-2 transition-colors"
                      onClick={() => closeMenuAndNavigate('/admin/products')}
                    >
                      Tuotehallinta
                    </Link>

                    <Link
                      to="/admin/users"
                      className="block text-xl font-oswaldVariable text-[#333f48] hover:text-[#e31837] py-2 transition-colors"
                      onClick={() => closeMenuAndNavigate('/admin/users')}
                    >
                      Käyttäjähallinta
                    </Link>

                    <Link
                      to="/admin/bookings"
                      className="block text-xl font-oswaldVariable text-[#333f48] hover:text-[#e31837] py-2 transition-colors"
                      onClick={() => closeMenuAndNavigate('/admin/bookings')}
                    >
                      Varaukset
                    </Link>

                    <Link
                      to="/admin/availability"
                      className="block text-xl font-oswaldVariable text-[#333f48] hover:text-[#e31837] py-2 transition-colors"
                      onClick={() => closeMenuAndNavigate('/admin/availability')}
                    >
                      Kalenteri
                    </Link>
                  </nav>
                </div>
              )}

              {/* ✅ UUSI: USER DASHBOARD - Näkyy vain kirjautuneille EI-ADMIN käyttäjille */}
              {currentUser && !isAdmin() && (
                <div className="mb-8 font-racingSansOne border-b border-[#e31837] pb-6">
                  <h3 className="font-oswaldVariable text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                    Omat tiedot
                  </h3>
                  <nav className="space-y-3">
                    <Link
                      to="/profile"
                      className="block text-xl font-oswaldVariable text-[#333f48] hover:text-[#e31837] py-2 transition-colors"
                      onClick={() => closeMenuAndNavigate('/profile')}
                    >
                      Profiili
                    </Link>

                    <Link
                      to="/profile?tab=orders"
                      className="block text-xl font-oswaldVariable text-[#333f48] hover:text-[#e31837] py-2 transition-colors"
                      onClick={() =>
                        closeMenuAndNavigate('/profile?tab=orders')
                      }
                    >
                      Omat tilaukset
                    </Link>

                    <Link
                      to="/profile?tab=password"
                      className="block text-xl font-oswaldVariable text-[#333f48] hover:text-[#e31837] py-2 transition-colors"
                      onClick={() =>
                        closeMenuAndNavigate('/profile?tab=password')
                      }
                    >
                      Vaihda salasana
                    </Link>
                  </nav>
                </div>
              )}

              {/* Muut linkit */}
              <div className="mb-8 font-racingSansOne border-b border-[#e31837] pb-6">
                <h3 className="font-oswaldVariable text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                  Sivut
                </h3>
                <nav className="space-y-3">
                  <Link
                    to="/"
                    className="block text-xl font-oswaldVariable text-[#333f48] hover:text-[#e31837] py-2"
                    onClick={() => closeMenuAndNavigate('/')}
                  >
                    ETUSIVU
                  </Link>

                  <Link
                    to="/repairs"
                    className="block text-xl font-oswaldVariable text-[#333f48] hover:text-[#e31837] py-2"
                    onClick={() => closeMenuAndNavigate('/repairs')}
                  >
                    PALVELUT
                  </Link>

                  <Link
                    to="/contact"
                    className="block text-xl font-oswaldVariable text-[#333f48] hover:text-[#e31837] py-2"
                    onClick={() => closeMenuAndNavigate('/contact')}
                  >
                    YHTEYSTIEDOT
                  </Link>

                  <Link
                    to="/about"
                    className="block text-xl font-oswaldVariable text-[#333f48] hover:text-[#e31837] py-2"
                    onClick={() => closeMenuAndNavigate('/about')}
                  >
                    MEISTÄ
                  </Link>
                </nav>
              </div>

              {/* Kategoriat - Isolla tekstillä */}
              <div className="mb-8 font-racingSansOne">
                <h3 className="font-oswaldVariable text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                  Kauppa
                </h3>
                <nav className="space-y-3">
                  <Link
                    to="/shop"
                    className="block text-xl font-oswaldVariable text-[#333f48] hover:text-[#e31837] py-3 transition-colors"
                    onClick={() => closeMenuAndNavigate('/shop')}
                  >
                    KAIKKI TUOTTEET
                  </Link>

                  <Link
                    to={`/shop?category=${CATEGORIES.GIFT_CARDS}`}
                    className="block text-xl font-oswaldVariable text-[#333f48] hover:text-[#e31837] py-3 transition-colors"
                    onClick={() =>
                      closeMenuAndNavigate(
                        `/shop?category=${CATEGORIES.GIFT_CARDS}`
                      )
                    }
                  >
                    LAHJAKORTIT
                  </Link>

                  <Link
                    to={`/shop?category=${CATEGORIES.SUPPLEMENTS}`}
                    className="block text-xl font-oswaldVariable text-[#333f48] hover:text-[#e31837] py-3 transition-colors"
                    onClick={() =>
                      closeMenuAndNavigate(
                        `/shop?category=${CATEGORIES.SUPPLEMENTS}`
                      )
                    }
                  >
                    LISÄRAVINTEET
                  </Link>
                </nav>
              </div>

              {/* Social Media - NYT NÄKYY! */}
              <div className="border-t border-[#e31837] pt-6 pb-8">
                <h4 className="text-lg font-racingSansOne text-[#333f48] text-center mb-6 uppercase tracking-wider">
                  Seuraa meitä
                </h4>
                <div className="flex gap-6 justify-center">
                  <a
                    href="#"
                    className="text-3xl text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <FaFacebook />
                  </a>
                  <a
                    href="#"
                    className="text-3xl text-blue-400 hover:text-blue-500 transition-colors"
                  >
                    <FaLinkedin />
                  </a>
                  <a
                    href="#"
                    className="text-3xl text-red-600 hover:text-red-700 transition-colors"
                  >
                    <FaYoutube />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Sidebar isSidebarOpen={isSidebarOpen} closeSidebar={toggleSidebar} />
    </>
  );
};

export default Header;
