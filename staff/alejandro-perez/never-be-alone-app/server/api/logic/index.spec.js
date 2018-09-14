require('dotenv').config();

const { expect } = require('chai');
const mongoose = require('mongoose');
const { logic } = require('.');

const {
  Types: { ObjectId },
} = mongoose;
const {
  User, Group, Event, EventAddress,
} = require('../data/model');

const {
  env: { DB_URL },
} = process;

describe('logic', () => {
  const email = `alejandro-${Math.random()}@mail.com`;
  const password = '123';
  const name = 'Alejandro';
  const surname = 'Perez';
  const groupName = 'I <3 testing';
  const groupDesc = 'testing testing testing testing testing testing testing';
  let _connection;

  before(() => mongoose
    .connect(
      DB_URL,
      { useNewUrlParser: true },
    )
    .then(conn => (_connection = conn)));
  beforeEach(() => Promise.all([User.deleteMany(), Group.deleteMany(), Event.deleteMany()]));

  describe('Register', () => {
    it('should register a user sucessfully', () => logic
      .registerUser(name, surname, email, password)
      .then((res) => {
        expect(res).to.be.true;
        return User.findOne({ email });
      })
      .then((user) => {
        expect(user).to.exist;
        expect(user.name).to.equal(name);
        expect(user.surname).to.equal(surname);
        expect(user.email).to.equal(email);
        expect(user.password).to.equal(password);
      }));
    it('should fail on empty name', () => logic
      .registerUser('', surname, email, password)
      .catch(err => err)
      .then(({ message }) => expect(message).to.equal('invalid name')));
    it('should fail on empty surname', () => logic
      .registerUser(name, '', email, password)
      .catch(err => err)
      .then(({ message }) => expect(message).to.equal('invalid surname')));
    it('should fail on invalid email', () => logic
      .registerUser(name, surname, 'email.com', password)
      .catch(err => err)
      .then(({ message }) => expect(message).to.equal(
        'User validation failed: email: Path `email` is invalid (email.com).',
      )));
    it('should fail on already registered email', () => User.create({
      name,
      email,
      surname,
      password,
    }).then(() => logic
      .registerUser(name, surname, email, password)
      .catch(err => err)
      .then(({ message }) => expect(message).to.equal(`User with email ${email} is already registered`))));
  });

  describe('Auth', () => {
    let userData;
    beforeEach(() => User.create({
      name,
      email,
      surname,
      password,
    }).then(data => (userData = data)));
    it('should login a user correctly', () => logic.authenticate(email, password).then((res) => {
      expect(res).to.equal(userData._id.toString());
    }));

    it('should fail on wrong credentials', () => logic
      .authenticate(userData.email, `${userData.password}1`)
      .catch(err => err)
      .then(({ message }) => expect(message).to.equal('Wrong credentials')));

    it('should fail on non-string email', () => logic
      .authenticate(123, userData.password)
      .catch(err => err)
      .then(({ message }) => expect(message).to.equal('invalid email')));
    it('should fail on non-string password', () => logic
      .authenticate(userData.email, undefined)
      .catch(err => err)
      .then(({ message }) => expect(message).to.equal('invalid password')));
  });

  describe('Get user info', () => {
    let userData;
    beforeEach(() => User.create({
      name,
      email,
      surname,
      password,
    }).then(data => (userData = data)));
    it("should retreive user's info correctly", () => logic.retrieveUser(userData._id).then((data) => {
      expect(data).to.exist;
      expect(data.name).to.equal(userData.name);
      expect(data.email).to.equal(userData.email);
    }));
    it("should fail to retreive user's info with non-existing id", () => {
      const testId = ObjectId();
      return logic
        .retrieveUser(testId)
        .catch(err => err)
        .then(({ message }) => expect(message).to.equal(`user ${testId} does not exist`));
    });
    it("should fail to retreive user's info with non-valid id", () => {
      const badId = 978963217;
      return logic
        .retrieveUser(badId)
        .catch(err => err)
        .then(({ message }) => expect(message).to.equal(
          `Cast to ObjectId failed for value "${badId}" at path "_id" for model "User"`,
        ));
    });

    describe('create a group', () => {
      let userData;
      beforeEach(() => User.create({
        name,
        email,
        surname,
        password,
      }).then(data => (userData = data)));
      it('should create a group correctly', () => logic.createGroup(userData._id, groupName, groupDesc).then((res) => {
        expect(res).to.exist;
        expect(res.users.length).to.equal(1);
        expect(res.name).to.equal(groupName);
        expect(res.description).to.equal(groupDesc);
      }));
      it('should fail on creating a group with empty name', () => logic
        .createGroup(userData._id, '', groupDesc)
        .catch(err => err)
        .then(({ message }) => expect(message).to.equal('invalid name')));
      it('should fail on creating a group with undefined name', () => logic
        .createGroup(userData._id, undefined, groupDesc)
        .catch(err => err)
        .then(({ message }) => expect(message).to.equal('invalid name')));
      it('should fail on creating a group with undefined description', () => logic
        .createGroup(userData._id, groupName, undefined)
        .catch(err => err)
        .then(({ message }) => expect(message).to.equal('invalid description')));
    });

    describe('request access to a group', () => {
      let userData;
      let groupData;
      beforeEach(() => User.create({
        name,
        email,
        surname,
        password,
      }).then((data) => {
        userData = data;
        return Group.create({ name: groupName, description: groupDesc }).then(
          group => (groupData = group),
        );
      }));
      it('should request access to a group correctly', () => logic
        .requestJoin(userData._id, groupData._id)
        .then((res) => {
          expect(res.pendings).to.deep.equal([userData._id]);
        })
        .then(() => User.findById(userData._id))
        .then(user => expect(user.requests).to.deep.equal([groupData._id])));
      it('should fail to request access if user has already requested access', () => logic
        .requestJoin(userData._id, groupData._id.toString())
        .then(() => logic.requestJoin(userData._id, groupData._id.toString()))
        .catch(err => err)
        .then(({ message }) => expect(message).to.equal(
          `user ${userData._id} has already requested access to this group`,
        )));
      it('should fail to request access to a group with wrong groupId', () => {
        const fakeId = ObjectId();
        return logic
          .requestJoin(userData._id, fakeId)
          .catch(err => err)
          .then(({ message }) => expect(message).to.equal(`group ${fakeId} does not exist`));
      });
    });

    describe('Accept group request', () => {
      let userData;
      let groupData;
      beforeEach(() => User.create({
        name,
        email,
        surname,
        password,
      }).then((data) => {
        userData = data;
        return Group.create({ name: groupName, description: groupDesc, users:[userData._id] }).then((group) => {
          groupData = group;
          return User.findByIdAndUpdate(userData._id, {
            $addToSet: { groups: { group: groupData._id, role: 'owner' } },
          });
        });
      }));
      it('should accept a user into the group sucessfully', () => {
        let newUser;
        return User.create({
          name,
          email,
          surname,
          password,
        }).then(data => (newUser = data))
        .then(() => logic.requestJoin(newUser._id,groupData._id))
        .then(group => {
          debugger
          expect(group.pendings.length).to.equal(1)
          expect(group.users.length).to.equal(1)
          return logic.acceptRequest(userData._id.toString(),newUser._id.toString(),groupData._id.toString())
        })
        .then(group => {
          expect(group).to.exist
          expect(group.pendings.length).to.equal(0)
          expect(group.users.length).to.equal(2)
          return User.findById(newUser._id)
            .then(newUserData => {
              expect(newUserData.groups[0].group).to.deep.equal(groupData._id)
              expect(newUserData.groups[0].role).to.equal('user')
            })  
        })
      });
    });
  });

  after(() => {
    Promise.all([User.deleteMany(), Group.deleteMany()]);
    _connection.disconnect();
  });
});
