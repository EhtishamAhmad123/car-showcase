const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true
    },
    publicId: {
      type: String,
      required: true
    }
  },
  { _id: false }
);

const carSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },

  make: {
    type: String,
    required: true,
    trim: true
  },

  model: {
    type: String,
    required: true,
    trim: true
  },

  year: {
    type: Number,
    required: true,
    min: 1990,
    max: new Date().getFullYear() + 1
  },

  price: {
    type: Number,
    required: true,
    min: 0
  },

  mileage: {
    type: Number,
    required: true,
    min: 0
  },

  fuelType: {
    type: String,
    enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'],
    required: true
  },

  transmission: {
    type: String,
    enum: ['Manual', 'Automatic', 'CVT', 'DCT'],
    required: true
  },

  color: {
    type: String,
    required: true
  },

  engineCapacity: {
    type: String,
    required: true
  },

  horsepower: {
    type: Number,
    required: true
  },

  topSpeed: {
    type: String,
    required: true
  },

  acceleration: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true,
    minlength: 50,
    maxlength: 2000
  },

  features: [
    {
      type: String
    }
  ],

  mainImage: {
    type: imageSchema,
    required: true
  },

  images: [imageSchema],

  condition: {
    type: String,
    enum: ['New', 'Used', 'Certified Pre-Owned'],
    default: 'Used'
  },

  location: {
    type: String,
    required: true
  },

  ownerContact: {
    phone: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true
    },

    whatsapp: String
  },

  featured: {
    type: Boolean,
    default: false
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }
});

carSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Car', carSchema);