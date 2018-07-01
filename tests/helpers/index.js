const User = require('../../models/users.model');
const Friend = require('../../models/friends.model');
const Subscribes = require('../../models/subscribes.model');

exports.clearDatabase = () => {
  Promise.all([
    User.remove({}),
    Friend.remove({}),
    Subscribes.remove({})
  ]).then(() => {
    console.log('Removed all data');
  });
}
