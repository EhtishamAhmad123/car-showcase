import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaCar,
  FaSignOutAlt,
  FaTimes,
  FaUpload,
  FaImage
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const getImageUrl = (image) => {
  if (!image) return '';

  // Cloudinary object: { url, publicId }
  if (typeof image === 'object') {
    return image.url || '';
  }

  // Backward compatibility if database contains a string
  if (typeof image === 'string') {
    return image;
  }

  return '';
};

const AdminDashboard = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate();

  // =====================================================
  // FORM DATA
  // =====================================================

  const initialFormData = {
    title: '',
    make: '',
    model: '',
    year: '',
    price: '',
    mileage: '',
    fuelType: 'Petrol',
    transmission: 'Manual',
    color: '',
    engineCapacity: '',
    horsepower: '',
    topSpeed: '',
    acceleration: '',
    description: '',
    features: [],
    location: '',
    ownerContact: {
      phone: '',
      email: '',
      whatsapp: ''
    },
    condition: 'Used',
    featured: false
  };

  const [formData, setFormData] = useState(initialFormData);

  // =====================================================
  // IMAGE STATES
  // =====================================================

  const [mainImageFile, setMainImageFile] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);

  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);

  // =====================================================
  // AUTH + FETCH
  // =====================================================

  useEffect(() => {
    const token = localStorage.getItem('adminToken');

    if (!token) {
      navigate('/admin/login');
      return;
    }

    fetchCars();
  }, [navigate]);

  // =====================================================
  // FETCH ALL CARS
  // =====================================================

  const fetchCars = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${API_URL}/api/cars`
      );

      if (response.data.success) {
        setCars(response.data.data || []);
      } else {
        setCars([]);
      }
    } catch (error) {
      console.error(
        'Fetch cars error:',
        error.response?.data || error.message
      );

      toast.error('Failed to fetch cars');
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem('adminToken');

    toast.success('Logged out successfully');

    navigate('/');
  };

  // =====================================================
  // MAIN IMAGE CHANGE
  // =====================================================

  const handleMainImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Basic validation
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    // 10 MB
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Main image must be less than 10MB');
      return;
    }

    setMainImageFile(file);

    const reader = new FileReader();

    reader.onload = (event) => {
      setMainImagePreview(event.target.result);
    };

    reader.readAsDataURL(file);
  };

  // =====================================================
  // GALLERY IMAGE CHANGE
  // =====================================================

  const handleGalleryImagesChange = (e) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    const validFiles = files.filter((file) => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image`);
        return false;
      }

      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} is larger than 10MB`);
        return false;
      }

      return true;
    });

    if (!validFiles.length) return;

    setGalleryFiles((prev) => [
      ...prev,
      ...validFiles
    ]);

    validFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        setGalleryPreviews((prev) => [
          ...prev,
          {
            type: 'new',
            url: event.target.result,
            file
          }
        ]);
      };

      reader.readAsDataURL(file);
    });

    // Allow selecting same file again
    e.target.value = '';
  };

  // =====================================================
  // REMOVE GALLERY IMAGE
  // =====================================================

  const removeGalleryImage = (index) => {
    const preview = galleryPreviews[index];

    // Only remove from upload files if this is a newly
    // selected file.
    if (preview?.type === 'new') {
      const newFileIndex = galleryPreviews
        .slice(0, index)
        .filter((item) => item.type === 'new')
        .length;

      setGalleryFiles((prev) =>
        prev.filter((_, i) => i !== newFileIndex)
      );
    }

    setGalleryPreviews((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  // =====================================================
  // FORM INPUT HANDLER
  // =====================================================

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // =====================================================
  // OWNER CONTACT HANDLER
  // =====================================================

  const handleOwnerContactChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      ownerContact: {
        ...prev.ownerContact,
        [field]: value
      }
    }));
  };

  // =====================================================
  // FEATURES HANDLER
  // =====================================================

  const handleFeaturesChange = (e) => {
    const value = e.target.value;

    const features = value
      .split(',')
      .map((feature) => feature.trim())
      .filter(Boolean);

    setFormData((prev) => ({
      ...prev,
      features
    }));
  };

  // =====================================================
  // RESET FORM
  // =====================================================

  const resetForm = () => {
    setFormData({
      ...initialFormData,
      ownerContact: {
        phone: '',
        email: '',
        whatsapp: ''
      }
    });

    setMainImageFile(null);
    setMainImagePreview(null);

    setGalleryFiles([]);
    setGalleryPreviews([]);
  };

  // =====================================================
  // OPEN ADD MODAL
  // =====================================================

  const handleAddCar = () => {
    setEditingCar(null);
    resetForm();
    setShowModal(true);
  };

  // =====================================================
  // EDIT CAR
  // =====================================================

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
      features: Array.isArray(car.features)
        ? car.features
        : [],
      location: car.location || '',
      ownerContact: {
        phone: car.ownerContact?.phone || '',
        email: car.ownerContact?.email || '',
        whatsapp: car.ownerContact?.whatsapp || ''
      },
      condition: car.condition || 'Used',
      featured: Boolean(car.featured)
    });

    // IMPORTANT:
    // Backend returns:
    //
    // mainImage: {
    //   url: "...",
    //   publicId: "..."
    // }
    //
    // So we need .url

    setMainImageFile(null);

    setMainImagePreview(
      getImageUrl(car.mainImage) || null
    );

    // Existing gallery images are NOT files.
    // Keep them as existing previews.
    const existingGallery = Array.isArray(car.images)
      ? car.images
          .map((image) => ({
            type: 'existing',
            url: getImageUrl(image),
            publicId: image?.publicId || null
          }))
          .filter((image) => image.url)
      : [];

    setGalleryFiles([]);
    setGalleryPreviews(existingGallery);

    setShowModal(true);
  };

  // =====================================================
  // CLOSE MODAL
  // =====================================================

  const closeModal = () => {
    if (uploading) return;

    setShowModal(false);
    setEditingCar(null);
    resetForm();
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('adminToken');

    if (!token) {
      toast.error('Authentication required');
      navigate('/admin/login');
      return;
    }

    if (!API_URL) {
      toast.error(
        'API URL is not configured'
      );
      return;
    }

    // Description validation
    if (formData.description.trim().length < 50) {
      toast.error(
        'Description must be at least 50 characters'
      );
      return;
    }

    setUploading(true);

    try {
      const data = new FormData();

      // =================================================
      // TEXT FIELDS
      // =================================================

      data.append(
        'title',
        formData.title.trim()
      );

      data.append(
        'make',
        formData.make.trim()
      );

      data.append(
        'model',
        formData.model.trim()
      );

      data.append(
        'year',
        formData.year
      );

      data.append(
        'price',
        formData.price
      );

      data.append(
        'mileage',
        formData.mileage
      );

      data.append(
        'fuelType',
        formData.fuelType
      );

      data.append(
        'transmission',
        formData.transmission
      );

      data.append(
        'color',
        formData.color.trim()
      );

      data.append(
        'engineCapacity',
        formData.engineCapacity.trim()
      );

      data.append(
        'horsepower',
        formData.horsepower
      );

      data.append(
        'topSpeed',
        formData.topSpeed.trim()
      );

      data.append(
        'acceleration',
        formData.acceleration.trim()
      );

      data.append(
        'description',
        formData.description.trim()
      );

      data.append(
        'location',
        formData.location.trim()
      );

      data.append(
        'condition',
        formData.condition
      );

      data.append(
        'featured',
        String(formData.featured)
      );

      // =================================================
      // FEATURES
      // =================================================

      data.append(
        'features',
        JSON.stringify(formData.features)
      );

      // =================================================
      // OWNER CONTACT
      // =================================================

      data.append(
        'ownerContact',
        JSON.stringify(formData.ownerContact)
      );

      // =================================================
      // MAIN IMAGE
      // =================================================

      // IMPORTANT:
      // Only append mainImage if a NEW file was selected.
      //
      // Existing Cloudinary image doesn't need to be sent
      // again during edit.

      if (mainImageFile) {
        data.append(
          'mainImage',
          mainImageFile
        );
      }

      // =================================================
      // GALLERY IMAGES
      // =================================================

      // Only upload NEW files.
      // Existing Cloudinary images are already in DB.

      galleryFiles.forEach((file) => {
        data.append(
          'images',
          file
        );
      });

      // =================================================
      // URL + METHOD
      // =================================================

      const url = editingCar
        ? `${API_URL}/api/admin/cars/${editingCar._id}`
        : `${API_URL}/api/admin/cars`;

      const method = editingCar
        ? 'put'
        : 'post';

      console.log(
        editingCar
          ? 'Updating car...'
          : 'Creating car...'
      );

      // =================================================
      // AXIOS REQUEST
      // =================================================

      const response = await axios({
        method,
        url,
        data,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // IMPORTANT:
      // Do NOT manually set:
      //
      // Content-Type: multipart/form-data
      //
      // Axios/browser automatically creates the correct
      // multipart boundary.

      if (response.data?.success) {
        toast.success(
          editingCar
            ? 'Car updated successfully!'
            : 'Car added successfully!'
        );

        setShowModal(false);
        setEditingCar(null);

        resetForm();

        await fetchCars();
      } else {
        toast.error(
          response.data?.message ||
          'Operation failed'
        );
      }
    } catch (error) {
      console.error(
        'Car operation error:',
        error.response?.data || error
      );

      if (error.response?.status === 401) {
        localStorage.removeItem('adminToken');

        toast.error(
          'Session expired. Please login again.'
        );

        navigate('/admin/login');

        return;
      }

      toast.error(
        error.response?.data?.message ||
        error.message ||
        'Operation failed'
      );
    } finally {
      setUploading(false);
    }
  };

  // =====================================================
  // DELETE CAR
  // =====================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this car?\n\nThis will also delete its Cloudinary images.'
    );

    if (!confirmed) return;

    const token = localStorage.getItem('adminToken');

    if (!token) {
      toast.error('Authentication required');
      navigate('/admin/login');
      return;
    }

    try {
      await axios.delete(
        `${API_URL}/api/admin/cars/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast.success(
        'Car and images deleted successfully'
      );

      await fetchCars();
    } catch (error) {
      console.error(
        'Delete car error:',
        error.response?.data || error
      );

      if (error.response?.status === 401) {
        localStorage.removeItem('adminToken');

        toast.error(
          'Session expired. Please login again.'
        );

        navigate('/admin/login');

        return;
      }

      toast.error(
        error.response?.data?.message ||
        'Failed to delete car'
      );
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="min-h-screen pt-20 px-4 pb-10">
      <div className="container mx-auto">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">

          <div>
            <h1 className="font-orbitron text-4xl font-bold text-white">
              Admin Dashboard
            </h1>

            <p className="text-gray-400 font-rajdhani">
              Manage your car collection
            </p>
          </div>

          <div className="flex gap-4">

            <button
              onClick={handleAddCar}
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

        {/* =================================================
            STAT CARD
        ================================================= */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          <div className="bg-gradient-to-b from-gray-900 to-black p-6 rounded-2xl border border-gray-800">

            <div className="flex items-center gap-4">

              <div className="bg-red-600/20 p-3 rounded-xl">
                <FaCar className="text-3xl text-red-500" />
              </div>

              <div>
                <p className="text-gray-400 font-rajdhani text-sm">
                  Total Cars
                </p>

                <p className="font-orbitron text-3xl font-bold text-white">
                  {cars.length}
                </p>
              </div>

            </div>

          </div>

        </div>

        {/* =================================================
            TABLE
        ================================================= */}

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

                    <th className="px-6 py-4 text-left text-gray-400 font-rajdhani font-semibold text-sm">
                      Car
                    </th>

                    <th className="px-6 py-4 text-left text-gray-400 font-rajdhani font-semibold text-sm">
                      Price
                    </th>

                    <th className="px-6 py-4 text-left text-gray-400 font-rajdhani font-semibold text-sm">
                      Year
                    </th>

                    <th className="px-6 py-4 text-left text-gray-400 font-rajdhani font-semibold text-sm">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-gray-400 font-rajdhani font-semibold text-sm">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {cars.length === 0 ? (

                    <tr>

                      <td
                        colSpan="5"
                        className="px-6 py-8 text-center text-gray-400"
                      >
                        No cars added yet. Click "Add Car" to get started!
                      </td>

                    </tr>

                  ) : (

                    cars.map((car) => {

                      const imageUrl =
                        getImageUrl(car.mainImage);

                      return (

                        <motion.tr
                          key={car._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="border-b border-gray-800 hover:bg-white/5 transition-colors"
                        >

                          {/* CAR */}

                          <td className="px-6 py-4">

                            <div className="flex items-center gap-3">

                              <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">

                                {imageUrl ? (

                                  <img
                                    src={imageUrl}
                                    alt={car.title || 'Car'}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.currentTarget.src =
                                        'https://via.placeholder.com/50';
                                    }}
                                  />

                                ) : (

                                  <div className="w-full h-full flex items-center justify-center">
                                    <FaCar className="text-gray-500" />
                                  </div>

                                )}

                              </div>

                              <div>

                                <p className="text-white font-rajdhani font-semibold">
                                  {car.make} {car.model}
                                </p>

                                <p className="text-gray-500 font-rajdhani text-sm">
                                  {car.title}
                                </p>

                              </div>

                            </div>

                          </td>

                          {/* PRICE */}

                          <td className="px-6 py-4 text-white font-orbitron font-bold">
                            £{Number(car.price || 0).toLocaleString()}
                          </td>

                          {/* YEAR */}

                          <td className="px-6 py-4 text-gray-300 font-rajdhani">
                            {car.year}
                          </td>

                          {/* STATUS */}

                          <td className="px-6 py-4">

                            <span
                              className={`px-3 py-1 rounded-full text-xs font-rajdhani font-semibold ${
                                car.featured
                                  ? 'bg-yellow-600/30 text-yellow-400 border border-yellow-600/30'
                                  : 'bg-gray-600/30 text-gray-400 border border-gray-600/30'
                              }`}
                            >
                              {car.featured
                                ? '⭐ Featured'
                                : 'Standard'}
                            </span>

                          </td>

                          {/* ACTIONS */}

                          <td className="px-6 py-4">

                            <div className="flex justify-end gap-2">

                              <button
                                onClick={() =>
                                  handleEdit(car)
                                }
                                className="bg-blue-600/20 hover:bg-blue-600/40 p-2 rounded-lg transition-colors"
                                title="Edit car"
                              >
                                <FaEdit className="text-blue-400" />
                              </button>

                              <button
                                onClick={() =>
                                  handleDelete(car._id)
                                }
                                className="bg-red-600/20 hover:bg-red-600/40 p-2 rounded-lg transition-colors"
                                title="Delete car"
                              >
                                <FaTrash className="text-red-400" />
                              </button>

                            </div>

                          </td>

                        </motion.tr>

                      );
                    })

                  )}

                </tbody>

              </table>

            </div>

          </div>

        )}

      </div>

      {/* ===================================================
          ADD / EDIT MODAL
      =================================================== */}

      {showModal && (

        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-b from-gray-900 to-black rounded-2xl border border-gray-800 max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8"
          >

            {/* MODAL HEADER */}

            <div className="flex justify-between items-center mb-6">

              <h2 className="font-orbitron text-2xl font-bold text-white">
                {editingCar
                  ? 'Edit Car'
                  : 'Add New Car'}
              </h2>

              <button
                onClick={closeModal}
                disabled={uploading}
                className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
              >
                <FaTimes className="text-2xl" />
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              {/* =================================================
                  BASIC INFORMATION
              ================================================= */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <input
                  type="text"
                  name="title"
                  placeholder="Title *"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white font-rajdhani focus:border-red-500 focus:outline-none"
                  required
                />

                <input
                  type="text"
                  name="make"
                  placeholder="Make *"
                  value={formData.make}
                  onChange={handleInputChange}
                  className="bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white font-rajdhani focus:border-red-500 focus:outline-none"
                  required
                />

                <input
                  type="text"
                  name="model"
                  placeholder="Model *"
                  value={formData.model}
                  onChange={handleInputChange}
                  className="bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white font-rajdhani focus:border-red-500 focus:outline-none"
                  required
                />

                <input
                  type="number"
                  name="year"
                  placeholder="Year *"
                  value={formData.year}
                  onChange={handleInputChange}
                  min="1990"
                  max={new Date().getFullYear() + 1}
                  className="bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white font-rajdhani focus:border-red-500 focus:outline-none"
                  required
                />

                <input
                  type="number"
                  name="price"
                  placeholder="Price *"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  className="bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white font-rajdhani focus:border-red-500 focus:outline-none"
                  required
                />

                <input
                  type="number"
                  name="mileage"
                  placeholder="Mileage (km) *"
                  value={formData.mileage}
                  onChange={handleInputChange}
                  min="0"
                  className="bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white font-rajdhani focus:border-red-500 focus:outline-none"
                  required
                />

                <select
                  name="fuelType"
                  value={formData.fuelType}
                  onChange={handleInputChange}
                  className="bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white font-rajdhani focus:border-red-500 focus:outline-none"
                  required
                >
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="CNG">CNG</option>
                </select>

                <select
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleInputChange}
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
                  name="color"
                  placeholder="Color *"
                  value={formData.color}
                  onChange={handleInputChange}
                  className="bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white font-rajdhani focus:border-red-500 focus:outline-none"
                  required
                />

                <input
                  type="text"
                  name="engineCapacity"
                  placeholder="Engine Capacity (e.g. 2.0L) *"
                  value={formData.engineCapacity}
                  onChange={handleInputChange}
                  className="bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white font-rajdhani focus:border-red-500 focus:outline-none"
                  required
                />

                <input
                  type="number"
                  name="horsepower"
                  placeholder="Horsepower *"
                  value={formData.horsepower}
                  onChange={handleInputChange}
                  min="0"
                  className="bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white font-rajdhani focus:border-red-500 focus:outline-none"
                  required
                />

                <input
                  type="text"
                  name="topSpeed"
                  placeholder="Top Speed (e.g. 340 km/h) *"
                  value={formData.topSpeed}
                  onChange={handleInputChange}
                  className="bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white font-rajdhani focus:border-red-500 focus:outline-none"
                  required
                />

                <input
                  type="text"
                  name="acceleration"
                  placeholder="Acceleration (e.g. 2.9 sec) *"
                  value={formData.acceleration}
                  onChange={handleInputChange}
                  className="bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white font-rajdhani focus:border-red-500 focus:outline-none"
                  required
                />

                <input
                  type="text"
                  name="location"
                  placeholder="Location (City, Country) *"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white font-rajdhani focus:border-red-500 focus:outline-none"
                  required
                />

                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                  className="bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white font-rajdhani focus:border-red-500 focus:outline-none"
                >
                  <option value="New">New</option>
                  <option value="Used">Used</option>
                  <option value="Certified Pre-Owned">
                    Certified Pre-Owned
                  </option>
                </select>

              </div>

              {/* =================================================
                  DESCRIPTION
              ================================================= */}

              <div>

                <textarea
                  name="description"
                  placeholder="Description (minimum 50 characters) *"
                  value={formData.description}
                  onChange={handleInputChange}
                  minLength="50"
                  maxLength="2000"
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white font-rajdhani focus:border-red-500 focus:outline-none min-h-[120px]"
                  required
                />

                <p className="text-gray-500 text-xs mt-1 font-rajdhani">
                  {formData.description.length}/2000 characters
                </p>

              </div>

              {/* =================================================
                  FEATURES
              ================================================= */}

              <div>

                <label className="block text-gray-400 font-rajdhani text-sm mb-2">
                  Features (comma separated)
                </label>

                <input
                  type="text"
                  placeholder="e.g. Air Conditioning, Power Steering, ABS"
                  value={formData.features.join(', ')}
                  onChange={handleFeaturesChange}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white font-rajdhani focus:border-red-500 focus:outline-none"
                />

              </div>

              {/* =================================================
                  OWNER CONTACT
              ================================================= */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>

                  <label className="block text-gray-400 font-rajdhani text-sm mb-2">
                    Phone Number *
                  </label>

                  <input
                    type="text"
                    placeholder="Phone"
                    value={
                      formData.ownerContact.phone
                    }
                    onChange={(e) =>
                      handleOwnerContactChange(
                        'phone',
                        e.target.value
                      )
                    }
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
                    value={
                      formData.ownerContact.email
                    }
                    onChange={(e) =>
                      handleOwnerContactChange(
                        'email',
                        e.target.value
                      )
                    }
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
                    value={
                      formData.ownerContact.whatsapp
                    }
                    onChange={(e) =>
                      handleOwnerContactChange(
                        'whatsapp',
                        e.target.value
                      )
                    }
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white font-rajdhani focus:border-red-500 focus:outline-none"
                  />

                </div>

                <div>

                  <label className="block text-gray-400 font-rajdhani text-sm mb-2">
                    Featured Car
                  </label>

                  <select
                    value={String(formData.featured)}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        featured:
                          e.target.value === 'true'
                      }))
                    }
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white font-rajdhani focus:border-red-500 focus:outline-none"
                  >
                    <option value="false">
                      No
                    </option>

                    <option value="true">
                      Yes
                    </option>

                  </select>

                </div>

              </div>

              {/* =================================================
                  MAIN IMAGE
              ================================================= */}

              <div className="border-2 border-dashed border-gray-700 rounded-xl p-6 hover:border-red-500 transition-colors">

                <label className="block text-gray-400 font-rajdhani text-sm mb-3">

                  <FaImage className="inline mr-2" />

                  Main Image

                  {editingCar && (
                    <span className="text-gray-500 ml-2">
                      (Select a new file to replace existing image)
                    </span>
                  )}

                </label>

                <div className="flex flex-wrap items-center gap-4">

                  <label className="cursor-pointer bg-red-600/20 hover:bg-red-600/30 px-4 py-2 rounded-lg border border-red-600/30 transition-colors">

                    <span className="text-white font-rajdhani">
                      Choose File
                    </span>

                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                      onChange={handleMainImageChange}
                      className="hidden"
                    />

                  </label>

                  <span className="text-gray-400 font-rajdhani text-sm">

                    {mainImageFile
                      ? mainImageFile.name
                      : editingCar && mainImagePreview
                        ? 'Existing image'
                        : 'No file selected'}

                  </span>

                </div>

                {mainImagePreview && (

                  <div className="mt-4">

                    <p className="text-gray-500 text-xs mb-2 font-rajdhani">
                      Preview
                    </p>

                    <img
                      src={mainImagePreview}
                      alt="Main preview"
                      className="w-40 h-40 object-cover rounded-lg border border-gray-700"
                    />

                  </div>

                )}

              </div>

              {/* =================================================
                  GALLERY IMAGES
              ================================================= */}

              <div className="border-2 border-dashed border-gray-700 rounded-xl p-6 hover:border-red-500 transition-colors">

                <label className="block text-gray-400 font-rajdhani text-sm mb-3">

                  <FaUpload className="inline mr-2" />

                  Gallery Images

                </label>

                <div className="flex flex-wrap items-center gap-4">

                  <label className="cursor-pointer bg-red-600/20 hover:bg-red-600/30 px-4 py-2 rounded-lg border border-red-600/30 transition-colors">

                    <span className="text-white font-rajdhani">
                      Choose Files
                    </span>

                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                      multiple
                      onChange={handleGalleryImagesChange}
                      className="hidden"
                    />

                  </label>

                  <span className="text-gray-400 font-rajdhani text-sm">

                    {galleryFiles.length} new file(s) selected

                  </span>

                </div>

                {galleryPreviews.length > 0 && (

                  <div className="flex gap-3 mt-4 flex-wrap">

                    {galleryPreviews.map(
                      (preview, index) => (

                        <div
                          key={`${preview.url}-${index}`}
                          className="relative"
                        >

                          <img
                            src={preview.url}
                            alt={`Gallery ${index + 1}`}
                            className="w-24 h-24 object-cover rounded-lg border border-gray-700"
                          />

                          {preview.type === 'existing' && (
                            <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[10px] px-1 rounded">
                              Existing
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              removeGalleryImage(index)
                            }
                            disabled={uploading}
                            className="absolute -top-2 -right-2 bg-red-600 rounded-full p-1 hover:bg-red-700 transition-colors disabled:opacity-50"
                            title="Remove image"
                          >
                            <FaTimes className="text-xs text-white" />
                          </button>

                        </div>

                      )
                    )}

                  </div>

                )}

                {editingCar &&
                  galleryPreviews.length > 0 && (
                    <p className="text-gray-500 text-xs mt-3 font-rajdhani">
                      Existing images are shown above. Selecting new
                      gallery images will upload them.
                    </p>
                  )}

              </div>

              {/* =================================================
                  BUTTONS
              ================================================= */}

              <div className="flex flex-col md:flex-row gap-4">

                <motion.button
                  whileHover={{
                    scale: uploading ? 1 : 1.02
                  }}
                  whileTap={{
                    scale: uploading ? 1 : 0.98
                  }}
                  type="submit"
                  disabled={uploading}
                  className="flex-1 sports-btn py-3 rounded-xl text-white font-orbitron font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >

                  {uploading
                    ? 'UPLOADING...'
                    : editingCar
                      ? 'UPDATE CAR'
                      : 'ADD CAR'}

                </motion.button>

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={uploading}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 py-3 rounded-xl text-white font-rajdhani font-semibold transition-colors disabled:opacity-50"
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