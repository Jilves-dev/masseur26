import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { useAuth } from '../../context/AuthContext';
import AdminMobileHeader from '../../common/AdminMobileHeader';
import Header from '../../common/Header';

const AdminDashboard = () => {
  const [productCount, setProductCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // Tuotteiden määrä
        const productsQuery = collection(db, 'products');
        const productsSnapshot = await getDocs(productsQuery);
        setProductCount(productsSnapshot.size);

        // Tilausten määrä
        const ordersQuery = collection(db, 'orders');
        const ordersSnapshot = await getDocs(ordersQuery);
        setOrderCount(ordersSnapshot.size);

        // Käyttäjien määrä (esimerkki - yleensä tämä tehdään palvelinpuolella)
        const usersQuery = collection(db, 'users');
        const usersSnapshot = await getDocs(usersQuery);
        setUserCount(usersSnapshot.size);

        // KORJATTU: Viimeisimmät tilaukset - parempi data normalisointi
        const recentOrdersQuery = query(
          collection(db, 'orders'),
          orderBy('createdAt', 'desc')
        );
        const recentOrdersSnapshot = await getDocs(recentOrdersQuery);

        const recentOrdersData = recentOrdersSnapshot.docs
          .slice(0, 5) // Otetaan vain 5 viimeisintä
          .map((doc) => {
            const rawData = doc.data();

            console.log('=== ADMIN DASHBOARD ORDER DEBUG ===');
            console.log('Raw order data:', rawData);

            // Normalisoi asiakastiedot monista lähteistä
            const getCustomerInfo = () => {
              // Yritä hakea nimi useista paikoista
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
              };
            };

            const customerInfo = getCustomerInfo();

            // Normalisoi summa monista lähteistä
            const totalAmount =
              parseFloat(rawData.totalAmount) ||
              parseFloat(rawData.amount) ||
              parseFloat(rawData.grandTotal) ||
              0;

            console.log('Customer info:', customerInfo);
            console.log('Total amount:', totalAmount);

            return {
              id: doc.id,
              // Säilytä alkuperäiset kentät
              ...rawData,
              // Lisää normalisoidut kentät
              customerName: customerInfo.name,
              customerEmail: customerInfo.email,
              totalAmount: totalAmount,
              createdAt: rawData.createdAt?.toDate
                ? rawData.createdAt.toDate()
                : new Date(rawData.createdAt || Date.now()),
            };
          });

        console.log('=== PROCESSED RECENT ORDERS ===');
        console.log('Recent orders:', recentOrdersData);

        setRecentOrders(recentOrdersData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Ladataan...</div>;
  }

  return (
    <div>
      {/* ✅ Admin Mobile Header - Näkyy vain mobiilinäkymässä*/}
      <AdminMobileHeader pageTitle="Admin Dashboard" />

      {/* ✅ Normaali Header - Näkyy vain desktop-näkymässä */}
      <div className="hidden md:block">
        <Header />
      </div>
      <div className="container mx-auto px-4 py-8 bg-[#eceef1] font-oswaldVariable">
        {/* Otsikko ja käyttäjän toiminnot - Responsiivinen asettelu 
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <h1 className="font-racingSansOne text-3xl font-medium mb-4 sm:mb-0">Hallintapaneeli</h1>
        <div className="font-oswaldVariable flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
          <span>Tervetuloa, {currentUser?.displayName || currentUser?.email}</span>
          <button 
            onClick={handleLogout}
            className="bg-[#e31837] hover:bg-[#333f48] text-white px-4 py-2 rounded w-full sm:w-auto"
          >
            Kirjaudu ulos
          </button>
        </div>
      </div>*/}

        <div className="bg-[#eceef1] mb-6 flex flex-col gap-4 justify-center items-center md:flex-row md:justify-between md:items-center">
          <div className="text-center md:text-left">
            <h2 className="font-racingSansOne text-xl font-medium">
              Tervetuloa, {currentUser?.displayName || currentUser?.email}
            </h2>
            <p className="text-lg text-gray-600">
              Hallinnoi verkkokauppaasi ja näe statistiikkaa
            </p>
          </div>
          <div className="hidden md:block">
            <button
              onClick={handleLogout}
              className="text-base bg-[#e31837] hover:bg-[#333f48] text-white px-4 py-2 rounded"
            >
              Kirjaudu ulos
            </button>
          </div>
        </div>

        {/* Tilastolaatikot */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#eceef1] border border-gray-300 rounded-lg shadow-xl p-6">
            <h2 className="font-racingSansOne text-xl font-semibold mb-2">Tuotteet</h2>
            <p className="text-3xl font-bold text-[#e31837]">{productCount}</p>
            <Link
              to="/admin/products"
              className="font-oswaldVariable text-[#e31837] hover:text-[#333f48] text-base mt-2 inline-block"
            >
              Hallitse tuotteita →
            </Link>
          </div>

          <div className="bg-[#eceef1] border border-gray-300 rounded-lg shadow-xl p-6">
            <h2 className="font-racingSansOne text-xl font-semibold mb-2">Tilaukset</h2>
            <p className="text-3xl font-bold text-[#e31837]">{orderCount}</p>
            <Link
              to="/admin/orders"
              className="text-[#e31837] hover:text-[#333f48] text-base mt-2 inline-block"
            >
              Hallitse tilauksia →
            </Link>
          </div>

          <div className="bg-[#eceef1] border border-gray-300 rounded-lg shadow-xl p-6">
            <h2 className="font-racingSansOne text-xl font-semibold mb-2">Käyttäjät</h2>
            <p className="text-3xl font-bold text-[#e31837]">{userCount}</p>
            <Link
              to="/admin/users"
              className="text-[#e31837] hover:text-[#333f48] text-base mt-2 inline-block"
            >
              Hallitse käyttäjiä →
            </Link>
          </div>

          <div className="bg-[#eceef1] border border-gray-300 rounded-lg shadow-xl p-6">
            <h2 className="font-racingSansOne text-xl font-semibold mb-2">Varaukset</h2>
            <p className="text-3xl font-bold text-[#e31837]">📅</p>
            <Link
              to="/admin/bookings"
              className="text-[#e31837] hover:text-[#333f48] text-base mt-2 inline-block"
            >
              Hallitse varauksia →
            </Link>
          </div>

          <div className="bg-[#eceef1] border border-gray-300 rounded-lg shadow-xl p-6">
            <h2 className="font-racingSansOne text-xl font-semibold mb-2">Kalenteri</h2>
            <p className="text-3xl font-bold text-[#e31837]">🗓</p>
            <Link
              to="/admin/availability"
              className="text-[#e31837] hover:text-[#333f48] text-base mt-2 inline-block"
            >
              Hallitse saatavuutta →
            </Link>
          </div>
        </div>

        {/* Viimeisimmät tilaukset */}
        <div className="bg-[#eceef1] rounded-lg border border-gray-300 shadow-xl p-6">
          <h2 className="font-racingSansOne text-xl font-semibold mb-4">Viimeisimmät tilaukset</h2>

          {recentOrders.length === 0 ? (
            <p className="text-gray-500 text-base">Ei tilauksia</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-[#eceef1] hover:white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b text-left">Tilaus ID</th>
                    <th className="py-2 px-4 border-b text-left">Asiakas</th>
                    <th className="py-2 px-4 border-b text-left">Päivämäärä</th>
                    <th className="py-2 px-4 border-b text-left">Summa</th>
                    <th className="py-2 px-4 border-b text-left">Tila</th>
                    <th className="py-2 px-4 border-b text-left">Debug</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="py-2 px-4 border-b">
                        <Link
                          to={`/admin/orders/${order.id}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {order.id.slice(0, 8)}...
                        </Link>
                      </td>
                      <td className="py-2 px-4 border-b">
                        <div>
                          <div className="font-medium">
                            {order.customerName || 'Tuntematon'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {order.customerEmail || 'Ei sähköpostia'}
                          </div>
                        </div>
                      </td>
                      <td className="py-2 px-4 border-b">
                        {order.createdAt
                          ? order.createdAt.toLocaleDateString('fi-FI')
                          : 'Tuntematon'}
                      </td>
                      <td className="py-2 px-4 border-b">
                        <span
                          className={
                            order.totalAmount > 0
                              ? 'text-green-600 font-medium'
                              : 'text-red-600'
                          }
                        >
                          {order.totalAmount > 0
                            ? `${order.totalAmount.toFixed(2)}€`
                            : 'Ei summaa'}
                        </span>
                      </td>
                      <td className="py-2 px-4 border-b">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            order.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : order.status === 'processing'
                                ? 'bg-yellow-100 text-yellow-800'
                                : order.status === 'pending'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {order.status === 'completed'
                            ? 'Valmis'
                            : order.status === 'processing'
                              ? 'Käsittelyssä'
                              : order.status === 'pending'
                                ? 'Odottaa'
                                : 'Tuntematon'}
                        </span>
                      </td>
                      {/*<td className="py-2 px-4 border-b text-xs text-gray-500">
                      <div>
                        Raw: {order.amount || 'N/A'}€
                      </div>
                      <div>
                        Items: {(order.orderItems || order.products || []).length}
                      </div>
                      <div>
                        User: {order.user?.uid ? '✓' : '✗'}
                      </div>
                    </td>*/}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-4">
            <Link
              to="/admin/orders"
              className="text-[#e31837] hover:text-[#333f48]"
            >
              Näytä kaikki tilaukset →
            </Link>
          </div>
        </div>

        <div className="md:hidden mt-8 mb-6 flex flex-col justify-center items-center">
          <button
            onClick={handleLogout}
            className="w-full text-base bg-[#e31837] hover:bg-[#333f48] text-white px-4 py-2 rounded"
          >
            Kirjaudu ulos
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
