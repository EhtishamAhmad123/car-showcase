const mongoose = require('mongoose');
const Car = require('./src/models/Car');

mongoose.connect('mongodb://localhost:27017/carshowcase')
  .then(async () => {
    await Car.updateMany({}, { 
      'ownerContact.email': 'sales@aumotors.uk'
    });
    console.log('Updated all cars to use: sales@aumotors.uk');
    process.exit();
  })
  .catch(function(err) {
    console.error('Error:', err);
    process.exit(1);
  });
