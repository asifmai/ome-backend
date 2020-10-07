'use strict';
const mongoose = require('mongoose');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    lowercase: true,
    unique: true,
    match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  },
  phone: String,
  verified: {
    type: Boolean,
    default: false,
  },
  passEnabled: {
    type: Boolean,
    default: false,
  },
  verificationCode : Number,
  password: String,
  salt: String,
  image: String,
  profile: {
    firstName: {
      type: String,
      default: '',
    },
    lastName: {
      type: String,
      default: '',
    },
    middleName: {
      type: String,
      default: ''
    },
  },
  facebook: {
    id: { type: String },
    displayName: { type: String },
    photoUrl: { type: String },
    email: { type: String },
    accessToken: { type: String }
  }
}, {
  timestamps: true
});

// check password function
UserSchema.methods.validatePassword = function(candidatePassword) {
  var hash = crypto.pbkdf2Sync(candidatePassword, this.salt, 1000, 64, 'sha512').toString('hex');
  return this.password === hash;
}

module.exports = mongoose.model('User', UserSchema);
