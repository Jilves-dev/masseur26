// Korjattu vismapay.js - Oikeat API-osoitteet
const config = require('./config');
const crypto = require('crypto');
const axios = require('axios');

// LISÄTTY: Yksinkertainen logger, joka toimii vain kehitystilassa
const DEBUG = process.env.FUNCTIONS_EMULATOR === 'true' || process.env.NODE_ENV === 'development';
const log = (...args) => {
  if (DEBUG) {
    console.log(...args);
  }
};

// KORJATTU: Oikeat Visma Pay API endpoints
const API_ENDPOINTS = {
  production: 'https://www.vismapay.com/pbwapi',
  development: 'https://www.vismapay.com/pbwapi'  // Myös kehitysversio käyttää samaa
};

log('=== VISMA PAY MODULE INIT ===');

// Hae konfiguraatio
const vismapayConfig = config.vismapay;
const MERCHANT_ID = vismapayConfig.merchant_id;
const API_KEY = vismapayConfig.api_key;
const PRIVATE_KEY = vismapayConfig.private_key;
const ENVIRONMENT = vismapayConfig.environment || 'development';

// KORJATTU: Käytä oikeaa endpoint:ia
const apiEndpoint = API_ENDPOINTS[ENVIRONMENT];

log('=== VISMA PAY CONFIGURATION ===', {
  Environment: ENVIRONMENT,
  'API Endpoint': apiEndpoint,
  'API_KEY set': !!API_KEY,
  'PRIVATE_KEY set': !!PRIVATE_KEY,
});

// KORJATTU authcode-funktio - käyttää HMAC-SHA256
function createAuthCode(apiKey, privateKey, orderNumber) {
  
  if (!apiKey || !privateKey || !orderNumber) {
    throw new Error('API_KEY, PRIVATE_KEY ja ORDER_NUMBER vaaditaan authcode-laskentaan');
  }

  // Visma Pay:n ohje: api_key|order_number
  const message = `${apiKey}|${orderNumber}`;
  
  // HMAC-SHA256
  const authCode = crypto
    .createHmac('sha256', privateKey)
    .update(message, 'utf8')
    .digest('hex')
    .toUpperCase();
  
  return authCode;
}

// Visma Pay -maksun luonti
exports.createPayment = async function(data) {
  try {
    const { orderId, amount, products, customer, return_url, notify_url } = data;
    
    if (!orderId || !amount || !products || !customer) {
      throw new Error('Puutteelliset tiedot: orderId, amount, products ja customer vaaditaan.');
    }

    if (!MERCHANT_ID || !API_KEY || !PRIVATE_KEY) {
      throw new Error('Visma Pay konfiguraatio puutteellinen');
    }

    // Laske kokonaissumma
    let calculatedTotal = 0;
    
    const orderDetails = products.map(item => {
      const productId = item.productCode || `PROD-${item.id || Date.now()}`;
      const unitPriceIncludingTax = item.price;
      // KORJATTU: Käytä tuotekohtaista ALV-prosenttia, jos se on määritelty.
      // Oletusarvona 24% jos tietoa ei ole.
      const vatRate = typeof item.vatRate === 'number' ? item.vatRate : 0.24;
      const unitPriceExcludingTax = unitPriceIncludingTax / (1 + vatRate);
      
      calculatedTotal += unitPriceIncludingTax * item.quantity;

      return {
        id: productId,
        title: item.title,
        count: item.quantity,
        pretax_price: Math.round(unitPriceExcludingTax * 100),
        tax: Math.round(vatRate * 100),
        price: Math.round(unitPriceIncludingTax * 100),
        type: 1
      };
    });

    // Lisää toimitusmaksu
    if (data.shippingFee && data.shippingFee > 0) {
      const shippingFeeInCents = Math.round(data.shippingFee * 100);
      const shippingVatRate = 1.24; // Oletetaan 24% ALV

      calculatedTotal += data.shippingFee;
      
      orderDetails.push({
        id: "SHIPPING",
        title: "Toimitus",
        count: 1,
        pretax_price: Math.round(shippingFeeInCents / shippingVatRate),
        tax: 24,
        price: shippingFeeInCents,
        type: 2
      });
    }

    const amountInCents = Math.round(calculatedTotal * 100);

    // KORJATTU: Käytä oikeaa API-versiota ja muotoa
    const paymentData = {
      version: 'w3.2',
      api_key: API_KEY,
      order_number: orderId,
      amount: amountInCents,
      currency: "EUR",
      email: customer.email,
      payment_method: {
        type: "e-payment",
        return_url: return_url,
        notify_url: notify_url,
        lang: "fi"
      },
      customer: {
        firstname: customer.firstName,
        lastname: customer.lastName,
        email: customer.email,
        address_street: customer.address,
        address_city: customer.city,
        address_zip: customer.postalCode,
        address_country: customer.country
      },
      products: orderDetails
    };

    // Luo authcode
    const authCode = createAuthCode(API_KEY, PRIVATE_KEY, orderId);
    paymentData.authcode = authCode;

    log('=== SENDING TO VISMA PAY ===', `${apiEndpoint}/auth_payment`, {
      ...paymentData,
      authcode: authCode.substring(0, 16) + '...'
    });

    // KORJATTU: Käytä oikeaa Content-Type:a
    const response = await axios.post(`${apiEndpoint}/auth_payment`, paymentData, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // LISÄTTY: Ammattimainen User-Agent kertoo API:lle, kuka olet.
        'User-Agent': 'FreewheelBikes-Webshop/1.0.0'
      },
      timeout: 30000,
      // LISÄTTY: Älä seuraa uudelleenohjauksia automaattisesti
      maxRedirects: 0,
      validateStatus: function (status) {
        return status >= 200 && status < 400; // Hyväksy 200-399
      }
    });

    log('=== VISMA PAY RESPONSE ===', { status: response.status, data: response.data });

    // Tarkista vastaus
    if (typeof response.data === 'string' && response.data.includes('<html>')) {
      log.error('Got HTML response instead of JSON - possible authentication issue');
      throw new Error('Virheellinen vastaus Visma Pay:ltä - HTML-sivu JSON:n sijaan');
    }

    if (response.data.result !== 0) {
      log.error('Visma Pay error:', response.data);
      const errorMessage = response.data.errors?.[0] || response.data.message || 'Tuntematon virhe';
      throw new Error(`Maksun luonti epäonnistui: ${response.data.result} - ${errorMessage}`);
    }

    if (!response.data.token) {
      log.error('Invalid response from Visma Pay - missing token');
      throw new Error('Virheellinen vastaus Visma Pay:ltä - token puuttuu');
    }

    // Rakennetaan maksusivun URL
    let paymentUrl = response.data.url;
    if (!paymentUrl) {
      paymentUrl = `https://www.vismapay.com/pbwapi/token/${response.data.token}`;
      log('Built payment URL:', paymentUrl);
    }

    return {
      success: true,
      token: response.data.token,
      url: paymentUrl
    };

  } catch (error) {
    log.error('=== VISMA PAY ERROR ===');
    log.error('Error type:', error.constructor.name);
    log.error('Error message:', error.message);
    
    if (error.response) {
      log.error('HTTP Status:', error.response.status);
      log.error('Response headers:', error.response.headers);
      log.error('Response data:', error.response.data);
    }
    
    throw error;
  }
};

// KORJATTU: MAC-laskenta webhook-validointiin Visma Payn dokumentaation mukaisesti
function calculateReturnMAC(params, privateKey) {
  // Dokumentaation mukaiset kentät OIKEASSA JÄRJESTYKSESSÄ
  const macParams = [
    'ORDER_NUMBER',
    'PAYMENT_ID',
    'AMOUNT',
    'CURRENCY',
    'PAYMENT_METHOD',
    'TIMESTAMP',
    'STATUS',
  ];

  // Muodosta merkkijono arvoista, jotka ovat mukana pyynnössä.
  const message = macParams
    .map(param => params[param])
    .filter(value => value !== undefined && value !== null && value !== '')
    .join('|');

  // Käytä HMAC-SHA256, EI pelkkää SHA256. Avain on toinen parametri, ei osa viestiä.
  return crypto
    .createHmac('sha256', privateKey)
    .update(message, 'utf8')
    .digest('hex')
    .toUpperCase();
}

exports.calculateReturnMAC = calculateReturnMAC;
