import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useDispatch } from 'react-redux';
import { clearCart } from '../redux/cartSlice';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);

        if (!orderId) {
          setError('Tilaustunnistetta ei löydy.');
          setLoading(false);
          return;
        }

        const orderRef = doc(db, 'orders', orderId);
        const orderDoc = await getDoc(orderRef);

        if (orderDoc.exists()) {
          const rawData = orderDoc.data();

          // KORJATTU: Käsittele eri kenttänimet kehitys- ja tuotantoympäristöjen välillä
          const normalizedOrder = {
            id: orderDoc.id,
            ...rawData,
            createdAt: rawData.createdAt?.toDate() || new Date(),

            // Normalisoi totalAmount - kokeile useita mahdollisia kenttänimiä
            totalAmount: rawData.totalAmount || rawData.amount || 0,

            // Normalisoi orderItems - kokeile useita mahdollisia kenttänimiä
            orderItems: rawData.orderItems || rawData.products || [],

            // Varmista että shippingFee on numero
            shippingFee: parseFloat(rawData.shippingFee) || 5,
          };

          console.log('=== ORDER DEBUG ===');
          console.log('Raw order data:', rawData);
          console.log('Normalized order data:', normalizedOrder);
          console.log(
            'totalAmount from rawData.totalAmount:',
            rawData.totalAmount,
            typeof rawData.totalAmount
          );
          console.log(
            'totalAmount from rawData.amount:',
            rawData.amount,
            typeof rawData.amount
          );
          console.log(
            'orderItems from rawData.orderItems:',
            rawData.orderItems
          );
          console.log('orderItems from rawData.products:', rawData.products);
          console.log(
            'Final normalized totalAmount:',
            normalizedOrder.totalAmount
          );
          console.log(
            'Final normalized orderItems:',
            normalizedOrder.orderItems
          );

          setOrder(normalizedOrder);
        } else {
          setError('Tilausta ei löydy.');
        }
      } catch (error) {
        console.error('Error fetching order:', error);
        setError('Tilauksen hakeminen epäonnistui. Yritä uudelleen.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  // Tyhjennetään ostoskori AINA kun OrderConfirmation-komponentti ladataan
  useEffect(() => {
    console.log('OrderConfirmation mounted, clearing cart...');
    dispatch(clearCart());
  }, [dispatch]);

  // Formaattiapuri päivämäärille
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fi-FI', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // KORJATTU: Turvallisempi valuutan formaatti
  const formatCurrency = (amount) => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) {
      console.error('Invalid amount for formatting:', amount);
      return '0,00 €';
    }

    return new Intl.NumberFormat('fi-FI', {
      style: 'currency',
      currency: 'EUR',
    }).format(numAmount);
  };

  // KORJATTU: Funktio laskemaan yhteissumma tuotteista
  const calculateTotalFromItems = (orderItems) => {
    if (!orderItems || !Array.isArray(orderItems)) {
      console.log('No valid orderItems array found:', orderItems);
      return 0;
    }

    console.log('Calculating total from items:', orderItems);

    return orderItems.reduce((total, item) => {
      const itemPrice = parseFloat(item.price) || 0;
      const itemQuantity = parseInt(item.quantity) || 0;
      const itemTotal = itemPrice * itemQuantity;

      console.log(
        `Item: ${item.title}, Price: ${itemPrice}, Quantity: ${itemQuantity}, Total: ${itemTotal}`
      );

      return total + itemTotal;
    }, 0);
  };

  return (
    <section className="bg-[#eceef1] pt-12 pb-16 min-h-screen font-oswaldVariable">
      <div className="container max-w-2xl mx-auto px-4">
        {loading ? (
          <div className="flex justify-center items-center h-60">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <h2 className="font-racingSansOne text-3xl font-bold text-red-600 mb-4">Virhe</h2>
            <p className="text-gray-700 mb-6">{error}</p>
            <Link
              to="/"
              className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 inline-block transition-colors"
            >
              Takaisin etusivulle
            </Link>
          </div>
        ) : order ? (
          <>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 text-green-600 rounded-full mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h1 className="font-racingSansOne text-4xl font-bold mb-2">Kiitos tilauksestasi!</h1>
              <p className="text-lg text-gray-600">Tilausnumero: #{orderId}</p>
              <p className="text-lg text-gray-600 mt-2">
                Tilausaika: {formatDate(order.createdAt)}
              </p>
            </div>

            <div className="border-t border-gray-200 pt-6 mb-6">
              <h2 className="font-racingSansOne text-2xl font-bold mb-4">Tilauksen tiedot</h2>

              <div className="space-y-4 mb-6">
                {(order.orderItems || []).map((item, index) => {
                  console.log(`Rendering item ${index}:`, {
                    title: item.title,
                    price: item.price,
                    priceType: typeof item.price,
                    quantity: item.quantity,
                    quantityType: typeof item.quantity,
                    total:
                      (parseFloat(item.price) || 0) *
                      (parseInt(item.quantity) || 0),
                  });

                  return (
                    <div
                      key={index}
                      className="flex justify-between items-center text-lg"
                    >
                      <div className="flex items-center">
                        <span className="bg-white text-gray-700 w-6 h-6 rounded-full flex items-center justify-center mr-3">
                          {item.quantity}
                        </span>
                        <span className="font-medium">{item.title}</span>
                      </div>
                      <span>
                        {formatCurrency(
                          (parseFloat(item.price) || 0) *
                            (parseInt(item.quantity) || 0)
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>

              {(() => {
                // KORJATTU: Laske summat turvallisesti useista lähteistä
                const savedTotalAmount = parseFloat(order.totalAmount) || 0;
                const calculatedTotalAmount = calculateTotalFromItems(
                  order.orderItems
                );
                const shippingFee = parseFloat(order.shippingFee) || 5;

                // Jos tallennettu summa on 0 tai virheellinen, käytä laskettua
                const finalTotalAmount =
                  savedTotalAmount > 0
                    ? savedTotalAmount
                    : calculatedTotalAmount;

                console.log('=== SUMMARY CALCULATION ===');
                console.log('Saved total amount:', savedTotalAmount);
                console.log('Calculated total amount:', calculatedTotalAmount);
                console.log('Final total amount:', finalTotalAmount);
                console.log('Shipping fee:', shippingFee);
                console.log('Grand total:', finalTotalAmount + shippingFee);

                return (
                  <div className="border-t border-gray-200 pt-4 mb-6 text-lg">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Välisumma</span>
                      <span>{formatCurrency(finalTotalAmount)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Toimitus</span>
                      <span>{formatCurrency(shippingFee)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                      <span>Yhteensä</span>
                      <span>
                        {formatCurrency(finalTotalAmount + shippingFee)}
                      </span>
                    </div>

                    {/* DEBUG INFO - poista kun ongelma on ratkaistu 
                    <div className="mt-4 p-3 bg-yellow-100 border border-yellow-400 rounded text-xs">
                      <strong>DEBUG INFO:</strong><br/>
                      Tallennettu summa: {order.totalAmount} (tyyppi: {typeof order.totalAmount})<br/>
                      Laskettu summa: {calculatedTotalAmount}<br/>
                      Käytetty summa: {finalTotalAmount}<br/>
                      Toimitusmaksu: {shippingFee}<br/>
                      Kokonaissumma: {finalTotalAmount + shippingFee}<br/>
                      <strong>Raw data check:</strong><br/>
                      rawData.amount: {JSON.stringify(order.amount)}<br/>
                      rawData.products: {JSON.stringify(order.products)}<br/>
                      orderItems length: {order.orderItems?.length || 0}
                    </div>*/}
                  </div>
                );
              })()}
            </div>

            <div className="border-t border-gray-200 pt-6 mb-6">
              <h2 className="font-racingSansOne text-2xl font-bold mb-4">Toimitustiedot</h2>
              {order.shippingDetails || order.customerDetails ? (
                <>
                  <p className="mb-1 text-lg">
                    {order.shippingDetails?.firstName ||
                      order.customerDetails?.firstName}{' '}
                    {order.shippingDetails?.lastName ||
                      order.customerDetails?.lastName}
                  </p>
                  <p className="mb-1 text-lg">
                    {order.shippingDetails?.email ||
                      order.customerDetails?.email}
                  </p>
                  <p className="mb-1 text-lg">
                    {order.shippingDetails?.address ||
                      order.customerDetails?.address}
                  </p>
                  <p className="mb-1 text-lg">
                    {order.shippingDetails?.postalCode ||
                      order.customerDetails?.postalCode}
                    ,{' '}
                    {order.shippingDetails?.city || order.customerDetails?.city}
                  </p>
                  <p className="mb-1 text-lg">
                    {order.shippingDetails?.country ||
                      order.customerDetails?.country}
                  </p>
                </>
              ) : (
                <p className="text-gray-500 text-lg">
                  Toimitustietoja ei löydy
                </p>
              )}
            </div>

            <div className="border-t border-gray-200 pt-6 mb-6">
              <h2 className="font-racingSansOne text-2xl font-bold mb-4">Maksutapa</h2>
              <p className="text-lg">
                {order.paymentMethod === 'credit-card'
                  ? 'Luottokortti'
                  : order.paymentMethod === 'visma-pay'
                    ? 'Visma Pay'
                    : order.paymentMethod === 'paypal'
                      ? 'PayPal'
                      : 'Pankkisiirto'}
              </p>
            </div>

            <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-8">
              <Link
                to="/shop"
                className="bg-[#e31837] text-lg text-white px-6 py-3 rounded-md hover:bg-[#333f48] inline-block transition-colors"
              >
                Jatka ostoksia
              </Link>

              <Link
                to="/profile"
                className="border border-[#e31837] text-[#e31837] text-lg px-6 py-3 rounded-md hover:bg-[#e31837] hover:text-[#eceef1] inline-block transition-colors"
              >
                Tilaushistoria
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <h2 className="font-racingSansOne text-lg font-bold text-red-600 mb-4">
              Tilausta ei löydy
            </h2>
            <Link
              to="/"
              className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 inline-block transition-colors"
            >
              Takaisin etusivulle
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default OrderConfirmation;
