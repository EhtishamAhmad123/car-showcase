const mongoose = require('mongoose');
const Car = require('./src/models/Car');

mongoose.connect('mongodb://localhost:27017/carshowcase')
  .then(async () => {
    const cars = await Car.find();
    console.log('Found ' + cars.length + ' cars');
    
    for (let car of cars) {
      let features = car.features;
      console.log('Processing: ' + car.title);
      console.log('  Original features:', features);
      
      // If features is a string, try to parse it
      if (typeof features === 'string') {
        try {
          features = JSON.parse(features);
          console.log('  Parsed from string');
        } catch {
          // If not valid JSON, split by comma
          features = features.split(',').map(function(f) { return f.trim(); });
          console.log('  Split by comma');
        }
      }
      
      // If features is an array with a single string
      if (Array.isArray(features) && features.length === 1 && typeof features[0] === 'string') {
        try {
          features = JSON.parse(features[0]);
          console.log('  Parsed array from string');
        } catch {
          // Keep as is
        }
      }
      
      // Flatten and clean
      if (Array.isArray(features)) {
        // Flatten
        features = features.flat();
        // Remove extra quotes
        features = features.map(function(f) {
          return String(f).replace(/^["']|["']$/g, '');
        });
        console.log('  Cleaned features:', features);
      }
      
      // Update the car with fixed features
      await Car.updateOne({ _id: car._id }, { features: features });
      console.log('  Updated successfully');
    }
    
    console.log('All features fixed!');
    process.exit();
  })
  .catch(function(err) {
    console.log('Error:', err);
    process.exit(1);
  });
