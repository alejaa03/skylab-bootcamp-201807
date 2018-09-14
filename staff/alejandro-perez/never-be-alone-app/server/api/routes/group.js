require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');

const { logic, LogicError } = require('../logic');

// const jwt = require('jsonwebtoken');
const validateJwt = require('./helpers/jwt-validator');

const groupRouter = express.Router();

const jsonBodyParser = bodyParser.json();

groupRouter.post('/groups/:userId', [validateJwt, jsonBodyParser], (req, res) => {
  const {
    params: { userId },
    body: { name, description },
  } = req;

  return logic
    .createGroup(userId, name, description)
    .then(data => res.status(201).json({ status: 'OK', data }))
    .catch((err) => {
      const { message } = err;
      res.status(err instanceof LogicError ? 400 : 500).json({ message });
    });
});



groupRouter.patch('/groups/:groupId/owners/:userId/users/:targetId', validateJwt, (req, res) => {
  const {
    params: { userId, targetId, groupId },
  } = req;

  return logic
    .updateRole(userId, targetId, groupId)
    .then(data => res.status(201).json({ status: 'OK',data }))
    .catch((err) => {
      const { message } = err;
      res.status(err instanceof LogicError ? 400 : 500).json({ message });
    });
});
groupRouter.put('/groups/:groupId/users/:userId', validateJwt, (req, res) => {
  const {
    params: { groupId, userId },
  } = req;

  return logic
    .requestJoin(userId, groupId)
    .then(data => res.status(200).json({ status: 'OK', data }))
    .catch((err) => {
      const { message } = err;
      res.status(err instanceof LogicError ? 400 : 500).json({ message });
    });
});

groupRouter.put('/groups/:groupId/owners/:userId/request/:targetId', validateJwt, (req, res) => {
  const {
    params: { targetId, userId, groupId },
  } = req;

  return logic
    .acceptRequest(userId, targetId, groupId)
    .then(data => res.status(200).json({ status: 'OK', data }))
    .catch((err) => {
      const { message } = err;
      res.status(err instanceof LogicError ? 400 : 500).json({ message });
    });
});

groupRouter.patch('/groups/:groupId/owners/:userId/request/:targetId', validateJwt, (req, res) => {
  const {
    params: { targetId, userId, groupId },
  } = req;

  return logic
    .rejectRequest(userId, targetId, groupId)
    .then(data => res.status(200).json({ status: 'OK', data }))
    .catch((err) => {
      const { message } = err;
      res.status(err instanceof LogicError ? 400 : 500).json({ message });
    });
});
groupRouter.post(
  '/groups/:groupId/users/:userId/events',
  [validateJwt, jsonBodyParser],
  (req, res) => {
    const {
      params: { userId, groupId },
      body: {
        name, description, date, category, duration, address,
      },
    } = req;

    return logic
      .createEvent(userId, groupId, name, description, date, category, duration, address)
      .then(data => res.status(200).json({ status: 'OK', data }))
      .catch((err) => {
        const { message } = err;
        res.status(err instanceof LogicError ? 418 : 500).json({ message });
      });
  },
);


groupRouter.delete('/groups/:groupId/users/:userId/events/:eventId', validateJwt, (req, res) => {
  const {
    params: { userId, groupId, eventId },
  } = req;

  return logic
    .deleteEvent(userId, groupId, eventId)
    .then(() => res.status(200).json({ status: 'OK' }))
    .catch((err) => {
      const { message } = err;
      res.status(err instanceof LogicError ? 400 : 500).json({ message });
    });
});

groupRouter.get('/groups/:groupId/events', (req, res) => {
  const {
    params: { groupId },
    query: { from, over },
  } = req;
  let date;
  if (from) {
    date = new Date(from);
    if (date == 'Invalid Date') date = undefined;
  }

  let overFilter;
  if (over === 'true') overFilter = true;
  else overFilter = false;
  return logic
    .listEvents(groupId, date, overFilter)
    .then(data => res.status(200).json({ status: 'OK', data }))
    .catch((err) => {
      const { message } = err;
      res.status(err instanceof LogicError ? 400 : 500).json({ message });
    });
});

groupRouter.get('/groups/:groupId/events/:date', (req,res) => {
  const {params:{groupId,date}} = req

  return logic.listEventsByDate(groupId,date)
    .then(data => res.status(200).json({ status: 'OK', data }))
    .catch((err) => {
      const { message } = err;
      res.status(err instanceof LogicError ? 400 : 500).json({ message });
    });
})

groupRouter.get('/events/:eventId', (req,res) => {
  const {params:{eventId}} = req

  return logic.retrieveEvent(eventId)
    .then(data => res.status(200).json({ status: 'OK', data }))
    .catch((err) => {
      const { message } = err;
      res.status(err instanceof LogicError ? 400 : 500).json({ message });
    });
})

groupRouter.delete('/groups/:groupId/owners/:userId/users/:targetId', validateJwt, (req,res) => {
  const {params:{groupId,userId,targetId}} = req

  return logic.kickMember(userId,targetId,groupId)
    .then(data => res.status(200).json({ status: 'OK', data }))
    .catch((err) => {
      const { message } = err;
      res.status(err instanceof LogicError ? 400 : 500).json({ message });
    });
})

module.exports = groupRouter;
