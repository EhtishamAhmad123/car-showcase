const mongoose = require('mongoose');
const Car = require('./src/models/Car');

const cars = [
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
    description: 'The Volkswagen Golf GTI is the original hot hatch icon. Powered by a 2.0L turbocharged engine producing 245 bhp, this 2019 model delivers an exhilarating driving experience with precise handling and everyday practicality. The GTI features a sporty interior with plaid cloth seats, advanced infotainment, and the legendary GTI driving dynamics that have made it a favourite among enthusiasts.',
    features: ['Plaid Cloth Seats', 'Sports Suspension', 'Apple CarPlay', 'Android Auto', 'Rear Parking Sensors', 'XDS Electronic Diff Lock', 'Sport Exhaust'],
    location: 'London, UK',
    condition: 'Used',
    featured: false,
    ownerContact: {
      phone: '07898365106',
      email: 'sales@aumotors.uk',
      whatsapp: '07898365106'
    },
    mainImage: 'https://picsum.photos/600/400?random=10',
    images: []
  },
  {
    title: 'Mercedes A45 AMG Premium Plus',
    make: 'Mercedes-Benz',
    model: 'A45 AMG Premium Plus',
    year: 2020,
    price: 20000,
    mileage: 82000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    color: 'Grey',
    engineCapacity: '2.0L',
    horsepower: 416,
    topSpeed: '168 mph',
    acceleration: '3.9 sec',
    description: 'The Mercedes-AMG A45 Premium Plus is a pocket rocket that redefines performance in the hot hatch segment. Powered by the mighty M139 2.0L four-cylinder engine producing 416 bhp, this 2020 model delivers supercar-rivalling performance with all-wheel-drive grip. The Premium Plus specification adds luxurious touches including leather upholstery, premium sound system, and advanced driver assistance features.',
    features: ['AMG SPEEDSHIFT 8G-DCT', '4MATIC+ AWD', 'AMG Ride Control', 'Leather Seats', 'Burmester Sound', 'Panoramic Roof', 'Premium Plus Package'],
    location: 'London, UK',
    condition: 'Used',
    featured: false,
    ownerContact: {
      phone: '07898365106',
      email: 'sales@aumotors.uk',
      whatsapp: '07898365106'
    },
    mainImage: 'https://picsum.photos/600/400?random=11',
    images: []
  },
  {
    title: 'Mercedes C220d',
    make: 'Mercedes-Benz',
    model: 'C220d',
    year: 2017,
    price: 13500,
    mileage: 77100,
    fuelType: 'Diesel',
    transmission: 'Automatic',
    color: 'Silver',
    engineCapacity: '2.1L',
    horsepower: 170,
    topSpeed: '143 mph',
    acceleration: '7.9 sec',
    description: 'The Mercedes-Benz C220d is a refined and efficient executive saloon that combines luxury with excellent fuel economy. Powered by the 2.1L diesel engine producing 170 bhp, this 2017 model delivers a smooth and comfortable ride with impressive torque for effortless motorway cruising. The C-Class offers a premium interior with high-quality materials and the latest Mercedes technology.',
    features: ['Leather Seats', 'COMAND Infotainment', 'Parking Sensors', 'Reversing Camera', 'Cruise Control', 'LED Headlights', 'Keyless Go'],
    location: 'London, UK',
    condition: 'Used',
    featured: false,
    ownerContact: {
      phone: '07898365106',
      email: 'sales@aumotors.uk',
      whatsapp: '07898365106'
    },
    mainImage: 'https://picsum.photos/600/400?random=12',
    images: []
  },
  {
    title: 'BMW G80 M3',
    make: 'BMW',
    model: 'G80 M3',
    year: 2022,
    price: 47500,
    mileage: 88000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    color: 'Black',
    engineCapacity: '3.0L',
    horsepower: 473,
    topSpeed: '155 mph',
    acceleration: '3.9 sec',
    description: 'The BMW G80 M3 is the ultimate driving machine. This 2022 model features the iconic 3.0L twin-turbo inline-6 engine producing 473 bhp, delivering breathtaking performance and the signature M3 driving dynamics. The G80 M3 features a bold, aggressive design, a driver-focused interior with premium materials, and the latest M-specific technology for an unparalleled driving experience.',
    features: ['M Sport Seats', 'Carbon Interior Trim', 'Harman Kardon Sound', 'M Drive Modes', 'M Sport Exhaust', 'Heads-Up Display', 'Drive Assist Pro'],
    location: 'London, UK',
    condition: 'Used',
    featured: true,
    ownerContact: {
      phone: '07898365106',
      email: 'sales@aumotors.uk',
      whatsapp: '07898365106'
    },
    mainImage: 'https://picsum.photos/600/400?random=13',
    images: []
  }
];

mongoose.connect('mongodb://localhost:27017/carshowcase')
  .then(async () => {
    console.log('Connected to MongoDB');
    
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
    console.log('Summary:');
    console.log('  VW Golf GTI - 15,500');
    console.log('  Mercedes A45 AMG - 20,000');
    console.log('  Mercedes C220d - 13,500');
    console.log('  BMW G80 M3 - 47,500');
    console.log('All cars added successfully!');
    process.exit();
  })
  .catch(function(err) {
    console.error('Error:', err);
    process.exit(1);
  });
