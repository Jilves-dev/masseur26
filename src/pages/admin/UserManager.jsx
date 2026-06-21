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
  where,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import AdminMobileHeader from '../../common/AdminMobileHeader';
import Header from '../../common/Header';

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    adminUsers: 0,
    customerUsers: 0,
    recentUsers: 0,
    activeUsers: 0,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');

      console.log('=== FETCHING USERS ===');

      const usersRef = collection(db, 'users');
      const q = query(usersRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);

      const usersData = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate
            ? data.createdAt.toDate()
            : new Date(data.createdAt || Date.now()),
          updatedAt: data.updatedAt?.toDate
            ? data.updatedAt.toDate()
            : new Date(data.updatedAt || Date.now()),
        };
      });

      // Laske tilastot
      const stats = calculateUserStats(usersData);
      setUserStats(stats);
      setUsers(usersData);

      console.log('Users loaded:', usersData.length);
      console.log('Stats:', stats);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Käyttäjien lataaminen epäonnistui: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateUserStats = (usersData) => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    return {
      totalUsers: usersData.length,
      adminUsers: usersData.filter((user) => user.role === 'admin').length,
      customerUsers: usersData.filter(
        (user) => user.role === 'customer' || !user.role
      ).length,
      recentUsers: usersData.filter((user) => user.createdAt >= sevenDaysAgo)
        .length,
      activeUsers: usersData.filter((user) => user.updatedAt >= thirtyDaysAgo)
        .length,
    };
  };

  // Käyttäjän roolin päivittäminen
  const updateUserRole = async (userId, newRole) => {
    if (
      !window.confirm(`Haluatko varmasti vaihtaa käyttäjän roolin: ${newRole}?`)
    ) {
      return;
    }

    try {
      await updateDoc(doc(db, 'users', userId), {
        role: newRole,
        updatedAt: new Date(),
      });

      // Päivitä paikallinen tila
      setUsers(
        users.map((user) =>
          user.id === userId
            ? { ...user, role: newRole, updatedAt: new Date() }
            : user
        )
      );

      // Päivitä tilastot
      const updatedUsers = users.map((user) =>
        user.id === userId ? { ...user, role: newRole } : user
      );
      setUserStats(calculateUserStats(updatedUsers));
    } catch (error) {
      console.error('Error updating user role:', error);
      setError('Käyttäjän roolin päivittäminen epäonnistui');
    }
  };

  // Käyttäjän poistaminen
  const deleteUser = async (userId, userEmail) => {
    if (
      !window.confirm(
        `Haluatko varmasti poistaa käyttäjän: ${userEmail}?\n\nVaroitus: Tämä poistaa vain käyttäjäprofiilin, ei Firebase Auth -tiliä.`
      )
    ) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'users', userId));

      // Päivitä paikallinen tila
      const updatedUsers = users.filter((user) => user.id !== userId);
      setUsers(updatedUsers);
      setUserStats(calculateUserStats(updatedUsers));
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Käyttäjän poisto epäonnistui');
    }
  };

  // Suodatetut ja järjestetyt käyttäjät
  const filteredAndSortedUsers = users
    .filter((user) => {
      const matchesRole =
        filterRole === 'all' ||
        user.role === filterRole ||
        (filterRole === 'customer' && !user.role);
      const matchesSearch =
        searchTerm === '' ||
        user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesRole && matchesSearch;
    })
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      // Erikoiskäsittely päivämäärille
      if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
        aValue = aValue instanceof Date ? aValue : new Date(aValue);
        bValue = bValue instanceof Date ? bValue : new Date(bValue);
      }

      // Järjestä
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Roolin formatointi
  const formatRole = (role) => {
    switch (role) {
      case 'admin':
        return 'Ylläpitäjä';
      case 'customer':
        return 'Asiakas';
      default:
        return 'Asiakas';
    }
  };

  // Roolin värin formatointi
  const getRoleColorClass = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'customer':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="text-center py-10">Ladataan käyttäjiä...</div>;
  }

  return (
    <div>
      {/* ✅ Admin Mobile Header - Näkyy vain mobiilinäkymässä*/}
      <AdminMobileHeader pageTitle="User manager" />

      {/* ✅ Normaali Header - Näkyy vain desktop-näkymässä */}
      <div className="hidden md:block">
        <Header />
      </div>

      <div className="container mx-auto px-4 py-8 bg-[#FFFFFF] font-librecaslon">
        {error && (
          <div className="bg-[#E73725] border border-red-400 text-white px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Tilastot */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-[#FFFFFF] rounded-lg border border-gray-300 shadow-xl p-6">
            <h3 className="text-lg font-semibold text-[#E73725]">
              Käyttäjiä yhteensä
            </h3>
            <p className="text-3xl font-bold text-[#E73725]">
              {userStats.totalUsers}
            </p>
          </div>

          <div className="bg-[#FFFFFF] rounded-lg border border-gray-300 shadow-xl p-6">
            <h3 className="text-lg font-semibold text-[#0BA334]">
              Ylläpitäjät
            </h3>
            <p className="text-3xl font-bold text-[#0BA334]">
              {userStats.adminUsers}
            </p>
          </div>

          <div className="bg-[#FFFFFF] rounded-lg border border-gray-300 shadow-xl p-6">
            <h3 className="text-lg font-semibold text-[#0B7AA3]">Asiakkaat</h3>
            <p className="text-3xl font-bold text-[#0B7AA3]">
              {userStats.customerUsers}
            </p>
          </div>

          <div className="bg-[#FFFFFF] rounded-lg border border-gray-300 shadow-xl p-6">
            <h3 className="text-lg font-semibold text-[#7AA30B]">
              Uudet (7 pv)
            </h3>
            <p className="text-3xl font-bold text-[#7AA30B]">
              {userStats.recentUsers}
            </p>
          </div>

          <div className="bg-[#FFFFFF] rounded-lg border border-gray-300 shadow-xl p-6">
            <h3 className="text-lg font-semibold text-[#340BA3]">
              Aktiiviset (30 pv)
            </h3>
            <p className="text-3xl font-bold text-[#340BA3]">
              {userStats.activeUsers}
            </p>
          </div>
        </div>

        {/* Suodattimet ja haku */}
        <div className="bg-[#FFFFFF] text-base rounded-lg shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Haku
              </label>
              <input
                type="text"
                placeholder="Hae nimellä tai sähköpostilla..."
                className="bg-white w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Rooli
              </label>
              <select
                className="bg-white w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="all">Kaikki</option>
                <option value="admin">Ylläpitäjät</option>
                <option value="customer">Asiakkaat</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Järjestä
              </label>
              <select
                className="bg-white w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="createdAt">Liittymispäivä</option>
                <option value="updatedAt">Viimeksi aktiivinen</option>
                <option value="displayName">Nimi</option>
                <option value="email">Sähköposti</option>
                <option value="role">Rooli</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Järjestys
              </label>
              <select
                className="bg-white w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="desc">Laskeva</option>
                <option value="asc">Nouseva</option>
              </select>
            </div>
          </div>
        </div>

        {/* Käyttäjätaulukko */}
        <div className="bg-[#FFFFFF] rounded-lg border border-gray-300 shadow-xl">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold">
              Käyttäjät ({filteredAndSortedUsers.length})
            </h2>
          </div>

          {filteredAndSortedUsers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {searchTerm || filterRole !== 'all'
                  ? 'Ei hakutuloksia'
                  : 'Ei käyttäjiä'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-[#FFFFFF]">
                  <tr>
                    <th className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase">
                      Käyttäjä
                    </th>
                    <th className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase">
                      Rooli
                    </th>
                    <th className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase">
                      Liittynyt
                    </th>
                    <th className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase">
                      Viimeksi aktiivinen
                    </th>
                    <th className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase">
                      Toiminnot
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredAndSortedUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">
                            {user.displayName || 'Ei nimeä'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                          {user.phone && (
                            <div className="text-sm text-gray-400">
                              📞 {user.phone}
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <select
                          value={user.role || 'customer'}
                          onChange={(e) =>
                            updateUserRole(user.id, e.target.value)
                          }
                          className={`px-2 py-1 rounded-full text-base font-medium border-0 ${getRoleColorClass(user.role)}`}
                        >
                          <option value="customer">Asiakas</option>
                          <option value="admin">Ylläpitäjä</option>
                        </select>
                      </td>

                      <td className="px-6 py-4 text-base text-gray-500">
                        {user.createdAt?.toLocaleDateString('fi-FI', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>

                      <td className="px-6 py-4 text-base text-gray-500">
                        {user.updatedAt?.toLocaleDateString('fi-FI', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <Link
                            to={`/admin/users/${user.id}`}
                            className="text-[#340BA3] hover:text-blue-800 text-base"
                          >
                            Näytä
                          </Link>
                          <button
                            onClick={() => deleteUser(user.id, user.email)}
                            className="text-[#E73725] hover:text-red-900 text-base"
                            disabled={user.role === 'admin'}
                          >
                            {user.role === 'admin' ? 'Suojattu' : 'Poista'}
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
          className="bg-[#E73725] hover:bg-red-700 font-librecaslon text-white text-base px-4 pt-2 pb-2 rounded"
        >
          Takaisin hallintapaneeliin
        </Link>
      </div>
    </div>
  );
};

export default UserManager;
