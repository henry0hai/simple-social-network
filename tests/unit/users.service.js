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
  broker.createService(SubscribeService);

  beforeAll(() => broker.start());
  afterAll(() => broker.stop());

  describe('Test \'friends.makeFriend\' action', () => {
    // - Request make friend success
    it('Should return success when make a new connection between email1 and email2', () => {
      const data = broker.call('friends.makeFriend', {
        friends: ['user6@test.ok', 'user7@test.ok'],
      });
      expect(data).resolves.toEqual({ success: true });
    });
  });
});
