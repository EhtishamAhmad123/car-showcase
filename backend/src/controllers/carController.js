```javascript
const Car = require('../models/Car');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const cloudinary = require('../config/cloudinary');

// ======================================================
// MULTER CONFIGURATION
// ======================================================
//
// Files are temporarily stored in memory and uploaded
// directly to Cloudinary.
//
// This is suitable for Vercel/serverless environments
// because we do NOT depend on permanent /uploads files.
//

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,

  limits: {
    fileSize: 10 * 1024 * 1024 // 10 MB per image
  },

  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;

    const extname = allowedTypes.test(
      file.originalname.toLowerCase()
    );

    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    }

    cb(new Error('Only image files are allowed'));
  }
});

exports.upload = upload;


// ======================================================
// CLOUDINARY UPLOAD HELPER
// ======================================================

const uploadToCloudinary = (
  fileBuffer,
  folder = 'au-motors/cars'
) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
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

    stream.end(fileBuffer);
  });
};


// ======================================================
// CLOUDINARY DELETE HELPER
// ======================================================
//
// Deletes an image from Cloudinary using its publicId.
//
// Example:
// publicId = "au-motors/cars/abc123"
//

const deleteFromCloudinary = async (publicId) => {
  if (!publicId) {
    return;
  }

  try {
    console.log(
      `Deleting Cloudinary image: ${publicId}`
    );

    const result = await cloudinary.uploader.destroy(
      publicId,
      {
        resource_type: 'image'
      }
    );

    console.log(
      `Cloudinary delete result for ${publicId}:`,
      result.result
    );

    return result;
  } catch (error) {
    console.error(
      `Failed to delete Cloudinary image ${publicId}:`,
      error.message
    );

    // We don't throw here because a Cloudinary deletion
    // failure should not prevent the MongoDB car deletion.
    return null;
  }
};


// ======================================================
// GET ALL CARS
// ======================================================

exports.getAllCars = async (req, res) => {
  try {
    const cars = await Car.find().sort({
      createdAt: -1
    });

    res.status(200).json({
      success: true,
      count: cars.length,
      data: cars
    });

  } catch (error) {
    console.error(
      'Get all cars error:',
      error
    );

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ======================================================
// GET CAR BY ID
// ======================================================

exports.getCarById = async (req, res) => {
  try {
    const car = await Car.findById(
      req.params.id
    );

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }

    res.status(200).json({
      success: true,
      data: car
    });

  } catch (error) {
    console.error(
      'Get car by ID error:',
      error
    );

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ======================================================
// CREATE CAR
// ======================================================

exports.createCar = async (req, res) => {
  try {
    const carData = {
      ...req.body
    };

    console.log('Creating car...');


    // ==================================================
    // UPLOAD MAIN IMAGE
    // ==================================================

    if (
      req.files &&
      req.files.mainImage &&
      req.files.mainImage.length > 0
    ) {
      const file = req.files.mainImage[0];

      console.log(
        'Uploading main image to Cloudinary...'
      );

      const result = await uploadToCloudinary(
        file.buffer,
        'au-motors/cars'
      );

      carData.mainImage = {
        url: result.secure_url,
        publicId: result.public_id
      };

      console.log(
        'Main image uploaded:',
        result.secure_url
      );
    }


    // ==================================================
    // UPLOAD ADDITIONAL IMAGES
    // ==================================================

    if (
      req.files &&
      req.files.images &&
      req.files.images.length > 0
    ) {
      console.log(
        `Uploading ${req.files.images.length} additional images...`
      );

      const uploadedImages = [];

      for (const file of req.files.images) {
        const result = await uploadToCloudinary(
          file.buffer,
          'au-motors/cars'
        );

        uploadedImages.push({
          url: result.secure_url,
          publicId: result.public_id
        });
      }

      carData.images = uploadedImages;

      console.log(
        'Additional images uploaded.'
      );
    }


    // ==================================================
    // FALLBACK IMAGE
    // ==================================================
    //
    // IMPORTANT:
    // Because your schema requires mainImage to contain
    // BOTH url and publicId, the fallback must also have
    // this structure.
    //
    // We use null publicId because this image does not
    // belong to your Cloudinary account.
    //

    if (!carData.mainImage) {
      carData.mainImage = {
        url: 'https://via.placeholder.com/600x400/ff0000/ffffff?text=Car',
        publicId: null
      };
    }


    // ==================================================
    // HANDLE FEATURES
    // ==================================================

    if (
      typeof carData.features === 'string'
    ) {
      try {
        const parsed = JSON.parse(
          carData.features
        );

        if (Array.isArray(parsed)) {
          carData.features = parsed;
        } else {
          carData.features =
            carData.features
              .split(',')
              .map(f => f.trim())
              .filter(Boolean);
        }

      } catch {
        carData.features =
          carData.features
            .split(',')
            .map(f => f.trim())
            .filter(Boolean);
      }
    }


    // ==================================================
    // HANDLE OWNER CONTACT
    // ==================================================

    if (
      typeof carData.ownerContact === 'string'
    ) {
      try {
        carData.ownerContact =
          JSON.parse(
            carData.ownerContact
          );

      } catch {
        // Leave unchanged
      }
    }


    // ==================================================
    // CREATE DATABASE RECORD
    // ==================================================

    const car = await Car.create(
      carData
    );

    console.log(
      'Car created successfully:',
      car._id
    );

    res.status(201).json({
      success: true,
      data: car
    });

  } catch (error) {
    console.error(
      'Create car error:',
      error
    );

    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


// ======================================================
// UPDATE CAR
// ======================================================

exports.updateCar = async (req, res) => {
  try {
    const car = await Car.findById(
      req.params.id
    );

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }

    const carData = {
      ...req.body
    };


    // ==================================================
    // NEW MAIN IMAGE
    // ==================================================

    if (
      req.files &&
      req.files.mainImage &&
      req.files.mainImage.length > 0
    ) {
      const file =
        req.files.mainImage[0];

      console.log(
        'Uploading new main image to Cloudinary...'
      );

      const result =
        await uploadToCloudinary(
          file.buffer,
          'au-motors/cars'
        );

      carData.mainImage = {
        url: result.secure_url,
        publicId: result.public_id
      };

      console.log(
        'New main image uploaded:',
        result.secure_url
      );


      // ------------------------------------------------
      // DELETE OLD MAIN IMAGE
      // ------------------------------------------------
      //
      // Only delete the old image if it has a
      // Cloudinary publicId.
      //

      if (
        car.mainImage &&
        car.mainImage.publicId
      ) {
        await deleteFromCloudinary(
          car.mainImage.publicId
        );
      }
    }


    // ==================================================
    // NEW ADDITIONAL IMAGES
    // ==================================================

    if (
      req.files &&
      req.files.images &&
      req.files.images.length > 0
    ) {
      console.log(
        `Uploading ${req.files.images.length} additional images...`
      );

      const uploadedImages = [];

      for (const file of req.files.images) {
        const result =
          await uploadToCloudinary(
            file.buffer,
            'au-motors/cars'
          );

        uploadedImages.push({
          url: result.secure_url,
          publicId: result.public_id
        });
      }

      carData.images =
        uploadedImages;

      console.log(
        'New additional images uploaded.'
      );


      // ------------------------------------------------
      // DELETE OLD ADDITIONAL IMAGES
      // ------------------------------------------------

      if (
        car.images &&
        car.images.length > 0
      ) {
        console.log(
          `Deleting ${car.images.length} old additional images...`
        );

        for (const image of car.images) {
          if (image.publicId) {
            await deleteFromCloudinary(
              image.publicId
            );
          }
        }
      }
    }


    // ==================================================
    // HANDLE FEATURES
    // ==================================================

    if (
      typeof carData.features === 'string'
    ) {
      try {
        const parsed = JSON.parse(
          carData.features
        );

        if (Array.isArray(parsed)) {
          carData.features = parsed;
        } else {
          carData.features =
            carData.features
              .split(',')
              .map(f => f.trim())
              .filter(Boolean);
        }

      } catch {
        carData.features =
          carData.features
            .split(',')
            .map(f => f.trim())
            .filter(Boolean);
      }
    }


    // ==================================================
    // HANDLE OWNER CONTACT
    // ==================================================

    if (
      typeof carData.ownerContact === 'string'
    ) {
      try {
        carData.ownerContact =
          JSON.parse(
            carData.ownerContact
          );

      } catch {
        // Leave unchanged
      }
    }


    // ==================================================
    // UPDATE DATABASE
    // ==================================================

    carData.updatedAt = Date.now();

    const updatedCar =
      await Car.findByIdAndUpdate(
        req.params.id,
        carData,
        {
          new: true,
          runValidators: true
        }
      );

    res.status(200).json({
      success: true,
      data: updatedCar
    });

  } catch (error) {
    console.error(
      'Update car error:',
      error
    );

    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


// ======================================================
// DELETE CAR
// ======================================================

exports.deleteCar = async (req, res) => {
  try {
    const car = await Car.findById(
      req.params.id
    );

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }


    // ==================================================
    // DELETE MAIN IMAGE FROM CLOUDINARY
    // ==================================================

    if (
      car.mainImage &&
      car.mainImage.publicId
    ) {
      console.log(
        'Deleting main image from Cloudinary...'
      );

      await deleteFromCloudinary(
        car.mainImage.publicId
      );
    }


    // ==================================================
    // DELETE ADDITIONAL IMAGES FROM CLOUDINARY
    // ==================================================

    if (
      car.images &&
      car.images.length > 0
    ) {
      console.log(
        `Deleting ${car.images.length} additional images from Cloudinary...`
      );

      for (const image of car.images) {
        if (image.publicId) {
          await deleteFromCloudinary(
            image.publicId
          );
        }
      }
    }


    // ==================================================
    // DELETE CAR FROM MONGODB
    // ==================================================

    await car.deleteOne();

    console.log(
      'Car and its Cloudinary images deleted successfully:',
      car._id
    );

    res.status(200).json({
      success: true,
      message:
        'Car and its images deleted successfully'
    });

  } catch (error) {
    console.error(
      'Delete car error:',
      error
    );

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ======================================================
// ADMIN LOGIN
// ======================================================

exports.adminLogin = (req, res) => {
  const {
    email,
    password
  } = req.body;

  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = jwt.sign(
      {
        email,
        role: 'admin'
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d'
      }
    );

    return res.status(200).json({
      success: true,
      token,
      message: 'Login successful'
    });
  }

  res.status(401).json({
    success: false,
    message: 'Invalid credentials'
  });
};
```
