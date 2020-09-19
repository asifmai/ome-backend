const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const AccountSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  name: {
    type: String,
    required: true,
  },
  bank: {
    type: String,
  },
  bankId: {
    type: String,
  },
  token: {
    type: String,
  },
  account_id: {
    type: String,
  },
  subtype: {
    type: String,
  },
  type: {
    type: String,
  },
  access_token: {
    type: String,
  },
  item_id: {
    type: String,
  },
});
module.exports = Card = mongoose.model("checkingAccount", AccountSchema);
