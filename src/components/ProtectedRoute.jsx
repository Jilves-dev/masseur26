import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Komponentti suojattuja reittejä varten
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { currentUser, isAdmin } = useAuth();

  // Jos käyttäjä ei ole kirjautunut, ohjataan kirjautumissivulle
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // Jos reitti vaatii admin-oikeudet
  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/" />; // Ohjataan etusivulle jos ei ole admin
  }

  return children;
};

export default ProtectedRoute;
