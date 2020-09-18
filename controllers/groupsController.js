const Group = require('../models/group');

module.exports.create_group_post = async (req, res) => {
  try {
    const userId = req.user._id;
    const group = req.body;

    const newGroup = new Group({userId, ...group});
    await newGroup.save();
  
    res.status(200).json({status: 'success', msg: 'Group created successfully'});
  } catch (error) {
    console.log(`Create Group Error: ${error}`);
    res.status(500).json({error});
  }
}

module.exports.groups_get = async (req, res) => {
  try {
    const userId = req.user._id;

    const groups = await Group.find({userId});
  
    res.status(200).json({status: 'success', data: groups});
  } catch (error) {
    console.log(`Create Group Error: ${error}`);
    res.status(500).json({error});
  }
}

module.exports.delete_group_get = async (req, res) => {
  try {
    const groupId = req.params.groupid;

    await Group.findByIdAndDelete(groupId);

    res.status(200).json({status: 'success', msg: 'Group deleted successfully'});
  } catch (error) {
    console.log(`Create Group Error: ${error}`);
    res.status(500).json({error});
  }
}

module.exports.update_group_post = async (req, res) => {
  try {
    const groupId = req.body.groupId;
    const data = req.body.data;
    console.log(data);

    await Group.findByIdAndUpdate(groupId, data);

    res.status(200).json({status: 'success', msg: 'Group Updated successfully'});
  } catch (error) {
    console.log(`Create Group Error: ${error}`);
    res.status(500).json({error});
  }
}