import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  addDoc,
} from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import AdminMobileHeader from '../../common/AdminMobileHeader';
import Header from '../../common/Header';

const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });

  // Hae tilaukset
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');

      console.log('=== ORDERMANAGER FETCHING ORDERS ===');

      const ordersRef = collection(db, 'orders');
      const q = query(ordersRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);

      const ordersData = snapshot.docs.map((doc) => {
        const rawData = doc.data();

        console.log('=== ORDER DEBUG ===');
        console.log('Raw order data:', rawData);

        // SAMA NORMALISOINTI KUIN AdminDashboard:ssa
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

          const fullName = `${firstName} ${lastName}`.trim();
          return {
            name: fullName || email.split('@')[0] || 'Tuntematon asiakas',
            email: email,
            firstName: firstName,
            lastName: lastName,
          };
        };

        const customerInfo = getCustomerInfo();

        // Normalisoi summa monista lähteistä
        const totalAmount =
          parseFloat(rawData.totalAmount) ||
          parseFloat(rawData.amount) ||
          parseFloat(rawData.grandTotal) ||
          0;

        // Normalisoi tuotteet
        const orderItems = rawData.orderItems || rawData.products || [];

        console.log('Customer info:', customerInfo);
        console.log('Total amount:', totalAmount);
        console.log('Order items:', orderItems);

        return {
          id: doc.id,
          // Säilytä alkuperäiset kentät
          ...rawData,
          // Lisää normalisoidut kentät
          customerName: customerInfo.name,
          customerEmail: customerInfo.email,
          customerFirstName: customerInfo.firstName,
          customerLastName: customerInfo.lastName,
          totalAmount: totalAmount,
          orderItems: orderItems,
          products: orderItems, // Kaksoistuki
          createdAt: rawData.createdAt?.toDate
            ? rawData.createdAt.toDate()
            : new Date(rawData.createdAt || Date.now()),
          // Normalisoi toimitusosoite
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
      });

      // Laske tilastot
      const summary = {
        totalOrders: ordersData.length,
        totalRevenue: ordersData.reduce(
          (sum, order) => sum + (parseFloat(order.totalAmount) || 0),
          0
        ),
        pendingOrders: ordersData.filter((order) => order.status === 'pending')
          .length,
        completedOrders: ordersData.filter((order) =>
          ['completed', 'delivered', 'paid'].includes(
            order.status?.toLowerCase()
          )
        ).length,
      };

      console.log('=== ORDERMANAGER SUMMARY ===');
      console.log('Orders found:', ordersData.length);
      console.log('Summary:', summary);

      setOrders(ordersData);
      setSummary(summary);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Tilausten lataaminen epäonnistui: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Päivitä tilauksen status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      console.log(`Updating order ${orderId} to status: ${newStatus}`);

      // 1. HAE TILAUKSEN TIEDOT ENSIN
      const orderRef = doc(db, 'orders', orderId);
      const orderDoc = await getDoc(orderRef);

      if (!orderDoc.exists()) {
        throw new Error('Tilausta ei löydy');
      }

      const orderData = {
        id: orderId,
        ...orderDoc.data(),
      };

      console.log('Order data for email:', orderData);

      // 2. PÄIVITÄ TILAUKSEN STATUS
      await updateDoc(orderRef, {
        status: newStatus,
        updatedAt: new Date(),
      });

      // Lähetä sähköposti-ilmoitus tilamuutoksesta
      await sendOrderStatusEmail(orderData, newStatus, orderId);

      // Päivitä paikallinen tila
      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      // Päivitä tilastot
      await fetchOrders();

      console.log(`Order ${orderId} status updated successfully`);
    } catch (error) {
      console.error('Error updating order status:', error);
      setError('Tilauksen tilan päivitys epäonnistui' + error.message);
    }
  };

  // Apufunktio sähköpostin lähettämiseen
  const sendOrderStatusEmail = async (order, newStatus, orderId) => {
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

      // Luo HTML-sähköposti  {/*Tilauksesi📦<strong style="color: #e31837;">#${orderId.slice(0, 8)}</strong>📦 tila on nyt:*/}
      //{/*<p style="margin: 5px 0 0 0; opacity: 0.9;">Tilauksesi tila on päivittynyt🪄</p>*/}
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #e31837; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">Urheiluhieroja💆</h1>
          </div>
          
          <div style="background-color: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #e31837; margin-top: 0;">Hei ${customerName}!😎</h2>
            
            <p style="font-size: 16px; line-height: 1.6;">
              📦<strong style="color: #e31837;">${orderTitle}📦(Tilaus id#${orderId.slice(0, 8)})tila on nyt:</strong>
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
              <div style="border-top: 2px solid #e31837; padding-top: 15px; margin-top: 15px;">
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
                <strong style="color: #e31837;">Urheiluhieroja</strong>
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
        Urheiluhieroja
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

  // Poista tilaus
  const deleteOrder = async (orderId) => {
    if (!window.confirm('Haluatko varmasti poistaa tämän tilauksen?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'orders', orderId));

      // Päivitä paikallinen tila
      setOrders(orders.filter((order) => order.id !== orderId));

      // Päivitä tilastot
      await fetchOrders();
    } catch (error) {
      console.error('Error deleting order:', error);
      setError('Tilauksen poisto epäonnistui');
    }
  };

  // Formatoi status
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

  // Status-värit
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
    return <div className="text-center py-10">Ladataan tilauksia...</div>;
  }

  return (
    <div>
      {/* ✅ Admin Mobile Header - Näkyy vain mobiilinäkymässä*/}
      <AdminMobileHeader pageTitle="Tilauksien hallinta" />

      {/* ✅ Normaali Header - Näkyy vain desktop-näkymässä */}
      <div className="hidden md:block">
        <Header />
      </div>

      <div className="container mx-auto px-4 py-8 bg-[#eceef1] font-oswaldVariable">
        {/* Tilastot */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#eceef1] border border-gray-300 rounded-2xl shadow-xl p-6">
            <h3 className="font-racingSansOne text-lg font-medium text-gray-700">
              Tilauksia yhteensä
            </h3>
            <p className="text-3xl font-bold text-blue-600">
              {summary.totalOrders}
            </p>
          </div>

          <div className="bg-[#eceef1] border border-gray-300 rounded-2xl shadow-xl p-6">
            <h3 className="font-racingSansOne text-lg font-medium text-gray-700">
              Kokonaismyynti
            </h3>
            <p className="text-3xl font-bold text-green-600">
              {summary.totalRevenue.toFixed(2)}€
            </p>
          </div>

          <div className="bg-[#eceef1] border border-gray-300 rounded-2xl shadow-xl p-6">
            <h3 className="font-racingSansOne text-lg font-medium text-gray-700">Odottavat</h3>
            <p className="text-3xl font-bold text-yellow-600">
              {summary.pendingOrders}
            </p>
          </div>

          <div className="bg-[#eceef1] border border-gray-300 rounded-2xl shadow-xl p-6">
            <h3 className="font-racingSansOne text-lg font-medium text-gray-700">Valmiit</h3>
            <p className="text-3xl font-bold text-green-600">
              {summary.completedOrders}
            </p>
          </div>
        </div>

        {/* Tilaukset */}
        <div className="bg-[#eceef1] rounded-lg border border-gray-300 shadow-xl">
          <div className="px-6 py-4 border-b">
            <h2 className="font-racingSansOne text-xl font-medium">
              Kaikki tilaukset ({orders.length})
            </h2>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Ei tilauksia</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-[#eceef1]">
                  <tr>
                    <th className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase">
                      Tilaus
                    </th>
                    <th className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase">
                      Asiakas
                    </th>
                    <th className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase">
                      Tuotteet
                    </th>
                    <th className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase">
                      Summa
                    </th>
                    <th className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase">
                      Tila
                    </th>
                    <th className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase">
                      Päivämäärä
                    </th>
                    <th className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase">
                      Toiminnot
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-400">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <Link
                          to={`/admin/orders/${order.id}`}
                          className="text-base text-blue-600 hover:text-blue-800 font-medium"
                        >
                          #{order.id.slice(0, 8)}
                        </Link>
                      </td>

                      <td className="px-6 py-4">
                        <div>
                          <div className="text-base font-medium text-gray-900">
                            {order.customerName || 'Tuntematon'}
                          </div>
                          <div className="text-base text-gray-500">
                            {order.customerEmail || 'Ei sähköpostia'}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-base">
                          {order.orderItems.length} tuotetta
                          <div className="text-base text-gray-500">
                            {order.orderItems
                              .slice(0, 2)
                              .map((item) => item.title)
                              .join(', ')}
                            {order.orderItems.length > 2 && '...'}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`font-medium ${order.totalAmount > 0 ? 'text-green-600' : 'text-red-600'}`}
                        >
                          {order.totalAmount > 0
                            ? `${order.totalAmount.toFixed(2)}€`
                            : 'Ei summaa'}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <select
                          value={order.status || 'pending'}
                          onChange={(e) =>
                            updateOrderStatus(order.id, e.target.value)
                          }
                          className={`px-2 py-1 rounded-full text-base font-medium border-0 ${getStatusColorClass(order.status)}`}
                        >
                          <option value="pending">Odottaa</option>
                          <option value="processing">Käsittelyssä</option>
                          <option value="shipped">Lähetetty</option>
                          <option value="delivered">Toimitettu</option>
                          <option value="completed">Valmis</option>
                          <option value="cancelled">Peruutettu</option>
                        </select>
                      </td>

                      <td className="px-6 py-4 text-base text-gray-500">
                        {order.createdAt?.toLocaleDateString('fi-FI')}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <Link
                            to={`/admin/orders/${order.id}`}
                            className="font-oswaldVariable text-blue-600 hover:text-blue-800 text-base"
                          >
                            Näytä
                          </Link>
                          <button
                            onClick={() => deleteOrder(order.id)}
                            className="font-oswaldVariable text-red-600 hover:text-red-800 text-base"
                          >
                            Poista
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <div className="md:hidden mt-4 mb-12 flex flex-col justify-center items-center">
        <Link
          to="/admin"
          className="bg-[#e31837] hover:bg-[#333f48] font-oswaldVariable text-white text-base px-4 pt-2 pb-2 rounded"
        >
          Takaisin hallintapaneeliin
        </Link>
      </div>
    </div>
  );
};

export default OrderManager;
