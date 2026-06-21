import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PageHeading from '../../common/PageHeading';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setMessage('');
      setError('');
      setLoading(true);
      await resetPassword(email);
      setMessage(
        'Tarkista sähköpostisi ja seuraa ohjeita salasanan nollaamiseksi.'
      );
    } catch (error) {
      setError(
        'Salasanan nollaus epäonnistui. Varmista, että sähköposti on oikein.'
      );
      console.error('Password reset error:', error);
    }

    setLoading(false);
  }

  return (
    <div className="bg-[#FFFFFF]">
      <PageHeading home={'HOME'} pagename={'RESET PASSWORD'} />
      <div className="w-full max-w-md mx-auto mt-0 mb-18">
        <div className="rounded-lg shadow-2xl p-8">
          {/*<h2 className="font-qiswah text-2xl font-bold text-center mb-6">Nollaa salasana</h2>*/}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          {message && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                className="block text-gray-700 font-qiswah text-sm font-bold mb-2"
                htmlFor="email"
              >
                email
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

            <div className="flex items-center justify-center">
              <button
                className="bg-[#A30B2E] hover:bg-red-700 font-qiswah text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Set password reset email'}
              </button>
            </div>
          </form>

          <div className="mt-4 font-qiswah text-center">
            <Link to="/login" className="text-[#A30B2E] hover:text-red-800">
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
