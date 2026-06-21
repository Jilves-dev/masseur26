// Lataa .env tiedosto paikallisessa kehityksessä
if (process.env.FUNCTIONS_EMULATOR) {
  require('dotenv').config();
}

console.log('=== CONFIG DEBUG ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('FUNCTIONS_EMULATOR:', process.env.FUNCTIONS_EMULATOR);

// 2nd gen käyttää suoraan environment variableja (.env tiedostosta)
const vismapayConfig = {
  merchant_id: process.env.VISMAPAY_MERCHANT_ID,
  api_key: process.env.VISMAPAY_API_KEY,
  private_key: process.env.VISMAPAY_PRIVATE_KEY,
  environment: process.env.VISMAPAY_ENVIRONMENT || 'production',
  return_url_base: process.env.VISMAPAY_RETURN_URL_BASE || 'https://masseur26-49a1e.web.app'
};

console.log('=== VISMA PAY CONFIG CHECK ===');
console.log('merchant_id length:', vismapayConfig.merchant_id?.length || 0);
console.log('api_key length:', vismapayConfig.api_key?.length || 0);
console.log('private_key length:', vismapayConfig.private_key?.length || 0);
console.log('environment:', vismapayConfig.environment);
console.log('return_url_base:', vismapayConfig.return_url_base);

// Tarkista että kaikki tarvittavat kentät ovat määritelty
const missingFields = [];
if (!vismapayConfig.merchant_id) missingFields.push('merchant_id');
if (!vismapayConfig.api_key) missingFields.push('api_key');
if (!vismapayConfig.private_key) missingFields.push('private_key');

if (missingFields.length > 0) {
  console.error('=== MISSING VISMA PAY CONFIG ===');
  console.error('Missing fields:', missingFields);
  console.error('Set these in .env file');
}

// Paytrail konfiguraatio
const paytrailConfig = {
  merchant_id: process.env.PAYTRAIL_MERCHANT_ID,
  secret_key: process.env.PAYTRAIL_SECRET_KEY,
  environment: process.env.PAYTRAIL_ENVIRONMENT || 'development'
};

console.log('=== PAYTRAIL CONFIG CHECK ===');
console.log('merchant_id length:', paytrailConfig.merchant_id?.length || 0);
console.log('secret_key length:', paytrailConfig.secret_key?.length || 0);
console.log('environment:', paytrailConfig.environment);

// Tarkista Paytrail-kentät
const missingPaytrailFields = [];
if (!paytrailConfig.merchant_id) missingPaytrailFields.push('merchant_id');
if (!paytrailConfig.secret_key) missingPaytrailFields.push('secret_key');

if (missingPaytrailFields.length > 0) {
  console.error('=== MISSING PAYTRAIL CONFIG ===');
  console.error('Missing fields:', missingPaytrailFields);
  console.error('Set these in .env file');
}

module.exports = {
  vismapay: vismapayConfig,
  paytrail: paytrailConfig
};


