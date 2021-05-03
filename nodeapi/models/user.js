const { Schema, model } = require('mongoose');
const { v4 } = require('uuid');
const crypto = require('crypto');
const {
  Types: { ObjectId },
} = Schema;

const userSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
  },
  hashedPassword: {
    type: String,
    required: true,
  },
  salt: String,
  created: {
    type: Date,
    default: Date.now(),
  },
  photo: {
    data: Buffer,
    contentType: String,
  },
  about: {
    type: String,
    trim: true,
    max: 200,
  },
  following: [{ type: ObjectId, ref: 'User' }],
  followers: [{ type: ObjectId, ref: 'User' }],
  updated: Date,
});

/**
 * Virtual fields are additional field to the given model.
 * Their valuees can be set annually or automatically with defined funcntionality.
 * Keep in mind: virtual properties don't get persisted in the database.
 * They only exist logically and are not written to the document's collections.
 */

userSchema
  .virtual('password')
  .set(function (password) {
    // create temmporary variables _password
    this._password = password;
    // generate a timestamp
    this.salt = v4();
    // encryptPassword()
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

userSchema.methods = {
  authenticate(plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword;
  },
  encryptPassword(password) {
    if (!password) return '';
    try {
      return crypto
        .createHmac('sha1', this.salt)
        .update(password)
        .digest('hex');
    } catch (err) {
      return '';
    }
  },
};

module.exports = model('User', userSchema);
