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

const FriendSchema = new Schema({
    user: String,
    friend: String,

    metadata: {}
  },
  schemaOptions
);

FriendSchema.index({ user: 1, friend: 1 }, { unique: true });

const Friend = mongoose.model('Friend', FriendSchema);

module.exports = Friend;
