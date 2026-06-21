import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PageHeading from '../../common/PageHeading';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, currentUser, logout } = useAuth();
  const navigate = useNavigate();

  // Tarkistetaan onko käyttäjä jo kirjautunut
  useEffect(() => {
    const checkUserAndRedirect = async () => {
      if (currentUser) {
        try {
          // Tarkistetaan käyttäjän rooli Firestoresta
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));

          if (userDoc.exists() && userDoc.data().role === 'admin') {
            navigate('/admin'); // Admin-käyttäjä ohjataan admin-paneeliin
          } else {
            navigate('/profile'); // Tavallinen käyttäjä ohjataan profiilisivulle
          }
        } catch (error) {
          console.error('Error checking user role:', error);
          // Jos roolintarkistus epäonnistuu, ohjataan profiilisivulle
          navigate('/profile');
        }
      }
    };

    checkUserAndRedirect();
  }, [currentUser, navigate]);

  // Pakota uloskirjautuminen, jos käyttäjä on jo kirjautunut sisään
  const handleForceLogout = async () => {
    try {
      await logout();
      setError('');
    } catch (error) {
      console.error('Error logging out:', error);
      setError('Uloskirjautuminen epäonnistui.');
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError('');
      setLoading(true);
      await login(email, password);

      // Kirjautuminen onnistui
      // Ohjaus tehdään useEffect-hookissa, kun currentUser päivittyy
    } catch (error) {
      setError('Kirjautuminen epäonnistui. Tarkista sähköposti ja salasana.');
      console.error('Login error:', error);
      setLoading(false);
    }
  }

  return (
    <div className="bg-[#FFFFFF]">
      <PageHeading home={'HOME'} pagename={'SIGN IN'} />
      <div className="w-full max-w-md mx-auto mt-0 mb-18">
        <div className="rounded-lg border border-[#FFF8E7] shadow-lg p-8">
          {/*<h2 className="font-qiswah text-2xl font-bold text-center mb-6">Sign In</h2>*/}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {currentUser ? (
            <div>
              <p className="mb-4 font-qiswah">
                You are logged in as {currentUser.email}.
              </p>
              <div className="flex justify-between">
                <button
                  onClick={handleForceLogout}
                  className="bg-red-600 hover:bg-red-700 font-qiswah text-white font-bold py-2 px-4 rounded"
                >
                  Log out
                </button>
                <button
                  onClick={() =>
                    navigate(
                      currentUser.email.includes('admin')
                        ? '/admin'
                        : '/profile'
                    )
                  }
                  className="bg-blue-600 hover:bg-blue-700 font-qiswah text-white font-bold py-2 px-4 rounded"
                >
                  Go to profile
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  className="block text-gray-700 font-qiswah text-sm font-bold mb-2"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  className="bg-white shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-6">
                <label
                  className="block text-gray-700 font-qiswah text-sm font-bold mb-2"
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="relative mb-3">
                  <input
                    className="bg-white shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  className="bg-[#A30B2E] hover:bg-red-700 font-qiswah text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Sign in...' : 'Sign in'}
                </button>
                <Link
                  className="inline-block align-baseline font-qiswah font-bold text-sm text-[#A30B2E] hover:text-red-800"
                  to="/reset-password"
                >
                  Forget Password?
                </Link>
              </div>

              <div className="mt-4 font-qiswah text-center">
                <p>
                  Don't have an account?{' '}
                  <Link
                    to="/signup"
                    className="text-[#A30B2E] font-qiswah hover:text-red-800"
                  >
                    Register
                  </Link>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
