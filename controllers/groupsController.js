const Group = require("../models/group");
const User = require("../models/user");
const Transaction = require("../models/Transaction");
const twilio = require("../helpers/twilio");

module.exports.create_group_post = async (req, res) => {
  try {
    const userId = req.user._id;
    const group = req.body;
    const members = group.members;

    for (let i = 0; i < members.length; i++) {
      members[i].user = null;
      const foundUser = await User.findOne({ phone: members[i].phone });
      if (foundUser) {
        if (foundUser.phone == req.user.phone) {
          return res.status(422).json({
            status: 422,
            msg: "You cannot add yourself as a group member",
          });
        }
        members[i].user = foundUser._id;
      } else {
        const smsBody = `OME\n${req.user.profile.firstName} has added you to a group. Please download OME from the link below to signup.`;
        twilio.sendSMS(members[i].phone, smsBody);
      }
    }

    const newGroup = new Group({ userId, ...group });
    await newGroup.save();

    res.status(200).json({
      status: "success",
      msg: "Group created successfully",
      group: newGroup,
    });
  } catch (error) {
    console.log(`Create Group Error: ${error}`);
    res.status(500).json({ error });
  }
};

module.exports.groups_get = async (req, res) => {
  try {
    const userId = req.user._id;

    let groups = await Group.find({ userId })
      .populate({
        path: "members transactions",
        populate: {
          path: "user",
          select:
            "-password -verificationCode -createdAt -updatedAt -salt -verified",
        },
      })
      .exec();

    res.status(200).json({ status: "success", data: groups });
  } catch (error) {
    console.log(`Create Group Error: ${error}`);
    res.status(500).json({ error });
  }
};

module.exports.delete_group_get = async (req, res) => {
  try {
    const groupId = req.params.groupid;

    await Group.findByIdAndDelete(groupId);

    res
      .status(200)
      .json({ status: "success", msg: "Group deleted successfully" });
  } catch (error) {
    console.log(`Create Group Error: ${error}`);
    res.status(500).json({ error });
  }
};

module.exports.update_group_post = async (req, res) => {
  try {
    const groupId = req.body.groupId;
    const group = req.body.data;
    const members = group.members;

    for (let i = 0; i < members.length; i++) {
      members[i].user = null;
      const foundUser = await User.findOne({
        verified: true,
        phone: members[i].phone,
      });
      if (foundUser) {
        if (foundUser.phone == req.user.phone)
          return res.status(422).json({
            status: 422,
            msg: "You cannot add yourself as a group member",
          });
        members[i].user = foundUser._id;
      } else {
        const smsBody = `OME\n${req.user.profile.firstName} has added you to a group. Please download OME from the link below to signup.`;
        twilio.sendSMS(members[i].phone, smsBody);
      }
    }

    const updatedGroup = await Group.findByIdAndUpdate(groupId, group);

    res.status(200).json({
      status: "success",
      msg: "Group Updated successfully",
      group: updatedGroup,
    });
  } catch (error) {
    console.log(`Create Group Error: ${error}`);
    res.status(500).json({ error });
  }
};

module.exports.add_transaction_post = async (req, res) => {
  try {
    const groupId = req.body.groupId;
    const transactionId = req.body.transactionId;

    const foundGroup = await Group.findById(groupId);
    const foundTransaction = await Transaction.findById(transactionId);

    // if (!foundGroup)
    //   return res.status(422).json({ status: 422, msg: "Group not found" });
    // if (!foundTransaction)
    //   return res
    //     .status(422)
    //     .json({ status: 422, msg: "Transaction not found" });

    const transactions = foundGroup.transactions;
    // if (transactions.some((tr) => tr == transactionId))
    //   return res.status(422).json({
    //     status: 422,
    //     msg: "Transaction is already added to the group",
    //   });
    transactions.push(transactionId);

    await Group.findByIdAndUpdate(groupId, {
      transactions,
    });

    let group = await Group.findOne({ _id: groupId }).populate("transactions");
    res.status(200).json({
      status: "success",
      msg: "Transaction Added to Group successfully",
      group: group,
    });
  } catch (error) {
    console.log(`Add Transaction to Group Error: ${error}`);
    res.status(500).json({ error });
  }
};
