import React, { useState, useEffect } from 'react';
import { seedEmulatorData, checkEmulatorData } from '../utils/seedEmulatorData';

const DevTools = () => {
  const [hasData, setHasData] = useState(null);
  const [isSeeding, setIsSeeding] = useState(false);
  const [message, setMessage] = useState('');

  // Tarkista dataa kehitystilassa
  useEffect(() => {
    const checkData = async () => {
      if (import.meta.env.DEV) {
        const dataExists = await checkEmulatorData();
        setHasData(dataExists);

        if (!dataExists) {
          setMessage('⚠️ Emulaattorissa ei ole dataa');
        }
      }
    };

    checkData();
  }, []);

  const handleSeedData = async () => {
    setIsSeeding(true);
    setMessage('🌱 Ladataan dataa...');

    try {
      const result = await seedEmulatorData();

      if (result.success) {
        setMessage(`✅ Ladattu ${result.count} tuotetta!`);
        setHasData(true);

        // Päivitä sivu 2 sekunnin kuluttua
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setMessage(`❌ Virhe: ${result.error}`);
      }
    } catch (error) {
      setMessage(`❌ Virhe: ${error.message}`);
    } finally {
      setIsSeeding(false);
    }
  };

  // Näytä vain kehitystilassa
  if (!import.meta.env.DEV) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: '#1e293b',
        color: 'white',
        padding: '16px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        zIndex: 9999,
        minWidth: '250px',
        fontSize: '14px',
      }}
    >
      <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
        🛠️ Dev Tools (Emulaattori)
      </div>

      {hasData === null ? (
        <div>Tarkistetaan dataa...</div>
      ) : hasData ? (
        <div style={{ color: '#10b981' }}>✅ Data OK</div>
      ) : (
        <div>
          <div style={{ marginBottom: '12px', color: '#f59e0b' }}>
            {message}
          </div>
          <button
            onClick={handleSeedData}
            disabled={isSeeding}
            style={{
              backgroundColor: isSeeding ? '#64748b' : '#3b82f6',
              color: 'white',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              cursor: isSeeding ? 'not-allowed' : 'pointer',
              width: '100%',
              fontWeight: 'bold',
            }}
          >
            {isSeeding ? 'Ladataan...' : '🌱 Lataa testidata'}
          </button>
        </div>
      )}

      {message && hasData && (
        <div
          style={{
            marginTop: '8px',
            fontSize: '12px',
            color: '#10b981',
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default DevTools;
