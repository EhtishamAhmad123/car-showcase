const Car = require('../models/Car');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

exports.upload = upload;

exports.getAllCars = async (req, res) => {
  try {
    const cars = await Car.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: cars.length,
      data: cars
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

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
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.createCar = async (req, res) => {
  try {
    const carData = req.body;
    
    // Handle file uploads
    if (req.files) {
      if (req.files.mainImage) {
        const file = req.files.mainImage[0];
        carData.mainImage = `/uploads/${file.filename}`;
      }
      
      if (req.files.images) {
        carData.images = req.files.images.map(file => `/uploads/${file.filename}`);
      }
    }
    
    // If no mainImage uploaded, use placeholder
    if (!carData.mainImage) {
      carData.mainImage = 'https://via.placeholder.com/600x400/ff0000/ffffff?text=Car';
    }
    
    // Handle features if it's a string
    if (typeof carData.features === 'string') {
      carData.features = carData.features.split(',').map(f => f.trim());
    }
    
    // Handle ownerContact if it's a string
    if (typeof carData.ownerContact === 'string') {
      try {
        carData.ownerContact = JSON.parse(carData.ownerContact);
      } catch {
        // Keep as is
      }
    }
    
    const car = await Car.create(carData);
    res.status(201).json({
      success: true,
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

exports.updateCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }

    const carData = req.body;
    
    // Handle file uploads
    if (req.files) {
      if (req.files.mainImage) {
        const file = req.files.mainImage[0];
        carData.mainImage = `/uploads/${file.filename}`;
      }
      
      if (req.files.images) {
        carData.images = req.files.images.map(file => `/uploads/${file.filename}`);
      }
    }
    
    // Handle features if it's a string
    if (typeof carData.features === 'string') {
      carData.features = carData.features.split(',').map(f => f.trim());
    }
    
    // Handle ownerContact if it's a string
    if (typeof carData.ownerContact === 'string') {
      try {
        carData.ownerContact = JSON.parse(carData.ownerContact);
      } catch {
        // Keep as is
      }
    }

    const updatedCar = await Car.findByIdAndUpdate(
      req.params.id,
      carData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: updatedCar
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

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
    res.status(200).json({
      success: true,
      message: 'Car deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.adminLogin = (req, res) => {
  const { email, password } = req.body;
  
  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign(
      { email, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.status(200).json({
      success: true,
      token,
      message: 'Login successful'
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
};
