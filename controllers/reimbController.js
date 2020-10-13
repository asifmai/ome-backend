const User = require("../models/user");
const Reimbursement = require("../models/Reimbursement");
const Transaction = require("../models/Transaction");
const CheckingAccount = require("../models/CheckingAccount");
const notify = require('../helpers/notify');
const formatter = require('../helpers/formatter');

module.exports.addreimb_post = async (req, res) => {
  try {
    let { transactionId, name, amount } = req.body;
    const phone = formatter.formatPhone(req.body.phone);

    const transaction = await Transaction.findById(transactionId);
    
    const reimbursedUser = await User.findOne({ phone });
    if (!reimbursedUser) {
      const smsBody = `OME\n${req.user.profile.firstName} has sent you a reimbursement of amount ${amount} against transaction ${transaction.name}. Please download OME from the link below to signup.`;
      notify.sendSMS(smsBody, phone);
    } else {
      const smsBody = `OME\n${req.user.profile.firstName} has sent you a reimbursement of amount ${amount} against transaction ${transaction.name}.`;
      notify.sendSMS(smsBody, phone);
      notify.sendEmail('Someone sent you a reimbursement', smsBody, reimbursedUser.email)
    }

    reimbersedUserId = reimbursedUser ? reimbursedUser._id : "";
    let newReimbursement = new Reimbursement({
      transactionId,
      name,
      phone,
      amount,
      userId: reimbursedUser,
    });
    await newReimbursement.save();

    newReimbursement = await Reimbursement.findOne({
      _id: newReimbursement._id,
    }).populate("transactionId");

    res.status(200).json({ status: 200, data: newReimbursement });
  } catch (error) {
    console.log(`addreimb_post error: ${error}`);
    res.status(500).json({ error });
  }
};

module.exports.updatecompleted_post = async (req, res) => {
  try {
    const { reimbursementId, completed } = req.body;

    await Reimbursement.findByIdAndUpdate(reimbursementId, {
      completed,
    });

    res.status(200).json({
      status: 200,
      msg: "Reimbursement Status Updated successfully...",
    });
  } catch (error) {
    console.log(`reimbursenet updatecompleted_post error: ${error}`);
    res.status(500).json({ error });
  }
};

module.exports.reimbursement_get = async (req, res) => {
  try {
    // Fetch Reimbursements created by the user / Reimb created for a user
    const account = await CheckingAccount.findOne({ userId: req.user._id });
    let trIds = [];
    if (account) {
      const transactions = await Transaction.find({ account_id: account._id });
      trIds = transactions.map((tr) => tr._id);
    }
    const reimbursements = await Reimbursement.find({
      $or: [
        { transactionId: { $in: trIds } },
        {
          userId: req.user._id,
        },
      ],
    }).populate("transactionId");

    res.status(200).json({ status: 200, data: reimbursements });
  } catch (error) {
    console.log(`reimbursement_get error: ${error}`);
    res.status(500).json({ error });
  }
};
