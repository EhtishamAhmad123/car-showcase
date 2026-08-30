require('dotenv').config({
  path: require('path').join(__dirname, '..', '.env')
});

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { v2: cloudinary } = require('cloudinary');

const Car = require('../src/models/Car');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');

function getFiles() {
  return fs
    .readdirSync(UPLOADS_DIR)
    .filter(file =>
      /^(mainImage|images)-.*\.(jpg|jpeg|png|webp|gif)$/i.test(file)
    )
    .sort((a, b) => {
      const ta = Number(a.split('-')[1]);
      const tb = Number(b.split('-')[1]);
      return ta - tb;
    });
}

function buildGroups() {
  const files = getFiles();

  const groups = [];
  let current = null;

  for (const filename of files) {
    if (filename.startsWith('mainImage-')) {
      current = {
        main: filename,
        images: []
      };

      groups.push(current);
    } else if (
      filename.startsWith('images-') &&
      current
    ) {
      current.images.push(filename);
    }
  }

  return groups;
}

function uploadToCloudinary(filePath) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      filePath,
      {
        folder: 'au-motors/cars',
        resource_type: 'image'
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
}

async function repair() {
  console.log('');
  console.log('======================================');
  console.log('CAR IMAGE REPAIR');
  console.log('======================================');
  console.log('');

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is missing');
  }

  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    throw new Error('CLOUDINARY_CLOUD_NAME is missing');
  }

  if (!process.env.CLOUDINARY_API_KEY) {
    throw new Error('CLOUDINARY_API_KEY is missing');
  }

  if (!process.env.CLOUDINARY_API_SECRET) {
    throw new Error('CLOUDINARY_API_SECRET is missing');
  }

  // ----------------------------------------
  // Connect MongoDB
  // ----------------------------------------

  console.log('Connecting to MongoDB...');

  await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 15000,
    connectTimeoutMS: 15000
  });

  console.log('MongoDB connected');
  console.log('');

  // ----------------------------------------
  // Get cars
  // ----------------------------------------

  const cars = await Car.find().sort({
    createdAt: 1
  });

  console.log(`Cars found: ${cars.length}`);
  console.log('');

  // ----------------------------------------
  // Build image groups
  // ----------------------------------------

  const groups = buildGroups();

  console.log(`Image groups found: ${groups.length}`);
  console.log('');

  // ----------------------------------------
  // SAFETY CHECK
  // ----------------------------------------

  if (groups.length < cars.length) {
    throw new Error(
      `Not enough image groups. Cars=${cars.length}, Groups=${groups.length}`
    );
  }

  console.log('The first image groups will be assigned to the cars in');
  console.log('the same order as their MongoDB creation dates.');
  console.log('');

  // ----------------------------------------
  // Show mapping BEFORE upload
  // ----------------------------------------

  console.log('IMAGE MAPPING');
  console.log('--------------------------------------');

  cars.forEach((car, index) => {
    const group = groups[index];

    console.log('');
    console.log(`${index + 1}. ${car.title}`);
    console.log(`   ID: ${car._id}`);
    console.log(`   MAIN: ${group.main}`);
    console.log(`   ADDITIONAL: ${group.images.length}`);

    group.images.forEach(image => {
      console.log(`      - ${image}`);
    });
  });

  console.log('');
  console.log('--------------------------------------');
  console.log('');

  // ----------------------------------------
  // Ask for explicit confirmation
  // ----------------------------------------

  console.log(
    'Starting repair in 3 seconds...'
  );

  await new Promise(resolve =>
    setTimeout(resolve, 3000)
  );

  // ----------------------------------------
  // Repair each car
  // ----------------------------------------

  for (let i = 0; i < cars.length; i++) {
    const car = cars[i];
    const group = groups[i];

    console.log('');
    console.log('======================================');
    console.log(`CAR ${i + 1}/${cars.length}: ${car.title}`);
    console.log('======================================');

    // --------------------------------------
    // Main image
    // --------------------------------------

    const mainPath = path.join(
      UPLOADS_DIR,
      group.main
    );

    console.log('');
    console.log(`Uploading main image: ${group.main}`);

    const mainResult =
      await uploadToCloudinary(mainPath);

    car.mainImage = {
      url: mainResult.secure_url,
      publicId: mainResult.public_id
    };

    console.log('Main image uploaded');
    console.log(mainResult.secure_url);

    // --------------------------------------
    // Additional images
    // --------------------------------------

    const additionalImages = [];

    for (const filename of group.images) {
      const imagePath = path.join(
        UPLOADS_DIR,
        filename
      );

      console.log(
        `Uploading additional image: ${filename}`
      );

      const result =
        await uploadToCloudinary(imagePath);

      additionalImages.push({
        url: result.secure_url,
        publicId: result.public_id
      });

      console.log('Uploaded');
    }

    car.images = additionalImages;

    // --------------------------------------
    // Save
    // --------------------------------------

    await car.save();

    console.log('');
    console.log('Car saved successfully');
    console.log(
      `Main: 1`
    );
    console.log(
      `Additional: ${additionalImages.length}`
    );
  }

  // ----------------------------------------
  // Verify
  // ----------------------------------------

  console.log('');
  console.log('');
  console.log('======================================');
  console.log('VERIFYING DATABASE');
  console.log('======================================');
  console.log('');

  const repairedCars = await Car.find()
    .sort({ createdAt: 1 })
    .select('title mainImage images');

  for (const car of repairedCars) {
    console.log('');
    console.log(`CAR: ${car.title}`);

    console.log(
      'Main image:',
      car.mainImage ? 'OK' : 'MISSING'
    );

    console.log(
      'Additional images:',
      car.images.length
    );

    if (car.mainImage) {
      console.log(
        'Main URL:',
        car.mainImage.url
      );
    }

    for (const image of car.images) {
      console.log(
        'Additional URL:',
        image.url
      );
    }
  }

  console.log('');
  console.log('======================================');
  console.log('REPAIR COMPLETE');
  console.log('======================================');
  console.log('');
}

repair()
  .catch(error => {
    console.error('');
    console.error('======================================');
    console.error('REPAIR FAILED');
    console.error('======================================');
    console.error('');
    console.error(error);
    console.error('');
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });