const { Schema } = require('mongoose');

module.exports = new Schema({
    street: {
        type: String
    },
    city: {
        type: String
    },
    zipCode: {
        type: String
    },
    country: {
        type: String
    },
    coords: {
        type: Array
    }
});