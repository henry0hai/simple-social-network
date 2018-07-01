const User = require('../models/users.model');

/**
 * Create some default users if the users collection is empty
 */
exports.createDefaultUsersIfEmpty = async () => {
  const count = await User.count();
  if (count > 0) return Promise.resolve(false);

  const users = [
    { email: 'user1@test.ok', password: '123788' },
    { email: 'user2@test.ok', password: '123787' },
    { email: 'user3@test.ok', password: '123786' },
    { email: 'user4@test.ok', password: '123786' },
    { email: 'user5@test.ok', password: '123785' },
    { email: 'user6@test.ok', password: '123785' },
    { email: 'user7@test.ok', password: '123785' },
    { email: 'user8@test.ok', password: '123785' },
    { email: 'user9@test.ok', password: '123785' },
    { email: 'user10@test.ok', password: '123785' },
  ];

  return Promise.all(users.map(u => User.create(u)));
};
