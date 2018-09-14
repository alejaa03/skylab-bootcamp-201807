const {
  Schema,
  Schema: { ObjectId }
} = require('mongoose');

const eventAddress = require('./eventAddress')

module.exports = new Schema({
  
  name:{
    type: String,
    required: true
  },

  description:{
    type: String,
    required: true
  },

  date: {
    type: Date,
    required: true
  },

  category: {
    type: String,
    enum: ['gastronomy', 'sport', 'culture', 'music', 'tecnologic', 'party' ]
  },

  duration:{
    type:Number
  },

  attendees:[
    {
      type:ObjectId,
      ref:'User'
    }
  ],

  organizer:{
    type:ObjectId,
    ref:'User',
    required:true
  },

  location: eventAddress

})