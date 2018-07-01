const Hashids = require('hashids');

/**
 * Create a Hash ID generator by module name.
 * Use `module` as prefix of the `hashSecret`
 */
module.exports = function(module, length) {
  const hashSecret = process.env.HASH_SECRET || 'MY_HASH_SECRET';
  return new Hashids(`module${hashSecret}`, length || 10);
};
