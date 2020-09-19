const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  amount: Number,
  category: [String],
  category_id: String,
  date: String,
  iso_currency_code: String,
  merchant_name: String,
  name: String,
  payment_channel: String,
  pending: Boolean,
  transaction_id: String,
  transaction_type: String,
  account_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'checkingaccount'
  }
});

module.exports = mongoose.model('transaction', TransactionSchema);