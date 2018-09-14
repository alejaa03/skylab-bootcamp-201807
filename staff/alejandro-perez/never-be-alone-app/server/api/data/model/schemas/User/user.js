const {
  Schema,
  Schema: { ObjectId },
} = require('mongoose');

module.exports = new Schema({
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  },
  password: {
    type: String,
    required: true,
  },
  groups: [
    {
      group: {
        type: ObjectId,
        ref: 'Group',
      },
      role: {
        type: String,
        enum: ['user', 'admin', 'owner'],
        required: true,
        default: 'user',
      },
    },
  ],

  photoProfile: {
    type:String,
    required:false
  },

  requests: [
    {
      type: ObjectId,
      ref: 'Group',
    },
  ],

  eventsToAttend: [
    {
      type: ObjectId,
      ref: 'Event',
    },
  ],
});
