require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');

const { logic, LogicError } = require('../logic');

const jwt = require('jsonwebtoken');
const validateJwt = require('./helpers/jwt-validator');

const { JWT_SECRET, JWT_EXP } = process.env;

const userRouter = express.Router();

const jsonBodyParser = bodyParser.json({limit: '10mb'});

userRouter.get('/groups/:groupId', (req, res) => {
  const {
    params: { groupId },
  } = req;

  return logic
    .retrieveGroup(groupId)
    .then((data) => {
      res.status(201).json({ status: 'OK', data });
    })
    .catch((err) => {
      const { message } = err;
      res.status(err instanceof LogicError ? 400 : 500).json({ message });
    });
});

userRouter.post('/users', jsonBodyParser, (req, res) => {
  const {
    name, surname, email, password,photoProfile
  } = req.body;

  logic
    .registerUser(name, surname, email, password,photoProfile)
    .then(() => {
      res.status(201).json({ status: 'OK' });
    })
    .catch((err) => {
      const { message } = err;
      res.status(err instanceof LogicError ? 400 : 500).json({ message });
    });
});

userRouter.post('/authenticate', jsonBodyParser, (req, res) => {
  const { email, password } = req.body;
  logic
    .authenticate(email, password)
    .then((id) => {
      const token = jwt.sign({ sub: id }, JWT_SECRET, {
        expiresIn: JWT_EXP,
      });
      res.status(200).json({ status: 'OK', id, token });
    })
    .catch((err) => {
      const { message } = err;
      res.status(err instanceof LogicError ? 400 : 500).json({ message });
    });
});

userRouter.get('/users/:userId', /*validateJwt,*/ (req, res) => {
  const {
    params: { userId },
  } = req;

  return logic
    .retrieveUser(userId)
    .then((data) => {
      res.status(200).json({ status: 'OK', data });
    })
    .catch((err) => {
      const { message } = err;
      res.status(err instanceof LogicError ? 400 : 500).json({ message });
    });
});

userRouter.patch('/users/:userId/groups/:groupId', validateJwt, (req, res) => {
  const {
    params: { userId, groupId },
  } = req;

  return logic
    .abandonGroup(userId, groupId)
    .then(data => res.status(200).json({ status: 'OK', data }))
    .catch((err) => {
      const { message } = err;
      res.status(err instanceof LogicError ? 400 : 500).json({ message });
    });
});

userRouter.delete('/users/:userId/groups/:groupId', validateJwt, (req, res) => {
  const {
    params: { userId, groupId },
  } = req;

  return logic
    .deleteGroup(userId, groupId)
    .then(data => res.status(200).json({ status: 'OK',data }))
    .catch((err) => {
      const { message } = err;
      res.status(err instanceof LogicError ? 400 : 500).json({ message });
    });
});

userRouter.get('/groups', (req, res) => {
  const {
    query: { name },
  } = req;

  return logic
    .listGroups(name)
    .then(data => res.status(201).json({ status: 'OK', data }))
    .catch((err) => {
      const { message } = err;
      res.status(err instanceof LogicError ? 400 : 500).json({ message });
    });
});

userRouter.patch('/uploadPhoto', jsonBodyParser, (req, res) => {
  const {
    body: { base64Image },
  } = req;
  return logic.saveImageProfile(base64Image)
    .then(photo => res.status(200).json({ status: 'OK',photo }))
    .catch((err) => {
      const { message } = err;
      res.status(err instanceof LogicError ? 400 : 500).json({ message });
    });
});

userRouter.get('/users/:userId/events/:date', (req,res) => {
  const {params:{userId,date}} = req
  const parsedDate = new Date(date)
  return logic.listEventsByDate(undefined,parsedDate,userId)
    .then(data => res.status(201).json({ status: 'OK', data }))
    .catch((err) => {
      const { message } = err;
      res.status(err instanceof LogicError ? 400 : 500).json({ message });
    });
})

userRouter.put('/users/:userId/events/:eventId', validateJwt, (req, res) => {
  const {
    params: { userId, eventId },
  } = req;

  return logic
    .attendEvent(userId, eventId)
    .then(data => res.status(200).json({ status: 'OK', data }))
    .catch((err) => {
      const { message } = err;
      res.status(err instanceof LogicError ? 400 : 500).json({ message });
    });
});

module.exports = userRouter;
