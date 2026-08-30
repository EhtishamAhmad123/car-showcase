const mongoose = require('mongoose');

const uri = mongoose.connect(process.env.MONGODB_URI)
mongoose.connect(uri)
  .then(() => {
    console.log('✅ Connected to MongoDB successfully!');
    process.exit(0);
  })
  .catch((err) => {
    console.log('❌ Error:', err.message);
    process.exit(1);
  });
