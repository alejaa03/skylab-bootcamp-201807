const { Event } = require('./schemas/');
const mongoose = require('mongoose');

module.exports = mongoose.model('Event', Event);