import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCar, FaUser, FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    setIsAdmin(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAdmin(false);
    navigate('/');
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
      className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-black via-gray-900 to-black border-b-2 border-red-600"
    >
      <div className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-red-600 blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <FaCar className="relative text-4xl text-red-600 group-hover:text-red-500 transition-colors" />
            </div>
            <div>
              <h1 className="font-orbitron text-2xl font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
                AU <span className="text-white">MOTORS</span>
              </h1>
              <div className="racing-stripe h-0.5 w-full"></div>
            </div>
          </Link>

          {/* Navigation Links - ADMIN button removed */}
          <div className="flex items-center gap-6">
            <Link to="/" className="text-gray-300 hover:text-red-500 transition-colors font-rajdhani font-semibold text-lg">
              HOME
            </Link>
            
            {/* Admin panel - hidden for public, only visible when logged in */}
            {isAdmin && (
              <>
                <Link to="/admin/dashboard" className="flex items-center gap-2 text-gray-300 hover:text-red-500 transition-colors">
                  <FaTachometerAlt />
                  <span className="font-rajdhani font-semibold">DASHBOARD</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-all hover:scale-105"
                >
                  <FaSignOutAlt />
                  <span className="font-rajdhani font-semibold">LOGOUT</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
