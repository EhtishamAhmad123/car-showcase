const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');
const authMiddleware = require('../middleware/auth');

// Public routes
router.get('/cars', carController.getAllCars);
router.get('/cars/:id', carController.getCarById);

// Admin routes
router.post('/admin/login', carController.adminLogin);

// Admin routes with file upload support
router.post('/admin/cars', 
  authMiddleware,
  carController.upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'images', maxCount: 10 }
  ]),
  carController.createCar
);

router.put('/admin/cars/:id',
  authMiddleware,
  carController.upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'images', maxCount: 10 }
  ]),
  carController.updateCar
);

router.delete('/admin/cars/:id', authMiddleware, carController.deleteCar);

module.exports = router;
