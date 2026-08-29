import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaChevronDown } from 'react-icons/fa';
import axios from 'axios';
import CarCard from '../components/CarCard';
import { Helmet } from 'react-helmet-async';

const Home = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'https://car-showcase.vercel.app';
      const response = await axios.get(apiUrl + '/api/cars');
      setCars(response.data.data || []);
    } catch (error) {
      console.error('Error fetching cars:', error);
      setCars([
        {
          _id: '1',
          title: 'BMW 840i',
          make: 'BMW',
          model: '840i',
          year: 2021,
          price: 27499,
          mileage: 38400,
          fuelType: 'Petrol',
          transmission: 'Automatic',
          color: 'Grey',
          engineCapacity: '3.0L',
          horsepower: 333,
          topSpeed: '155 mph',
          acceleration: '5.4 sec',
          description: 'The BMW 840i is a luxurious grand tourer.',
          features: ['20" M Alloy Wheels', 'M Sport Exterior'],
          mainImage: 'https://picsum.photos/600/400?random=1',
          images: [],
          condition: 'Used',
          location: 'London, UK',
          ownerContact: {
            phone: '07898365106',
            email: 'sales@aumotors.uk'
          },
          featured: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const safeCars = Array.isArray(cars) ? cars : [];

  const filteredCars = safeCars.filter(function(car) {
    const searchText = (car.make || '') + ' ' + (car.model || '') + ' ' + (car.year || '');
    const matchesSearch = searchText.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || car.fuelType === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <>
      <Helmet>
        <title>AU MOTORS LTD - Premium Used Cars in London</title>
        <meta name="description" content="Quality used cars in London." />
      </Helmet>

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/90 z-10"></div>
          <div className="absolute inset-0 speed-lines"></div>
          <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-20 text-center px-4"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 100 }}
            className="inline-block"
          >
            <div className="bg-gradient-to-r from-red-600 to-red-800 px-6 py-2 rounded-full mb-6">
              <p className="font-orbitron text-sm text-white">🏁 QUALITY USED CARS</p>
            </div>
          </motion.div>

          <h1 className="font-orbitron text-5xl md:text-7xl font-bold text-white mb-6">
            <span className="glowing-text">Drive</span> Your
            <br />
            <span className="bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
              Dream Car
            </span>
          </h1>

          <p className="text-xl text-gray-300 font-rajdhani max-w-2xl mx-auto mb-8">
            Discover quality used cars in London. Premium vehicles at competitive prices.
          </p>
        </motion.div>
      </section>

      <section className="py-20 px-4 relative">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-block bg-red-600/20 px-4 py-1 rounded-full mb-4 border border-red-600/30">
              <p className="font-rajdhani text-red-400 font-semibold text-sm">OUR COLLECTION</p>
            </div>
            <h2 className="font-orbitron text-4xl md:text-5xl font-bold text-white">
              Featured <span className="text-red-500">Cars</span>
            </h2>
            <div className="racing-stripe h-1 w-24 mx-auto mt-4"></div>
          </motion.div>

          <div className="flex flex-col md:flex-row gap-4 mb-12">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by make, model, or year..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-12 py-3 text-white font-rajdhani placeholder-gray-400 focus:border-red-500 focus:outline-none transition-colors"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-gray-900/50 border border-gray-700 rounded-xl px-6 py-3 text-white font-rajdhani focus:border-red-500 focus:outline-none transition-colors"
            >
              <option value="all">All Fuel Types</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="loading-spinner"></div>
            </div>
          ) : filteredCars.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 font-rajdhani text-xl">No cars found matching your criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCars.map(function(car) {
                return <CarCard key={car._id} car={car} />;
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Home;
