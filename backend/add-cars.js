```javascript
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
    description:
      'The BMW 840i is a luxurious grand tourer that combines elegant styling with impressive performance. Featuring a 3.0L twin-turbo inline-6 engine producing 333 bhp, this coupe delivers a smooth and powerful driving experience.',
    features: [
      '20" M Alloy Wheels',
      'M Sport Exterior',
      'Live Cockpit Professional',
      'Harman Kardon Sound',
      'Wireless Apple CarPlay',
      'Heated Seats',
      'Parking Sensors'
    ],
    location: 'London, UK',
    condition: 'Used',
    featured: true,
    ownerContact: {
      phone: '07898365106',
      email: 'sales@aumotors.uk',
      whatsapp: '07898365106'
    },
    mainImage: {
      url: 'https://via.placeholder.com/600x400/808080/ffffff?text=BMW+840i',
      publicId: 'placeholder-bmw-840i'
    },
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
    description:
      'The Mercedes-AMG C43 is a performance-focused luxury sedan that delivers exhilarating driving dynamics. Powered by the innovative M139 2.0L four-cylinder engine with electrically assisted turbocharger producing 416 bhp.',
    features: [
      'AMG SPEEDSHIFT MCT 9G-Tronic',
      '4MATIC All-Wheel Drive',
      'AMG Ride Control Suspension',
      '11.9" MBUX Touchscreen',
      'AMG Sports Seats',
      'Burmester Sound'
    ],
    location: 'London, UK',
    condition: 'Used',
    featured: true,
    ownerContact: {
      phone: '07898365106',
      email: 'sales@aumotors.uk',
      whatsapp: '07898365106'
    },
    mainImage: {
      url: 'https://via.placeholder.com/600x400/808080/ffffff?text=Mercedes+C43',
      publicId: 'placeholder-mercedes-c43'
    },
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
    description:
      'The Nissan Qashqai is a popular crossover SUV that offers practicality, comfort, and efficiency. Powered by a 1.3L turbo engine producing 158 bhp, this family-friendly vehicle delivers a smooth ride with excellent fuel economy.',
    features: [
      'Wireless Apple CarPlay',
      'DAB Digital Radio',
      'Front/Rear Parking Sensors',
      'Reversing Camera',
      'Privacy Glass',
      'Lane Assist'
    ],
    location: 'London, UK',
    condition: 'Used',
    featured: false,
    ownerContact: {
      phone: '07898365106',
      email: 'sales@aumotors.uk',
      whatsapp: '07898365106'
    },
    mainImage: {
      url: 'https://via.placeholder.com/600x400/000000/ffffff?text=Nissan+Qashqai',
      publicId: 'placeholder-nissan-qashqai'
    },
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
    description:
      'The BMW 7 Series 740d is the epitome of luxury and refinement. This flagship sedan combines a powerful 3.0L engine with an elegant design and a sumptuous interior.',
    features: [
      'Executive Package',
      'Massage Seats',
      'BMW Theatre Screen',
      'Bowers & Wilkins Sound',
      'Driver Assist Pro'
    ],
    location: 'London, UK',
    condition: 'Used',
    featured: false,
    ownerContact: {
      phone: '07898365106',
      email: 'sales@aumotors.uk',
      whatsapp: '07898365106'
    },
    mainImage: {
      url: 'https://via.placeholder.com/600x400/000000/ffffff?text=BMW+740d',
      publicId: 'placeholder-bmw-740d'
    },
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
    description:
      'The Volkswagen Golf GTI is the original hot hatch icon. Powered by a 2.0L turbocharged engine producing 245 bhp, this 2019 model delivers an exhilarating driving experience with precise handling and everyday practicality. The GTI features a sporty interior with plaid cloth seats, advanced infotainment, and legendary GTI driving dynamics.',
    features: [
      'Plaid Cloth Seats',
      'Sports Suspension',
      'Apple CarPlay',
      'Android Auto',
      'Rear Parking Sensors',
      'XDS Electronic Diff Lock',
      'Sport Exhaust'
    ],
    location: 'London, UK',
    condition: 'Used',
    featured: false,
    ownerContact: {
      phone: '07898365106',
      email: 'sales@aumotors.uk',
      whatsapp: '07898365106'
    },
    mainImage: {
      url: 'https://picsum.photos/600/400?random=10',
      publicId: 'placeholder-vw-golf-gti'
    },
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
    description:
      'The Mercedes-AMG A45 Premium Plus is a pocket rocket that redefines performance in the hot hatch segment. Powered by the mighty M139 2.0L four-cylinder engine producing 416 bhp, this 2020 model delivers supercar-rivalling performance with all-wheel-drive grip. The Premium Plus specification adds luxurious touches including leather upholstery, premium sound system, and advanced driver assistance features.',
    features: [
      'AMG SPEEDSHIFT 8G-DCT',
      '4MATIC+ AWD',
      'AMG Ride Control',
      'Leather Seats',
      'Burmester Sound',
      'Panoramic Roof',
      'Premium Plus Package'
    ],
    location: 'London, UK',
    condition: 'Used',
    featured: false,
    ownerContact: {
      phone: '07898365106',
      email: 'sales@aumotors.uk',
      whatsapp: '07898365106'
    },
    mainImage: {
      url: 'https://picsum.photos/600/400?random=11',
      publicId: 'placeholder-mercedes-a45'
    },
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
    description:
      'The Mercedes-Benz C220d is a refined and efficient executive saloon that combines luxury with excellent fuel economy. Powered by the 2.1L diesel engine producing 170 bhp, this 2017 model delivers a smooth and comfortable ride with impressive torque for effortless motorway cruising.',
    features: [
      'Leather Seats',
      'COMAND Infotainment',
      'Parking Sensors',
      'Reversing Camera',
      'Cruise Control',
      'LED Headlights',
      'Keyless Go'
    ],
    location: 'London, UK',
    condition: 'Used',
    featured: false,
    ownerContact: {
      phone: '07898365106',
      email: 'sales@aumotors.uk',
      whatsapp: '07898365106'
    },
    mainImage: {
      url: 'https://picsum.photos/600/400?random=12',
      publicId: 'placeholder-mercedes-c220d'
    },
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
    description:
      'The BMW G80 M3 is the ultimate driving machine. This 2022 model features the iconic 3.0L twin-turbo inline-6 engine producing 473 bhp, delivering breathtaking performance and the signature M3 driving dynamics. The G80 M3 features a bold, aggressive design, a driver-focused interior with premium materials, and the latest M-specific technology.',
    features: [
      'M Sport Seats',
      'Carbon Interior Trim',
      'Harman Kardon Sound',
      'M Drive Modes',
      'M Sport Exhaust',
      'Heads-Up Display',
      'Drive Assist Pro'
    ],
    location: 'London, UK',
    condition: 'Used',
    featured: true,
    ownerContact: {
      phone: '07898365106',
      email: 'sales@aumotors.uk',
      whatsapp: '07898365106'
    },
    mainImage: {
      url: 'https://picsum.photos/600/400?random=13',
      publicId: 'placeholder-bmw-g80-m3'
    },
    images: []
  }
];

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');

    // Clear existing cars before adding the 8 cars
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
        console.error(
          'Error adding ' + carData.title + ':',
          err.message
        );
      }
    }

    console.log('');
    console.log('================================');
    console.log(`Successfully added ${added} cars!`);
    console.log('================================');
    console.log('');
    console.log('Cars added:');
    console.log('1. BMW 840i - £27,499');
    console.log('2. Mercedes C43 AMG - £39,800');
    console.log('3. Nissan Qashqai - £17,099');
    console.log('4. BMW 7 Series 740d - £32,699');
    console.log('5. VW Golf GTI - £15,500');
    console.log('6. Mercedes A45 AMG Premium Plus - £20,000');
    console.log('7. Mercedes C220d - £13,500');
    console.log('8. BMW G80 M3 - £47,500');
    console.log('');
    console.log('All cars are now in MongoDB!');

    process.exit(0);
  })
  .catch((err) => {
    console.error('Database connection error:', err);
    process.exit(1);
  });
```
