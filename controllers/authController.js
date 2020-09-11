'use strict';
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../config/main');
const {genVerificationCode} = require('../helpers/random');
const twilio = require('../helpers/twilio');

// generate jwt token with basic user data
function generateTokenResponse(user) {
  // user info to be included in jwt
  const userInfo = {
    _id: user._id,
    firstName: user.profile.firstName,
    lastName: user.profile.lastName,
    email: user.email
  };

  return {
    token: 'Bearer ' + jwt.sign(userInfo, config.secret, { expiresIn: 10080}),
    user: userInfo
  };
}

// login route
exports.login = function(req, res, next) {
  return res.status(200).json(generateTokenResponse(req.user));
}

// registration route
exports.register = async function(req, res, next) {
  try {
    const errors = [];
    const email = req.body.email ? req.body.email.trim() : undefined;
    const firstName = req.body.firstName ? req.body.firstName.trim() : undefined;
    const maidenName = req.body.maidenName ? req.body.maidenName.trim() : '';
    const lastName = req.body.lastName ? req.body.lastName.trim() : undefined;
    const password = req.body.password ? req.body.password.trim() : undefined;
    const phone = req.body.phone ? req.body.phone.trim() : undefined;
  
    // check for errors
    if (!email) errors.push({msg: 'You must enter an email address.'});
    if (!firstName || !lastName) errors.push({msg: 'You must enter your full name.'});
    if (!password) errors.push({msg: 'You must enter a password.'});
    if (password.length < 6) errors.push({msg: 'Password must be at least 6 characters'});
    if (!phone) errors.push({msg: 'You must enter a phone number'});
    
    if (errors.length > 0) {
      return res.status(422).json(errors);
    } else {
      let foundUser = await User.findOne({email});
      if (foundUser)
        return res.status(422).send({ error: 'That email address is already in use.' });

      foundUser = await User.findOne({phone});
      if (foundUser)
        return res.status(422).send({ error: 'That phone number is already in use.' });
  
      const verificationCode = genVerificationCode();
      let newUser = new User({
        email,
        password,
        profile: {firstName, lastName, maidenName},
        verified: false,
        phone,
        verificationCode
      });
  
      await newUser.save();
      
      const smsBody = `OME\nYour verification code is: ${verificationCode}`;
      twilio.sendSMS(phone, smsBody);
  
      // res.status(201).json(generateTokenResponse(user));
      res.status(200).json({msg: 'Account Created please verifiy phone number.'})
    }
  } catch (error) {
    console.log(`Register Error: ${error}`);
    res.status(500).json({error});
  }
}

// Phone Verification Route
exports.verifyPhone = async function(req, res, next) {
  try {
    console.log(req.body)
    const errors = [];
    const email = req.body.email ? req.body.email.trim() : undefined;
    const verificationCode = req.body.verificationCode ? req.body.verificationCode.trim() : undefined;
  
    // check for errors
    if (!email) errors.push({msg: 'You must enter an email address.'});
    if (!verificationCode) errors.push({msg: 'You must enter a Verification Code.'});
    
    if (errors.length > 0) {
      return res.status(422).json(errors);
    } else {
      let user = await User.findOne({email});
      if (!user)
        return res.status(422).send({ error: 'There is no account with this email.' });

      if (Number(user.verificationCode) == Number(verificationCode)) {
        await User.findOneAndUpdate({email}, {verified: true});
        res.status(201).json(generateTokenResponse(user));
      } else {
        res.status(422).json({error: 'Verification code is not correct.'});
      }
    }
  } catch (error) {
    console.log(`Verify Phone Error: ${error}`);
    res.status(500).json({error});
  }
}
