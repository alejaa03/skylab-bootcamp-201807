const { Group } = require('./schemas/');
const mongoose = require('mongoose');

module.exports = mongoose.model('Group', Group);