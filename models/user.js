'use strict';
const mongoose = require('mongoose');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: true,
    match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  },
  phone: String,
  verified: {
    type: Boolean,
    default: false,
  },
  verificationCode : Number,
  password: String,
  salt: String,
  profile: {
    firstName: String,
    lastName: String,
    maidenName: String,
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

// encrypt password before saving
UserSchema.pre('save', function(next) {
  const user = this;
  if (!user.isModified('password'))
    return next();

  user.salt = crypto.randomBytes(16).toString('hex');
  user.password = crypto.pbkdf2Sync(user.password, user.salt, 1000, 64, 'sha512').toString('hex');
  return next();
})

// check password function
UserSchema.methods.validatePassword = function(candidatePassword) {
  var hash = crypto.pbkdf2Sync(candidatePassword, this.salt, 1000, 64, 'sha512').toString('hex');
  return this.password === hash;
}

module.exports = mongoose.model('User', UserSchema);
