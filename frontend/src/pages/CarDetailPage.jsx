import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import CarDetails from '../components/CarDetails';
import { Helmet } from 'react-helmet-async';

const CarDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCarDetails();
  }, [id]);

  const fetchCarDetails = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/cars/${id}`);
      setCar(response.data.data);
    } catch (error) {
      console.error('Error fetching car details:', error);
      // Set a demo car if API fails
      setCar({
        _id: '1',
        title: 'Luxury Sports Car',
        make: 'Ferrari',
        model: 'F8 Tributo',
        year: 2023,
        price: 350000,
        mileage: 1500,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        color: 'Red',
        engineCapacity: '3.9L',
        horsepower: 710,
        topSpeed: '340 km/h',
        acceleration: '2.9 sec',
        description: 'The Ferrari F8 Tributo is a masterpiece of Italian engineering.',
        features: ['Carbon Fiber', 'Leather Seats', 'Bose Sound System'],
        mainImage: 'https://via.placeholder.com/600x400/ff0000/ffffff?text=Ferrari+F8',
        images: ['https://via.placeholder.com/600x400/ff0000/ffffff?text=Ferrari+F8'],
        condition: 'New',
        location: 'Dubai, UAE',
        ownerContact: {
          phone: '+971 50 123 4567',
          email: 'info@speedshow.com'
        },
        featured: true
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen pt-20">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="flex justify-center items-center min-h-screen pt-20">
        <p className="text-gray-400 font-rajdhani text-xl">Car not found</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${car.make} ${car.model} - SpeedShow`}</title>
        <meta name="description" content={`${car.year} ${car.make} ${car.model} - ${car.price}`} />
      </Helmet>

      <div className="pt-20 min-h-screen">
        <div className="container mx-auto px-4">
          <motion.button
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors font-rajdhani mb-6"
          >
            <FaArrowLeft />
            Back to Gallery
          </motion.button>

          <CarDetails car={car} />
        </div>
      </div>
    </>
  );
};

export default CarDetailPage;
