import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BiMenu } from 'react-icons/bi';
import { useMobileMenu } from '../context/MobileMenuContext';

const AdminMobileHeader = ({ pageTitle }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { openMobileMenu } = useMobileMenu();

  // Tarkista tuleeko mobiilivalikosta
  const fromMobileMenu = location.state?.fromMobileMenu || false;

  // Paluu mobile menuun + avaa menu
  const handleBackToMenu = () => {
    navigate('/'); // Palaa etusivulle
    setTimeout(() => {
      openMobileMenu(); // Avaa mobile menu
    }, 50);
  };

  // Scroll listener - seuraa TopBar:n katoamista
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

  return (
    <>
      {/* MOBILE HEADER - Näkyy vain sm ja pienemmillä */}
      <div className="md:hidden bg-[#FFFFFF]">
        {/* Hamburger nappi - Fixed position */}
        <button
          onClick={handleBackToMenu}
          className={`fixed left-4 z-50 w-10 h-10 bg-[#FFFFFF] rounded-full 
          shadow-xl flex items-center justify-center text-black hover:text-[#A30B2E] 
          transition-all duration-300 ease-in-out 
          ${isScrolled ? 'top-4' : 'top-22'}`}
          aria-label="Back to menu"
        >
          <BiMenu size={20} />
        </button>

        {/* Sivun otsikko - Skrollaa sisällön mukana */}
        <div className="flex items-center justify-center pt-12 pb-4">
          <h1 className="font-racingSansOne text-3xl font-medium text-center">
            {pageTitle}
          </h1>
        </div>
      </div>
    </>
  );
};

export default AdminMobileHeader;
