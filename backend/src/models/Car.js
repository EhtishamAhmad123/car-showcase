const mongoose = require('mongoose');

const carSchema = new mongoose.Schema(
  {
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
      enum: [
        'Petrol',
        'Diesel',
        'Electric',
        'Hybrid',
        'CNG'
      ],
      required: true
    },

    transmission: {
      type: String,
      enum: [
        'Manual',
        'Automatic',
        'CVT',
        'DCT'
      ],
      required: true
    },

    color: {
      type: String,
      required: true,
      trim: true
    },

    engineCapacity: {
      type: String,
      required: true,
      trim: true
    },

    horsepower: {
      type: Number,
      required: true,
      min: 0
    },

    topSpeed: {
      type: String,
      required: true,
      trim: true
    },

    acceleration: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true,
      minlength: 50,
      maxlength: 2000,
      trim: true
    },

    features: {
      type: [String],
      default: []
    },

    /*
     * Static images stored in:
     *
     * frontend/public/cars/
     *
     * Example:
     *
     * mainImage: "/cars/bmw-840i/1.jpg"
     */

    mainImage: {
      type: String,
      required: true,
      trim: true
    },

    images: {
      type: [String],
      default: []
    },

    condition: {
      type: String,
      enum: [
        'New',
        'Used',
        'Certified Pre-Owned'
      ],
      default: 'Used'
    },

    location: {
      type: String,
      required: true,
      trim: true
    },

    ownerContact: {
      phone: {
        type: String,
        required: true,
        trim: true
      },

      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
      },

      whatsapp: {
        type: String,
        trim: true
      }
    },

    featured: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Car', carSchema);