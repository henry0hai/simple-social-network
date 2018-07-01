const crypto = require('crypto');
const bcrypt = require('bcrypt-nodejs');
const mongoose = require('mongoose');
const { autoIncrement } = require('mongoose-plugin-autoinc');

const hashids = require('../helpers/hashids')('users');
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

const UserSchema = new Schema({
    email: {
      type: String,
      trim: true,
      unique: true,
      index: true,
      lowercase: true,
    },
    password: String,

    metadata: {}
  },
  schemaOptions
);

UserSchema.plugin(autoIncrement, {
  model: 'User',
  startAt: 1,
});

/**
 * Virtual `code` field instead of _id
 */
UserSchema.virtual('code').get(function() {
  return this.encodeID();
});

/**
 * Password hashing
 */
UserSchema.pre('save', function(next) {
  let user = this;
  if (!user.referal_key) user.referal_key = user.username;
  if (!user.isModified('password')) return next();

  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      user.password = hash;
      next();
    });
  });
});

/**
 * Password compare
 */
UserSchema.methods.comparePassword = function(password, cb) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    cb(err, isMatch);
  });
};

/**
 * Virtual field for `avatar`.
 */
UserSchema.virtual('avatar').get(function() {
  // Load picture from profile
  if (this.profile && this.profile.picture) return this.profile.picture;

  // Generate a gravatar picture
  if (!this.email) return 'https://gravatar.com/avatar/?s=64&d=wavatar';

  const md5 = crypto
    .createHash('md5')
    .update(this.email)
    .digest('hex');
  return 'https://gravatar.com/avatar/' + md5 + '?s=64&d=wavatar';
});

/**
 * Encode `_id` to `code`
 */
UserSchema.methods.encodeID = function() {
  return hashids.encodeHex(this._id);
};

/**
 * Decode `code` to `_id`
 */
UserSchema.methods.decodeID = function(code) {
  return hashids.decodeHex(code);
};

let User = mongoose.model('User', UserSchema);

module.exports = User;
