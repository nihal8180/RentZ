const Inquiry = require('../models/Inquiry');

async function create(data) {
  const inquiry = new Inquiry(data);
  return inquiry.save();
}

async function findByOwner(ownerId) {
  return Inquiry.find({ ownerId }).sort({ createdAt: -1 });
}

async function findByUser(userId) {
  return Inquiry.find({ userId }).sort({ createdAt: -1 });
}

async function updateStatus(id, ownerId, status) {
  return Inquiry.findOneAndUpdate({ _id: id, ownerId }, { status }, { new: true });
}

module.exports = { create, findByOwner, findByUser, updateStatus };
