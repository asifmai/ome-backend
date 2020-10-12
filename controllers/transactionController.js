const Transaction = require("../models/Transaction");
const CheckingAccount = require("../models/CheckingAccount");
const Reimbursement = require("../models/Reimbursement");
const LinkedAccount = require("../models/LinkedAccount");

module.exports.transactions_get = async (req, res) => {
  try {
    const userId = req.user._id;
    const userAccount = await CheckingAccount.findOne({ userId });
    if (!userAccount)
      return res
        .status(500)
        .json({ error: "Checking account for user not found" });

    const linkedAccounts = await LinkedAccount.find({
      accountId: userAccount._id,
    });

    let transactions = await Transaction.find({
      account_id: userAccount._id,
    }).sort({ _id: -1 });
    transactions = transactions.map((tr) => tr.toJSON());

    for (let i = 0; i < transactions.length; i++) {
      const reimbursements = await Reimbursement.find({
        transactionId: transactions[i]._id,
      });
      if (reimbursements.length > 0) {
        console.log(transactions[i]._id, reimbursements.length);
        transactions[i].reimbursements = reimbursements;
        console.log(transactions[i]);
      }
    }

    const response = {
      account: userAccount,
      transactions,
      linkedAccounts,
    };

    res.status(200).json({ status: "success", data: response });
  } catch (error) {
    console.log(`Get Transactions Error: ${error}`);
    res.status(500).json({ error });
  }
};

module.exports.addtransaction_get = async (req, res) => {
  try {
    const type = req.body.type ? req.body.type.trim() : "";
    const vendor = req.body.vendor ? req.body.vendor.trim() : "";
    const category = req.body.category ? req.body.category.slice(1) : [];
    const amount = req.body.amount ? req.body.amount.trim() : "";
    const date = req.body.date ? req.body.date.trim() : "";
    const name = req.body.name ? req.body.name.trim() : "";
    const category_id = req.body.categoryId ? req.body.categoryId.trim() : "";

    if (
      type == "" ||
      vendor == "" ||
      amount == "" ||
      date == "" ||
      name == ""
    ) {
      return res.status(422).json({
        status: 422,
        msg: "Type, Name, Vendor, Amount and Date are required...",
      });
    }

    const account = await CheckingAccount.findOne({ userId: req.user._id });
    const newTransaction = new Transaction({
      transaction_type: type,
      merchant_name: vendor,
      category,
      category_id,
      amount,
      date,
      name,
      account_id: account._id,
    });
    await newTransaction.save();

    res.status(200).json({
      status: 200,
      msg: "Transaction added successfully...",
      transaction: newTransaction,
    });
  } catch (error) {
    console.log(`addtransaction_get error: ${error}`);
    res.status(500).json({ error });
  }
};
