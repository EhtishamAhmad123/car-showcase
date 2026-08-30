import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaGasPump, FaCog, FaTachometerAlt, FaCalendar, 
  FaMapMarkerAlt, FaPhone, FaEnvelope, FaWhatsapp,
  FaBolt, FaPalette, FaExpand, FaTimes
} from 'react-icons/fa';
import { MdSpeed } from 'react-icons/md';

const CarDetails = ({ car }) => {
  const [selectedImage, setSelectedImage] = useState(car.mainImage);
  const [isOpen, setIsOpen] = useState(false);

const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return 'https://picsum.photos/600/400?random=1';
  }

  return imagePath;
};

  const allImages = [car.mainImage, ...car.images].filter(Boolean);

  const specs = [
    { icon: <FaCalendar />, label: 'Year', value: car.year },
    { icon: <FaTachometerAlt />, label: 'Mileage', value: car.mileage.toLocaleString() + ' km' },
    { icon: <FaGasPump />, label: 'Fuel Type', value: car.fuelType },
    { icon: <FaCog />, label: 'Transmission', value: car.transmission },
    { icon: <FaBolt />, label: 'Horsepower', value: car.horsepower + ' HP' },
    { icon: <MdSpeed />, label: 'Top Speed', value: car.topSpeed },
    { icon: <FaTachometerAlt />, label: 'Acceleration', value: car.acceleration },
    { icon: <FaPalette />, label: 'Color', value: car.color },
  ];

  const openLightbox = () => setIsOpen(true);
  const closeLightbox = () => setIsOpen(false);

  const nextImage = () => {
    const currentIndex = allImages.indexOf(selectedImage);
    setSelectedImage(allImages[(currentIndex + 1) % allImages.length]);
  };

  const prevImage = () => {
    const currentIndex = allImages.indexOf(selectedImage);
    setSelectedImage(allImages[(currentIndex - 1 + allImages.length) % allImages.length]);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-4 py-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div>
            <div 
              className="relative rounded-2xl overflow-hidden bg-black/50 border border-gray-800 cursor-pointer group"
              onClick={openLightbox}
            >
              <img
                src={getImageUrl(selectedImage)}
                alt={car.make + ' ' + car.model}
                className="w-full h-[500px] object-contain transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  e.target.src = 'https://picsum.photos/600/400?random=1';
                }}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="bg-black/70 p-3 rounded-full">
                  <FaExpand className="text-3xl text-white" />
                </div>
              </div>
              <p className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black/60 px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                Click to enlarge
              </p>
            </div>
            
            {/* Thumbnails */}
            <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
              {allImages.map((img, index) => (
                <motion.img
                  key={index}
                  src={getImageUrl(img)}
                  alt={'Thumbnail ' + (index + 1)}
                  onClick={() => setSelectedImage(img)}
                  className={'gallery-thumb w-28 h-28 object-cover rounded-lg cursor-pointer border-2 transition-all ' + (selectedImage === img ? 'border-red-500' : 'border-transparent')}
                  whileHover={{ scale: 1.05 }}
                  onError={(e) => {
                    e.target.src = 'https://picsum.photos/100/100?random=1';
                  }}
                />
              ))}
            </div>
          </div>

          {/* Details - Bigger Font */}
          <div className="space-y-6">
            <div>
              <motion.h1 
                initial={{ x: -20 }}
                animate={{ x: 0 }}
                className="font-orbitron text-4xl md:text-5xl font-bold text-white"
              >
                {car.make} {car.model}
              </motion.h1>
              <p className="text-gray-400 font-rajdhani text-lg md:text-xl mt-1">{car.condition}</p>
            </div>

            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-gradient-to-r from-red-600/20 to-red-800/20 p-6 rounded-2xl border border-red-600/30"
            >
              <p className="text-gray-400 font-rajdhani text-base md:text-lg">PRICE</p>
              <p className="font-orbitron text-6xl md:text-7xl font-bold text-white price-glow">
                £{car.price.toLocaleString()}
              </p>
            </motion.div>

            <div className="grid grid-cols-2 gap-3">
              {specs.map((spec, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white/5 p-3 rounded-xl border border-gray-800 hover:border-red-600/30 transition-colors"
                >
                  <div className="flex items-center gap-2 text-red-500 text-lg">
                    {spec.icon}
                  </div>
                  <p className="text-gray-400 font-rajdhani text-xs md:text-sm mt-1">{spec.label}</p>
                  <p className="text-white font-rajdhani font-semibold text-base md:text-lg">{spec.value}</p>
                </motion.div>
              ))}
            </div>

            <div className="bg-white/5 p-4 rounded-xl border border-gray-800">
              <h3 className="font-rajdhani font-bold text-white text-lg md:text-xl mb-2">Description</h3>
              <p className="text-gray-300 font-rajdhani text-base md:text-lg leading-relaxed">{car.description}</p>
            </div>

            <div className="bg-white/5 p-4 rounded-xl border border-gray-800">
              <h3 className="font-rajdhani font-bold text-white text-lg md:text-xl mb-2">Key Features</h3>
              <div className="flex flex-wrap gap-2">
                {car.features.map((feature, index) => (
                  <span
                    key={index}
                    className="bg-red-600/20 text-red-400 px-3 py-1 rounded-full text-sm md:text-base font-rajdhani font-semibold border border-red-600/30"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-gray-900 to-black p-6 rounded-2xl border border-gray-800">
              <h3 className="font-rajdhani font-bold text-white text-lg md:text-xl mb-3">Contact Owner</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-300">
                  <FaPhone className="text-red-500 text-lg" />
                  <span className="font-rajdhani text-base md:text-lg">{car.ownerContact.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <FaEnvelope className="text-red-500 text-lg" />
                  <span className="font-rajdhani text-base md:text-lg">{car.ownerContact.email}</span>
                </div>
                {car.ownerContact.whatsapp && (
                  <div className="flex items-center gap-3 text-gray-300">
                    <FaWhatsapp className="text-green-500 text-lg" />
                    <span className="font-rajdhani text-base md:text-lg">{car.ownerContact.whatsapp}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-gray-300">
                  <FaMapMarkerAlt className="text-red-500 text-lg" />
                  <span className="font-rajdhani text-base md:text-lg">{car.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Custom Lightbox */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center" onClick={closeLightbox}>
          <div className="relative w-full h-full flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white text-4xl hover:text-red-500 transition-colors z-10"
            >
              <FaTimes />
            </button>
            
            {allImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 text-white text-4xl hover:text-red-500 transition-colors z-10 bg-black/50 p-3 rounded-full"
                >
                  ‹
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 text-white text-4xl hover:text-red-500 transition-colors z-10 bg-black/50 p-3 rounded-full"
                >
                  ›
                </button>
              </>
            )}
            
            <img
              src={getImageUrl(selectedImage)}
              alt={car.make + ' ' + car.model}
              className="max-h-[90vh] max-w-[90vw] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black/60 px-4 py-2 rounded-full">
              {allImages.indexOf(selectedImage) + 1} / {allImages.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CarDetails;
