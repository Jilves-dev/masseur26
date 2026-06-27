import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
} from 'firebase/firestore';
import {
  updateProfile,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';
import { db } from '../../firebase/firebase';
//import PageHeading from "../../common/PageHeading";
import AdminMobileHeader from '../../common/AdminMobileHeader';
import Header from '../../common/Header';

const UserProfile = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userProfile, setUserProfile] = useState({
    displayName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    country: '',
  });
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  //const [activeTab, setActiveTab] = useState("profile");
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [ordersSummary, setOrdersSummary] = useState({
    totalOrders: 0,
    totalSpent: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });

  // ✅ Lue välilehti URL:sta tai käytä oletusta "profile"
  const [activeTab, setActiveTab] = useState(
    searchParams.get('tab') || 'profile'
  );

  // ... muut statet

  // ✅ Synkronoi URL kun välilehti vaihtuu
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  // ✅ Päivitä URL kun välilehti vaihtuu
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        setError('');

        // Käyttäjäprofiilin haku/luonti
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          await setDoc(userDocRef, {
            displayName: currentUser.displayName || '',
            email: currentUser.email,
            role: 'customer',
            createdAt: new Date(),
            updatedAt: new Date(),
          });

          const newUserDoc = await getDoc(userDocRef);
          const userData = newUserDoc.data();

          setUserProfile({
            displayName: currentUser.displayName || userData.displayName || '',
            email: currentUser.email || '',
            phone: userData.phone || '',
            address: userData.address || '',
            city: userData.city || '',
            zipCode: userData.zipCode || '',
            country: userData.country || '',
          });
        } else {
          const userData = userDoc.data();
          setUserProfile({
            displayName: currentUser.displayName || userData.displayName || '',
            email: currentUser.email || '',
            phone: userData.phone || '',
            address: userData.address || '',
            city: userData.city || '',
            zipCode: userData.zipCode || '',
            country: userData.country || '',
          });
        }

        // PARANNETTU TILAUSTEN HAKU - Sama logiikka kuin OrderManager:ssa
        await fetchUserOrders();
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Käyttäjätietojen hakeminen epäonnistui: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser, navigate]);

  // UUSI: Erillinen funktio tilausten hakuun
  const fetchUserOrders = async () => {
    try {
      console.log('=== USERPROFILE FETCHING ORDERS ===');
      console.log('Current user UID:', currentUser.uid);

      // Ensisijainen kysely: userId (käyttää olemassa olevaa indexiä)
      let ordersQuery = query(
        collection(db, 'orders'),
        where('userId', '==', currentUser.uid),
        orderBy('createdAt', 'desc')
      );

      let ordersSnapshot;
      try {
        ordersSnapshot = await getDocs(ordersQuery);
        console.log('Query 1 (userId) results:', ordersSnapshot.size);
      } catch (queryError) {
        console.log('Query 1 failed, trying user.uid query:', queryError);

        // Vaihtoehtoinen kysely user.uid-kentän perusteella
        ordersQuery = query(
          collection(db, 'orders'),
          where('user.uid', '==', currentUser.uid),
          orderBy('createdAt', 'desc')
        );

        try {
          ordersSnapshot = await getDocs(ordersQuery);
          console.log('Query 2 (user.uid) results:', ordersSnapshot.size);
        } catch (altQueryError) {
          console.error('Both queries failed:', altQueryError);

          // Kolmas yritys ilman orderBy
          try {
            ordersQuery = query(
              collection(db, 'orders'),
              where('userId', '==', currentUser.uid)
            );
            ordersSnapshot = await getDocs(ordersQuery);
            console.log(
              'Query 3 (userId without orderBy) results:',
              ordersSnapshot.size
            );
          } catch (finalError) {
            console.error('All queries failed:', finalError);
            setOrders([]);
            return;
          }
        }
      }

      if (ordersSnapshot.empty) {
        console.log('No orders found for user');
        setOrders([]);
        setOrdersSummary({
          totalOrders: 0,
          totalSpent: 0,
          pendingOrders: 0,
          completedOrders: 0,
        });
        return;
      }

      // SAMA NORMALISOINTI KUIN OrderManager:ssa
      const ordersData = ordersSnapshot.docs.map((doc) => {
        const rawData = doc.data();

        // Normalisoi asiakastiedot
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

          return { firstName, lastName, email };
        };

        const customerInfo = getCustomerInfo();

        // Normalisoi summa
        const totalAmount =
          parseFloat(rawData.totalAmount) ||
          parseFloat(rawData.amount) ||
          parseFloat(rawData.grandTotal) ||
          0;

        // Normalisoi tuotteet
        const orderItems = rawData.orderItems || rawData.products || [];

        console.log('Order processed:', doc.id, {
          userUID: rawData.user?.uid,
          userId: rawData.userId,
          totalAmount: totalAmount,
          itemsCount: orderItems.length,
        });

        return {
          id: doc.id,
          ...rawData,
          customerInfo,
          totalAmount,
          orderItems,
          products: orderItems, // Kaksoistuki
          createdAt: rawData.createdAt?.toDate
            ? rawData.createdAt.toDate()
            : new Date(rawData.createdAt || Date.now()),
          shippingFee: parseFloat(rawData.shippingFee) || 5,
        };
      });

      // Järjestä päivämäärän mukaan jos orderBy ei toiminut
      ordersData.sort((a, b) => b.createdAt - a.createdAt);

      // Laske tilastot
      const summary = {
        totalOrders: ordersData.length,
        totalSpent: ordersData.reduce(
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

      console.log('=== USERPROFILE ORDERS SUMMARY ===');
      console.log('Orders found:', ordersData.length);
      console.log('Summary:', summary);

      setOrders(ordersData);
      setOrdersSummary(summary);
    } catch (orderError) {
      console.error('Tilausten hakeminen epäonnistui:', orderError);
      setError('Tilausten hakeminen epäonnistui: ' + orderError.message);
      setOrders([]);
    }
  };

  // Profiilin tietojen päivitys
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setUserProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Salasanan tietojen päivitys
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Profiilin tallentaminen
  const handleSaveProfile = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const userDocRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        await setDoc(
          userDocRef,
          {
            ...userDoc.data(),
            displayName: userProfile.displayName,
            phone: userProfile.phone,
            address: userProfile.address,
            city: userProfile.city,
            zipCode: userProfile.zipCode,
            country: userProfile.country,
            updatedAt: new Date(),
          },
          { merge: true }
        );
      } else {
        await setDoc(userDocRef, {
          displayName: userProfile.displayName,
          email: userProfile.email,
          phone: userProfile.phone,
          address: userProfile.address,
          city: userProfile.city,
          zipCode: userProfile.zipCode,
          country: userProfile.country,
          role: 'customer',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      if (currentUser.displayName !== userProfile.displayName) {
        await updateProfile(currentUser, {
          displayName: userProfile.displayName,
        });
      }

      if (currentUser.email !== userProfile.email) {
        await updateEmail(currentUser, userProfile.email);
      }

      setSuccess('Profiili päivitetty onnistuneesti');
    } catch (error) {
      console.error('Error saving profile:', error);

      if (error.code === 'auth/requires-recent-login') {
        setError(
          'Sinun on kirjauduttava uudelleen sisään ennen sähköpostin vaihtamista'
        );
      } else {
        setError('Profiilin päivittäminen epäonnistui: ' + error.message);
      }
    } finally {
      setSaving(false);
    }
  };

  // Salasanan vaihtaminen
  const handleChangePassword = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError('');
      setSuccess('');

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        throw new Error('Uusi salasana ja vahvistus eivät täsmää');
      }

      const credential = EmailAuthProvider.credential(
        currentUser.email,
        passwordData.currentPassword
      );

      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, passwordData.newPassword);

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      setSuccess('Salasana vaihdettu onnistuneesti');
    } catch (error) {
      console.error('Error changing password:', error);

      if (error.code === 'auth/wrong-password') {
        setError('Nykyinen salasana on virheellinen');
      } else {
        setError('Salasanan vaihtaminen epäonnistui: ' + error.message);
      }
    } finally {
      setSaving(false);
    }
  };

  // Uloskirjautuminen
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      setError('Uloskirjautuminen epäonnistui');
    }
  };

  // Tilauksen tilan formatointi
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

  // Tilauksen tilan värin formatointi
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
    return (
      <div className="font-oswaldVariable text-2xl text-center py-10">
        Ladataan...
      </div>
    );
  }

  return (
    <>
      <AdminMobileHeader pageTitle="User Dashboard" />
      {/* ✅ Normaali Header - Näkyy vain desktop-näkymässä */}
      <div className="hidden md:block">
        <Header />
      </div>

      <div className="container mx-auto px-4 py-8 bg-[#eceef1]">
        <div className="bg-[#eceef1] rounded-xl border border-gray-300 shadow-xl p-6">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
            <div>
              <h2 className="font-racingSansOne text-xl font-medium">
                Tervetuloa, {userProfile.displayName || currentUser.email}
              </h2>
              <p className="font-oswaldVariable text-lg text-gray-600">
                Hallinnoi tiliäsi ja näe tilauksesi
              </p>
            </div>
            <div className="hidden md:block">
              <button
                onClick={handleLogout}
                className="font-oswaldVariable text-base bg-[#e31837] hover:bg-[#333f48] text-white px-4 py-2 rounded"
              >
                Kirjaudu ulos
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}

          {/* Välilehdet */}
          <div className="flex border-b mb-6 text-lg">
            <button
              className={`py-2 px-4 mr-2 ${
                activeTab === 'profile'
                  ? 'font-oswaldVariable border-b-2 border-[#e31837] text-[#e31837] font-semibold'
                  : 'font-oswaldVariable text-gray-600 hover:text-[#e31837]'
              }`}
              onClick={() => handleTabChange('profile')}
            >
              Profiili
            </button>
            <button
              className={`py-2 px-4 mr-2 ${
                activeTab === 'orders'
                  ? 'font-oswaldVariable border-b-2 border-[#e31837] text-[#e31837] font-semibold'
                  : 'font-oswaldVariable text-gray-600 hover:text-[#e31837]'
              }`}
              onClick={() => handleTabChange('orders')}
            >
              Tilaukset ({ordersSummary.totalOrders})
            </button>
            <button
              className={`py-2 px-4 ${
                activeTab === 'password'
                  ? 'font-oswaldVariable border-b-2 border-[#e31837] text-[#e31837] font-semibold'
                  : 'font-oswaldVariable text-gray-600 hover:text-[#e31837]'
              }`}
              onClick={() => handleTabChange('password')}
            >
              Vaihda salasana
            </button>
          </div>

          {/* Profiili-välilehti */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label
                    className="font-oswaldVariable block text-gray-700 text-base font-bold mb-2"
                    htmlFor="displayName"
                  >
                    Nimi
                  </label>
                  <input
                    className="bg-white font-oswaldVariable shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="displayName"
                    name="displayName"
                    type="text"
                    placeholder="Nimi"
                    value={userProfile.displayName}
                    onChange={handleProfileChange}
                  />
                </div>

                <div>
                  <label
                    className="font-oswaldVariable block text-gray-700 text-base font-bold mb-2"
                    htmlFor="email"
                  >
                    Sähköposti
                  </label>
                  <input
                    className="bg-white font-oswaldVariable shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Sähköposti"
                    value={userProfile.email}
                    onChange={handleProfileChange}
                    disabled
                  />
                </div>
              </div>

              <div className="mb-4">
                <label
                  className="font-oswaldVariable block text-gray-700 text-base font-bold mb-2"
                  htmlFor="phone"
                >
                  Puhelinnumero
                </label>
                <input
                  className="bg-white font-oswaldVariable shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Puhelinnumero"
                  value={userProfile.phone}
                  onChange={handleProfileChange}
                />
              </div>

              <div className="mb-4">
                <label
                  className="font-oswaldVariable block text-gray-700 text-base font-bold mb-2"
                  htmlFor="address"
                >
                  Osoite
                </label>
                <input
                  className="bg-white font-oswaldVariable shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="address"
                  name="address"
                  type="text"
                  placeholder="Katuosoite"
                  value={userProfile.address}
                  onChange={handleProfileChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label
                    className="font-oswaldVariable block text-gray-700 text-base font-bold mb-2"
                    htmlFor="city"
                  >
                    Kaupunki
                  </label>
                  <input
                    className="bg-white font-oswaldVariable shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="city"
                    name="city"
                    type="text"
                    placeholder="Kaupunki"
                    value={userProfile.city}
                    onChange={handleProfileChange}
                  />
                </div>

                <div>
                  <label
                    className="font-oswaldVariable block text-gray-700 text-base font-bold mb-2"
                    htmlFor="zipCode"
                  >
                    Postinumero
                  </label>
                  <input
                    className="bg-white font-oswaldVariable shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="zipCode"
                    name="zipCode"
                    type="text"
                    placeholder="Postinumero"
                    value={userProfile.zipCode}
                    onChange={handleProfileChange}
                  />
                </div>

                <div>
                  <label
                    className="font-oswaldVariable block text-gray-700 text-base font-bold mb-2"
                    htmlFor="country"
                  >
                    Maa
                  </label>
                  <input
                    className="bg-white font-oswaldVariable shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="country"
                    name="country"
                    type="text"
                    placeholder="Maa"
                    value={userProfile.country}
                    onChange={handleProfileChange}
                  />
                </div>
              </div>

              <div className="flex justify-center md:justify-end mt-6">
                <button
                  type="submit"
                  className="font-oswaldVariable w-full md:w-auto bg-[#e31837] hover:bg-[#333f48] text-white text-base py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  disabled={saving}
                >
                  {saving ? 'Tallennetaan...' : 'Tallenna muutokset'}
                </button>
              </div>
            </form>
          )}

          {/* TILAUKSET-VÄLILEHTI */}
          {activeTab === 'orders' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-racingSansOne text-xl font-semibold">
                  Tilaushistoria
                </h3>
                {orders.length > 0 && (
                  <button
                    onClick={() => navigate('/shop')}
                    className="font-oswaldVariable bg-[#e31837] hover:bg-[#333f48] text-white px-4 py-2 rounded text-sm"
                  >
                    Jatka ostoksia
                  </button>
                )}
              </div>

              {/* Tilastot */}
              {orders.length > 0 && (
                <div className="font-oswaldVariable grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {ordersSummary.totalOrders}
                    </div>
                    <div className="text-sm text-blue-600">
                      Tilauksia yhteensä
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {ordersSummary.totalSpent.toFixed(2)}€
                    </div>
                    <div className="text-sm text-green-600">
                      Ostettu yhteensä
                    </div>
                  </div>

                  <div className="bg-yellow-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {ordersSummary.pendingOrders}
                    </div>
                    <div className="text-sm text-yellow-600">Odottavat</div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {ordersSummary.completedOrders}
                    </div>
                    <div className="text-sm text-green-600">Valmiit</div>
                  </div>
                </div>
              )}

              {orders.length === 0 ? (
                <div className="font-oswaldVariable text-center py-12 bg-[#eceef1] rounded-2xl border border-gray-300 shadow-xl">
                  <div className="mb-4">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-racingSansOne text-lg font-medium text-gray-900 mb-2">
                    Ei vielä tilauksia
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Aloita ostokset ja näet tilauksesi täällä
                  </p>
                  <button
                    onClick={() => navigate('/shop')}
                    className="bg-[#e31837] hover:bg-[#333f48] text-white px-6 py-2 rounded-md font-medium flex mx-auto items-center justify-center"
                  >
                    Selaa tuotteita
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => {
                    const displayTotal = parseFloat(order.totalAmount) || 0;
                    const shippingFee = parseFloat(order.shippingFee) || 0;
                    const grandTotal = displayTotal + shippingFee;

                    return (
                      <div
                        key={order.id}
                        className="font-oswaldVariable border border-gray-300 rounded-lg overflow-hidden bg-[#eceef1] shadow-xl hover:shadow-2xl transition-shadow"
                      >
                        {/* Tilauksen header */}
                        <div className="px-6 py-4 border-b">
                          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                            <div>
                              <h4 className="font-racingSansOne font-semibold text-lg text-gray-900">
                                Tilaus #{order.id.slice(0, 8)}
                              </h4>
                              <p className="text-base text-gray-600">
                                {order.createdAt?.toLocaleDateString('fi-FI', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                }) || 'Tuntematon päivämäärä'}
                              </p>
                            </div>
                            <div className="mt-2 md:mt-0 flex items-center space-x-4">
                              <span
                                className={`px-3 py-1 rounded-full text-base font-medium ${getStatusColorClass(order.status)}`}
                              >
                                {formatStatus(order.status)}
                              </span>
                              <div className="text-right">
                                <div className="font-bold text-lg text-gray-900">
                                  {grandTotal.toFixed(2)}€
                                </div>
                                <div className="text-base text-gray-500">
                                  {order.orderItems.length} tuotetta
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Tilauksen sisältö */}
                        <div className="px-6 py-4">
                          {/* Tuotteet */}
                          <div className="mb-4">
                            <h5 className="font-racingSansOne text-base font-medium text-gray-900 mb-3">
                              Tilatut tuotteet:
                            </h5>
                            <div className="space-y-2">
                              {order.orderItems.map((item, index) => (
                                <div
                                  key={index}
                                  className="flex justify-between items-center py-2 px-3 rounded"
                                >
                                  <div className="flex-1">
                                    <div className="text-base font-medium text-gray-900">
                                      {item.quantity || 0}×{' '}
                                      {item.title || 'Nimetön tuote'}
                                    </div>
                                    <div className="text-base text-gray-500">
                                      {(parseFloat(item.price) || 0).toFixed(2)}
                                      € / kpl
                                    </div>
                                  </div>
                                  <div className="text-base font-medium text-gray-900">
                                    {(
                                      (parseFloat(item.price) || 0) *
                                      (parseInt(item.quantity) || 0)
                                    ).toFixed(2)}
                                    €
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Hintatiedot */}
                          <div className="border-t pt-4">
                            <div className="space-y-2 text-base">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Tuotteet:</span>
                                <span className="text-gray-900">
                                  {displayTotal.toFixed(2)}€
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Toimitus:</span>
                                <span className="text-gray-900">
                                  {shippingFee.toFixed(2)}€
                                </span>
                              </div>
                              <div className="flex justify-between font-bold text-base border-t pt-2">
                                <span>Yhteensä:</span>
                                <span className="text-green-600">
                                  {grandTotal.toFixed(2)}€
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Toimitusosoite */}
                          {(order.shippingDetails || order.customerDetails) && (
                            <div className="mt-4 pt-4 border-t">
                              <h6 className="font-racingSansOne text-lg font-medium text-gray-900 mb-2">
                                Toimitusosoite:
                              </h6>
                              <div className="text-base text-gray-600">
                                <p>
                                  {order.shippingDetails?.firstName ||
                                    order.customerDetails?.firstName}{' '}
                                  {order.shippingDetails?.lastName ||
                                    order.customerDetails?.lastName}
                                </p>
                                <p>
                                  {order.shippingDetails?.address ||
                                    order.customerDetails?.address}
                                </p>
                                <p>
                                  {order.shippingDetails?.postalCode ||
                                    order.customerDetails?.postalCode}{' '}
                                  {order.shippingDetails?.city ||
                                    order.customerDetails?.city}
                                </p>
                                <p>
                                  {order.shippingDetails?.country ||
                                    order.customerDetails?.country}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Salasanan vaihto -välilehti */}
          {activeTab === 'password' && (
            <form onSubmit={handleChangePassword}>
              <div className="mb-4">
                <label
                  className="font-oswaldVariable block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="currentPassword"
                >
                  Nykyinen salasana
                </label>
                <input
                  className="font-oswaldVariable bg-white shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  placeholder="••••••••"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  className="font-oswaldVariable block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="newPassword"
                >
                  Uusi salasana
                </label>
                <input
                  className="font-oswaldVariable bg-white shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  placeholder="••••••••"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Vähintään 6 merkkiä
                </p>
              </div>

              <div className="mb-6">
                <label
                  className="font-oswaldVariable block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="confirmPassword"
                >
                  Vahvista uusi salasana
                </label>
                <input
                  className="font-oswaldVariable bg-white shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <div className="flex justify-center md:justify-end mt-6">
                <button
                  type="submit"
                  className="font-oswaldVariable w-full md:w-auto bg-[#e31837] hover:bg-[#333f48] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  disabled={saving}
                >
                  {saving ? 'Vaihdetaan...' : 'Vaihda salasana'}
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="md:hidden mt-8 mb-6 mx-8 flex flex-col justify-center items-center">
          <button
            onClick={handleLogout}
            className="w-full font-oswaldVariable text-base bg-[#e31837] hover:bg-[#333f48] text-white px-4 py-2 rounded"
          >
            Kirjaudu ulos
          </button>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
