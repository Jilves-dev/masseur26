import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // KORJAUS: oikea polku
import { useSelector, useDispatch } from 'react-redux'; // REDUX
import { clearCart } from '../redux/cartSlice'; // REDUX
//import { fadeUp } from "../components/Services/Services";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDoc,
} from 'firebase/firestore';
import { db } from '../firebase/firebase';
import vismaPayLogo from '../assets/VismaPay_logo_vaaka.png';
import paytrailLogo from '../assets/Paytrail_logo_1200x1200.png';
import nordeaLogo from '../assets/nordea_logo.png';
import danskeBank from '../assets/danskeBank.png';
import op from '../assets/OP.png';
import visa from '../assets/Visa.png';
import ma from '../assets/ma.png';
import mp from '../assets/mobilepay.svg';

const OrderCheckout = () => {
  const { currentUser } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // REDUX selectors
  const { data: cart, totalAmount: totalPrice } = useSelector(
    (state) => state.cart
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: currentUser?.email || '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Finland',
    paymentMethod: 'paytrail', // Oletusarvo Paytrail
  });

  const getFunctionUrl = (functionName) => {
    // Emulaattoriyhteys hoidetaan nyt firebase.js-tiedostossa
    if (import.meta.env.DEV) {
      const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
      const region = import.meta.env.VITE_FIREBASE_REGION;
      // Oletusarvoiset emulaattorin portit
      const functionsPort = 5001;
      return `http://127.0.0.1:${functionsPort}/${projectId}/${region}/${functionName}`;
    }

    // Tuotantoympäristö (Cloud Run)
    const functionUrls = {
      createPayment: import.meta.env.VITE_CREATE_PAYMENT_URL,
      createPaytrailPayment: import.meta.env.VITE_CREATE_PAYTRAIL_PAYMENT_URL,
      getOrders: import.meta.env.VITE_GET_ORDERS_URL,
      vismapayWebhook: import.meta.env.VITE_VISMAPAY_WEBHOOK_URL,
      paytrailWebhook: import.meta.env.VITE_PAYTRAIL_WEBHOOK_URL,
      debugPayment: import.meta.env.VITE_DEBUG_PAYMENT_URL,
    };

    const url = functionUrls[functionName];
    if (!url) {
      console.error(
        `Production URL for function "${functionName}" is not defined in .env.production`
      );
      return '';
    }
    return url;
  };

  // Ohjaa käyttäjä kirjautumissivulle, jos ei ole kirjautunut
  useEffect(() => {
    if (!currentUser) {
      navigate('/login', { state: { redirectAfterLogin: '/checkout' } });
    }
  }, [currentUser, navigate]);

  // Jos ostoskori on tyhjä, ohjaa käyttäjä kauppaan
  if (cart.length === 0) {
    return (
      <section className="py-12 md:py-24 min-h-screen font-librecaslon">
        <div className="container px-4 mx-auto">
          <div className="bg-[#FFFFFF] rounded-xl border border-gray-200 shadow-xl p-8 max-w-lg mx-auto text-center">
            <h1 className="text-3xl font-normal mb-6">Your cart is empty</h1>
            <p className="mb-6">
              Please add items to your cart before checking out.
            </p>

            <button
              onClick={() => navigate('/shop')}
              className="bg-[#E73725] text-white px-6 py-3 rounded-md hover:bg-red-700 transition-colors mx-auto"
            >
              Go to Shop
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Jos käyttäjä ei ole kirjautunut, näytä latausanimaatio
  if (!currentUser) {
    return (
      <section className="bg-gray-50 py-12 min-h-screen font-varela flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
      </section>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError('');

      if (!currentUser || !currentUser.uid) {
        throw new Error('User authentication failed.');
      }

      // VARMISTA REDUX-TILA
      console.log('=== CHECKOUT DEBUG ===');
      console.log('Cart items:', cart);
      console.log('Cart length:', cart.length);
      console.log('Redux totalPrice:', totalPrice, typeof totalPrice);

      // LASKE SUMMA UUDELLEEN VARMUUDEN VUOKSI
      const calculatedTotal = cart.reduce((total, item) => {
        const itemPrice = parseFloat(item.price) || 0;
        const itemQuantity = parseInt(item.quantity) || 0;
        return total + itemPrice * itemQuantity;
      }, 0);

      const finalTotalAmount = parseFloat(totalPrice) || calculatedTotal;
      const shippingCost = 5.0;

      console.log('Calculated total:', calculatedTotal);
      console.log('Redux total:', totalPrice);
      console.log('Final total used:', finalTotalAmount);

      if (finalTotalAmount <= 0) {
        throw new Error(
          'Tilauksen summa ei voi olla nolla. Tarkista ostoskori.'
        );
      }

      if (cart.length === 0) {
        throw new Error('Ostoskori on tyhjä.');
      }

      // ROBUST ORDER DATA - kaikki kentät varmasti mukana
      const orderData = {
        // Lisätään userId-kenttä eksplisiittisesti
        userId: currentUser.uid,
        // KÄYTTÄJÄTIEDOT
        user: {
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName || '',
        },

        // TOIMITUS- JA ASIAKASTIEDOT
        shippingDetails: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country,
        },
        customerDetails: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country,
        },
        orderItems: cart.map((item) => ({
          id: item.id,
          productCode: item.productCode || `PROD-${item.id || Date.now()}`,
          title: item.title,
          price: parseFloat(item.price) || 0,
          quantity: parseInt(item.quantity) || 0,
        })),
        paymentMethod: formData.paymentMethod,
        totalAmount: finalTotalAmount,
        shippingFee: shippingCost,
        grandTotal: finalTotalAmount + shippingCost,

        // TILA JA METADATA
        status: 'pending',
        source: 'web-checkout', // Tunniste mistä tilaus tuli
        createdAt: serverTimestamp(),

        // DEBUG-INFO
        debug: {
          reduxTotal: totalPrice,
          calculatedTotal: calculatedTotal,
          cartLength: cart.length,
          timestamp: new Date().toISOString(),
          userIdAdded: true, // Vahvistus että userId on lisätty
        },
      };

      {
        /*console.log("=== SAVING ORDER DATA ===");
    console.log("Final orderData userId:", orderData.userId);
    console.log("Final orderData user.uid:", orderData.user.uid);
    console.log("Final orderData:", orderData);*/
      }

      const orderRef = await addDoc(collection(db, 'orders'), orderData);
      const orderId = orderRef.id;

      console.log('Order saved with ID:', orderId);

      // Tarkista että tilaus tallentui oikein
      try {
        const savedOrderDoc = await getDoc(orderRef);
        if (savedOrderDoc.exists()) {
          const savedData = savedOrderDoc.data();
          console.log('=== VERIFICATION: SAVED ORDER ===');
          console.log('Saved order ID:', orderId);
          console.log('Saved totalAmount:', savedData.totalAmount);
          console.log('Saved amount:', savedData.amount);
          //console.log("Saved user.uid:", savedData.user?.uid);
          //console.log("Saved userId:", savedData.userId);
          console.log(
            'Saved orderItems count:',
            (savedData.orderItems || []).length
          );
          console.log(
            'Saved products count:',
            (savedData.products || []).length
          );
          console.log('Saved customerDetails:', savedData.customerDetails);
          console.log('Saved shippingDetails:', savedData.shippingDetails);
          console.log('Full saved data keys:', Object.keys(savedData));
        } else {
          console.error('VERIFICATION FAILED: Order not found after save!');
        }
      } catch (verifyError) {
        console.error('VERIFICATION ERROR:', verifyError);
      }

      // Paytrail-maksu
      if (formData.paymentMethod === 'paytrail') {
        try {
          console.log('=== CALLING PAYTRAIL API ===');

          const paymentRequestData = {
            orderId: orderId,
            amount: orderData.grandTotal,
            userId: orderData.userId,
            products: orderData.orderItems,
            customerDetails: orderData.customerDetails,
            shippingFee: orderData.shippingFee,
          };

          console.log('Paytrail payment request data:', paymentRequestData);

          const functionUrl = getFunctionUrl('createPaytrailPayment');
          //console.log("Calling Paytrail function URL:", functionUrl);

          const response = await fetch(functionUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify(paymentRequestData),
          });

          console.log('Paytrail function response status:', response.status);

          if (!response.ok) {
            const errorText = await response.text();
            console.error('Paytrail function error response:', errorText);
            throw new Error(
              `Paytrail function error: ${response.status} - ${errorText}`
            );
          }

          const result = await response.json();
          console.log('Paytrail function result:', result);

          if (result.success && result.paymentUrl) {
            console.log(
              'Redirecting to Paytrail payment URL:',
              result.paymentUrl
            );
            window.location.href = result.paymentUrl;
            return;
          } else {
            console.error('Invalid Paytrail result structure:', result);
            throw new Error(
              result.error || 'Paytrail maksun luomisessa tapahtui virhe.'
            );
          }
        } catch (error) {
          console.error('Paytrail payment error:', error);
          throw error;
        }
      }

      // Visma Pay -maksu
      else if (formData.paymentMethod === 'visma-pay') {
        try {
          console.log('=== CALLING VISMA PAY API ===');

          // YKSINKERTAISTETTU: Käytä aiemmin luotua orderData-objektia
          // ja poimi siitä tarvittavat tiedot.
          const paymentRequestData = {
            orderId: orderId,
            amount: orderData.grandTotal, // Käytä lopullista summaa
            userId: orderData.userId,
            products: orderData.orderItems, // Käytä jo olemassa olevaa listaa
            customerDetails: orderData.customerDetails, // Käytä jo olemassa olevaa objektia
            shippingFee: orderData.shippingFee,
          };

          console.log('Payment request data:', paymentRequestData);

          // KORJATTU: Käytä getFunctionUrl-apufunktiota, jotta osoite on oikea
          // sekä kehityksessä (emulaattori) että tuotannossa.
          const functionUrl = getFunctionUrl('createPayment');
          console.log('Calling function URL:', functionUrl);

          const response = await fetch(functionUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify(paymentRequestData),
          });

          //console.log("Function response status:", response.status);
          //console.log("Function response headers:", response.headers);

          if (!response.ok) {
            const errorText = await response.text();
            console.error('Function error response:', errorText);
            throw new Error(
              `Function error: ${response.status} - ${errorText}`
            );
          }

          const result = await response.json();
          console.log('Function result:', result);

          if (result.success && result.paymentUrl) {
            console.log('Redirecting to payment URL:', result.paymentUrl);
            window.location.href = result.paymentUrl;
            return;
          } else {
            console.error('Invalid result structure:', result);
            throw new Error(
              result.error || 'Maksun luomisessa tapahtui virhe.'
            );
          }
        } catch (error) {
          console.error('Visma Pay payment error:', error);
          throw error;
        }
      } else {
        // Muu maksutapa
        dispatch(clearCart());
        navigate(`/order-confirmation/${orderId}`);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setError('Tilauksen käsittelyssä tapahtui virhe: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-[#FFFFFF] py-12 min-h-screen font-librecaslon ">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 ml-6 mr-6">
          {/* Shipping and Payment Form */}

          <div className="bg-[#FFFFFF] rounded-xl border border-gray-200 shadow-xl pl-4 pr-4 py-8">
            <h2 className="text-2xl font-bold mb-6">
              Toimitus- ja maksutiedot
            </h2>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Etunimi
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="bg-white w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Sukunimi
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="bg-white w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="email"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Sähköposti
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-white w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                  required
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="address"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Katuosoite
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="bg-white w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label
                    htmlFor="city"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Kaupunki
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="bg-white w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="postalCode"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Postinumero
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    className="bg-white w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                    required
                  />
                </div>
              </div>

              <div className="mb-10">
                <label
                  htmlFor="country"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Maa
                </label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="bg-white w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                  required
                >
                  <option value="">Valitse maa</option>
                  <option value="Finland">Suomi</option>
                  <option value="Sweden">Ruotsi</option>
                  <option value="Norway">Norja</option>
                  <option value="Denmark">Tanska</option>
                  <option value="Estonia">Viro</option>
                </select>
              </div>

              <h3 className="text-xl font-bold mb-4">Maksutapa</h3>

              <div className="mb-8 space-y-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="paytrail"
                    name="paymentMethod"
                    value="paytrail"
                    checked={formData.paymentMethod === 'paytrail'}
                    onChange={handleChange}
                    className="bg-white h-5 w-5 text-red-600"
                  />
                  <label
                    htmlFor="paytrail"
                    className="ml-2 text-gray-700 flex items-center"
                  >
                    {/* Visma Pay<span className="ml-2 text-xs text-green-600 font-medium border border-green-600 rounded px-1">Suosittu</span>*/}
                    <img
                      src={paytrailLogo}
                      alt="Paytrail"
                      className="h-4 ml-1"
                      style={{ maxHeight: '3rem', maxWidth: '4rem' }}
                    />
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="radio"
                    id="visma-pay"
                    name="paymentMethod"
                    value="visma-pay"
                    checked={formData.paymentMethod === 'visma-pay'}
                    onChange={handleChange}
                    className="bg-white h-5 w-5 text-red-600"
                  />
                  <label
                    htmlFor="visma-pay"
                    className="ml-2 text-gray-700 flex items-center"
                  >
                    {/* Visma Pay<span className="ml-2 text-xs text-green-600 font-medium border border-green-600 rounded px-1">Suosittu</span>*/}
                    <img
                      src={vismaPayLogo}
                      alt="Visma Pay"
                      className="h-4 ml-1"
                      style={{ maxHeight: '5rem', maxWidth: '7rem' }}
                    />
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="radio"
                    id="credit-card"
                    name="paymentMethod"
                    value="credit-card"
                    checked={formData.paymentMethod === 'credit-card'}
                    onChange={handleChange}
                    className="h-5 w-5 text-red-600"
                  />
                  <label htmlFor="credit-card" className="ml-2 text-gray-700">
                    Luottokortti
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="radio"
                    id="bank-transfer"
                    name="paymentMethod"
                    value="bank-transfer"
                    checked={formData.paymentMethod === 'bank-transfer'}
                    onChange={handleChange}
                    className="h-5 w-5 text-red-600"
                  />
                  <label htmlFor="bank-transfer" className="ml-2 text-gray-700">
                    Pankkisiirto
                  </label>
                </div>
              </div>

              {formData.paymentMethod === 'visma-pay' && (
                <div className="mb-6 bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-700">
                    Maksat turvallisesti Visma Pay -palvelun kautta. Sinut
                    ohjataan maksun jälkeen takaisin verkkokauppaan.
                  </p>
                </div>
              )}
              <button
                type="submit"
                className="w-full bg-[#E73725] text-white px-6 py-3 rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 disabled:opacity-50"
                disabled={loading}
              >
                {loading
                  ? 'Käsitellään...'
                  : formData.paymentMethod === 'visma-pay'
                    ? 'Siirry maksamaan'
                    : 'Tee tilaus'}
              </button>
            </form>
          </div>

          {/* Order Summary */}

          <div className="bg-[#FFFFFF] rounded-xl border border-gray-200 shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-6">Tilauksesi</h2>
            <div className="space-y-6 mb-8">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="h-16 object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-gray-600 text-sm">
                      Määrä: {item.quantity}
                    </p>
                  </div>
                  <div className="font-bold">
                    €{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-6 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Välisumma</span>
                <span className="font-medium">€{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Toimitus</span>
                <span className="font-medium">€5.00</span>
              </div>
              <div className="flex justify-between text-xl font-bold">
                <span>Yhteensä</span>
                <span>€{(totalPrice + 5).toFixed(2)}</span>
              </div>
            </div>

            {/* Visma Pay tuetut maksutavat */}
            {formData.paymentMethod === 'visma-pay' && (
              <div className="mt-8">
                <p className="text-sm text-gray-600 mb-3">
                  Visma Pay tukee seuraavia maksutapoja:
                </p>
                <div className="flex flex-wrap gap-1">
                  <div className="h-8 w-16 bg-white rounded flex items-center justify-center text-xs">
                    <img
                      src={nordeaLogo}
                      alt="Nordea"
                      className="h-16 ml-2"
                      style={{ maxHeight: '1rem', maxWidth: '4rem' }}
                    />
                  </div>
                  <div className="h-8 w-16 bg-white rounded flex items-center justify-center text-xs">
                    <img
                      src={op}
                      alt="OP"
                      className="h-8 ml-2"
                      style={{ maxHeight: '2rem', maxWidth: '4rem' }}
                    />
                  </div>
                  <div className="h-8 w-16 bg-white rounded flex items-center justify-center text-xs">
                    <img
                      src={danskeBank}
                      alt="Danske Bank"
                      className="h-14 ml-2"
                      style={{ maxHeight: '2rem', maxWidth: '4rem' }}
                    />
                  </div>
                  <div className="h-8 w-16 bg-white rounded flex items-center justify-center text-xs">
                    <img
                      src={visa}
                      alt="Visa"
                      className="h-4 ml-2"
                      style={{ maxHeight: '1rem', maxWidth: '3rem' }}
                    />
                  </div>
                  <div className="h-8 w-16 bg-white rounded flex items-center justify-center text-xs">
                    <img
                      src={ma}
                      alt="Mastercard"
                      className="h-8 ml-2"
                      style={{ maxHeight: '2rem', maxWidth: '3rem' }}
                    />
                  </div>
                  <div className="h-8 w-16 bg-white rounded flex items-center justify-center text-xs">
                    <img
                      src={mp}
                      alt="Mobilepay"
                      className="h-10 ml-2"
                      style={{ maxHeight: '4rem', maxWidth: '4rem' }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Paytrail tuetut maksutavat */}
            {formData.paymentMethod === 'paytrail' && (
              <div className="mt-8">
                <p className="text-sm text-gray-600 mb-3">
                  Paytrail tukee seuraavia maksutapoja:
                </p>
                <div className="flex flex-wrap gap-1">
                  <div className="h-8 w-16 bg-white rounded flex items-center justify-center text-xs">
                    <img
                      src={nordeaLogo}
                      alt="Nordea"
                      className="h-16 ml-2"
                      style={{ maxHeight: '1rem', maxWidth: '4rem' }}
                    />
                  </div>
                  <div className="h-8 w-16 bg-white rounded flex items-center justify-center text-xs">
                    <img
                      src={op}
                      alt="OP"
                      className="h-8 ml-2"
                      style={{ maxHeight: '2rem', maxWidth: '4rem' }}
                    />
                  </div>
                  <div className="h-8 w-16 bg-white rounded flex items-center justify-center text-xs">
                    <img
                      src={danskeBank}
                      alt="Danske Bank"
                      className="h-14 ml-2"
                      style={{ maxHeight: '2rem', maxWidth: '4rem' }}
                    />
                  </div>
                  <div className="h-8 w-16 bg-white rounded flex items-center justify-center text-xs">
                    <img
                      src={visa}
                      alt="Visa"
                      className="h-4 ml-2"
                      style={{ maxHeight: '1rem', maxWidth: '3rem' }}
                    />
                  </div>
                  <div className="h-8 w-16 bg-white rounded flex items-center justify-center text-xs">
                    <img
                      src={ma}
                      alt="Mastercard"
                      className="h-8 ml-2"
                      style={{ maxHeight: '2rem', maxWidth: '3rem' }}
                    />
                  </div>
                  <div className="h-8 w-16 bg-white rounded flex items-center justify-center text-xs">
                    <img
                      src={mp}
                      alt="Mobilepay"
                      className="h-10 ml-2"
                      style={{ maxHeight: '4rem', maxWidth: '4rem' }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderCheckout;
