// 2nd Gen Firebase Functions - KORJATTU versio Cloud Run:ille
const { onRequest } = require('firebase-functions/v2/https');
const admin = require('firebase-admin');
const { FieldValue } = require('firebase-admin/firestore');
const crypto = require('crypto');
const cors = require('cors');

// Alusta Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp();
}

// CORS konfiguraatio 2nd gen:lle - KORJATTU
const corsHandler = cors({
  origin: function (origin, callback) {
    // Salli requests ilman originia (esim. mobile apps, curl)
    if (!origin) return callback(null, true);
    
    let allowedOrigins = [
      'https://masseur26-49a1e.web.app',
      'https://masseur26-49a1e.firebaseapp.com'
    ];
    
    // Salli localhost vain emulaattorissa
    if (process.env.FUNCTIONS_EMULATOR) {
      allowedOrigins = allowedOrigins.concat([
        'http://localhost:5000',
        'http://127.0.0.1:5000',
        'http://localhost:5173',
        'http://127.0.0.1:5173'
      ]);
    }
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error('CORS blocked for origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
});

const db = admin.firestore();

// ============================================
// VISMA PAY - Maksun luonti
// ============================================
exports.createPayment = onRequest({
  region: 'europe-north1',
  timeoutSeconds: 540,
  memory: '256MiB',
  maxInstances: 100
}, async (req, res) => {
  corsHandler(req, res, async () => {
    try {
      const vismapay = require('./vismapay');
      console.log('=== CREATE PAYMENT REQUEST ===');
      console.log('Method:', req.method);
      console.log('Origin:', req.headers.origin);

      if (req.method !== 'POST') {
        console.log('Invalid method:', req.method);
        return res.status(405).json({ error: 'Method not allowed' });
      }

      console.log('Request body:', JSON.stringify(req.body, null, 2));

      const { orderId, amount, products, customerDetails, shippingFee, userId } = req.body;

      // Validoi syötteet
      if (!orderId || !amount || !products || !customerDetails || !userId) {
        console.log('Missing required fields');
        return res.status(400).json({ 
          error: 'Puutteelliset tiedot',
          missing: {
            orderId: !orderId,
            amount: !amount,
            products: !products,
            customerDetails: !customerDetails,
            userId: !userId
          }
        });
      }

      // ⭐ KORJATTU: baseUrl kehitys- ja tuotantoympäristölle
      let baseUrl;
      if (process.env.FUNCTIONS_EMULATOR === 'true') {
        // Kehitysympäristö: Käytä Cloudflare/ngrok URL:ää
        baseUrl = process.env.CLOUDFLARE_URL || process.env.NGROK_URL || 'http://localhost:5173';
        console.log('🔧 Using tunnel URL for development:', baseUrl);
      } else {
        // Tuotanto: Käytä Firebase Hosting URL:ää
        baseUrl = req.headers.origin || 'https://masseur26-49a1e.web.app';
      }

      const return_url = `${baseUrl}/order-confirmation/${orderId}`;
      const notify_url = `${baseUrl}/api/vismapay-webhook`;

      console.log('URLs:', { return_url, notify_url });

      // Valmistele maksudata vismapay.js:lle
      const paymentData = {
        orderId,
        amount,
        products,
        customer: {
          firstName: customerDetails.firstName,
          lastName: customerDetails.lastName,
          email: customerDetails.email,
          address: customerDetails.address,
          city: customerDetails.city,
          postalCode: customerDetails.postalCode,
          country: customerDetails.country || 'Finland'
        },
        shippingFee: shippingFee || 0,
        return_url,
        notify_url
      };

      console.log('Calling vismapay.createPayment...');

      // Kutsu Visma Pay -palvelua
      const result = await vismapay.createPayment(paymentData);

      // Tallenna tilaus säilyttäen alkuperäiset kentät
      const existingOrderRef = db.collection('orders').doc(orderId);

      const orderUpdateData = {
        paymentToken: result.token,
        paymentUrl: result.url,
        status: 'pending',
        updatedAt: FieldValue.serverTimestamp()
      };

      await existingOrderRef.update(orderUpdateData);
      
      console.log('Order updated with payment info:', orderId);

      // Palauta maksulinkki
      return res.status(200).json({
        success: true,
        paymentUrl: result.url,
        token: result.token,
        orderId: orderId
      });

    } catch (error) {
      console.error('=== PAYMENT CREATION ERROR ===');
      console.error('Error:', error.message);
      console.error('Stack:', error.stack);
      
      return res.status(500).json({ 
        error: 'Maksun luonti epäonnistui',
        details: error.message 
      });
    }
  });
});

// ============================================
// VISMA PAY - Webhook
// ============================================
exports.vismapayWebhook = onRequest({
  region: 'europe-north1',
  timeoutSeconds: 120,
  memory: '256MiB'
}, async (req, res) => {
  corsHandler(req, res, async () => {
    try {
      const vismapay = require('./vismapay');
      console.log('=== VISMA PAY WEBHOOK ===');
      console.log('Method:', req.method);
      console.log('Headers:', req.headers);
      console.log('Body:', req.body);
      
      const { RETURN_AUTHCODE, ...params } = req.body;
      const expectedMAC = vismapay.calculateReturnMAC(params, process.env.VISMAPAY_PRIVATE_KEY);

      if (!RETURN_AUTHCODE || !crypto.timingSafeEqual(Buffer.from(expectedMAC), Buffer.from(RETURN_AUTHCODE))) {
        console.log('Invalid MAC in webhook. Expected:', expectedMAC, 'Got:', RETURN_AUTHCODE);
        return res.status(400).send('Invalid MAC');
      }
      
      const { ORDER_NUMBER, STATUS } = req.body;
      
      if (ORDER_NUMBER && STATUS) {
        const orderRef = db.collection('orders').doc(ORDER_NUMBER);
        const orderDoc = await orderRef.get();
        
        if (orderDoc.exists) {
          const existingData = orderDoc.data();
          
          console.log('=== PRESERVING ORDER DATA ===');
          console.log('Existing data keys:', Object.keys(existingData));
          
          const updateData = {
            status: STATUS.toLowerCase(),
            updatedAt: FieldValue.serverTimestamp(),
            webhookData: req.body,
            webhookTimestamp: new Date()
          };

          if (!existingData.userId && existingData.user?.uid) {
            updateData.userId = existingData.user.uid;
            console.log('Added missing userId from user.uid:', existingData.user.uid);
          }
          
          await orderRef.update(updateData);
          
          console.log(`Order ${ORDER_NUMBER} status updated to ${STATUS}, original data preserved`);
        } else {
          console.log(`Order ${ORDER_NUMBER} not found in database`);
        }
      }
      
      return res.status(200).send('OK');
    } catch (error) {
      console.error('Webhook error:', error);
      return res.status(500).send('Error');
    }
  });
});

// ============================================
// PAYTRAIL - Maksun luonti
// ============================================
exports.createPaytrailPayment = onRequest({
  region: 'europe-north1',
  timeoutSeconds: 540,
  memory: '256MiB',
  maxInstances: 100
}, async (req, res) => {
  corsHandler(req, res, async () => {
    try {
      const paytrail = require('./paytrail');
      console.log('=== CREATE PAYTRAIL PAYMENT REQUEST ===');
      console.log('Method:', req.method);
      console.log('Origin:', req.headers.origin);

      if (req.method !== 'POST') {
        console.log('Invalid method:', req.method);
        return res.status(405).json({ error: 'Method not allowed' });
      }

      console.log('Request body:', JSON.stringify(req.body, null, 2));

      const { orderId, amount, products, customerDetails, shippingFee, userId } = req.body;

      if (!orderId || !amount || !products || !customerDetails || !userId) {
        console.log('Missing required fields');
        return res.status(400).json({ 
          error: 'Puutteelliset tiedot',
          missing: {
            orderId: !orderId,
            amount: !amount,
            products: !products,
            customerDetails: !customerDetails,
            userId: !userId
          }
        });
      }

      // ⭐ KORJATTU: baseUrl kehitys- ja tuotantoympäristölle
      let baseUrl;
      if (process.env.FUNCTIONS_EMULATOR === 'true') {
        // Kehitysympäristö: Käytä Cloudflare/ngrok URL:ää
        baseUrl = process.env.CLOUDFLARE_URL || process.env.NGROK_URL || 'http://localhost:5173';
        console.log('🔧 Using tunnel URL for development:', baseUrl);
      } else {
        // Tuotanto: Käytä Firebase Hosting URL:ää
        baseUrl = req.headers.origin || 'https://masseur26-49a1e.web.app';
      }

      const return_url = `${baseUrl}/order-confirmation/${orderId}`;
      const notify_url = `${baseUrl}/api/paytrail-webhook`;

      console.log('URLs:', { return_url, notify_url });

      const paymentData = {
        orderId,
        amount,
        products,
        customer: {
          firstName: customerDetails.firstName,
          lastName: customerDetails.lastName,
          email: customerDetails.email,
          address: customerDetails.address,
          city: customerDetails.city,
          postalCode: customerDetails.postalCode,
          country: customerDetails.country || 'FI'
        },
        shippingFee: shippingFee || 0,
        return_url,
        notify_url
      };

      console.log('Calling paytrail.createPayment...');

      const result = await paytrail.createPayment(paymentData);

      // Päivitä tilaus Paytrail-tiedoilla
      const existingOrderRef = db.collection('orders').doc(orderId);
      
      const orderUpdateData = {
        paymentProvider: 'paytrail',
        paymentTransactionId: result.transactionId,
        paymentUrl: result.url,
        status: 'pending',
        updatedAt: FieldValue.serverTimestamp()
      };

      await existingOrderRef.update(orderUpdateData);
      
      console.log('Order updated with Paytrail payment info:', orderId);

      return res.status(200).json({
        success: true,
        paymentUrl: result.url,
        transactionId: result.transactionId,
        orderId: orderId
      });

    } catch (error) {
      console.error('=== PAYTRAIL PAYMENT CREATION ERROR ===');
      console.error('Error:', error.message);
      console.error('Stack:', error.stack);
      
      return res.status(500).json({ 
        error: 'Paytrail maksun luonti epäonnistui',
        details: error.message 
      });
    }
  });
});

// ============================================
// PAYTRAIL - Webhook
// ============================================
exports.paytrailWebhook = onRequest({
  region: 'europe-north1',
  timeoutSeconds: 120,
  memory: '256MiB'
}, async (req, res) => {
  corsHandler(req, res, async () => {
    try {
      const paytrail = require('./paytrail');
      console.log('=== PAYTRAIL WEBHOOK ===');
      console.log('Method:', req.method);
      console.log('Query params:', req.query);
      
      const params = req.method === 'GET' ? req.query : req.body;
      const signature = params.signature;
      
      // Validoi signature
      const isValid = paytrail.validateSignature(
        params,
        signature,
        process.env.PAYTRAIL_SECRET_KEY
      );

      if (!isValid) {
        console.log('Invalid signature in Paytrail webhook');
        return res.status(400).send('Invalid signature');
      }
      
      // Käsittele webhook
      const { 'checkout-reference': orderNumber, 'checkout-status': status } = params;
      
      if (orderNumber && status) {
        const orderRef = db.collection('orders').doc(orderNumber);
        const orderDoc = await orderRef.get();
        
        if (orderDoc.exists) {
          const existingData = orderDoc.data();
          
          console.log('=== UPDATING PAYTRAIL ORDER STATUS ===');
          console.log('Order:', orderNumber);
          console.log('Status:', status);
          
          const updateData = {
            status: status === 'ok' ? 'paid' : status === 'fail' ? 'failed' : 'pending',
            updatedAt: FieldValue.serverTimestamp(),
            paytrailWebhookData: params,
            webhookTimestamp: new Date()
          };

          if (!existingData.userId && existingData.user?.uid) {
            updateData.userId = existingData.user.uid;
          }
          
          await orderRef.update(updateData);
          
          console.log(`Paytrail order ${orderNumber} status updated to ${status}`);
        } else {
          console.log(`Order ${orderNumber} not found in database`);
        }
      }
      
      return res.status(200).send('OK');
    } catch (error) {
      console.error('Paytrail webhook error:', error);
      return res.status(500).send('Error');
    }
  });
});

// ============================================
// Hae tilaukset
// ============================================
exports.getOrders = onRequest({
  region: 'europe-north1',
  timeoutSeconds: 60,
  memory: '256MiB'
}, async (req, res) => {
  corsHandler(req, res, async () => {
    try {
      const orders = await db.collection('orders').get();
      const ordersList = orders.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      return res.status(200).json(ordersList);
    } catch (error) {
      console.error('Error fetching orders:', error);
      return res.status(500).json({ error: 'Failed to fetch orders' });
    }
  });
});

// ============================================
// Debug-funktio
// ============================================
exports.debugPayment = onRequest({
  region: 'europe-north1',
  timeoutSeconds: 60,
  memory: '256MiB'
}, async (req, res) => {
  corsHandler(req, res, async () => {
    try {
      console.log('=== DEBUG TEST ===');
      
      // Testaa vismapay moduulin lataamista
      let vismapayTest;
      try {
        vismapayTest = require('./vismapay');
        console.log('Vismapay module loaded successfully');
        console.log('Vismapay functions:', Object.keys(vismapayTest));
      } catch (error) {
        console.error('Vismapay module loading failed:', error.message);
        return res.status(500).json({ 
          error: 'Vismapay module failed to load',
          details: error.message 
        });
      }
      
      // Testaa Firestore yhteyttä
      try {
        await db.collection('test').doc('test').set({ timestamp: new Date() });
        console.log('Firestore connection OK');
      } catch (error) {
        console.error('Firestore connection failed:', error.message);
      }
      
      return res.status(200).json({
        message: 'Debug test completed',
        timestamp: new Date().toISOString(),
        hasVismapay: !!vismapayTest,
        environment: process.env.NODE_ENV,
        vismapayConfig: {
          hasApiKey: !!process.env.VISMAPAY_API_KEY,
          hasPrivateKey: !!process.env.VISMAPAY_PRIVATE_KEY,
          hasMerchantId: !!process.env.VISMAPAY_MERCHANT_ID
        }
      });
      
    } catch (error) {
      console.error('Debug test error:', error);
      return res.status(500).json({ 
        error: 'Debug test failed',
        details: error.message 
      });
    }
  });
});






















// 2nd Gen Firebase Functions - KORJATTU versio Cloud Run:ille
{/*const { onRequest } = require('firebase-functions/v2/https');
const admin = require('firebase-admin');
const { FieldValue } = require('firebase-admin/firestore');
const crypto = require('crypto');
const cors = require('cors');
const paytrail = require('./paytrail');

// Alusta Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp();
}

// CORS konfiguraatio 2nd gen:lle - KORJATTU
const corsHandler = cors({
  origin: function (origin, callback) {
    // Salli requests ilman originia (esim. mobile apps, curl)
    if (!origin) return callback(null, true);
    
    let allowedOrigins = [
      'https://bike26-2ffd8.web.app',
      'https://bike26-2ffd8.firebaseapp.com'
    ];
    
    // Salli localhost vain emulaattorissa
    if (process.env.FUNCTIONS_EMULATOR) {
      allowedOrigins = allowedOrigins.concat([
        'http://localhost:5000',
        'http://127.0.0.1:5000',
        'http://localhost:5173',
        'http://127.0.0.1:5173'
      ]);
    }
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error('CORS blocked for origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
});

// Tuo vismapay-moduuli
//const vismapay = require('./vismapay');
const db = admin.firestore();

// functions

exports.createPayment = onRequest({
  region: 'europe-north1',
  timeoutSeconds: 540,
  memory: '256MiB',
  maxInstances: 100
}, async (req, res) => {
  corsHandler(req, res, async () => {
    try {
      const vismapay = require('./vismapay');
      console.log('=== CREATE PAYMENT REQUEST ===');
      console.log('Method:', req.method);
      console.log('Origin:', req.headers.origin);

      if (req.method !== 'POST') {
        console.log('Invalid method:', req.method);
        return res.status(405).json({ error: 'Method not allowed' });
      }

      console.log('Request body:', JSON.stringify(req.body, null, 2));

      const { orderId, amount, products, customerDetails, shippingFee, userId } = req.body;

      // Validoi syötteet - LISÄTTY userId validointi
      if (!orderId || !amount || !products || !customerDetails || !userId) {
        console.log('Missing required fields');
        return res.status(400).json({ 
          error: 'Puutteelliset tiedot',
          missing: {
            orderId: !orderId,
            amount: !amount,
            products: !products,
            customerDetails: !customerDetails,
            userId: !userId
          }
        });
      }

      // Luo return_url ja notify_url
      const baseUrl = req.headers.origin || 'https://bike26-2ffd8.web.app';
      const return_url = `${baseUrl}/order-confirmation/${orderId}`;
      const notify_url = `${baseUrl}/api/vismapay-webhook`;

      console.log('URLs:', { return_url, notify_url });

      // Valmistele maksudata vismapay.js:lle
      const paymentData = {
        orderId,
        amount,
        products,
        customer: {
          firstName: customerDetails.firstName,
          lastName: customerDetails.lastName,
          email: customerDetails.email,
          address: customerDetails.address,
          city: customerDetails.city,
          postalCode: customerDetails.postalCode,
          country: customerDetails.country || 'Finland'
        },
        shippingFee: shippingFee || 0,
        return_url,
        notify_url
      };

      console.log('Calling vismapay.createPayment...');

      // Kutsu Visma Pay -palvelua
      const result = await vismapay.createPayment(paymentData);

      // KORJATTU: Tallenna tilaus säilyttäen alkuperäiset kentät
      const existingOrderRef = db.collection('orders').doc(orderId);

      // YKSINKERTAISTETTU: Oletetaan, että tilaus on jo luotu frontendissä.
      // Päivitetään vain maksutiedot. Jos tilausta ei löydy, se on virhe.
      const orderUpdateData = {
        paymentToken: result.token,
        paymentUrl: result.url,
        status: 'pending', // Asetetaan tila odottamaan maksua
        updatedAt: FieldValue.serverTimestamp()
      };

      // Käytä `update` setin sijaan, jotta et vahingossa ylikirjoita koko dokumenttia.
      // Tämä myös epäonnistuu, jos dokumenttia ei ole olemassa.
      await existingOrderRef.update(orderUpdateData);
      
      console.log('Order updated with payment info:', orderId);

      // Palauta maksulinkki
      return res.status(200).json({
        success: true,
        paymentUrl: result.url,
        token: result.token,
        orderId: orderId
      });

    } catch (error) {
      console.error('=== PAYMENT CREATION ERROR ===');
      console.error('Error:', error.message);
      console.error('Stack:', error.stack);
      
      return res.status(500).json({ 
        error: 'Maksun luonti epäonnistui',
        details: error.message 
      });
    }
  });
});


exports.vismapayWebhook = onRequest({
  region: 'europe-north1',
  timeoutSeconds: 120,
  memory: '256MiB'
}, async (req, res) => {
  corsHandler(req, res, async () => {
    try {
      const vismapay = require('./vismapay');
      console.log('=== VISMA PAY WEBHOOK ===');
      console.log('Method:', req.method);
      console.log('Headers:', req.headers);
      console.log('Body:', req.body);
      
      // Käytä vismapay.js:n calculateReturnMAC funktiota
      // KORJATTU: Vertaile laskettua MAC-arvoa saapuvaan RETURN_AUTHCODE-kenttään
      const { RETURN_AUTHCODE, ...params } = req.body;
      const expectedMAC = vismapay.calculateReturnMAC(params, process.env.VISMAPAY_PRIVATE_KEY);

      // Varmista, että vertailu on turvallinen (constant-time comparison)
      if (!RETURN_AUTHCODE || !crypto.timingSafeEqual(Buffer.from(expectedMAC), Buffer.from(RETURN_AUTHCODE))) {
        console.log('Invalid MAC in webhook. Expected:', expectedMAC, 'Got:', RETURN_AUTHCODE);
        return res.status(400).send('Invalid MAC');
      }
      
      // Käsittele webhook
      const { ORDER_NUMBER, STATUS } = req.body;
      
      if (ORDER_NUMBER && STATUS) {
        // KORJATTU: Hae ensin olemassa oleva tilaus ja säilytä sen rakenne
        const orderRef = db.collection('orders').doc(ORDER_NUMBER);
        const orderDoc = await orderRef.get();
        
        if (orderDoc.exists) {
          const existingData = orderDoc.data();
          
          console.log('=== PRESERVING ORDER DATA ===');
          console.log('Existing data keys:', Object.keys(existingData));
          console.log('Existing totalAmount:', existingData.totalAmount);
          console.log('Existing user:', existingData.user);
          console.log('Existing shippingDetails:', existingData.shippingDetails);
          
          // Päivitä VAIN status ja webhook-tiedot, säilytä kaikki muu
          const updateData = {
            status: STATUS.toLowerCase(),
            updatedAt: FieldValue.serverTimestamp(),
            webhookData: req.body,
            webhookTimestamp: new Date()
          };

            // KORJAUS: Jos userId puuttuu, lisää se user.uid:sta
          if (!existingData.userId && existingData.user?.uid) {
            updateData.userId = existingData.user.uid;
            console.log('Added missing userId from user.uid:', existingData.user.uid);
          }
          
          // ÄLÄ korvaa olemassa olevia kenttiä
          await orderRef.update(updateData);
          
          console.log(`Order ${ORDER_NUMBER} status updated to ${STATUS}, original data preserved`);
        } else {
          console.log(`Order ${ORDER_NUMBER} not found in database`);
        }
      }
      
      return res.status(200).send('OK');
    } catch (error) {
      console.error('Webhook error:', error);
      return res.status(500).send('Error');
    }
  });
});

// Hae tilaukset - 2ND GEN KORJATTU
exports.getOrders = onRequest({
  region: 'europe-north1',
  timeoutSeconds: 60,
  memory: '256MiB'
}, async (req, res) => {
  corsHandler(req, res, async () => {
    try {
      const orders = await db.collection('orders').get();
      const ordersList = orders.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      return res.status(200).json(ordersList);
    } catch (error) {
      console.error('Error fetching orders:', error);
      return res.status(500).json({ error: 'Failed to fetch orders' });
    }
  });
});

// Debug-funktio - 2ND GEN KORJATTU
exports.debugPayment = onRequest({
  region: 'europe-north1',
  timeoutSeconds: 60,
  memory: '256MiB'
}, async (req, res) => {
  corsHandler(req, res, async () => {
    try {
      console.log('=== DEBUG TEST ===');
      
      // Testaa vismapay moduulin lataamista
      let vismapayTest;
      try {
        vismapayTest = require('./vismapay');
        console.log('Vismapay module loaded successfully');
        console.log('Vismapay functions:', Object.keys(vismapayTest));
      } catch (error) {
        console.error('Vismapay module loading failed:', error.message);
        return res.status(500).json({ 
          error: 'Vismapay module failed to load',
          details: error.message 
        });
      }
      
      // Testaa Firestore yhteyttä
      try {
        await db.collection('test').doc('test').set({ timestamp: new Date() });
        console.log('Firestore connection OK');
      } catch (error) {
        console.error('Firestore connection failed:', error.message);
      }
      
      return res.status(200).json({
        message: 'Debug test completed',
        timestamp: new Date().toISOString(),
        hasVismapay: !!vismapayTest,
        environment: process.env.NODE_ENV,
        vismapayConfig: {
          hasApiKey: !!process.env.VISMAPAY_API_KEY,
          hasPrivateKey: !!process.env.VISMAPAY_PRIVATE_KEY,
          hasMerchantId: !!process.env.VISMAPAY_MERCHANT_ID
        }
      });
      
    } catch (error) {
      console.error('Debug test error:', error);
      return res.status(500).json({ 
        error: 'Debug test failed',
        details: error.message 
      });
    }
  });
});

// Paytrail maksun luonti
exports.createPaytrailPayment = onRequest({
  region: 'europe-north1',
  timeoutSeconds: 540,
  memory: '256MiB',
  maxInstances: 100
}, async (req, res) => {
  corsHandler(req, res, async () => {
    try {
      console.log('=== CREATE PAYTRAIL PAYMENT REQUEST ===');
      console.log('Method:', req.method);
      console.log('Origin:', req.headers.origin);

      if (req.method !== 'POST') {
        console.log('Invalid method:', req.method);
        return res.status(405).json({ error: 'Method not allowed' });
      }

      console.log('Request body:', JSON.stringify(req.body, null, 2));

      const { orderId, amount, products, customerDetails, shippingFee, userId } = req.body;

      if (!orderId || !amount || !products || !customerDetails || !userId) {
        console.log('Missing required fields');
        return res.status(400).json({ 
          error: 'Puutteelliset tiedot',
          missing: {
            orderId: !orderId,
            amount: !amount,
            products: !products,
            customerDetails: !customerDetails,
            userId: !userId
          }
        });
      }

       let baseUrl;
      if (process.env.FUNCTIONS_EMULATOR === 'true') {
        // Kehitysympäristö: Käytä Cloudflare/ngrok URL:ää
        baseUrl = process.env.CLOUDFLARE_URL || process.env.NGROK_URL || 'http://localhost:5173';
        console.log('🔧 Using tunnel URL for development:', baseUrl);
      } else {

      const baseUrl = req.headers.origin || 'https://bike26-2ffd8.web.app';
      }
      const return_url = `${baseUrl}/order-confirmation/${orderId}`;
      const notify_url = `${baseUrl}/api/paytrail-webhook`;
      console.log('URLs:', { return_url, notify_url });
      

     

      const paymentData = {
        orderId,
        amount,
        products,
        customer: {
          firstName: customerDetails.firstName,
          lastName: customerDetails.lastName,
          email: customerDetails.email,
          address: customerDetails.address,
          city: customerDetails.city,
          postalCode: customerDetails.postalCode,
          country: customerDetails.country || 'FI'
        },
        shippingFee: shippingFee || 0,
        return_url,
        notify_url
      };

      console.log('Calling paytrail.createPayment...');

      const result = await paytrail.createPayment(paymentData);

      // Päivitä tilaus Paytrail-tiedoilla
      const existingOrderRef = db.collection('orders').doc(orderId);
      
      const orderUpdateData = {
        paymentProvider: 'paytrail',
        paymentTransactionId: result.transactionId,
        paymentUrl: result.url,
        status: 'pending',
        updatedAt: FieldValue.serverTimestamp()
      };

      await existingOrderRef.update(orderUpdateData);
      
      console.log('Order updated with Paytrail payment info:', orderId);

      return res.status(200).json({
        success: true,
        paymentUrl: result.url,
        transactionId: result.transactionId,
        orderId: orderId
      });

    } catch (error) {
      console.error('=== PAYTRAIL PAYMENT CREATION ERROR ===');
      console.error('Error:', error.message);
      console.error('Stack:', error.stack);
      
      return res.status(500).json({ 
        error: 'Paytrail maksun luonti epäonnistui',
        details: error.message 
      });
    }

  });
});

// Paytrail webhook
exports.paytrailWebhook = onRequest({
  region: 'europe-north1',
  timeoutSeconds: 120,
  memory: '256MiB'
}, async (req, res) => {
  corsHandler(req, res, async () => {
    try {
      console.log('=== PAYTRAIL WEBHOOK ===');
      console.log('Method:', req.method);
      console.log('Query params:', req.query);
      
      const params = req.method === 'GET' ? req.query : req.body;
      const signature = params.signature;
      
      // Validoi signature
      const isValid = paytrail.validateSignature(
        params,
        signature,
        process.env.PAYTRAIL_SECRET_KEY
      );

      if (!isValid) {
        console.log('Invalid signature in Paytrail webhook');
        return res.status(400).send('Invalid signature');
      }
      
      // Käsittele webhook
      const { 'checkout-reference': orderNumber, 'checkout-status': status } = params;
      
      if (orderNumber && status) {
        const orderRef = db.collection('orders').doc(orderNumber);
        const orderDoc = await orderRef.get();
        
        if (orderDoc.exists) {
          const existingData = orderDoc.data();
          
          console.log('=== UPDATING PAYTRAIL ORDER STATUS ===');
          console.log('Order:', orderNumber);
          console.log('Status:', status);
          
          const updateData = {
            status: status === 'ok' ? 'paid' : status === 'fail' ? 'failed' : 'pending',
            updatedAt: FieldValue.serverTimestamp(),
            paytrailWebhookData: params,
            webhookTimestamp: new Date()
          };

          if (!existingData.userId && existingData.user?.uid) {
            updateData.userId = existingData.user.uid;
          }
          
          await orderRef.update(updateData);
          
          console.log(`Paytrail order ${orderNumber} status updated to ${status}`);
        } else {
          console.log(`Order ${orderNumber} not found in database`);
        }
      }
      
      return res.status(200).send('OK');
    } catch (error) {
      console.error('Paytrail webhook error:', error);
      return res.status(500).send('Error');
    }
  });
});*/}
