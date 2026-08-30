import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaGasPump,
  FaCog,
  FaTachometerAlt,
  FaCalendar
} from 'react-icons/fa';

const FALLBACK_IMAGE =
  'https://picsum.photos/600/400?random=1';

const getImageUrl = (mainImage) => {
  if (!mainImage) {
    return FALLBACK_IMAGE;
  }

  // New format:
  // mainImage: { url: "...", publicId: "..." }
  if (typeof mainImage === 'object' && mainImage.url) {
    return mainImage.url;
  }

  // Old format:
  // mainImage: "https://..."
  if (typeof mainImage === 'string') {
    if (
      mainImage.startsWith('http://') ||
      mainImage.startsWith('https://')
    ) {
      return mainImage;
    }

    // Old local uploads cannot reliably load from Vercel
    if (mainImage.startsWith('/uploads/')) {
      return FALLBACK_IMAGE;
    }

    return mainImage;
  }

  return FALLBACK_IMAGE;
};

const CarCard = ({ car }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="car-card rounded-2xl overflow-hidden group"
    >
      <Link to={`/car/${car._id}`}>
        {/* IMAGE */}
        <div className="relative overflow-hidden h-80 md:h-96">
          <img
            src={getImageUrl(car.mainImage)}
            alt={`${car.make} ${car.model}`}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={(e) => {
              if (e.currentTarget.src !== FALLBACK_IMAGE) {
                e.currentTarget.src = FALLBACK_IMAGE;
              }
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>

          {/* PRICE */}
          <div className="absolute bottom-4 right-4 bg-gradient-to-r from-red-600 to-red-700 px-4 py-2 rounded-lg shadow-2xl">
            <p className="font-orbitron text-xl font-bold text-white">
              £{Number(car.price || 0).toLocaleString()}
            </p>
          </div>

          {/* YEAR */}
          <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full border border-red-600">
            <p className="font-rajdhani font-semibold text-sm text-white">
              {car.year}
            </p>
          </div>

          {/* FEATURED */}
          {car.featured && (
            <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-500 to-yellow-600 px-4 py-1 rounded-full shadow-lg animate-pulse">
              <p className="font-rajdhani font-bold text-xs text-black">
                ⭐ FEATURED
              </p>
            </div>
          )}
        </div>

        {/* CARD CONTENT */}
        <div className="p-6 space-y-4">
          <h3 className="font-orbitron text-xl font-bold text-white group-hover:text-red-500 transition-colors">
            {car.make} {car.model}
          </h3>

          {/* DETAILS */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-gray-400">
              <FaGasPump className="text-red-500" />
              <span className="font-rajdhani text-sm">
                {car.fuelType}
              </span>
            </div>

            <div className="flex items-center gap-2 text-gray-400">
              <FaCog className="text-red-500" />
              <span className="font-rajdhani text-sm">
                {car.transmission}
              </span>
            </div>

            <div className="flex items-center gap-2 text-gray-400">
              <FaTachometerAlt className="text-red-500" />
              <span className="font-rajdhani text-sm">
                {Number(car.mileage || 0).toLocaleString()} km
              </span>
            </div>

            <div className="flex items-center gap-2 text-gray-400">
              <FaCalendar className="text-red-500" />
              <span className="font-rajdhani text-sm">
                {car.year}
              </span>
            </div>
          </div>

          {/* FOOTER */}
          <div className="pt-4 border-t border-gray-800">
            <div className="flex justify-between items-center">
              <p className="font-rajdhani text-gray-400 text-sm">
                {car.location}
              </p>

              <motion.span
                whileHover={{ x: 5 }}
                className="text-red-500 font-rajdhani font-semibold text-sm"
              >
                View Details →
              </motion.span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CarCard;