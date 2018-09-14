const { User } = require('./schemas/');
const mongoose = require('mongoose');

module.exports = mongoose.model('User', User);