const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  name: String,
  image: {
    type: String,
    default: '',
  },
  members: [
    {
      name: String,
      phone: String,
      image: {
        type: String,
        default: '',
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      }
    }
  ],
  transactions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'transaction'
    }
  ],
  createdAt: {
    type: Date,
    default: new Date,
  }
});

module.exports = mongoose.model('group', GroupSchema);
