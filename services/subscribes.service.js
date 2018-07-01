'use strict';

const { MoleculerClientError } = require('moleculer').Errors;

const DbService = require('../mixins/db.mixin');
const { createDefaultSubscribesIfEmpty } = require('../seeders/subscribes');

module.exports = {
  name: 'subscribes',
  mixins: [DbService('subscribes')],
  /**
   * Service settings
   */
  settings: {},

  /**
   * Service metadata
   */
  metadata: {},

  /**
   * Service dependencies
   */
  //dependencies: [],

  /**
   * Actions
   */
  actions: {
    /**
     * Subscribes 2 users by email
     *
     * @action
     *
     * @param { string } requestor
     * @param { string } target
     */
    subscribes: {
      params: {
        requestor: { type: 'email' },
        target: { type: 'email' },
      },
      handler(ctx) {
        const { requestor, target } = ctx.params;
        return this.subscribes({ requestor, target, status: true });
      },
    },

    /**
     * Block notification of target from requestor
     *
     * @action
     *
     * @param { string } requestor
     * @param { string } target
     */
    block: {
      params: {
        requestor: { type: 'email' },
        target: { type: 'email' },
      },
      handler(ctx) {
        const { requestor, target } = ctx.params;
        return this.subscribes({ requestor, target, status: false });
      },
    },

    /**
     * Retrieve all email addresses that can receive updates from an email address.
     *
     * @action
     *
     * @param { string } sender
     * @param { string } text
     */
    composeMessage: {
      params: {
        sender: { type: 'email' },
        text: 'string',
      },
      async handler(ctx) {
        const { sender, text } = ctx.params;
        const recipients = await this.getReceptionList(sender, text);
        return { success: true, recipients };
      },
    },
  },

  /**
   * Events
   */
  events: {},

  /**
   * Methods
   */
  methods: {
    /**
     * Subscribes 2 users by email with status
     *
     * @method
     *
     * @param { Object(requestor, target) } subscribes
     * @returns {Object} created subscribers
     */
    async subscribes({ requestor, target, status }) {
      const [requestorExisted, targetExisted] = await Promise.all([
        this.broker.call('users.checkEmailExisted', { email: requestor }),
        this.broker.call('users.checkEmailExisted', { email: target }),
      ]);
      if (!requestorExisted) {
        throw new MoleculerClientError('Email is not existed', 422, '', [
          { field: 'requestor', message: 'Email is not existed' },
        ]);
      }
      if (!targetExisted) {
        throw new MoleculerClientError('Email is not existed', 422, '', [
          { field: 'target', message: 'Email is not existed' },
        ]);
      }

      const subscriberExisted = await this.isSubscribesExisted({
        requestor,
        target,
      });
      if (subscriberExisted[0] && subscriberExisted[0].active === true) {
        throw new MoleculerClientError('Already subscribes', 422, '', [
          { field: 'target', message: 'Target is already subscribes' },
        ]);
      }

      if (subscriberExisted[0]) {
        subscriberExisted[0].active = status;
        const result = this.adapter.updateById(
          subscriberExisted[0].id,
          subscriberExisted[0],
        );
        if (result) {
          return { success: true };
        } else {
          return { success: false };
        }
      }
      return this.adapter.insert({ requestor, target, active: status });
    },

    /**
     * Check subscribes is existed or not
     *
     * @method
     *
     * @param { Object(requestor, target) } subscribes
     * @returns {Object} subscribes
     */
    isSubscribesExisted({ requestor, target }) {
      return this.adapter.find({ query: { requestor, target } });
    },

    /**
     * Get subscribers list from target
     *
     * @method
     *
     * @param { string } target
     * @returns {array} subscribes
     */
    async getSubscribers(email) {
      const subscribers = await this.adapter.find({ query: { target: email, active: true } });
      return subscribers.map(({ requestor }) => requestor);
    },

    /**
     * Get friends of sender
     *
     * @method
     *
     * @param { string } sender
     * @returns {array} emails
     */
    async getSenderFriends(sender) {
      const friends = await this.broker.call('friends.getFriends', {
        email: sender,
      });
      return friends.friends;
    },

    /**
     * Get emails from text
     *
     * @method
     *
     * @param { string } text
     * @returns {array} emails
     */
    async getMentionEmails(text) {
      const emails = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
      const results = await Promise.all(emails.map(email => this.broker.call('users.checkEmailExisted', { email })));
      const existedEmails = [];
      for (let i = 0; i < results.length; i++) {
        if (results[i]) {
          existedEmails.push(emails[i]);
        }
      }
      return existedEmails;
    },

    /**
     * Get reception list from sender and text
     *
     * @method
     *
     * @param { string } sender
     * @param { string } text
     * @returns {array} emails
     */
    async getReceptionList(sender, text) {
      const [senderFriends, subscribers, mentionEmails] = await Promise.all([
        this.getSenderFriends(sender),
        this.getSubscribers(sender),
        this.getMentionEmails(text)
      ]);
      return [...senderFriends, ...subscribers, ...mentionEmails].reduce((res, email) => {
        if (res.indexOf(email) === -1) {
          res.push(email);
        }
        return res;
      }, []);
    }
  },

  /**
   * Service created lifecycle event handler
   */
  created() {
    // Create default subscribes if not existed
    createDefaultSubscribesIfEmpty();
  },

  /**
   * Service started lifecycle event handler
   */
  started() {},

  /**
   * Service stopped lifecycle event handler
   */
  stopped() {},
};
