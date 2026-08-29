import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaLock, FaCar } from 'react-icons/fa';
import toast from 'react-hot-toast';
import axios from 'axios';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/admin/login`,
        credentials
      );
      
      if (response.data.success) {
        localStorage.setItem('adminToken', response.data.token);
        toast.success('Login successful!');
        navigate('/admin/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-gradient-to-b from-gray-900 to-black p-8 rounded-2xl border border-gray-800 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-block bg-red-600/20 p-4 rounded-full mb-4">
              <FaCar className="text-4xl text-red-500" />
            </div>
            <h2 className="font-orbitron text-3xl font-bold text-white">Admin Login</h2>
            <div className="racing-stripe h-0.5 w-16 mx-auto mt-2"></div>
            <p className="text-gray-400 font-rajdhani mt-2">Access your car collection</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-300 font-rajdhani text-sm mb-2">
                Email Address
              </label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  value={credentials.email}
                  onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-10 py-3 text-white font-rajdhani focus:border-red-500 focus:outline-none transition-colors"
                  placeholder="admin@carshowcase.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 font-rajdhani text-sm mb-2">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-10 py-3 text-white font-rajdhani focus:border-red-500 focus:outline-none transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full sports-btn py-3 rounded-xl text-white font-orbitron font-bold text-lg disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'LOGIN'}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500 font-rajdhani text-sm">
              Protected area for authorized personnel only
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
