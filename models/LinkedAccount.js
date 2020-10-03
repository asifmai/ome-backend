const mongoose = require('mongoose');

const LinkedAccountSchema = new mongoose.Schema({
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'checkingAccount',
  },
  mask: String,
  name: String,
  official_name: String,
  subtype: String,
  type: String,
  balance: Number,
  notification: String,
});

module.exports = mongoose.model('LinkedAccount', LinkedAccountSchema);
