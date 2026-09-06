const Car = require('../models/Car');
const jwt = require('jsonwebtoken');

// ======================================================
// HELPER: CLEAN FEATURES
// ======================================================

const parseFeatures = (features) => {
  if (!features) return [];
  if (Array.isArray(features)) {
    return features.flat().map(f => String(f).trim()).filter(Boolean);
  }
  if (typeof features === 'string') {
    try {
      const parsed = JSON.parse(features);
      if (Array.isArray(parsed)) {
        return parsed.flat().map(f => String(f).trim()).filter(Boolean);
      }
    } catch {
      // Not JSON, split by comma
    }
    return features.split(',').map(f => f.trim()).filter(Boolean);
  }
  return [];
};

// ======================================================
// GET ALL CARS
// ======================================================

exports.getAllCars = async (req, res) => {
  try {
    const cars = await Car.find().sort({ createdAt: -1 });
    
    // Transform mainImage to full URL for frontend
    const transformedCars = cars.map(car => {
      const carObj = car.toObject();
      if (carObj.mainImage && !carObj.mainImage.startsWith('http')) {
        // Image is stored as path like /cars/bmw-840i/1.jpg
        // No change needed, frontend will use it directly
      }
      return carObj;
    });
    
    res.status(200).json({
      success: true,
      count: cars.length,
      data: transformedCars
    });
  } catch (error) {
    console.error('Get all cars error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ======================================================
// GET CAR BY ID
// ======================================================

exports.getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: car
    });
  } catch (error) {
    console.error('Get car by ID error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid car ID'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ======================================================
// CREATE CAR
// ======================================================

exports.createCar = async (req, res) => {
  try {
    console.log('Creating car...');
    
    const carData = {
      ...req.body
    };
    
    // Features
    carData.features = parseFeatures(carData.features);
    
    // Owner contact
    if (typeof carData.ownerContact === 'string') {
      try {
        carData.ownerContact = JSON.parse(carData.ownerContact);
      } catch {
        // Keep as is
      }
    }
    
    // Main image - should be path like /cars/folder/image.jpg
    if (!carData.mainImage || typeof carData.mainImage !== 'string' || !carData.mainImage.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Main image path is required. Example: /cars/bmw-840i/1.jpg'
      });
    }
    
    carData.mainImage = carData.mainImage.trim();
    
    // Images array
    if (typeof carData.images === 'string') {
      try {
        carData.images = JSON.parse(carData.images);
      } catch {
        carData.images = carData.images.split(',').map(i => i.trim()).filter(Boolean);
      }
    }
    
    const car = await Car.create(carData);
    
    console.log('Car created successfully:', car._id);
    
    res.status(201).json({
      success: true,
      message: 'Car created successfully',
      data: car
    });
  } catch (error) {
    console.error('Create car error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// ======================================================
// UPDATE CAR
// ======================================================

exports.updateCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }
    
    const carData = { ...req.body };
    
    // Features
    if (carData.features !== undefined) {
      carData.features = parseFeatures(carData.features);
    }
    
    // Owner contact
    if (typeof carData.ownerContact === 'string') {
      try {
        carData.ownerContact = JSON.parse(carData.ownerContact);
      } catch {
        // Keep as is
      }
    }
    
    // Images
    if (typeof carData.images === 'string') {
      try {
        carData.images = JSON.parse(carData.images);
      } catch {
        carData.images = carData.images.split(',').map(i => i.trim()).filter(Boolean);
      }
    }
    
    const updatedCar = await Car.findByIdAndUpdate(
      req.params.id,
      carData,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      message: 'Car updated successfully',
      data: updatedCar
    });
  } catch (error) {
    console.error('Update car error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid car ID'
      });
    }
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// ======================================================
// DELETE CAR
// ======================================================

exports.deleteCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }
    
    await car.deleteOne();
    
    console.log('Car deleted successfully:', car._id);
    
    res.status(200).json({
      success: true,
      message: 'Car deleted successfully'
    });
  } catch (error) {
    console.error('Delete car error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid car ID'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ======================================================
// ADMIN LOGIN
// ======================================================

exports.adminLogin = (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }
    
    if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is missing');
      return res.status(500).json({
        success: false,
        message: 'Server authentication configuration is missing'
      });
    }
    
    const token = jwt.sign(
      { email, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    return res.status(200).json({
      success: true,
      token,
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
};