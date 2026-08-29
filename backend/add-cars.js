const mongoose = require('mongoose');
const Car = require('./src/models/Car');

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
    description: 'The BMW 840i is a luxurious grand tourer that combines elegant styling with impressive performance. Featuring a 3.0L twin-turbo inline-6 engine producing 333 bhp, this coupe delivers a smooth and powerful driving experience.',
    features: ['20" M Alloy Wheels', 'M Sport Exterior', 'Live Cockpit Professional', 'Harman Kardon Sound', 'Wireless Apple CarPlay', 'Heated Seats', 'Parking Sensors'],
    location: 'London, UK',
    condition: 'Used',
    featured: true,
    ownerContact: {
      phone: '07898365106',
      email: 'info@automotors.co.uk',
      whatsapp: '07898365106'
    },
    mainImage: 'https://via.placeholder.com/600x400/808080/ffffff?text=BMW+840i',
    images: []
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
    description: 'The Mercedes-AMG C43 is a performance-focused luxury sedan that delivers exhilarating driving dynamics. Powered by the innovative M139 2.0L four-cylinder engine with electrically assisted turbocharger producing 416 bhp.',
    features: ['AMG SPEEDSHIFT MCT 9G-Tronic', '4MATIC All-Wheel Drive', 'AMG Ride Control Suspension', '11.9" MBUX Touchscreen', 'AMG Sports Seats', 'Burmester Sound'],
    location: 'London, UK',
    condition: 'Used',
    featured: true,
    ownerContact: {
      phone: '07898365106',
      email: 'info@automotors.co.uk',
      whatsapp: '07898365106'
    },
    mainImage: 'https://via.placeholder.com/600x400/808080/ffffff?text=Mercedes+C43',
    images: []
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
    description: 'The Nissan Qashqai is a popular crossover SUV that offers practicality, comfort, and efficiency. Powered by a 1.3L turbo engine producing 158 bhp, this family-friendly vehicle delivers a smooth ride with excellent fuel economy.',
    features: ['Wireless Apple CarPlay', 'DAB Digital Radio', 'Front/Rear Parking Sensors', 'Reversing Camera', 'Privacy Glass', 'Lane Assist'],
    location: 'London, UK',
    condition: 'Used',
    featured: false,
    ownerContact: {
      phone: '07898365106',
      email: 'info@automotors.co.uk',
      whatsapp: '07898365106'
    },
    mainImage: 'https://via.placeholder.com/600x400/000000/ffffff?text=Nissan+Qashqai',
    images: []
  },
  {
    title: 'BMW 7 Series 740d',
    make: 'BMW',
    model: '740d',
    year: 2022,
    price: 32699,
    mileage: 33000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    color: 'Black',
    engineCapacity: '3.0L',
    horsepower: 320,
    topSpeed: '155 mph',
    acceleration: '5.4 sec',
    description: 'The BMW 7 Series 740d is the epitome of luxury and refinement. This flagship sedan combines a powerful 3.0L engine with an elegant design and a sumptuous interior.',
    features: ['Executive Package', 'Massage Seats', 'BMW Theatre Screen', 'Bowers & Wilkins Sound', 'Driver Assist Pro'],
    location: 'London, UK',
    condition: 'Used',
    featured: false,
    ownerContact: {
      phone: '07898365106',
      email: 'info@automotors.co.uk',
      whatsapp: '07898365106'
    },
    mainImage: 'https://via.placeholder.com/600x400/000000/ffffff?text=BMW+740d',
    images: []
  }
];

mongoose.connect('mongodb://localhost:27017/carshowcase')
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
    console.log('All cars are now in the database!');
    console.log('Summary:');
    console.log('  BMW 840i - 27,499');
    console.log('  Mercedes C43 AMG - 39,800');
    console.log('  Nissan Qashqai - 17,099');
    console.log('  BMW 7 Series 740d - 32,699');
    process.exit();
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
