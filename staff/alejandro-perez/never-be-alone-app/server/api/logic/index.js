const NodeGeocoder = require('node-geocoder');
const cloudinary = require('cloudinary');
const {
  Event, EventAddress, User, Group,
} = require('../data/model');

const moment = require('moment')

cloudinary.config({
  cloud_name: 'decvqfmni',
  api_key: '164664672957578',
  api_secret: 'T6eag-zo9dXUPnjUVFZGbEMwhFI',
});

const options = {
  provider: 'google',

  // Optional depending on the providers
  httpAdapter: 'https', // Default
  apiKey: 'AIzaSyCF7V7YldwrxwVVK-knOZuiiiuZWHHwGsU', // for Mapquest, OpenCage, Google Premier
  formatter: null, // 'gpx', 'string', ...
};
const geocoder = NodeGeocoder(options);

const {
  Types: { ObjectId },
} = require('mongoose');

const logic = {
  _validateStringField(fieldName, fieldValue) {
    if (typeof fieldValue !== 'string' || !fieldValue.trim().length) {
      throw new LogicError(`invalid ${fieldName}`);
    }
  },

  /** Register a user
   * @param {string} name 
   * @param {string} surname
   * @param {string} email
   * @param {string} password
   * @param {string} photoProfile - in base64
   * 
   * @return {promise} - create user in database
   */

  registerUser(
    name,
    surname,
    email,
    password,
    photoProfile = 'http://res.cloudinary.com/decvqfmni/image/upload/v1535793506/mt3ojavrkcvsmwrkzzo7.png',
  ) {
    return Promise.resolve()
      .then(() => {
        this._validateStringField('name', name);
        this._validateStringField('surname', surname);
        this._validateStringField('email', email);
        this._validateStringField('password', password);

        return User.findOne({ email });
      })
      .then((user) => {
        if (user) {
          throw new LogicError(`User with email ${email} is already registered`);
        }
        return User.create({
          name,
          surname,
          email,
          password,
          photoProfile,
        }).then(() => true);
      });
  },

    /** Login a user
   * @param {string} name 
   * @param {string} email
   * 
   * @return {promise} - login ok
   */
  authenticate(email, password) {
    return Promise.resolve()
      .then(() => {
        this._validateStringField('email', email);
        this._validateStringField('password', password);

        return User.findOne({ email });
      })
      .then((user) => {
        if (!user) throw new LogicError(`User with email ${email} is not registered`);
        if (user.password !== password) throw new LogicError('Wrong credentials');

        return user.id;
      });
  },

      /** Retrieve a user
   * @param {string} UserId 
   * 
   * @return {promise} - with user data
   */

  retrieveUser(userId) {
    return Promise.resolve()
      .then(() => User.findById(userId)
        .select({
          password: 0,
          __v: 0,
          'groups._id': 0,
        })
        .populate({
          path: 'groups.group',
          select: { __v: 0 },
        })
        .populate({
          path: 'eventsToAttend',
          select: { __v: 0, _id: 0 },
        })
        .lean())
      .then((data) => {
        data.groups.forEach((elem) => {
          elem.group.id = elem.group._id;
          delete elem.group._id;
        });
        if (!data) throw new LogicError(`user ${userId} does not exist`);
        data.id = data._id;
        delete data._id;
        return data;
      });
  },

      /** Abandon a group
   * @param {string} userId 
   * @param {string} groupId
   * @param {boolean} force - To force owner to leave when group deletion
   * 
   * @return {promise} - with group new data
   */

  abandonGroup(userId, groupId, force = false) {
    return Promise.resolve()
      .then(() => {
        this._validateStringField('userId', userId);
        this._validateStringField('groupId', groupId);
        return User.findById(userId)
          .then((user) => {
            if (!user) throw new LogicError(`user ${userId} does not exist`);
            const group = user.groups.find(elem => elem.group.toString() === groupId);
            if (!group) throw new LogicError(`user ${userId} is not in group ${groupId}`);
            return group;
          })
          .then((group) => {
            if (group.role === 'owner' && !force) throw new LogicError(`owner cannot leave group ${groupId}`);
            return User.findByIdAndUpdate(userId, { $pull: { groups: { group: groupId } } });
          });
      })
      .then(() => Group.findByIdAndUpdate(
        groupId,
        { $pull: { users: userId } },
        { new: true, fields: { __v: 0, _id: 0 } },
      ).populate({
        path:"users",
        select: {_id:1,name:1,surname:1,photoProfile:1,groups:1}
      }));
  },

   /** Abandon a group
   * @param {string} userId 
   * @param {string} targetId
   * @param {string} groupId 
   * 
   * @return {promise} - with group new data
   */

  updateRole(userId, targetId, groupId) {
    return Promise.resolve()
      .then(() => User.findById(userId).then((owner) => {
        if (!owner) throw new LogicError(`user ${userId} does not exist`);
        const group = owner.groups.find(elem => elem.group.toString() === groupId);
        if (!group) throw new LogicError(`user ${userId} is not in group ${groupId}`);
        if (group.role !== 'owner') throw new LogicError('you cannot perform this action');
      }))
      .then(() => User.findById(targetId).then((user) => {
        if (!user) throw new LogicError(`user ${targetId} does not exist`);
        const group = user.groups.find(elem => elem.group.toString() === groupId);
        // group = group.group._id.toString()
        if (!group) throw new LogicError(`user ${targetId} is not in group ${groupId}`);
        if (group.role === 'user') {
          group.role = 'admin';
        } else if (group.role === 'admin') {
          group.role = 'user';
        }
        user.save();
      }))
      .then(() => Group.findById(groupId).populate({
        path: 'users',
        select: { _id:1,photoProfile:1,name:1,surname:1,groups:1 },
      }))
  },

   /** Request a group
   * @param {string} userId 
   * @param {string} groupId
   * 
   * @return {promise} - with group new data
   */

  requestJoin(userId, groupId) {
    return Promise.resolve()
      .then(() => User.findById(userId))
      .then((user) => {
        if (!user) throw new LogicError(`user ${userId} does not exist`);
        if (user.groups.find(elem => elem.group.toString() === groupId)) throw new LogicError(`user already in group ${groupId}`);
        const group = user.requests.find(elem => elem.toString() === groupId);
        if (group) throw new LogicError(`user ${userId} has already requested access to this group`);
        // return User.findByIdAndUpdate(userId, { $addToSet: { requests: groupId } });
      })
      .then(() => Group.findById(groupId))
      .then((group) => {
        if (!group) throw new LogicError(`group ${groupId} does not exist`);
        return User.findByIdAndUpdate(userId, { $addToSet: { requests: groupId } });
      })
      .then(() => Group.findByIdAndUpdate(
        groupId,
        { $addToSet: { pendings: userId } },
        { new: true, fields: { __v: 0, _id: 0 } },
      ).populate({
        path: 'pendings',
        select: { name:1,surname:1,photoProfile:1,_id:1 },
      }));
  },

   /** Attend an event
   * @param {string} userId 
   * @param {string} eventId
   * 
   * @return {promise} - with event new data
   */


  attendEvent(userId, eventId) {
    return Promise.resolve()
      .then(() => User.findById(userId))
      .then((user) => {
        if (!user) throw new LogicError(`user ${userId} does not exist`);
        const eventToAttend = user.eventsToAttend.find(elem => elem.toString() === eventId);
        if (eventToAttend) throw new LogicError(`user is already in event ${eventId}`);
        const a = user.groups.map(elem => Group.findById(elem.group).then(group => group.events.map(elem => elem._id.toString())))
        return Promise.all(a)
      })
      .then(groups => {
        return groups.some(elem => elem.find(elem => elem === eventId) )
      })

      .then((event) => {
        if (!event) throw new LogicError(`event ${eventId} not in user's groups`);
        return User.findByIdAndUpdate(
          userId,
          { $addToSet: { eventsToAttend: eventId } },
          { new: true, fields: { _id: 0, __v: 0 } },
        );
      })
      .then(() => Event.findByIdAndUpdate(
        eventId,
        { $addToSet: { attendees: userId } },
        { new: true, fields: { _id: 0, __v: 0 } },
      ).populate({
        path: 'attendees',
        select: { __v: 0,password:0 },
        options: { sort: { name: 1 } },
      }).populate({path: 'organizer',
        select: { __v: 0,password:0 },
        options: { sort: { name: 1 } }
        })
    )},

  // GROUPS

   /** Create a group
   * @param {string} userId 
   * @param {string} name - Group Name
   * @param {string} description - Group desc
   * 
   * @return {promise} - with new group with the owner inside
   */


  createGroup(userId, name, description) {
    return Promise.resolve()
      .then(() => User.findById(userId))
      .then((user) => {
        if (!user) throw new LogicError(`user ${userId} does not exist`);
        this._validateStringField('name', name);
        this._validateStringField('description', description);
        return Group.create({
          name,
          description,
        });
      })
      .then(data => this.acceptRequest(undefined, userId, data.id, 'owner', true));
  },


  /** Lists groups
   * @param {string} query
   * 
   * @return {promise} - with groups matching the query
   */


  listGroups(query) {
    return Promise.resolve().then(() => {
      const filter = {};
      if (query) {
        filter.name = {
          $regex: query,
          $options: 'i',
        };
      }
      return Group.find(
        filter,
        { __v: 0 },
        {
          sort: {
            users: 1,
          },
        },
      )
        .lean()
        .then((groups) => {
          if (!groups) console.log('NO GROUPS');
          groups.forEach((elem) => {
            elem.id = elem._id;
            delete elem._id;
          });
          return groups;
        });
    });
  },

  /** Retrieve a group
   * @param {string} groupId
   * 
   * @return {promise} - with group data
   */


  retrieveGroup(groupId) {
    return Promise.resolve().then(() => Group.findById(groupId).populate({
      path: 'users',
      select: {  _id: 1,name:1,surname:1, groups:1,photoProfile:1 },
      options: { sort: { name: 1 } }
    })
    .populate({
      path: 'events',
      select: {  },
      options: { sort: {  } }
    })
    .populate({
      path: 'pendings',
      select: {  },
      options: { sort: {  } }
    })
      .lean()
      .then((group) => {
        if (!group) throw new LogicError(`group ${groupId} does not exist`);
        group.id = group._id;
        delete group._id;
        delete group.__v;
        return group;
      }));
  },

   /** Delete a group
   * @param {string} userId 
   * @param {string} groupId
   *  
   * @return {promise} - with user data
   */


  deleteGroup(userId, groupId) {
    return Promise.resolve()
      .then(() => User.findById(userId))
      .then((user) => {
        if (!user) throw new LogicError(`user ${userId} does not exist`);
        return user.groups.find(elem => elem.group.toString() === groupId);
      })
      .then((group) => {
        if (!group) throw new LogicError(`user ${userId} is not in group ${groupId}`);
        if (group.role !== 'owner') throw new LogicError(`user ${userId} is not allowed to delete group ${groupId}`);
        return Group.findByIdAndRemove(groupId);
      })
      .then((group) => {
        if (!group) throw new LogicError(`group ${groupId} does not exist`); //! !!
        const promises = group.users.map(userId => this.abandonGroup(userId.toString(), group.id, true));
        const promises1 = group.pendings.map(elem => User.findByIdAndUpdate(elem, {$pull : { requests:ObjectId(groupId)}}))
        return Promise.all(promises1,promises);
      })
      .then(() => User.findById(userId).populate());
  },


  /** accept a request to a group
   * @param {string} userId 
   * @param {string} target
   * @param {string} groupId
   * @param {string} role
   * @param {boolean} force - When a user creates a group, pass it as true to join it without having requested it
   * 
   * @return {promise} - with group new data
   */


  acceptRequest(userId, targetId, groupId, role = 'user', force = false) {
    return Promise.resolve()
      .then(() => Group.findById(groupId))
      .then((data) => {
        if (!data) throw new LogicError(`group ${groupId} not found`);
        if (data.users.find(elem => elem.toString() === targetId)) throw new LogicError('user is already in this group');
        if (!data.pendings.find(elem => elem.toString() === targetId) && !force) throw new LogicError(`user ${targetId} has not requested to join group ${groupId}`);
        return User.findById(userId)
          .then((user) => {
            if (!force) {
              if (!user) throw new LogicError(`user ${userId} does not exist`);
              const group = user.groups.find(elem => elem.group.toString() === groupId);
              if (!group) throw new LogicError(`user is not in group ${groupId}`);
              if (group.role === 'user') throw new LogicError('users cannot accept new members');
            }
          })
          .then(() => data);
      })
      .then((data) => {
        if (!data) {
          throw new LogicError(`group ${groupId} does not exist`);
        }
        return User.findByIdAndUpdate(targetId, {
          $addToSet: { groups: { group: groupId, role } },
        })
          .then(() => User.findByIdAndUpdate(targetId, {
            $pull: { requests: groupId },
          }))
          .then(() => Group.findByIdAndUpdate(groupId, { $addToSet: { users: targetId } }))
          .then(() => Group.findByIdAndUpdate(
            groupId,
            { $pull: { pendings: targetId } },
            { new: true, fields: { __v: 0 } },
          ).populate({
            path: 'users',
            select: { _id:1,photoProfile:1,name:1,surname:1,groups:1 },
          }).populate({
            path: 'pendings',
            select: { },
          }));
      });
  },

  /** rejects a request to  a group
   * @param {string} userId 
   * @param {string} targetId
   * @param {string} groupId
   * 
   * @return {promise} - with group new data
   */


  rejectRequest(userId, targetId, groupId) {
    return Promise.resolve()
      .then(() => Group.findById(groupId))
      .then((data) => {
        if (!data) throw new LogicError(`group ${groupId} not found`);
        if (!data.pendings.find(elem => elem.toString() === targetId)) throw new LogicError(`user ${targetId} has not requested to join this group`);
        if (data.users.find(elem => elem.toString() === targetId)) throw new LogicError('user is already in this group');
        return User.findById(userId)
          .then((user) => {
            if (!user) throw new LogicError(`user ${userId} does not exist`);
            const group = user.groups.find(elem => elem.group.toString() === groupId);
            if (!group) throw new LogicError(`user is not in group ${groupId}`);
            if (group.role === 'user') throw new LogicError('users cannot reject new members');
          })
          .then(() => data);
      })
      .then((data) => {
        if (!data) {
          throw new LogicError(`group ${groupId} does not exist`);
        }
        return User.findByIdAndUpdate(targetId, {
          $pull: { requests: groupId },
        }).then(() => Group.findByIdAndUpdate(
          groupId,
          { $pull: { pendings: targetId } },
          { new: true, fields: { _id: 0, __v: 0 } },
        ).populate({
          path: 'users',
          select: { _id:1,photoProfile:1,name:1,surname:1,groups:1 },
        }).populate({
          path: 'pendings',
          select: { },
        }));
      });
  },

  /** kick a member from a group
   * @param {string} userId 
   * @param {string} targetId
   * @param {string} groupId
   * 
   * @return {promise} - with group new data
   */


  kickMember(userId, targetId, groupId) {
    return Promise.resolve()
      .then(() => Group.findById(groupId))
      .then((data) => {
        if (!data) throw new LogicError(`group ${groupId} not found`);
        if (!data.users.find(elem => elem.toString() === targetId)) throw new LogicError(`user is not in group ${groupId}`);
        return User.findById(userId).then((user) => {
          if (!user) throw new LogicError(`user ${userId} does not exist`);
          const group = user.groups.find(elem => elem.group.toString() === groupId);
          if (group.role !== 'owner') throw new LogicError('only the owner can kick members');
          if (userId === targetId) throw new LogicError('you cannot kick yourself from the group :D');
        });
      })
      .then(() => User.findByIdAndUpdate(targetId, {
        $pull: { groups: {group:ObjectId(groupId)} },
      }).then(() => Group.findByIdAndUpdate(
        groupId,
        { $pull: { users: targetId } },
        { new: true, fields: { _id: 0, __v: 0 } },
      ).populate({
        path: 'users',
        select: { _id:1,photoProfile:1,name:1,surname:1,groups:1 },
      })));
  },

  // EVENTS

  /** Create an event in a group
   * @param {string} userId 
   * @param {string} groupId
   * @param {string} name
   * @param {string} description
   * @param {string} date - In accepted string format (21-02-2018)
   * @param {string} category
   * @param {string} duration
   * @param {string} address
   * 
   * @return {promise} - with group new data
   */


  createEvent(userId, groupId, name, description, date, category, duration, address) {
    return Promise.resolve()
      .then(() => User.findById(userId).then((user) => {
        if (!user) throw new LogicError(`user ${userId} does not exist`);
        const group = user.groups.find(elem => elem.group.toString() === groupId);
        if (!group) throw new LogicError(`user is not in group ${groupId}`);
        if (group.role === 'user') throw new LogicError('users cannot create events');
      }))
      .then(() => Group.findById(groupId).then((group) => {
        if (!group) throw new LogicError(`group ${groupId} not found`);
        return geocoder
          // .geocode(`${address.street} ${address.city}`)
          .geocode(address.name)
          .then((data) => {
            if (!data.length) throw new LogicError('Couldnt find that place :(');
            address.coords = [data[0].latitude, data[0].longitude];
            return true;
          })
          .then(() => Event.create({
            name,
            description,
            date: new Date(date),
            category,
            duration,
            location: new EventAddress(address),
            organizer: userId,
          }));
      }))
      .then(event => Group.findByIdAndUpdate(
        groupId,
        { $addToSet: { events: event.id } },
        { new: true, fields: { __v: 0, _id: 0 } },
      ).populate({
        path: 'events',
        select: {  },
        options: { sort: {  } }
      }));
  },

  /** Retreieve an event 
   * @param {string} eventId
   * 
   * @return {promise} - with event data
   */


  retrieveEvent(eventId) {
    return Promise.resolve()
      .then(() => Event.findById(eventId).lean().populate({path: 'organizer',
      select: { __v: 0,password:0 },
      options: { sort: { name: 1 } },
    }).populate({path: 'attendees',
    select: { __v: 0,password:0 },
    options: { sort: { name: 1 } },
  }))
      .then((event) => {
        if (!event) throw new LogicError(`event ${eventId} doesnt exist`);
        event.id = event._id;
        delete event._id;
        delete event.__v;
        return event;
      });
  },

  /** List group events
   * @param {string} groupId 
   * @param {Date} eventDate 
   * @param {boolean} old - To sort by passed events or events to come
   * 
   * @return {promise} - with group events matching the params
   */


  listEvents(groupId, eventDate = Date.now(), old = false) {
    return Promise.resolve()
      .then(() => {
        if (!old) {
          return Group.findById(groupId, { _id: 0, __v: 0 }).populate({
            path: 'events',
            select: { __v: 0, _id: 0 },
            match: { date: { $gte: eventDate } },
            options: { sort: { date: 1 } },
          });
        } // TODO: DURATION! + DATE
        if (old) {
          return Group.findById(groupId, { _id: 0, __v: 0 }).populate({
            path: 'events',
            select: { __v: 0, _id: 0 },
            match: { date: { $lte: eventDate } },
            options: { sort: { date: 1 } },
          });
        }
      })
      .then((group) => {
        if (!group) throw new LogicError(`group ${groupId} does not exist`);
        return group.events;
        // const groupEvents = await group.events.map(elem => elem.name)
        // return groupEvents
      });
  },

  /** list events by a date of a group or of a user
   * @param {string} groupId
   * @param {string} eventDate - A valid string date 
   * @param {string} userId   
   * 
   * @return {promise} - with events matching the params
   */


  listEventsByDate(groupId = undefined, eventDate = moment().startOf('day'),userId = undefined) {
    return Promise.resolve().then(() => {
      if(!(groupId || userId)) throw new LogicError(`groupId or userId not provided`)
      if(groupId) { 
        return Group.findById(groupId).populate({
          path: 'events',
          select: { __v: 0},
          match: { date: { $gte: eventDate, $lte:moment(eventDate).endOf('day') } },
          options: { sort: { date: 1 } },
        }).lean()
      } else {
        return User.findById(userId).populate({
          path: 'eventsToAttend',
          select: { __v: 0},
          match: { date: { $gte: moment(eventDate).startOf('day').toDate(), $lte:moment(eventDate).endOf('day').toDate() } },
          options: { sort: { date: 1 } },
        }).lean()
      }
    })
    .then(data => {
      if(groupId) {
        data.events.forEach(elem => {
          elem.id = elem._id
          delete elem._id
        })
        return data.events
      }
      if(userId) {
        data.eventsToAttend.forEach(elem => {
          elem.id = elem._id
          delete elem._id
        })
        return data.eventsToAttend
      }
    })
  },

   /** Delete an event from a group
   * @param {string} userId 
   * @param {string} groupId
   * @param {string} eventId
   *  
   * @return {promise} - with group new data
   */


  deleteEvent(userId, groupId, eventId) {
    return Promise.resolve()
      .then(() => User.findById(userId).then((user) => {
        if (!user) throw new LogicError(`user ${userId} does not exist`);
        const group = user.groups.find(elem => elem.group.toString() === groupId);
        if (!group) throw new LogicError(`user is not in group ${groupId}`);
        if (group.role === 'user') throw new LogicError('users cannot delete events');
        return Group.findById(groupId);
      }))
      .then((group) => {
        const events = group.events.find(elem => elem.toString() === eventId);
        if (!events) throw new LogicError(`event ${eventId} does not exist in group ${groupId}`); //
        return Event.findById(eventId);
      })
      .then((event) => {
        let promises;
        if (!event.attendees.length) {
          promises = event.attendees.map(userId => User.findByIdAndUpdate(userId, { $pull: { eventsToAttend: eventId } }));
        }
        return Group.findByIdAndUpdate(groupId, { $pull: { events: eventId } }).then(async () => {
          await Event.findByIdAndRemove(eventId);
          if (promises.length) return Promise.all(promises);
        });
      })
      .then(() => true);
  },

  /** upload image to cloudinary
   * @param {string} groupId
   * 
   * @return {promise} - cloudinary URL
   */


  saveImageProfile(base64Image) {
        return new Promise((resolve, reject) => cloudinary.v2.uploader.upload(base64Image, (err, data) => {
          if (err) return reject(err);
          resolve(data.url);
        }))
  },
};

class LogicError extends Error {
  constructor(message) {
    super(message);
  }
}

module.exports = { logic, LogicError };
