const path = require('path');
const DbService = require('moleculer-db');

module.exports = function(modelName) {
  const MONGO_URI = process.MONGO_URI || 'mongodb://localhost/simple-social-network';
  const MongooseAdapter = require('moleculer-db-adapter-mongoose');

  return {
    mixins: [DbService],
    adapter: new MongooseAdapter(MONGO_URI),
    model: require(`../models/${modelName}.model.js`)
  };
};
