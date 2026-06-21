// MaintenanceChecker.jsx
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase/firebase';

function MaintenanceChecker({ children }) {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔍 Tarkistetaan palvelukatko-tila...');

    const checkMaintenanceMode = async () => {
      try {
        const docRef = doc(db, 'settings', 'maintenance');
        console.log('📄 Haetaan Firestore dokumentti...');

        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log('✅ Firestore data:', data);
          setMaintenanceMode(data.enabled);
        } else {
          console.log('❌ Dokumenttia ei löytynyt');
        }
      } catch (error) {
        console.error('🚨 Virhe palvelukatkotilan tarkistuksessa:', error);
      } finally {
        setLoading(false);
        console.log('✅ Loading valmis');
      }
    };

    checkMaintenanceMode();
  }, []);

  // Loading-tila - näkyy kunnolla
  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#f9fafb',
          flexDirection: 'column',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <div
          style={{
            width: '50px',
            height: '50px',
            border: '5px solid #e5e7eb',
            borderTop: '5px solid #dc2626',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        ></div>
        <p style={{ marginTop: '20px', color: '#6b7280' }}>
          Ladataan sovellusta...
        </p>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  // Palvelukatko-tila - täysin näkyvä
  if (maintenanceMode) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          width: '100vw',
          position: 'fixed',
          top: 0,
          left: 0,
          backgroundColor: '#f9fafb',
          flexDirection: 'column',
          fontFamily: 'Arial, sans-serif',
          padding: '20px',
          textAlign: 'center',
          zIndex: 9999,
        }}
      >
        <div
          style={{
            backgroundColor: 'white',
            padding: '40px',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            maxWidth: '500px',
            width: '100%',
          }}
        >
          <div style={{ fontSize: '60px', marginBottom: '20px' }}>🔧</div>
          <h1
            style={{
              color: '#1f2937',
              marginBottom: '20px',
              fontSize: '28px',
              fontWeight: 'bold',
            }}
          >
            Palvelukatko
          </h1>
          <p
            style={{
              color: '#6b7280',
              fontSize: '18px',
              marginBottom: '15px',
              lineHeight: '1.6',
            }}
          >
            Jeeves Clothing -verkkokauppa on tilapäisesti suljettu huoltotöiden
            vuoksi.
          </p>
          <p
            style={{
              color: '#9ca3af',
              fontSize: '16px',
              marginBottom: '25px',
            }}
          >
            Pahoittelemme aiheutunutta haittaa. Palaamme pian!
          </p>
          <div
            style={{
              padding: '15px',
              backgroundColor: '#fef3f2',
              borderRadius: '8px',
              border: '1px solid #fecaca',
            }}
          >
            <p
              style={{
                color: '#dc2626',
                fontSize: '14px',
                margin: 0,
                fontWeight: '500',
              }}
            >
              📧 Kiireellisissä asioissa: support@jeevesclothing.com
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Normaali sovellus
  console.log('✅ Palvelukatko ei ole aktiivinen, näytetään normaali sovellus');
  return children;
}

export default MaintenanceChecker;
