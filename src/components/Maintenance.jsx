// src/components/Maintenance.jsx
import React from 'react';

const Maintenance = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFAF0]">
      <div className="text-center p-8 max-w-2xl">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-[#A30B2E] mb-4">
            🔧 Huoltokatko
          </h1>
          <p className="text-xl text-[#A30B2E] mb-4">
            Sivusto on tilapäisesti huollossa
          </p>
          <p className="text-gray-600">
            Pahoittelemme häiriötä. Palaamme pian takaisin!
          </p>
        </div>
        <div className="mt-8 text-sm text-gray-500">Odotettu paluu: Pian⚡</div>
      </div>
    </div>
  );
};

export default Maintenance;
