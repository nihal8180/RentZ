/**
 * userRepository - data access abstraction for the User entity.
 *
 * IMPORTANT: Controllers/services should ONLY talk to this file, never to
 * the Mongoose model directly. When RentZ migrates auth-service from
 * MongoDB to MySQL, this is the only file that needs to change
 * (swap Mongoose calls for a Sequelize/Prisma equivalent) - the rest of
 * the codebase stays untouched as long as the method signatures below
 * are preserved.
 */

const User = require('../models/User');

async function findByEmail(email) {
  return User.findOne({ email: email.toLowerCase() });
}

async function findById(id) {
  return User.findById(id);
}

async function createUser({ name, email, phone, passwordHash, role }) {
  const user = new User({ name, email, phone, passwordHash, role });
  return user.save();
}

async function updateUser(id, updates) {
  return User.findByIdAndUpdate(id, updates, { new: true });
}

async function deactivateUser(id) {
  return User.findByIdAndUpdate(id, { isActive: false }, { new: true });
}

module.exports = {
  findByEmail,
  findById,
  createUser,
  updateUser,
  deactivateUser,
};
