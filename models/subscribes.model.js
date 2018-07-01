const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schemaOptions = {
  timestamps: true,
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
};

const SubscribeSchema = new Schema({
    requestor: String,
    target: String,
    active: {
      type: Boolean,
      default: false,
    },

    metadata: {}
  },
  schemaOptions
);

SubscribeSchema.index({ requestor: 1, target: 1 }, { unique: true });

const Subscribe = mongoose.model('Subscribe', SubscribeSchema);

module.exports = Subscribe;
