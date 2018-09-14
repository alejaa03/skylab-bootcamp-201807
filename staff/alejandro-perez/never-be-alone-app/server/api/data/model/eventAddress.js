const { EventAddress } = require('./schemas/');
const mongoose = require('mongoose');

module.exports = mongoose.model('EventAddress', EventAddress);