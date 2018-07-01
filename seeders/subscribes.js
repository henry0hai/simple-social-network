const Subscribe = require('../models/subscribes.model');

/**
 * Create some default subscribes if the subscribes collection is empty
 */
exports.createDefaultSubscribesIfEmpty = async () => {
  const count = await Subscribe.count();
  if (count > 0) return Promise.resolve(false);

  const subscribes = [
    { requestor: 'user1@test.ok', target: 'user2@test.ok', active: true },
    { requestor: 'user1@test.ok', target: 'user3@test.ok', active: true },
    { requestor: 'user3@test.ok', target: 'user4@test.ok', active: true },
    { requestor: 'user4@test.ok', target: 'user6@test.ok', active: false },
    { requestor: 'user5@test.ok', target: 'user6@test.ok', active: false },
    { requestor: 'user6@test.ok', target: 'user1@test.ok', active: false },
    { requestor: 'user7@test.ok', target: 'user6@test.ok', active: true },
    { requestor: 'user7@test.ok', target: 'user8@test.ok', active: false },
    { requestor: 'user9@test.ok', target: 'user2@test.ok', active: true },
    { requestor: 'user10@test.ok', target: 'user1@test.ok', active: false },
  ];

  return Promise.all(subscribes.map(u => Subscribe.create(u)));
};
