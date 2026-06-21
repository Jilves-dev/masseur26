import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { auth, db } from '../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';

// Luodaan autentikaatiokonteksti
const AuthContext = createContext();

// Hook, jolla käytetään autentikaatiokontekstia
export function useAuth() {
  return useContext(AuthContext);
}

// AuthProvider-komponentti, joka tarjoaa autentikaatiotiedot koko sovellukselle
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Rekisteröityminen
  async function signup(email, password, displayName) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      // Asetetaan käyttäjän näyttönimi
      await updateProfile(userCredential.user, { displayName });
      return userCredential;
    } catch (error) {
      throw error;
    }
  }

  // Kirjautuminen
  async function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Uloskirjautuminen
  async function logout() {
    return signOut(auth);
  }

  // Salasanan nollaus
  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  // Seurataan käyttäjän kirjautumistilaa ja haetaan käyttäjän rooli
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      // Jos käyttäjä on kirjautunut, haetaan rooli Firestoresta
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserRole(userDoc.data().role || 'customer');
          } else {
            setUserRole('customer'); // Oletusrooli, jos käyttäjädokumenttia ei löydy
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
          setUserRole('customer');
        }
      } else {
        setUserRole(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Tarkistaa, onko käyttäjä admin
  function isAdmin() {
    return userRole === 'admin';
  }

  // Näytetään console.log käyttäjätiedoista kehityksen aikana
  useEffect(() => {
    if (currentUser) {
      /*console.log("Kirjautunut käyttäjä:", currentUser.email);
      console.log("Käyttäjärooli:", userRole);*/
    } else {
      console.log('Ei kirjautunutta käyttäjää');
    }
  }, [currentUser, userRole]);

  // Kontekstin arvo
  const value = {
    currentUser,
    userRole,
    isAdmin,
    signup,
    login,
    logout,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
