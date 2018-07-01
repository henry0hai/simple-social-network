'use strict';
const DbService = require('../mixins/db.mixin');
const { MoleculerClientError } = require('moleculer').Errors;
const { createDefaultFriendsIfEmpty } = require('../seeders/friends');

module.exports = {
  name: 'friends',
  mixins: [DbService('friends')],

  /**
   * Service settings
   */
  settings: {

  },

  /**
   * Service metadata
   */
  metadata: {

  },

  /**
   * Service dependencies
   */
  //dependencies: [],

  /**
   * Actions
   */
  actions: {
    friends: {
      handler(ctx) {
        return this.adapter.find();
      }
    },
    /**
     * Make friend between 2 users by emails
     * 
     * @action
     * 
     * @param {array} friends - list of users emails'
     */
    makeFriend: {
      params: {
        friends: 'array'
      },
      async handler(ctx) {
        const { friends } = ctx.params;
        const res = await this.makeFriend(friends);
        return { success: res };
      }
    },

    /**
     * Get friends by email
     *
     * @action
     *
     * @param {string} email
     */
    getFriends: {
      params: {
        email: { type: 'email' }
      },
      handler(ctx) {
        const { email } = ctx.params;
        return this.getFriends(email);
      }
    },

    /**
     * Get common friend between 2 users by emails
     *
     * @action
     *
     * @param { array } friends - list of users emails '
     */
    getCommonFriends: {
      params: {
        friends: 'array'
      },
      handler(ctx) {
        const { friends } = ctx.params;
        return this.getCommonFriends(friends);
      }
    },
  },

  /**
   * Events
   */
  events: {

  },

  /**
   * Methods
   */
  methods: {
    /**
     * Make friend between 2 users by emails
     * 
     * @method
     * 
     * @param {array} friends - list of users emails'
     * @returns {boolean} true | false
     */
    async makeFriend(friends) {
      const [user, friend] = friends; // user email, friend email
      const [userExisted, friendExisted] = await Promise.all([
        this.broker.call('users.checkEmailExisted', { email: user }),
        this.broker.call('users.checkEmailExisted', { email: friend })
      ]);
      if (!userExisted) {
        throw new MoleculerClientError('Email is not existed', 422, '', [{ field: 'friends[0]', message: 'Email is not existed' }])
      }
      if (!friendExisted) {
        throw new MoleculerClientError('Email is not existed', 422, '', [{ field: 'friends[1]', message: 'Email is not existed' }])
      }
      const isExistedConnection = await this.checkExistedConnection(user, friend);
      if (isExistedConnection) {
        throw new MoleculerClientError('They are already connected', 422, '', [{ field: 'friends', message: 'They are already connected' }])
      }
      const res = await this.adapter.insert({ user, friend });
      return res ? true : false;
    },

    /**
     * Check whether users are connected or not
     * @param {string} email1
     * @param {string} email2
     */
    async checkExistedConnection(email1, email2) {
      const [res1, res2] = await Promise.all([
        this.adapter.count({ query: { user: email1, friend: email2 } }),
        this.adapter.count({ query: { user: email2, friend: email1 } })
      ]);
      return res1 > 0 || res2 > 0;
    },

    /**
     * Get friends by email
     *
     * @method
     *
     * @param {string} email
     * @returns {boolean, array, number} true | false, array, number
     */
    async getFriends(email) {
      const isEmailExisted = await this.broker.call('users.checkEmailExisted', { email });
      console.log('[getFriends] > isEmailExisted: ', isEmailExisted);
      if (!isEmailExisted) {
        throw new MoleculerClientError('Email is not existed', 422, '', [{ field: 'email', message: 'Email is not existed' }])
      }
      const [friendsByUser = [], friendsByFriend = []] = await Promise.all([
        this.adapter.find({ query: { user: email } }).then(users => users.map(({ friend }) => friend)),
        this.adapter.find({ query: { friend: email } }).then(users => users.map(({ user }) => user))
      ]);

      const friends = [...friendsByUser, ...friendsByFriend];
      const count = friends.length;
      return {
        success: true,
        friends,
        count
      };
    },
    /**
     * Get friends between 2 users by email
     *
     * @method
     *
     * @param { array } friends - list of users emails '
     * @returns {boolean, array, number} true | false, array, number
     */
    async getCommonFriends(friends) {
      const [user, friend] = friends; // user email, friend email
      const [userExisted, friendExisted] = await Promise.all([
        this.broker.call('users.checkEmailExisted', { email: user }),
        this.broker.call('users.checkEmailExisted', { email: friend })
      ]);
      if (!userExisted) {
        throw new MoleculerClientError('Email is not existed', 422, '', [{ field: 'friends[0]', message: 'Email is not existed' }])
      }
      if (!friendExisted) {
        throw new MoleculerClientError('Email is not existed', 422, '', [{ field: 'friends[1]', message: 'Email is not existed' }])
      }

      const { friends: friendOfUser1 } = await this.getFriends(user);
      const { friends: friendOfUser2 } = await this.getFriends(friend);

      const commonFriends = [];
      for (let i = 0; i < friendOfUser1.length; i++) {
        for (let j = 0; j < friendOfUser2.length; j++) {
          if (friendOfUser1[i] === friendOfUser2[j]) {
            commonFriends.push(friendOfUser1[i]);
          }
        }
      }

      const count = commonFriends.length;
      return {
        success: true,
        friends: commonFriends,
        count
      };
    }
  },

  /**
   * Service created lifecycle event handler
   */
  created() {
    // Create default friends if not existed
    createDefaultFriendsIfEmpty();
  },

  /**
   * Service started lifecycle event handler
   */
  started() {

  },

  /**
   * Service stopped lifecycle event handler
   */
  stopped() {

  }
};
