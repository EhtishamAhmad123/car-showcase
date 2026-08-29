const mongoose = require('mongoose');

const uri = 'mongodb+srv://ehtishamahmad950_db_user:mJuTesrq5CpxI5x9@cluster0.1mxdqtb.mongodb.net/carshowcase?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(uri)
  .then(() => {
    console.log('✅ Connected to MongoDB successfully!');
    process.exit(0);
  })
  .catch((err) => {
    console.log('❌ Error:', err.message);
    process.exit(1);
  });
