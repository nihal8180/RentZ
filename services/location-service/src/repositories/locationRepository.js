const Locality = require('../models/Locality');

async function create(data) {
  const locality = new Locality(data);
  return locality.save();
}

async function listCities() {
  return Locality.distinct('city');
}

async function listLocalitiesByCity(city) {
  return Locality.find({ city: new RegExp(`^${city}$`, 'i') }).sort({ locality: 1 });
}

async function search(term) {
  return Locality.find({
    $or: [
      { city: new RegExp(term, 'i') },
      { locality: new RegExp(term, 'i') },
      { pincode: new RegExp(term, 'i') },
    ],
  }).limit(20);
}

module.exports = { create, listCities, listLocalitiesByCity, search };
