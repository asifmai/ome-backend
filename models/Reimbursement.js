const mongoose = require("mongoose");

const ReimbursementSchema = new mongoose.Schema({
  transactionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "transaction",
  },
  name: String, // This will come in in request
  phone: String,
  amount: Number,
  completed: {
    type: Boolean,
    default: false,
  }, // The user can change it
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "group",
  },
});

module.exports = mongoose.model("reimbursement", ReimbursementSchema);
