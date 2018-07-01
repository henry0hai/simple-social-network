'use strict';

const { ServiceBroker } = require('moleculer');
const { ValidationError } = require('moleculer').Errors;
const FriendService = require('../../services/friends.service');
const UserService = require('../../services/users.service');
const helper = require('../helpers/index');

describe('Test \'friend\' service', () => {
  let broker = new ServiceBroker();
  broker.createService(FriendService);
  broker.createService(UserService);

  beforeAll(() => broker.start());
  afterAll(() => broker.stop());

  describe('Test \'friends.makeFriend\' action', () => {
    // - Request make friend success
    it('Should return success when make a new connection between email1 and email2', () => {
      console.log('>>> [NODE_ENV] >>>', process.env.NODE_ENV);
      console.log('>>> [MONGO_URI] >>>', process.env.MONGO_URI);

      const createData1 = broker.call('users.register', { email: 'user6@test.ok', password: '123' });
      const createData2 = broker.call('users.register', { email: 'user7@test.ok', password: '123' });

      const data = broker.call('friends.makeFriend', {
        friends: ['user6@test.ok', 'user7@test.ok'],
      });
      expect(data).resolves.toEqual({ success: true });
    });

    //- Give wrong type of params
    it('Should throw execption if passing wrong type of params', async (done) => {
      try {
        const data = broker.call('friends.makeFriend', {
          friends: ['user6', 'user7'],
        });
        expect.assertions(1);
      } catch (err) {
        done();
      }
    });

    //- Give wrong shape of request payload
    it('Should throw execption if passing wrong shape of request payload', async (done) => {
      try {
        const data = broker.call('friends.makeFriend', {
          other: "abc",
        });
        expect.assertions(1);
      } catch (err) {
        done();
      }
    });

    //- Give an array with 1 existed email and 1 not existed
    it('Should throw execption if passing an array with 1 existed email and 1 not existed', async (done) => {
      try {
        const data = broker.call('friends.makeFriend', {
          friends: ['user6@test.ok', 'user7@test.ok'],
        });
        expect.assertions(1);
      } catch (err) {
        done();
      }
    });

    //- Give an array with non existed email
    it('Should throw execption if passing an array with non existed email', async (done) => {
      try {
        const data = broker.call('friends.makeFriend', {
          friends: ['user6@test.ok', 'user7@test.ok'],
        });
        expect.assertions(1);
      } catch (err) {
        done();
      }
    });

    //- Give an array with an array has more than 2 emails
    it('Should throw execption if passing an array with an array has more than 2 emails', async (done) => {
      try {
        const data = broker.call('friends.makeFriend', {
          friends: ['user6@test.ok', 'user7@test.ok', 'user8@test.ok'],
        });
        expect.assertions(1);
      } catch (err) {
        done();
      }
    });
  });

  describe('Test \'friends.friends\' action', () => {
    // - Get friends success
    it('Should return success when get friends success', () => {
      const data = broker.call('friends.getFriends', {
        email: 'user1@test.ok',
      });
      expect(data).resolves.toEqual({ success: true });
    });

    //- Give wrong type of email
    it('Should throw execption if passing wrong type of email', async (done) => {
      try {
        const data = broker.call('friends.getFriends', {
          email: 'user1',
        });
        expect.assertions(1);
      } catch (err) {
        done();
      }
    });

    //- Give email that not existed in data
    it('Should throw execption if passing an email that not existed in data', async (done) => {
      try {
        const data = broker.call('friends.getFriends', {
          email: 'user11@test.ok',
        });
        expect.assertions(1);
      } catch (err) {
        done();
      }
    });
  });

  describe('Test \'friends.get-common-friends\' action', () => {
    // - Get common friends success
    it('Should return success when get common friends success', () => {
      const data = broker.call('friends.getFriends', {
        friends: ['user6@test.ok', 'user7@test.ok'],
      });
      expect(data).resolves.toEqual({ success: true });
    });

    //- Give wrong type of params
    it('Should throw execption if passing wrong type of params', async (done) => {
      try {
        const data = broker.call('friends.getFriends', {
          friends: ['user6', 'user7'],
        });
        expect.assertions(1);
      } catch (err) {
        done();
      }
    });

    //- Give wrong shape of request payload
    it('Should throw execption if passing wrong shape of request payload', async (done) => {
      try {
        const data = broker.call('friends.getFriends', {
          other: 'abc',
        });
        expect.assertions(1);
      } catch (err) {
        done();
      }
    });

    //- Give an array with 1 existed email and 1 not existed
    it('Should throw execption if passing an array with 1 existed email and 1 not existed', async (done) => {
      try {
        const data = broker.call('friends.getFriends', {
          friends: ['user6@test.ok', 'user7@test.ok'],
        });
        expect.assertions(1);
      } catch (err) {
        done();
      }
    });

    //- Give an array with non existed email
    it('Should throw execption if passing an array with non existed email', async (done) => {
      try {
        const data = broker.call('friends.getFriends', {
          friends: ['user6@test.ok', 'user7@test.ok'],
        });
        expect.assertions(1);
      } catch (err) {
        done();
      }
    });
  });

});
