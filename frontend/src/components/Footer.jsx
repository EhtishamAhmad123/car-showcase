import React from 'react';
import { FaCar, FaPhone, FaEnvelope, FaMapMarkerAlt, FaBuilding, FaCompany } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-black via-gray-900 to-black border-t-2 border-red-600 mt-20">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <FaCar className="text-3xl text-red-600" />
              <div>
                <h2 className="font-orbitron text-2xl font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
                  AU MOTORS LTD
                </h2>
                <p className="text-gray-500 font-rajdhani text-xs">Company Number: 14695906</p>
              </div>
            </div>
            <p className="text-gray-400 font-rajdhani text-sm leading-relaxed">
              Premium used car dealership in London. Quality vehicles at competitive prices.
            </p>
            <div className="racing-stripe h-0.5 w-24 mt-4"></div>
          </div>

          <div>
            <h3 className="font-rajdhani font-bold text-white text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-400 hover:text-red-500 transition-colors font-rajdhani text-sm">Home</a></li>
              <li><a href="/admin/login" className="text-gray-400 hover:text-red-500 transition-colors font-rajdhani text-sm">Admin Login</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-rajdhani font-bold text-white text-lg mb-4">Contact & Address</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-gray-400">
                <FaMapMarkerAlt className="text-red-500 mt-1" />
                <span className="font-rajdhani text-sm">
                  Unit 16 Beckton Chip Plant<br />
                  Armada Way, Opposite Tesco Entrance<br />
                  London, England, E6 7FB
                </span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <FaPhone className="text-red-500" />
                <span className="font-rajdhani text-sm">07898 365106</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <FaEnvelope className="text-red-500" />
                <span className="font-rajdhani text-sm">info@automotors.co.uk</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <FaBuilding className="text-red-500" />
                <span className="font-rajdhani text-sm">Company No: 14695906</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-500 font-rajdhani text-sm">
            © 2024 AU MOTORS LTD. All rights reserved. 
            Registered in England & Wales.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


