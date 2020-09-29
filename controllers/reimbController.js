const User = require('../models/user');
const Reimbursement = require('../models/Reimbursement');
const Transaction = require('../models/Transaction');
const twilio = require('../helpers/twilio');

module.exports.addreimb_post = async (req, res) => {
  try {
    const {transactionId, name, phone, amount} = req.body;

    const transaction = await Transaction.findById(transactionId);
    const reimbursedUser = await User.findOne({phone});

    if (!reimbursedUser) {
      twilio.sendInvitation(phone, req.user.profile.firstName, transaction.name, amount);
    }
    
    reimbersedUserId = reimbursedUser ? reimbursedUser._id : '';
    const newReimbursement = new Reimbursement({
      transactionId,
      name,
      phone,
      amount,
      userId: reimbursedUser
    });
    await newReimbursement.save();
    
    res.status(200).json({status: 200, msg: 'Reimbursement Added successfully...'});
  } catch (error) {
    console.log(`addreimb_post error: ${error}`);
    res.status(500).json({error});
  }
};

module.exports.updatecompleted_post = async (req, res) => {
  try {
    const {reimbursementId, completed} = req.body;

    await Reimbursement.findByIdAndUpdate(reimbursementId, {
      completed
    });
    
    res.status(200).json({status: 200, msg: 'Reimbursement Status Updated successfully...'});
  } catch (error) {
    console.log(`reimbursenet updatecompleted_post error: ${error}`);
    res.status(500).json({error});
  }
};
