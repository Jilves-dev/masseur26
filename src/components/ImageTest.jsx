import React, { useEffect, useState } from 'react';

const ImageTest = () => {
  const [imageStatus, setImageStatus] = useState({});

  const testImages = [
    '/images/slider1.jpg',
    '/images/slider2.jpg',
    '/images/slider3.jpg',
    '/images/MEN.jpg',
    '/images/WOMEN.jpg',
    '/images/ACCESSORIES.jpg',
    '/images/bg_testi.jpg',
    '/images/bg2.jpg',
  ];

  useEffect(() => {
    testImages.forEach((src) => {
      const img = new Image();
      img.onload = () => {
        setImageStatus((prev) => ({ ...prev, [src]: 'loaded' }));
        console.log(`✅ Kuva latautui: ${src}`);
      };
      img.onerror = () => {
        setImageStatus((prev) => ({ ...prev, [src]: 'error' }));
        console.error(`❌ Kuva ei latautunut: ${src}`);
      };
      img.src = src;
    });
  }, []);

  return (
    <div className="p-4 bg-gray-100 m-4 rounded">
      <h2 className="text-xl font-bold mb-4">Kuvien lataustesti</h2>
      <p className="mb-4 text-sm text-gray-600">
        Lisää tämä komponentti väliaikaisesti App.jsx:ään ja tarkista konsoli.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {testImages.map((src) => (
          <div key={src} className="border rounded p-2">
            <img
              src={src}
              alt="test"
              className="w-full h-24 object-cover mb-2"
              style={{ backgroundColor: '#f0f0f0' }}
            />
            <div className="text-xs">
              <div className="font-mono">{src}</div>
              <div
                className={`mt-1 ${
                  imageStatus[src] === 'loaded'
                    ? 'text-green-600'
                    : imageStatus[src] === 'error'
                      ? 'text-red-600'
                      : 'text-yellow-600'
                }`}
              >
                {imageStatus[src] === 'loaded'
                  ? '✅ Latautunut'
                  : imageStatus[src] === 'error'
                    ? '❌ Virhe'
                    : '⏳ Ladataan...'}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-white rounded border">
        <h3 className="font-bold mb-2">Tarkistuslista:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Onko public/images/ kansio projektin juuressa?</li>
          <li>
            Ovatko tiedostonimet täsmälleen oikein? (isot/pienet kirjaimet)
          </li>
          <li>Onko kuvat oikeassa tiedostomuodossa? (.jpg, .png, .gif)</li>
          <li>
            Toimivatko kuvat kun menet selaimessa osoitteeseen:
            localhost:5173/images/slider1.jpg
          </li>
          <li>Käynnistäkö dev-serveri uudelleen kun lisäsit kuvat?</li>
        </ol>
      </div>

      <div className="mt-4 p-4 bg-blue-50 rounded border border-blue-200">
        <h3 className="font-bold text-blue-800 mb-2">
          Jos kuvat eivät vieläkään toimi:
        </h3>
        <div className="text-sm text-blue-700 space-y-2">
          <div>1. Kokeile siirtää kuvat src/assets/images/ kansioon</div>
          <div>2. Käytä import-lauseita kuvien tuomiseen</div>
          <div>3. Tarkista konsolin virheviestit Network-välilehdeltä</div>
        </div>
      </div>
    </div>
  );
};

export default ImageTest;
