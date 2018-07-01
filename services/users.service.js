'use strict';

const { MoleculerClientError } = require('moleculer').Errors;

const DbService = require('../mixins/db.mixin');
const { createDefaultUsersIfEmpty } = require('../seeders/users');

module.exports = {
  name: 'users',
  mixins: [DbService('users')],
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
    register: {
      params: {
        email: { type: 'email' },
        password: { type: 'string', min: 1 }
      },
      handler(ctx) {
        const { email, password } = ctx.params;
        if (!this.isEmailExisted(email)) {
          return this.registerNewUser({ email, password });
        }
        throw new MoleculerClientError('User is existed', 422, '', [{ field: 'user', message: 'User is existed' }])
      }
    },

    /**
     * Check whether email existed or not
     * 
     * @action
     * 
     * @param {string} email
     */
    checkEmailExisted: {
      params: {
        email: { type: 'email' }
      },
      handler(ctx) {
        const { email } = ctx.params;
        return this.isEmailExisted(email);
      }
    }
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
     * Register new user with email & password
     * 
     * @param {Object(email, password)} user 
     * @returns {Object} created user
     */
    registerNewUser({ email, password }) {
      return this.adapter.insert({ email, password });
    },

    /**
     * Check email is existed or not
     * 
     * @method
     * 
     * @param {string} email
     * @returns {boolean} true|false
     */
    isEmailExisted(email) {
      return this.adapter.count({ query: { email } }).then(c => c > 0);
    }
  },

  /**
   * Service created lifecycle event handler
   */
  created() {
    // Create default users if not existed
    createDefaultUsersIfEmpty();
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
