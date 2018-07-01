'use strict';

const { ServiceBroker } = require('moleculer');
const { ValidationError } = require('moleculer').Errors;
const FriendService = require('../../services/friends.service');
const UserService = require('../../services/users.service');
const SubscribeService = require('../../services/subscribes.service');
const helper = require('../helpers/index');

describe('Test \'friend\' service', () => {
  let broker = new ServiceBroker();
  broker.createService(FriendService);
  broker.createService(UserService);
  broker.createService(SubscribeService);

  beforeAll(() => broker.start());
  afterAll(() => broker.stop());

  describe('Test \'subscribes.subscribes\' action', () => {
    // - Request make success
    it('Should return success when create subscribes between 2 emails', () => {
      const data = broker.call('subscribes.subscribes', {
        requestor: "user1@test.ok",
        target: "user3@test.ok"
      });
      expect(data).resolves.toEqual({ success: true });
    });

    // - Give wrong type of params
    it('Should throw execption if passing wrong type of params', async (done) => {
      try {
        const data = broker.call('subscribes.subscribes', {
          requestor: "user",
          target: "user3"
        });
        expect.assertions(1);
      } catch (err) {
        done();
      }
    });

    // - Give wrong shape of request payload
    it('Should throw execption if passing wrong shape of request payload', async (done) => {
      try {
        const data = broker.call('subscribes.subscribes', {
          requestor: ["user", "user3"]
        });
        expect.assertions(1);
      } catch (err) {
        done();
      }
    });

    // - Give requestor existed email and target not existed
    it('Should throw execption if requestor existed email and target not existed', async (done) => {
      try {
        const data = broker.call('subscribes.subscribes', {
          requestor: "user@test.ok",
          target: "user3@test.ok"
        });
        expect.assertions(1);
      } catch (err) {
        done();
      }
    });

    // - Give target existed email and requestor not existed
    it('Should throw execption if target existed email and requestor not existed', async (done) => {
      try {
        const data = broker.call('subscribes.subscribes', {
          requestor: "user@test.ok",
          target: "user3@test.ok"
        });
        expect.assertions(1);
      } catch (err) {
        done();
      }
    });

    // - Give target not existed email and requestor not existed
    it('Should throw execption if target not existed email and requestor not existed', async (done) => {
      try {
        const data = broker.call('subscribes.subscribes', {
          requestor: "user@test.ok",
          target: "user3@test.ok"
        });
        expect.assertions(1);
      } catch (err) {
        done();
      }
    });
  });

  describe('Test \'subscribes.block\' action', () => {
    // - Request make success
    it('Should return success when create subscribes between 2 emails', () => {
      const data = broker.call('subscribes.block', {
        requestor: "user1@test.ok",
        target: "user3@test.ok"
      });
      expect(data).resolves.toEqual({ success: true });
    });

    // - Give wrong type of params
    it('Should throw execption if passing wrong type of params', async (done) => {
      try {
        const data = broker.call('subscribes.block', {
          requestor: "user",
          target: "user3"
        });
        expect.assertions(1);
      } catch (err) {
        done();
      }
    });

    // - Give wrong shape of request payload
    it('Should throw execption if passing wrong shape of request payload', async (done) => {
      try {
        const data = broker.call('subscribes.block', {
          requestor: ["user", "user3"]
        });
        expect.assertions(1);
      } catch (err) {
        done();
      }
    });

    // - Give requestor existed email and target not existed
    it('Should throw execption if requestor existed email and target not existed', async (done) => {
      try {
        const data = broker.call('subscribes.block', {
          requestor: "user@test.ok",
          target: "user3@test.ok"
        });
        expect.assertions(1);
      } catch (err) {
        done();
      }
    });

    // - Give target existed email and requestor not existed
    it('Should throw execption if target existed email and requestor not existed', async (done) => {
      try {
        const data = broker.call('subscribes.block', {
          requestor: "user@test.ok",
          target: "user3@test.ok"
        });
        expect.assertions(1);
      } catch (err) {
        done();
      }
    });

    // - Give target not existed email and requestor not existed
    it('Should throw execption if target not existed email and requestor not existed', async (done) => {
      try {
        const data = broker.call('subscribes.block', {
          requestor: "user@test.ok",
          target: "user3@test.ok"
        });
        expect.assertions(1);
      } catch (err) {
        done();
      }
    });
  });

  describe('Test \'subscribes.composeMessage\' action', () => {
    // - Request make success
    it('Should return success', () => {
      const data = broker.call('subscribes.composeMessage', {
        sender: "user1@test.ok",
        text: "Hello user3@test.ok and user4@test.ok, we can find the user111@test.ok"
      });
      expect(data).resolves.toEqual({ success: true });
    });

    // - Give wrong type of params
    it('Should throw execption if passing wrong type of params', async (done) => {
      try {
        const data = broker.call('subscribes.composeMessage', {
          sender: "user",
          text: "user3"
        });
        expect.assertions(1);
      } catch (err) {
        done();
      }
    });

    // - Give wrong shape of request payload
    it('Should throw execption if passing wrong shape of request payload', async (done) => {
      try {
        const data = broker.call('subscribes.composeMessage', {
          sender: ["user", "user3"]
        });
        expect.assertions(1);
      } catch (err) {
        done();
      }
    });

    // - Give sender not existed email
    it('Should throw execption if sender not existed email', async (done) => {
      try {
        const data = broker.call('subscribes.composeMessage', {
          sender: "user1@test.ok",
          text: "Hello user3@test.ok and user4@test.ok, we can find the user111@test.ok"
        });
        expect.assertions(1);
      } catch (err) {
        done();
      }
    });

    // - Give a text params that have some existed emails and some not existed
    it('Should throw execption if a text params that have some existed emails and some not existed', async (done) => {
      try {
        const data = broker.call('subscribes.composeMessage', {
          sender: "user1@test.ok",
          text: "Hello user3@test.ok and user4@test.ok, we can find the user111@test.ok"
        });
        expect.assertions(1);
      } catch (err) {
        done();
      }
    });
  });

});
