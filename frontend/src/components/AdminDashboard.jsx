import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaPlus, FaEdit, FaTrash, FaCar, 
  FaSignOutAlt, FaTimes, FaUpload, FaImage
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import axios from 'axios';

const AdminDashboard = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '', make: '', model: '', year: '', price: '',
    mileage: '', fuelType: 'Petrol', transmission: 'Manual',
    color: '', engineCapacity: '', horsepower: '', topSpeed: '',
    acceleration: '', description: '', features: [],
    location: '', ownerContact: { phone: '', email: '', whatsapp: '' },
    condition: 'Used', featured: false
  });

  // File upload states
  const [mainImageFile, setMainImageFile] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchCars();
  }, [navigate]);

  const fetchCars = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/cars`);
      setCars(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch cars');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/');
    toast.success('Logged out successfully');
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setMainImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setMainImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleGalleryImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    
    setGalleryFiles(prev => [...prev, ...files]);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setGalleryPreviews(prev => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeGalleryImage = (index) => {
    setGalleryFiles(prev => prev.filter((_, i) => i !== index));
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    setUploading(true);
    
    try {
      const formDataToSend = new FormData();
      
      // Add all text fields
      Object.keys(formData).forEach(key => {
        if (key === 'ownerContact') {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else if (key === 'features') {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Add main image file
      if (mainImageFile) {
        formDataToSend.append('mainImage', mainImageFile);
      }

      // Add gallery images
      galleryFiles.forEach(file => {
        formDataToSend.append('images', file);
      });

      const url = editingCar 
        ? `${process.env.REACT_APP_API_URL}/api/admin/cars/${editingCar._id}`
        : `${process.env.REACT_APP_API_URL}/api/admin/cars`;
      
      const method = editingCar ? 'put' : 'post';
      
      const response = await axios[method](url, formDataToSend, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        toast.success(editingCar ? 'Car updated!' : 'Car added!');
        setShowModal(false);
        setEditingCar(null);
        resetForm();
        fetchCars();
      }
    } catch (error) {
      console.error('Error:', error.response?.data || error);
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this car?')) return;
    
    const token = localStorage.getItem('adminToken');
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/admin/cars/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      toast.success('Car deleted successfully');
      fetchCars();
    } catch (error) {
      toast.error('Failed to delete car');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '', make: '', model: '', year: '', price: '',
      mileage: '', fuelType: 'Petrol', transmission: 'Manual',
      color: '', engineCapacity: '', horsepower: '', topSpeed: '',
      acceleration: '', description: '', features: [],
      location: '', ownerContact: { phone: '', email: '', whatsapp: '' },
      condition: 'Used', featured: false
    });
    setMainImageFile(null);
    setMainImagePreview(null);
    setGalleryFiles([]);
    setGalleryPreviews([]);
  };

  const handleEdit = (car) => {
    setEditingCar(car);
    setFormData({
      title: car.title || '',
      make: car.make || '',
      model: car.model || '',
      year: car.year || '',
      price: car.price || '',
      mileage: car.mileage || '',
      fuelType: car.fuelType || 'Petrol',
      transmission: car.transmission || 'Manual',
      color: car.color || '',
      engineCapacity: car.engineCapacity || '',
      horsepower: car.horsepower || '',
      topSpeed: car.topSpeed || '',
      acceleration: car.acceleration || '',
      description: car.description || '',
      features: car.features || [],
      location: car.location || '',
      ownerContact: car.ownerContact || { phone: '', email: '', whatsapp: '' },
      condition: car.condition || 'Used',
      featured: car.featured || false
    });
    setMainImagePreview(car.mainImage || null);
    setGalleryPreviews(car.images || []);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-orbitron text-4xl font-bold text-white">
              Admin Dashboard
            </h1>
            <p className="text-gray-400 font-rajdhani">Manage your car collection</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => { setEditingCar(null); resetForm(); setShowModal(true); }}
              className="sports-btn px-6 py-3 rounded-xl text-white font-orbitron font-bold flex items-center gap-2"
            >
              <FaPlus />
              Add Car
            </button>
            <button
              onClick={handleLogout}
              className="bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-xl text-white font-rajdhani font-semibold flex items-center gap-2 transition-colors"
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-b from-gray-900 to-black p-6 rounded-2xl border border-gray-800">
            <div className="flex items-center gap-4">
              <div className="bg-red-600/20 p-3 rounded-xl">
                <FaCar className="text-3xl text-red-500" />
              </div>
              <div>
                <p className="text-gray-400 font-rajdhani text-sm">Total Cars</p>
                <p className="font-orbitron text-3xl font-bold text-white">{cars.length}</p>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="loading-spinner"></div>
          </div>
        ) : (
          <div className="bg-gradient-to-b from-gray-900 to-black rounded-2xl border border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-black/50 border-b border-gray-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-gray-400 font-rajdhani font-semibold text-sm">Car</th>
                    <th className="px-6 py-4 text-left text-gray-400 font-rajdhani font-semibold text-sm">Price</th>
                    <th className="px-6 py-4 text-left text-gray-400 font-rajdhani font-semibold text-sm">Year</th>
                    <th className="px-6 py-4 text-left text-gray-400 font-rajdhani font-semibold text-sm">Status</th>
                    <th className="px-6 py-4 text-right text-gray-400 font-rajdhani font-semibold text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cars.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-gray-400">
                        No cars added yet. Click "Add Car" to get started!
                      </td>
                    </tr>
                  ) : (
                    cars.map((car) => (
                      <motion.tr
                        key={car._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="border-b border-gray-800 hover:bg-white/5 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={car.mainImage || 'https://via.placeholder.com/50'}
                              alt={car.title}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                            <div>
                              <p className="text-white font-rajdhani font-semibold">{car.make} {car.model}</p>
                              <p className="text-gray-500 font-rajdhani text-sm">{car.title}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-white font-orbitron font-bold">
                          £{car.price?.toLocaleString() || 0}
                        </td>
                        <td className="px-6 py-4 text-gray-300 font-rajdhani">{car.year}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-rajdhani font-semibold ${
                            car.featured 
                              ? 'bg-yellow-600/30 text-yellow-400 border border-yellow-600/30'
                              : 'bg-gray-600/30 text-gray-400 border border-gray-600/30'
                          }`}>
                            {car.featured ? '⭐ Featured' : 'Standard'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEdit(car)}
                              className="bg-blue-600/20 hover:bg-blue-600/40 p-2 rounded-lg transition-colors"
                            >
                              <FaEdit className="text-blue-400" />
                            </button>
                            <button
                              onClick={() => handleDelete(car._id)}
                              className="bg-red-600/20 hover:bg-red-600/40 p-2 rounded-lg transition-colors"
                            >
                              <FaTrash className="text-red-400" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-b from-gray-900 to-black rounded-2xl border border-gray-800 max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-orbitron text-2xl font-bold text-white">
                {editingCar ? 'Edit Car' : 'Add New Car'}
              </h2>
              <button
                onClick={() => { setShowModal(false); setEditingCar(null); resetForm(); }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaTimes className="text-2xl" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Title *"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white font-rajdhani focus:border-red-500 focus:outline-none"
                  required
                />
                <input
                  type="text"
                  placeholder="Make *"
                  value={formData.make}
                  onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                  className="bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white font-rajdhani focus:border-red-500 focus:outline-none"
                  required
                />
                <input
                  type="text"
                  placeholder="Model *"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  className="bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white font-rajdhani focus:border-red-500 focus:outline-none"
                  required
                />
                <input
                  type="number"
                  placeholder="Year *"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white font-rajdhani focus:border-red-500 focus:outline-none"
                  required
                />
                <input
                  type="number"
                  placeholder="Price *"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white font-rajdhani focus:border-red-500 focus:outline-none"
                  required
                />
                <input
                  type="number"
                  placeholder="Mileage (km) *"
                  value={formData.mileage}
                  onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                  className="bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white font-rajdhani focus:border-red-500 focus:outline-none"
                  required
                />
                <select
                  value={formData.fuelType}
                  onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                  className="bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white font-rajdhani focus:border-red-500 focus:outline-none"
                  required
                >
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
                <select
                  value={formData.transmission}
                  onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
                  className="bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white font-rajdhani focus:border-red-500 focus:outline-none"
                  required
                >
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                  <option value="CVT">CVT</option>
                  <option value="DCT">DCT</option>
                </select>
                <input
                  type="text"
                  placeholder="Color *"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white font-rajdhani focus:border-red-500 focus:outline-none"
                  required
                />
                <input
                  type="text"
                  placeholder="Engine Capacity (e.g., 2.0L) *"
                  value={formData.engineCapacity}
                  onChange={(e) => setFormData({ ...formData, engineCapacity: e.target.value })}
                  className="bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white font-rajdhani focus:border-red-500 focus:outline-none"
                  required
                />
                <input
                  type="number"
                  placeholder="Horsepower *"
                  value={formData.horsepower}
                  onChange={(e) => setFormData({ ...formData, horsepower: e.target.value })}
                  className="bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white font-rajdhani focus:border-red-500 focus:outline-none"
                  required
                />
                <input
                  type="text"
                  placeholder="Top Speed (e.g., 340 km/h) *"
                  value={formData.topSpeed}
                  onChange={(e) => setFormData({ ...formData, topSpeed: e.target.value })}
                  className="bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white font-rajdhani focus:border-red-500 focus:outline-none"
                  required
                />
                <input
                  type="text"
                  placeholder="Acceleration (e.g., 2.9 sec) *"
                  value={formData.acceleration}
                  onChange={(e) => setFormData({ ...formData, acceleration: e.target.value })}
                  className="bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white font-rajdhani focus:border-red-500 focus:outline-none"
                  required
                />
                <input
                  type="text"
                  placeholder="Location (City, Country) *"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white font-rajdhani focus:border-red-500 focus:outline-none"
                  required
                />
                <select
                  value={formData.condition}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                  className="bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white font-rajdhani focus:border-red-500 focus:outline-none"
                >
                  <option value="New">New</option>
                  <option value="Used">Used</option>
                  <option value="Certified Pre-Owned">Certified Pre-Owned</option>
                </select>
              </div>

              <div>
                <textarea
                  placeholder="Description (min 50 characters) *"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white font-rajdhani focus:border-red-500 focus:outline-none min-h-[100px]"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 font-rajdhani text-sm mb-2">
                  Features (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Air Conditioning, Power Steering, ABS"
                  value={formData.features.join(', ')}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value.split(',').map(f => f.trim()) })}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white font-rajdhani focus:border-red-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 font-rajdhani text-sm mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    placeholder="Phone"
                    value={formData.ownerContact.phone}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      ownerContact: { ...formData.ownerContact, phone: e.target.value }
                    })}
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white font-rajdhani focus:border-red-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-rajdhani text-sm mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.ownerContact.email}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      ownerContact: { ...formData.ownerContact, email: e.target.value }
                    })}
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white font-rajdhani focus:border-red-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-rajdhani text-sm mb-2">
                    WhatsApp (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="WhatsApp"
                    value={formData.ownerContact.whatsapp}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      ownerContact: { ...formData.ownerContact, whatsapp: e.target.value }
                    })}
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white font-rajdhani focus:border-red-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-rajdhani text-sm mb-2">
                    Featured Car
                  </label>
                  <select
                    value={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.value === 'true' })}
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white font-rajdhani focus:border-red-500 focus:outline-none"
                  >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </div>
              </div>

              {/* ===== MAIN IMAGE UPLOAD ===== */}
              <div className="border-2 border-dashed border-gray-700 rounded-xl p-6 hover:border-red-500 transition-colors">
                <label className="block text-gray-400 font-rajdhani text-sm mb-3">
                  <FaImage className="inline mr-2" />
                  Main Image (Upload from your computer)
                </label>
                <div className="flex items-center gap-4">
                  <label className="cursor-pointer bg-red-600/20 hover:bg-red-600/30 px-4 py-2 rounded-lg border border-red-600/30 transition-colors">
                    <span className="text-white font-rajdhani">Choose File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleMainImageChange}
                      className="hidden"
                    />
                  </label>
                  <span className="text-gray-400 font-rajdhani text-sm">
                    {mainImageFile ? mainImageFile.name : 'No file selected'}
                  </span>
                </div>
                {mainImagePreview && (
                  <div className="mt-3">
                    <img src={mainImagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-lg border border-gray-700" />
                  </div>
                )}
              </div>

              {/* ===== GALLERY IMAGES UPLOAD ===== */}
              <div className="border-2 border-dashed border-gray-700 rounded-xl p-6 hover:border-red-500 transition-colors">
                <label className="block text-gray-400 font-rajdhani text-sm mb-3">
                  <FaUpload className="inline mr-2" />
                  Gallery Images (Upload multiple images)
                </label>
                <div className="flex items-center gap-4">
                  <label className="cursor-pointer bg-red-600/20 hover:bg-red-600/30 px-4 py-2 rounded-lg border border-red-600/30 transition-colors">
                    <span className="text-white font-rajdhani">Choose Files</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleGalleryImagesChange}
                      className="hidden"
                    />
                  </label>
                  <span className="text-gray-400 font-rajdhani text-sm">
                    {galleryFiles.length} file(s) selected
                  </span>
                </div>
                {galleryPreviews.length > 0 && (
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {galleryPreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <img src={preview} alt={`Gallery ${index + 1}`} className="w-24 h-24 object-cover rounded-lg border border-gray-700" />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(index)}
                          className="absolute -top-2 -right-2 bg-red-600 rounded-full p-1 hover:bg-red-700 transition-colors"
                        >
                          <FaTimes className="text-xs" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={uploading}
                  className="flex-1 sports-btn py-3 rounded-xl text-white font-orbitron font-bold text-lg disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : (editingCar ? 'UPDATE CAR' : 'ADD CAR')}
                </motion.button>
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setEditingCar(null); resetForm(); }}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 py-3 rounded-xl text-white font-rajdhani font-semibold transition-colors"
                >
                  CANCEL
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
