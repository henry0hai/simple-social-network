'use strict';

const ApiGateway = require('moleculer-web');

module.exports = {
  name: 'api',
  mixins: [ApiGateway],

  // More info about settings: http://moleculer.services/docs/moleculer-web.html
  settings: {
    port: process.env.PORT || 3000,

    routes: [{
      path: '/api',
      aliases: {
        'POST /register': 'users.register',
        'POST /make-friend': 'friends.makeFriend',
        'POST /friends': 'friends.getFriends',
        'POST /get-common-friends': 'friends.getCommonFriends',
        'POST /subscribe': 'subscribes.subscribes',
        'POST /block': 'subscribes.block',
        'POST /compose-message': 'subscribes.composeMessage'
      },
    }],

    // Serve assets from "public" folder
    assets: {
      folder: 'public'
    }
  }
};
