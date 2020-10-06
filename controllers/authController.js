'use strict';
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/user');
const Group = require('../models/group');
const config = require('../config/main');
const {genVerificationCode} = require('../helpers/random');
const twilio = require('../helpers/twilio');

// generate jwt token with basic user data
function generateTokenResponse(user) {
  // user info to be included in jwt
  const userInfo = {
    _id: user._id,
    firstName: user.profile.firstName,
    middleName: user.profile.middleName,
    lastName: user.profile.lastName,
    email: user.email,
    image: user.image,
    phone: user.phone,
  };

  return {
    token: 'Bearer ' + jwt.sign(userInfo, config.secret, { expiresIn: 120000}),
    user: userInfo
  };
}

// login route
exports.login = function(req, res, next) {
  return res.status(200).json(generateTokenResponse(req.user));
}

// Register Phone Number
exports.register_phone = async function(req, res, next) {
  try {
    const errors = [];
    const phone = req.body.phone ? req.body.phone.trim() : undefined;
    if (!phone) errors.push({msg: 'You must enter a phone number'});

    if (errors.length > 0) {
      return res.status(422).json({status: 'error', errors});
    } else {
      const foundUser = await User.findOne({phone});
      if (foundUser) return res.status(422).json({ status: 'error', errors: [{msg: 'That phone number is already in use.'}] });

      // @todo: uncomment the genVerificationCode function and remove the prevailing line
      // const verificationCode = genVerificationCode();
      const verificationCode = 123456;
      let newUser = new User({
        verified: false,
        phone,
        verificationCode
      });
  
      await newUser.save();
      
      twilio.sendPhoneVerificationSMS(phone, verificationCode);

      res.status(200).json({status: 'success', msg: 'Please verifiy phone number.'})
    }
  } catch (error) {
    console.log(`Register Phone Error: ${error}`);
    res.status(500).json({error});
  }
}

// Resend Verification Code
exports.resend_code = async function(req, res, next) {
  try {
    const errors = [];
    const phone = req.body.phone ? req.body.phone.trim() : undefined;
    if (!phone) errors.push({msg: 'You must enter a phone number'});

    if (errors.length > 0) {
      return res.status(422).json({status: 'error', errors});
    } else {
      const foundUser = await User.findOne({phone});
      if (!foundUser) return res.status(422).json({ status: 'error', errors: [{msg: 'That phone number is not registered.'}] });
      
      twilio.sendPhoneVerificationSMS(phone, foundUser.verificationCode);

      res.status(200).json({status: 'success', msg: 'Please verifiy phone number.'})
    }
  } catch (error) {
    console.log(`Register Phone Error: ${error}`);
    res.status(500).json({error});
  }
}

// Phone Verification Route
exports.verify_phone = async function(req, res, next) {
  try {
    const errors = [];
    const phone = req.body.phone ? req.body.phone.trim() : undefined;
    const verificationCode = req.body.verificationCode ? req.body.verificationCode.trim() : undefined;
  
    // check for errors
    if (!phone) errors.push({msg: 'You must enter a phone number.'});
    if (!verificationCode) errors.push({msg: 'You must enter a Verification Code.'});
    
    if (errors.length > 0) {
      return res.status(422).json({status: 'error', errors});
    } else {
      let foundUser = await User.findOne({phone});
      if (!foundUser)
        return res.status(422).send({ status: 'error', errors: [{msg: 'There is no account with this phone number.'}] });

      if (Number(foundUser.verificationCode) == Number(verificationCode)) {
        await User.findOneAndUpdate({phone}, {verified: true});
        res.status(200).json({status: 'success', msg: 'Phone number verified successfully.'});
      } else {
        res.status(422).json({status: 'error', errors: [{msg: 'Verification code is not correct.'}]});
      }
    }
  } catch (error) {
    console.log(`Verify Phone Error: ${error}`);
    res.status(500).json({error});
  }
}

// registration route
exports.register = async function(req, res, next) {
  try {
    const errors = [];
    const phone = req.body.phone ? req.body.phone.trim() : undefined;
    const email = req.body.email ? req.body.email.trim() : undefined;
    const password = req.body.password ? req.body.password.trim() : undefined;
    const image = req.body.image ? req.body.image.trim() : '';
  
    // check for errors
    if (!email) errors.push({msg: 'You must enter an email address.'});
    if (!password) errors.push({msg: 'You must enter a password.'});
    else if (password.length < 6) errors.push({msg: 'Password must be at least 6 characters'});
    if (!phone) errors.push({msg: 'You must enter a phone number'});
    
    if (errors.length > 0) {
      return res.status(422).json({status: 'error', errors});
    } else {
      let foundUser = await User.findOne({email});
      if (foundUser)
        return res.status(422).json({ status: 'error', errors: [{msg: 'That email address is already in use.'}] });

      foundUser = await User.findOne({phone});
      if (!foundUser)
        return res.status(422).json({ status: 'error', errors: [{msg: 'That phone number is not registered.'}] });
  
      const salt = crypto.randomBytes(16).toString('hex');
      const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
      const newUser = await User.findOneAndUpdate({phone}, {
        email,
        password: hash,
        image,
        salt,
      });
      console.log(newUser);

      // See if the user is already added to a group
      const groups = await Group.find();
      for (let i = 0; i < groups.length; i++) {
        let members = groups[i].members;
        if (members.some(mem => mem.phone == newUser.phone)) {
          console.log('User found in a group');
          members = members.map(mem => {
            if (mem.phone == newUser.phone) {
              mem.user = newUser._id;
            }
            return mem;
          });
          await Group.findByIdAndUpdate(groups[i]._id, {members: members});
        }
      }

      res.status(200).json({status: 'success', msg: 'Account Created.'})
    }
  } catch (error) {
    console.log(`Register Error: ${error}`);
    res.status(500).json({error});
  }
}