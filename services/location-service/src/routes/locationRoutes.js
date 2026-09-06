const express = require('express');
const { body } = require('express-validator');
const locationController = require('../controllers/locationController');

const router = express.Router();

router.get('/cities', locationController.getCities);
router.get('/localities', locationController.getLocalities);
router.get('/search', locationController.searchLocations);

router.post(
  '/',
  [
    body('city').trim().notEmpty().withMessage('City is required'),
    body('locality').trim().notEmpty().withMessage('Locality is required'),
  ],
  locationController.addLocality
);

module.exports = router;
