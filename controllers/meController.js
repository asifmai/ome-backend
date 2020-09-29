const User = require('../models/user');
const Transaction = require('../models/Transaction');
const CheckingAccount = require('../models/CheckingAccount');
const Reimbursement = require('../models/Reimbursement');
const Group = require('../models/group');
const crypto = require('crypto');

module.exports.me_get = function(req, res, next) {
  return res.status(200).json({
    authSuccess: true,
    user: req.user
  });
}

module.exports.updatename_post = async (req, res) => {
  try {
    const firstName = req.body.firstName ? req.body.firstName.trim() : '';
    const lastName = req.body.lastName ? req.body.lastName.trim() : '';
    const middleName = req.body.middleName ? req.body.middleName.trim() : '';

    await User.findByIdAndUpdate(req.user._id, {
      profile: {
        firstName,
        lastName,
        middleName
      }
    })
    
    res.status(200).json({status: 200, msg: 'Names were updated successfully...'});
  } catch (error) {
    console.log(`updatename_post error: ${error}`);
    res.status(500).json({error});
  }
}

module.exports.updateimage_post = async (req, res) => {
  try {
    const image = req.body.image;

    await User.findByIdAndUpdate(req.user._id, {image});
    
    res.status(200).json({status: 200, msg: 'Image was updated successfully...'});
  } catch (error) {
    console.log(`updateimage_post error: ${error}`);
    res.status(500).json({error});
  }
}

module.exports.deleteuser_get = async (req, res) => {
  try {
    const checkingAccount = await CheckingAccount.findOne({userId: req.user._id});
    const transactions = await Transaction.find({account_id: checkingAccount._id});
    const trsId = transactions.map(tr => tr._id);
    await Reimbursement.deleteMany({transactionId: {$in: trsId}});
    
    await Transaction.deleteMany({account_id: checkingAccount._id});
    await CheckingAccount.deleteMany({userId: req.user._id});
    await Group.deleteMany({userId: req.user._id});
    await User.findByIdAndDelete(req.user._id);
    
    res.status(200).json({status: 200, msg: 'User(User, Transactions, Checking Account, Groups) Deleted successfully...'});
  } catch (error) {
    console.log(`deleteuser_get error: ${error}`);
    res.status(500).json({error});
  }
}

module.exports.updatepassword_post = async (req, res) => {
  try {
    const {oldPassword, password} = req.body;

    const oldPasswordFromDb = crypto.pbkdf2Sync(oldPassword, req.user.salt, 1000, 64, 'sha512').toString('hex');
    if (oldPasswordFromDb != req.user.password) {
      return res.status(422).json({status: 422, error: 'Old Password is incorrect'});
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');

    await User.findByIdAndUpdate(req.user._id, {
      password: hash,
      salt
    });
    
    res.status(200).json({status: 200, msg: 'Password Updated successfully...'});
  } catch (error) {
    console.log(`updatepassword_post error: ${error}`);
    res.status(500).json({error});
  }
}
