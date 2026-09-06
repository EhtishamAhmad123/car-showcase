const express = require('express');

const router = express.Router();

const carController =
  require('../controllers/carController');

const authMiddleware =
  require('../middleware/auth');

// ======================================================
// PUBLIC ROUTES
// ======================================================

router.get(
  '/cars',
  carController.getAllCars
);

router.get(
  '/cars/:id',
  carController.getCarById
);

// ======================================================
// ADMIN LOGIN
// ======================================================

router.post(
  '/admin/login',
  carController.adminLogin
);

// ======================================================
// ADMIN CAR ROUTES
// ======================================================

router.post(
  '/admin/cars',
  authMiddleware,
  carController.createCar
);

router.put(
  '/admin/cars/:id',
  authMiddleware,
  carController.updateCar
);

router.delete(
  '/admin/cars/:id',
  authMiddleware,
  carController.deleteCar
);

module.exports = router;