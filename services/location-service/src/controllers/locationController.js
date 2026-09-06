const { validationResult } = require('express-validator');
const locationRepository = require('../repositories/locationRepository');

// POST /api/locations  (admin seeding endpoint)
async function addLocality(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const locality = await locationRepository.create(req.body);
    return res.status(201).json(locality);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Locality already exists for this city' });
    }
    console.error('[location-service] addLocality error:', err.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// GET /api/locations/cities
async function getCities(req, res) {
  try {
    const cities = await locationRepository.listCities();
    return res.status(200).json(cities);
  } catch (err) {
    console.error('[location-service] getCities error:', err.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// GET /api/locations/localities?city=Lucknow
async function getLocalities(req, res) {
  try {
    const { city } = req.query;
    if (!city) {
      return res.status(400).json({ message: 'city query param is required' });
    }
    const localities = await locationRepository.listLocalitiesByCity(city);
    return res.status(200).json(localities);
  } catch (err) {
    console.error('[location-service] getLocalities error:', err.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// GET /api/locations/search?q=gomti
async function searchLocations(req, res) {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ message: 'q query param is required' });
    }
    const matches = await locationRepository.search(q);
    return res.status(200).json(matches);
  } catch (err) {
    console.error('[location-service] searchLocations error:', err.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = { addLocality, getCities, getLocalities, searchLocations };
