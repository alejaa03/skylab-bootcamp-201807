const {
  Schema,
  Schema: { ObjectId }
} = require('mongoose');

module.exports = new Schema({

  name:{
    type:String,
    required: true
  },

  description:{
    type:String,
    required: true
  },

  users: [
    {
      type: ObjectId,
      ref: 'User'
    }
  ],

  pendings: [
    {
      type: ObjectId,
      ref: 'User'
    }
  ],

  events : [
    {
      type: ObjectId,
      ref: 'Event'
    }
  ]
})