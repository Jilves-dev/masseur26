import React, { createContext, useContext, useState } from 'react';

const MobileMenuContext = createContext();

export const useMobileMenu = () => {
  const context = useContext(MobileMenuContext);
  if (!context) {
    throw new Error('useMobileMenu must be used within MobileMenuProvider');
  }
  return context;
};

export const MobileMenuProvider = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const openMobileMenu = () => {
    setIsMobileMenuOpen(true);
    setIsClosing(false);
  };

  const closeMobileMenu = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsMobileMenuOpen(false);
      setIsClosing(false);
    }, 200);
  };

  const toggleMobileMenu = () => {
    if (isMobileMenuOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  };

  return (
    <MobileMenuContext.Provider
      value={{
        isMobileMenuOpen,
        isClosing,
        openMobileMenu,
        closeMobileMenu,
        toggleMobileMenu,
        setIsClosing,
        setIsMobileMenuOpen,
      }}
    >
      {children}
    </MobileMenuContext.Provider>
  );
};
