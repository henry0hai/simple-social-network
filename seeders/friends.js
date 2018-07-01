const Friend = require('../models/friends.model');

/**
 * Create some default friends if the friends collection is empty
 */
exports.createDefaultFriendsIfEmpty = async () => {
  const count = await Friend.count();
  if (count > 0) return Promise.resolve(false);

  const friends = [
    { user: 'user1@test.ok', friend: 'user2@test.ok' },
    { user: 'user1@test.ok', friend: 'user3@test.ok' },
    { user: 'user1@test.ok', friend: 'user4@test.ok' },
    { user: 'user4@test.ok', friend: 'user6@test.ok' },
    { user: 'user5@test.ok', friend: 'user6@test.ok' },
    { user: 'user6@test.ok', friend: 'user1@test.ok' },
    { user: 'user7@test.ok', friend: 'user6@test.ok' },
    { user: 'user7@test.ok', friend: 'user4@test.ok' },
    { user: 'user9@test.ok', friend: 'user2@test.ok' },
    { user: 'user10@test.ok', friend: 'user1@test.ok' },
  ];

  return Promise.all(friends.map(u => Friend.create(u)));
};
