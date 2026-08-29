const mongoose = require('mongoose');
const Car = require('./src/models/Car');

mongoose.connect('mongodb://localhost:27017/carshowcase')
  .then(async () => {
    const cars = await Car.find();
    console.log('Found ' + cars.length + ' cars');
    
    for (let car of cars) {
      console.log('Processing: ' + car.title);
      
      // Set features directly as clean arrays
      let cleanFeatures = [];
      
      if (car.title === 'BMW 840i') {
        cleanFeatures = [
          '20" M Alloy Wheels',
          'M Sport Exterior',
          'Live Cockpit Professional',
          'Harman Kardon Sound',
          'Wireless Apple CarPlay',
          'Heated Seats',
          'Parking Sensors'
        ];
      } else if (car.title === 'Mercedes C43 AMG') {
        cleanFeatures = [
          'AMG SPEEDSHIFT MCT 9G-Tronic',
          '4MATIC All-Wheel Drive',
          'AMG Ride Control Suspension',
          '11.9" MBUX Touchscreen',
          'AMG Sports Seats',
          'Burmester Sound'
        ];
      } else if (car.title === 'Nissan Qashqai') {
        cleanFeatures = [
          'Wireless Apple CarPlay',
          'DAB Digital Radio',
          'Front/Rear Parking Sensors',
          'Reversing Camera',
          'Privacy Glass',
          'Lane Assist'
        ];
      } else if (car.title === 'BMW 7 Series 740d') {
        cleanFeatures = [
          'Executive Package',
          'Massage Seats',
          'BMW Theatre Screen',
          'Bowers & Wilkins Sound',
          'Driver Assist Pro'
        ];
      }
      
      // Update the car
      await Car.updateOne({ _id: car._id }, { features: cleanFeatures });
      console.log('  Updated features:', cleanFeatures);
    }
    
    console.log('All features fixed successfully!');
    process.exit();
  })
  .catch(function(err) {
    console.log('Error:', err);
    process.exit(1);
  });
