// backend/seed.js
const mongoose = require('mongoose');
const Car = require('./src/models/Car');
require('dotenv').config();

const cars = [
  {
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
    description: 'The BMW 840i is a luxurious grand tourer that combines elegant styling with impressive performance.',
    features: ['20" M Alloy Wheels', 'M Sport Exterior', 'Live Cockpit Professional', 'Harman Kardon Sound'],
    location: 'London, UK',
    condition: 'Used',
    featured: true,
    ownerContact: {
      phone: '07898365106',
      email: 'sales@aumotors.uk',
      whatsapp: '07898365106'
    },
    mainImage: '/cars/bmw-840i/1.jpg',
    images: ['/cars/bmw-840i/2.jpg', '/cars/bmw-840i/3.jpg']
  },
  {
    title: 'Mercedes C43 AMG',
    make: 'Mercedes-Benz',
    model: 'C43 AMG',
    year: 2023,
    price: 39800,
    mileage: 18550,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    color: 'Grey',
    engineCapacity: '2.0L',
    horsepower: 416,
    topSpeed: '155 mph',
    acceleration: '4.6 sec',
    description: 'The Mercedes-AMG C43 is a performance-focused luxury sedan that delivers exhilarating driving dynamics.',
    features: ['AMG SPEEDSHIFT MCT 9G-Tronic', '4MATIC All-Wheel Drive', 'AMG Ride Control Suspension'],
    location: 'London, UK',
    condition: 'Used',
    featured: true,
    ownerContact: {
      phone: '07898365106',
      email: 'sales@aumotors.uk',
      whatsapp: '07898365106'
    },
    mainImage: '/cars/mercedes-c43/1.jpg',
    images: ['/cars/mercedes-c43/2.jpg']
  },
  {
    title: 'Nissan Qashqai',
    make: 'Nissan',
    model: 'Qashqai 1.3 DiG-T MH 158',
    year: 2022,
    price: 17099,
    mileage: 23200,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    color: 'Black',
    engineCapacity: '1.3L',
    horsepower: 158,
    topSpeed: '128 mph',
    acceleration: '9.5 sec',
    description: 'The Nissan Qashqai is a popular crossover SUV that offers practicality, comfort, and efficiency.',
    features: ['Wireless Apple CarPlay', 'DAB Digital Radio', 'Front/Rear Parking Sensors'],
    location: 'London, UK',
    condition: 'Used',
    featured: false,
    ownerContact: {
      phone: '07898365106',
      email: 'sales@aumotors.uk',
      whatsapp: '07898365106'
    },
    mainImage: '/cars/nissan-qashqai/1.jpg',
    images: []
  },
  {
    title: 'BMW 7 Series 740d',
    make: 'BMW',
    model: '740d',
    year: 2022,
    price: 32699,
    mileage: 33000,
    fuelType: 'Diesel',
    transmission: 'Automatic',
    color: 'Black',
    engineCapacity: '3.0L',
    horsepower: 320,
    topSpeed: '155 mph',
    acceleration: '5.4 sec',
    description: 'The BMW 7 Series 740d is the epitome of luxury and refinement.',
    features: ['Executive Package', 'Massage Seats', 'BMW Theatre Screen'],
    location: 'London, UK',
    condition: 'Used',
    featured: false,
    ownerContact: {
      phone: '07898365106',
      email: 'sales@aumotors.uk',
      whatsapp: '07898365106'
    },
    mainImage: '/cars/bmw-740d/1.jpg',
    images: []
  },
  {
    title: 'VW Golf GTI',
    make: 'Volkswagen',
    model: 'Golf GTI',
    year: 2019,
    price: 15500,
    mileage: 69200,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    color: 'Red',
    engineCapacity: '2.0L',
    horsepower: 245,
    topSpeed: '155 mph',
    acceleration: '6.2 sec',
    description: 'The Volkswagen Golf GTI is the original hot hatch icon.',
    features: ['Plaid Cloth Seats', 'Sports Suspension', 'Apple CarPlay'],
    location: 'London, UK',
    condition: 'Used',
    featured: false,
    ownerContact: {
      phone: '07898365106',
      email: 'sales@aumotors.uk',
      whatsapp: '07898365106'
    },
    mainImage: '/cars/vw-golf-gti/1.jpg',
    images: []
  }
];

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    await Car.deleteMany({});
    console.log('Cleared existing cars');
    
    let added = 0;
    for (const carData of cars) {
      try {
        const car = new Car(carData);
        await car.save();
        added++;
        console.log('Added: ' + carData.title);
      } catch (err) {
        console.error('Error adding ' + carData.title + ':', err.message);
      }
    }
    console.log('Successfully added ' + added + ' cars!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error:', err);
    process.exit(1);
  });