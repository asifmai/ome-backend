const User = require("../models/user");
const Reimbursement = require("../models/Reimbursement");
const Transaction = require("../models/Transaction");
const CheckingAccount = require("../models/CheckingAccount");
const twilio = require("../helpers/twilio");

module.exports.addreimb_post = async (req, res) => {
  try {
    let { transactionId, name, phone, amount } = req.body;

    const transaction = await Transaction.findById(transactionId);
    phone = phone.replace(/\D/g, "");
    phone = phone.replace(" ", "");
    const reimbursedUser = await User.findOne({ phone });
    if (!reimbursedUser) {
      twilio.sendInvitation(
        phone,
        req.user.profile.firstName,
        transaction.name,
        amount
      );
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
