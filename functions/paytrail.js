// Paytrail API integraatio - KORJATTU VERSIO
const config = require('./config');
const crypto = require('crypto');
const axios = require('axios');

const DEBUG = process.env.FUNCTIONS_EMULATOR === 'true' || process.env.NODE_ENV === 'development';
const log = (...args) => {
  if (DEBUG) {
    console.log(...args);
  }
};

// Paytrail API endpoints
const API_ENDPOINTS = {
  production: 'https://services.paytrail.com',
  development: 'https://services.paytrail.com'
};

log('=== PAYTRAIL MODULE INIT ===');

// Hae konfiguraatio
const paytrailConfig = config.paytrail;
const MERCHANT_ID = paytrailConfig.merchant_id;
const SECRET_KEY = paytrailConfig.secret_key;
const ENVIRONMENT = paytrailConfig.environment || 'development';

const apiEndpoint = API_ENDPOINTS[ENVIRONMENT];

log('=== PAYTRAIL CONFIGURATION ===', {
  Environment: ENVIRONMENT,
  'API Endpoint': apiEndpoint,
  'Merchant ID': MERCHANT_ID,
  'SECRET_KEY length': SECRET_KEY?.length,
  'SECRET_KEY set': !!SECRET_KEY,
});

/**
 * Laskee HMAC-SHA256 allekirjoituksen Paytrail API:lle
 * TÄRKEÄÄ: Headerit TÄYTYY olla TÄSSÄ järjestyksessä!
 */
function calculateSignature(secret, headers, body = '') {
  // Headerit TÄSMÄLLEEN tässä järjestyksessä (Paytrail vaatii tämän)
  const headerKeys = [
    'checkout-account',
    'checkout-algorithm',
    'checkout-method',
    'checkout-nonce',
    'checkout-timestamp'
  ];

  // Muodosta header-string
  const headerString = headerKeys
    .map(key => {
      const value = headers[key];
      if (value === undefined) {
        throw new Error(`Missing required header: ${key}`);
      }
      return `${key}:${value}`;
    })
    .join('\n');

  log('=== SIGNATURE CALCULATION ===');
  log('Header string:', headerString);
  log('Body:', body.substring(0, 100) + '...');

  // Muodosta allekirjoitettava string: headerString + '\n' + body
  const dataToSign = headerString + '\n' + body;
  
  log('Data to sign (first 200 chars):', dataToSign.substring(0, 200));

  // Laske HMAC-SHA256
  const signature = crypto
    .createHmac('sha256', secret)
    .update(dataToSign, 'utf8')
    .digest('hex');

  log('Calculated signature:', signature);

  return signature;
}

/**
 * Luo uuden maksun Paytrail API:ssa
 */
exports.createPayment = async function(data) {
  try {
    const { orderId, amount, products, customer, return_url, notify_url } = data;
    
    if (!orderId || !amount || !products || !customer) {
      throw new Error('Puutteelliset tiedot: orderId, amount, products ja customer vaaditaan.');
    }

    if (!MERCHANT_ID || !SECRET_KEY) {
      throw new Error('Paytrail konfiguraatio puutteellinen');
    }

    // Laske kokonaissumma ja muodosta tuotelista
    let calculatedTotal = 0;
    
    const items = products.map(item => {
      const unitPrice = parseFloat(item.price) * 100; // senteiksi
      const vatRate = typeof item.vatRate === 'number' ? item.vatRate : 24;
      
      calculatedTotal += (item.price * item.quantity);

      return {
        unitPrice: Math.round(unitPrice),
        units: item.quantity,
        vatPercentage: vatRate,
        productCode: item.productCode || `PROD-${item.id || Date.now()}`,
        description: item.title || item.name || 'Tuote'
      };
    });

    // Lisää toimitusmaksu
    if (data.shippingFee && data.shippingFee > 0) {
      calculatedTotal += data.shippingFee;
      
      items.push({
        unitPrice: Math.round(data.shippingFee * 100),
        units: 1,
        vatPercentage: 24,
        productCode: "SHIPPING",
        description: "Toimitus"
      });
    }

    const amountInCents = Math.round(calculatedTotal * 100);

    // Paytrail payment request body
    const timestamp = new Date().toISOString();
    const nonce = crypto.randomBytes(16).toString('hex');
    
    const requestBody = {
      stamp: orderId,
      reference: orderId,
      amount: amountInCents,
      currency: "EUR",
      language: "FI",
      items: items,
      customer: {
        email: customer.email,
        firstName: customer.firstName || '',
        lastName: customer.lastName || '',
        phone: customer.phone || '',
        vatId: ''
      },
      deliveryAddress: {
        streetAddress: customer.address || '',
        postalCode: customer.postalCode || '',
        city: customer.city || '',
        country: customer.country || 'FI'
      },
      invoicingAddress: {
        streetAddress: customer.address || '',
        postalCode: customer.postalCode || '',
        city: customer.city || '',
        country: customer.country || 'FI'
      },
      redirectUrls: {
        success: return_url,
        cancel: return_url
      },
      callbackUrls: {
        success: notify_url,
        cancel: notify_url
      }
    };

    const requestBodyString = JSON.stringify(requestBody);
    
    // Muodosta headers TÄSSÄ järjestyksessä
    const headers = {
      'checkout-account': MERCHANT_ID,
      'checkout-algorithm': 'sha256',
      'checkout-method': 'POST',
      'checkout-nonce': nonce,
      'checkout-timestamp': timestamp
    };

    // Laske signature
    const signature = calculateSignature(SECRET_KEY, headers, requestBodyString);

    // Lisää signature ja content-type
    const requestHeaders = {
      ...headers,
      'signature': signature,
      'content-type': 'application/json; charset=utf-8'
    };

    log('=== SENDING TO PAYTRAIL ===');
    log('URL:', `${apiEndpoint}/payments`);
    log('Headers:', {
      'checkout-account': requestHeaders['checkout-account'],
      'checkout-algorithm': requestHeaders['checkout-algorithm'],
      'checkout-method': requestHeaders['checkout-method'],
      'checkout-nonce': requestHeaders['checkout-nonce'].substring(0, 8) + '...',
      'checkout-timestamp': requestHeaders['checkout-timestamp'],
      'signature': requestHeaders['signature'].substring(0, 16) + '...'
    });
    log('Body preview:', {
      stamp: requestBody.stamp,
      amount: requestBody.amount,
      currency: requestBody.currency,
      itemCount: requestBody.items.length
    });

    // Lähetä pyyntö
    const response = await axios.post(
      `${apiEndpoint}/payments`,
      requestBodyString,
      { headers: requestHeaders }
    );

    log('=== PAYTRAIL RESPONSE ===');
    log('Status:', response.status);
    log('Transaction ID:', response.data.transactionId);

    if (!response.data.transactionId || !response.data.href) {
      throw new Error('Virheellinen vastaus Paytrailista - transaction ID tai href puuttuu');
    }

    return {
      success: true,
      transactionId: response.data.transactionId,
      url: response.data.href,
      reference: response.data.reference
    };

  } catch (error) {
    log('=== PAYTRAIL ERROR ===');
    log('Error type:', error.constructor.name);
    log('Error message:', error.message);
    
    if (error.response) {
      log('HTTP Status:', error.response.status);
      log('Response headers:', error.response.headers);
      log('Response data:', JSON.stringify(error.response.data, null, 2));
    }
    
    throw error;
  }
};

/**
 * Validoi Paytrail webhook signature
 */
exports.validateSignature = function(params, signature, secret) {
  try {
    // Paytrail webhook parametrit
    const filteredParams = { ...params };
    delete filteredParams.signature;
    
    // Järjestä parametrit aakkosjärjestykseen
    const sortedKeys = Object.keys(filteredParams).sort();
    
    // Muodosta allekirjoitettava string
    const paramsString = sortedKeys
      .map(key => `${key}:${filteredParams[key]}`)
      .join('\n');

    log('=== WEBHOOK SIGNATURE VALIDATION ===');
    log('Params string:', paramsString);
    log('Received signature:', signature);

    // Laske signature
    const calculatedSignature = crypto
      .createHmac('sha256', secret)
      .update(paramsString, 'utf8')
      .digest('hex');

    log('Calculated signature:', calculatedSignature);
    log('Signatures match:', calculatedSignature === signature);

    return calculatedSignature === signature;
    
  } catch (error) {
    log('Signature validation error:', error);
    return false;
  }
};