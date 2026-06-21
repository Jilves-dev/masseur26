// Firebase konfiguraatio
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { getStorage } from 'firebase/storage';

// Varmista, että sinulla on .env.development -tiedosto projektin juuressa
// ja että se sisältää kaikki VITE_FIREBASE_... -alkuiset muuttujat.
// Löydät nämä arvot Firebase-projektisi asetuksista.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

/* ✅ LISÄÄ TÄMÄ DEBUG-LOHKO
console.log('=== FIREBASE CONFIG DEBUG ===');
console.log('DEV mode:', import.meta.env.DEV);
console.log('Mode:', import.meta.env.MODE);
console.log('Config loaded:', {
  apiKey: firebaseConfig.apiKey ? '✅ OK' : '❌ MISSING',
  authDomain: firebaseConfig.authDomain ? '✅ OK' : '❌ MISSING',
  projectId: firebaseConfig.projectId ? '✅ OK' : '❌ MISSING',
  storageBucket: firebaseConfig.storageBucket ? '✅ OK' : '❌ MISSING',
  messagingSenderId: firebaseConfig.messagingSenderId ? '✅ OK' : '❌ MISSING',
  appId: firebaseConfig.appId ? '✅ OK' : '❌ MISSING',
});
console.log('Full config:', firebaseConfig);*/

// Alustetaan Firebase
const app = initializeApp(firebaseConfig);

// Haetaan palvelut (Auth, Firestore, jne.)
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app, 'europe-north1');
export const storage = getStorage(app);

// Yhdistetään emulaattoreihin VAIN kehitystilassa (npm run dev)
if (import.meta.env.DEV) {
  console.log('=== Yhdistetään Firebase-emulaattoreihin... ===');
  try {
    // Yhdistetään Auth- ja Firestore-emulaattoreihin.
    // Nyt web-sovellus kirjoittaa ja lukee dataa paikallisesta emulaattorista.
    connectAuthEmulator(auth, 'http://127.0.0.1:9099');
    console.log('Auth-emulaattori yhdistetty (port 9099)');

    connectFirestoreEmulator(db, '127.0.0.1', 8080);
    console.log('Firestore-emulaattori yhdistetty.');

    connectFunctionsEmulator(functions, '127.0.0.1', 5001);
    console.log('✅ Functions-emulaattori yhdistetty (port 5001)');
  } catch (error) {
    console.error('Virhe yhdistettäessä emulaattoreihin:', error);
  }
}

export default app;
