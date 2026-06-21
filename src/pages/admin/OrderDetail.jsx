import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  collection,
} from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import AdminMobileHeader from '../../common/AdminMobileHeader';
import Header from '../../common/Header';

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setError('');

      const orderDoc = await getDoc(doc(db, 'orders', orderId));

      if (!orderDoc.exists()) {
        setError('Tilausta ei löytynyt');
        return;
      }

      const rawData = orderDoc.data();

      // Sama normalisointi kuin muissa komponenteissa
      const getCustomerInfo = () => {
        const firstName =
          rawData.shippingDetails?.firstName ||
          rawData.customerDetails?.firstName ||
          rawData.user?.displayName?.split(' ')[0] ||
          '';
        const lastName =
          rawData.shippingDetails?.lastName ||
          rawData.customerDetails?.lastName ||
          rawData.user?.displayName?.split(' ')[1] ||
          '';
        const email =
          rawData.shippingDetails?.email ||
          rawData.customerDetails?.email ||
          rawData.user?.email ||
          '';

        return {
          firstName,
          lastName,
          fullName: `${firstName} ${lastName}`.trim(),
          email,
        };
      };

      const customerInfo = getCustomerInfo();
      const totalAmount =
        parseFloat(rawData.totalAmount) || parseFloat(rawData.amount) || 0;
      const orderItems = rawData.orderItems || rawData.products || [];

      const normalizedOrder = {
        id: orderDoc.id,
        ...rawData,
        customerInfo,
        totalAmount,
        orderItems,
        createdAt: rawData.createdAt?.toDate
          ? rawData.createdAt.toDate()
          : new Date(rawData.createdAt || Date.now()),
        shippingAddress: {
          firstName: customerInfo.firstName,
          lastName: customerInfo.lastName,
          email: customerInfo.email,
          address:
            rawData.shippingDetails?.address ||
            rawData.customerDetails?.address ||
            '',
          city:
            rawData.shippingDetails?.city ||
            rawData.customerDetails?.city ||
            '',
          postalCode:
            rawData.shippingDetails?.postalCode ||
            rawData.customerDetails?.postalCode ||
            '',
          country:
            rawData.shippingDetails?.country ||
            rawData.customerDetails?.country ||
            '',
        },
      };

      setOrder(normalizedOrder);
    } catch (error) {
      console.error('Error fetching order:', error);
      setError('Tilauksen hakeminen epäonnistui');
    } finally {
      setLoading(false);
    }
  };

  // Päivitä tilauksen status JA lähetä sähköposti
  const updateOrderStatus = async (newStatus) => {
    try {
      setUpdating(true);
      console.log(`Updating order ${orderId} to status: ${newStatus}`);

      // 1. PÄIVITÄ TILAUKSEN STATUS
      await updateDoc(doc(db, 'orders', orderId), {
        status: newStatus,
        updatedAt: new Date(),
      });

      // 2. LÄHETÄ SÄHKÖPOSTI-ILMOITUS (käytä olemassa olevaa order-objektia)
      await sendOrderStatusEmail(order, newStatus, orderId);

      // 3. PÄIVITÄ PAIKALLINEN TILA
      setOrder({ ...order, status: newStatus });

      console.log(`Order ${orderId} status updated successfully`);
    } catch (error) {
      console.error('Error updating order:', error);
      setError('Tilan päivitys epäonnistui');
    } finally {
      setUpdating(false);
    }
  };

  // UUSI FUNKTIO: Sähköpostin lähettäminen
  const sendOrderStatusEmail = async (orderData, newStatus, orderId) => {
    try {
      console.log('=== SENDING EMAIL NOTIFICATION ===');

      // Hae asiakkaan sähköpostiosoite useista lähteistä
      const customerEmail =
        order.shippingDetails?.email ||
        order.customerDetails?.email ||
        order.user?.email ||
        order.customerEmail;

      if (!customerEmail) {
        console.error(
          'Asiakkaan sähköpostiosoitetta ei löydy tilauksesta:',
          orderId
        );
        return;
      }

      console.log('Sending email to:', customerEmail);

      // Muunna status suomeksi
      const statusTranslations = {
        pending: 'Odottaa käsittelyä',
        processing: 'Käsittelyssä',
        shipped: 'Lähetetty',
        delivered: 'Toimitettu',
        completed: 'Valmis',
        cancelled: 'Peruutettu',
        paid: 'Maksettu',
      };

      const statusText =
        statusTranslations[newStatus.toLowerCase()] || newStatus;

      // Hae asiakkaan nimi
      const customerName =
        order.shippingDetails?.firstName ||
        order.customerDetails?.firstName ||
        order.user?.displayName?.split(' ')[0] ||
        'asiakkaamme';

      // Hae tilauksen tuotteet
      const orderItems = order.orderItems || order.products || [];
      const totalAmount =
        parseFloat(order.totalAmount) || parseFloat(order.amount) || 0;

      let orderTitle;
      if (orderItems.length === 1) {
        orderTitle = `Tilauksesi "${orderItems[0].title || 'tuote'}"`;
      } else {
        orderTitle = 'Tilauksesi';
      }

      console.log('Email data:', {
        customerEmail,
        customerName,
        statusText,
        orderItems: orderItems.length,
        totalAmount,
      });

      // Luo HTML-sähköposti  {/*Tilauksesi📦<strong style="color: #E73725;">#${orderId.slice(0, 8)}</strong>📦 tila on nyt:*/}
      //{/*<p style="margin: 5px 0 0 0; opacity: 0.9;">Tilauksesi tila on päivittynyt🪄</p>*/}
      const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background-color: #E73725; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="margin: 0; font-size: 24px;">Freewheel Bikes🚴</h1>
              </div>
              
              <div style="background-color: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
                <h2 style="color: #E73725; margin-top: 0;">Hei ${customerName}!😎</h2>
                
                <p style="font-size: 16px; line-height: 1.6;">
                  📦<strong style="color: #E73725;">${orderTitle}📦(Tilaus id#${orderId.slice(0, 8)})
                  tila on nyt:</strong>
                  <strong style="color: #059669;">${statusText}</strong>
                </p>
                
                <div style="background-color: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0;">
                  <h3 style="margin-top: 0; color: #374151;">Tilauksen yhteenveto:</h3>
                  <ul style="padding-left: 20px; line-height: 1.8;">
                    ${orderItems
                      .map(
                        (item) => `
                      <li style="margin-bottom: 8px;">
                        <strong>${item.quantity || 1} x ${item.title || 'Tuote'}</strong> 
                        - €${((parseFloat(item.price) || 0) * (parseInt(item.quantity) || 1)).toFixed(2)}
                      </li>
                    `
                      )
                      .join('')}
                  </ul>
                  <div style="border-top: 2px solid #E73725; padding-top: 15px; margin-top: 15px;">
                    <p style="font-size: 18px; font-weight: bold; margin: 0; color: #059669;">
                      Yhteensä: €${totalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>
                
                ${
                  newStatus.toLowerCase() === 'shipped'
                    ? `
                  <div style="background-color: #dbeafe; border: 1px solid #3b82f6; border-radius: 8px; padding: 15px; margin: 20px 0;">
                    <p style="margin: 0; color: #1e40af;">
                      📦 <strong>Tilauksesi on lähetetty!</strong>📦 Saat pian seurantakoodin sähköpostiisi.
                    </p>
                  </div>
                `
                    : ''
                }
                
                <p style="font-size: 14px; color: #6b7280; line-height: 1.6;">
                  Jos sinulla on kysyttävää tilauksestasi, vastaa tähän viestiin tai ota yhteyttä asiakaspalveluumme.
                </p>
                
                <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                  <p style="margin: 0; color: #374151;">
                    Ystävällisin terveisin,<br>
                    <strong style="color: #E73725;">Freewheel Bikes Team</strong>
                  </p>
                </div>
              </div>
            </div>
          `;

      // Luo teksti-versio
      const text = `
            Tilauksesi tila on päivittynyt
            
            Hei ${customerName}!
            
            ${orderTitle} (Tilaus #${orderId.slice(0, 8)}) tila on nyt: ${statusText}
            
            Tilauksen yhteenveto:
            ${orderItems
              .map(
                (item) =>
                  `${item.quantity || 1} x ${item.title || 'Tuote'} - €${((parseFloat(item.price) || 0) * (parseInt(item.quantity) || 1)).toFixed(2)}`
              )
              .join('\n')}
            
            Yhteensä: €${totalAmount.toFixed(2)}
            
            Jos sinulla on kysyttävää tilauksestasi, vastaa tähän viestiin tai ota yhteyttä asiakaspalveluumme.
            
            Ystävällisin terveisin,
            Freewheel Bikes Team
          `;

      // LUO SÄHKÖPOSTIDOKUMENTTI FIRESTORE MAIL-KOKOELMAAN
      const emailDoc = {
        to: [customerEmail],
        message: {
          //subject: `Tilauksesi #${orderId.slice(0, 8)} tila on päivittynyt: ${statusText}`,
          subject: `Tilauksesi ${orderTitle}📦tila on päivittynyt: ${statusText}`,
          html,
          text,
        },
        // Metadata
        orderId: orderId,
        orderStatus: newStatus,
        customerEmail: customerEmail,
        createdAt: new Date(),
        type: 'order_status_update',
      };

      // TALLENNA FIRESTORE MAIL-KOKOELMAAN
      const mailRef = await addDoc(collection(db, 'mail'), emailDoc);

      console.log('✅ Email queued successfully with ID:', mailRef.id);
      console.log('📧 Email will be sent to:', customerEmail);
    } catch (error) {
      console.error('❌ Sähköpostin lähettäminen epäonnistui:', error);
      // Älä anna virheen kaataa tilauksen päivitystä
      console.log(
        'ℹ️  Tilauksen status päivitettiin, mutta sähköposti epäonnistui'
      );
    }
  };

  const deleteOrder = async () => {
    if (
      !window.confirm(
        'Haluatko varmasti poistaa tämän tilauksen? Toimintoa ei voi perua.'
      )
    ) {
      return;
    }

    try {
      setUpdating(true);

      await deleteDoc(doc(db, 'orders', orderId));

      navigate('/admin/orders');
    } catch (error) {
      console.error('Error deleting order:', error);
      setError('Tilauksen poisto epäonnistui');
      setUpdating(false);
    }
  };

  const formatStatus = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'Odottaa';
      case 'processing':
        return 'Käsittelyssä';
      case 'shipped':
        return 'Lähetetty';
      case 'delivered':
        return 'Toimitettu';
      case 'completed':
        return 'Valmis';
      case 'cancelled':
        return 'Peruutettu';
      case 'paid':
        return 'Maksettu';
      default:
        return status || 'Tuntematon';
    }
  };

  const getStatusColorClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-indigo-100 text-indigo-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="text-center py-10">Ladataan tilausta...</div>;
  }

  if (error && !order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
        <Link
          to="/admin/orders"
          className="mt-4 inline-block bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
        >
          Takaisin tilauksiin
        </Link>
      </div>
    );
  }

  return (
    <div>
      <AdminMobileHeader pageTitle={`Tilaus #${order.id.slice(0, 8)}`} />
      <div className="hidden md:block">
        <Header />
      </div>

      <div className="container mx-auto px-4 py-8 bg-[#FFFFFF] font-librecaslon min-h-screen">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold">
            Tilaus #{order.id.slice(0, 8)}
          </h1>
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <Link
              to="/admin/orders"
              className="flex-1 md:flex-none text-center bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded"
            >
              Takaisin tilauksiin
            </Link>
            <Link
              to="/admin"
              className="flex-1 md:flex-none text-center bg-[#E73725] hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Hallintapaneeli
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Vasemma sarake - Tilauksen tiedot */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tilauksen perustiedot */}
            <div className="bg-[#FFFFFF] rounded-lg border border-gray-300 shadow-xl p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold">Tilauksen tiedot</h2>
                  <p className="text-gray-600">Tilaus #{order.id}</p>
                  <p className="text-sm text-gray-500">
                    Luotu:{' '}
                    {order.createdAt?.toLocaleDateString('fi-FI', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-base font-medium ${getStatusColorClass(order.status)}`}
                >
                  {formatStatus(order.status)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-base">
                <div>
                  <span className="font-medium">Maksutapa:</span>{' '}
                  {order.paymentMethod || 'Ei tietoa'}
                </div>
                <div>
                  <span className="font-medium">Lähde:</span>{' '}
                  {order.source || 'Tuntematon'}
                </div>
              </div>
            </div>

            {/* Tuotteet */}
            <div className="bg-[#FFFFFF] rounded-lg border border-gray-300 shadow-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Tilatut tuotteet</h3>

              <div className="space-y-3">
                {order.orderItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-gray-50 rounded gap-2"
                  >
                    <div>
                      <h4 className="font-medium">
                        {item.title || 'Nimetön tuote'}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Tuotekoodi: {item.productCode || item.id || 'Ei koodia'}
                      </p>
                      <p className="text-sm text-gray-600 sm:hidden">
                        Hinta: {(parseFloat(item.price) || 0).toFixed(2)}€ ×{' '}
                        {item.quantity || 0} kpl
                      </p>
                    </div>
                    <div className="text-left sm:text-right w-full sm:w-auto mt-2 sm:mt-0">
                      <p className="text-sm text-gray-600 hidden sm:block">
                        {(parseFloat(item.price) || 0).toFixed(2)}€ ×{' '}
                        {item.quantity || 0} kpl
                      </p>
                      <p className="font-medium">
                        {(
                          (parseFloat(item.price) || 0) *
                          (parseInt(item.quantity) || 0)
                        ).toFixed(2)}
                        €
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Yhteenveto */}
              <div className="border-t mt-4 pt-4">
                <div className="space-y-2 text-base">
                  <div className="flex justify-between">
                    <span>Tuotteet yhteensä:</span>
                    <span>
                      {(
                        order.totalAmount - (parseFloat(order.shippingFee) || 0)
                      ).toFixed(2)}
                      €
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Toimitus:</span>
                    <span>
                      {(parseFloat(order.shippingFee) || 0).toFixed(2)}€
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Yhteensä:</span>
                    <span className="text-green-600">
                      {order.totalAmount.toFixed(2)}€
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Oikea sarake - Asiakastiedot ja toiminnot */}
          <div className="space-y-6">
            {/* Asiakastiedot */}
            <div className="bg-[#FFFFFF] rounded-lg border border-gray-300 shadow-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Asiakastiedot</h3>

              <div className="space-y-3 text-base">
                <div>
                  <span className="font-medium">Nimi:</span>
                  <br />
                  {order.customerInfo.fullName || 'Ei nimeä'}
                </div>
                <div>
                  <span className="font-medium">Sähköposti:</span>
                  <br />
                  {order.customerInfo.email || 'Ei sähköpostia'}
                </div>
                <div>
                  <span className="font-medium">Käyttäjä ID:</span>
                  <br />
                  <span className="text-xs text-gray-500">
                    {order.user?.uid || order.userId || 'Ei ID:tä'}
                  </span>
                </div>
              </div>
            </div>

            {/* Toimitusosoite */}
            <div className="bg-[#FFFFFF] rounded-lg border border-gray-300 shadow-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Toimitusosoite</h3>

              <div className="text-base">
                <p>
                  {order.shippingAddress.firstName}{' '}
                  {order.shippingAddress.lastName}
                </p>
                <p>{order.shippingAddress.address}</p>
                <p>
                  {order.shippingAddress.postalCode}{' '}
                  {order.shippingAddress.city}
                </p>
                <p>{order.shippingAddress.country}</p>
                {order.shippingAddress.email && (
                  <p className="text-gray-600 mt-2">
                    {order.shippingAddress.email}
                  </p>
                )}
              </div>
            </div>

            {/* Toiminnot */}
            <div className="bg-[#FFFFFF] rounded-lg border border-gray-300 shadow-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Toiminnot</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-base font-medium mb-2">
                    Päivitä tila:
                  </label>
                  <select
                    value={order.status || 'pending'}
                    onChange={(e) => updateOrderStatus(e.target.value)}
                    disabled={updating}
                    className="bg-white w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pending">Odottaa</option>
                    <option value="processing">Käsittelyssä</option>
                    <option value="shipped">Lähetetty</option>
                    <option value="delivered">Toimitettu</option>
                    <option value="completed">Valmis</option>
                    <option value="cancelled">Peruutettu</option>
                  </select>
                </div>

                <div className="border-t pt-4">
                  <button
                    onClick={deleteOrder}
                    disabled={updating}
                    className="w-full bg-[#E73725] hover:bg-red-700 disabled:bg-red-400 text-white font-medium py-2 px-4 rounded-md transition-colors"
                  >
                    {updating ? 'Poistetaan...' : 'Poista tilaus'}
                  </button>
                  <p className="text-xs text-gray-500 mt-2">
                    Varoitus: Tämä toiminto ei ole palautettavissa
                  </p>
                </div>
              </div>
            </div>

            {/* Debug-tiedot (kehitysympäristössä) 
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-gray-100 rounded-lg p-4">
              <h4 className="text-sm font-semibold mb-2">Debug-tiedot</h4>
              <div className="text-xs text-gray-600 space-y-1">
                <div>Raw totalAmount: {order.amount || 'N/A'}</div>
                <div>Normalized totalAmount: {order.totalAmount}</div>
                <div>Items count: {order.orderItems.length}</div>
                <div>User.uid: {order.user?.uid || 'N/A'}</div>
                <div>UserId: {order.userId || 'N/A'}</div>
                <div>Source: {order.source || 'N/A'}</div>
                <div>Payment: {order.paymentMethod || 'N/A'}</div>
              </div>
            </div>
          )}*/}
          </div>
        </div>
      </div>

      <div className="md:hidden mt-4 mb-12 flex flex-col justify-center items-center">
        <Link
          to="/admin/orders"
          className="bg-[#E73725] hover:bg-red-700 font-librecaslon text-white text-base px-4 pt-2 pb-2 rounded"
        >
          Takaisin tilauksiin
        </Link>
      </div>
    </div>
  );
};

export default OrderDetail;
