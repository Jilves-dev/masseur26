// src/components/Maintenance.jsx
import React from 'react';

const Maintenance = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#eceef1]">
      <div className="text-center p-8 max-w-2xl">
        <div className="mb-6">
          <h1 className="font-racingSansOne text-4xl font-bold text-[#e31837] mb-4">
            🔧 Huoltokatko
          </h1>
          <p className="font-oswaldVariable text-xl text-[#333f48] mb-4">
            Sivusto on tilapäisesti huollossa
          </p>
          <p className="font-oswaldVariable text-gray-600">
            Pahoittelemme häiriötä. Palaamme pian takaisin!
          </p>
        </div>
        <div className="font-oswaldVariable mt-8 text-sm text-gray-500">Odotettu paluu: Pian⚡</div>
      </div>
    </div>
  );
};

export default Maintenance;
