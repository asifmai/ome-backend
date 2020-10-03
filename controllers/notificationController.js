const Notification = require('../models/Notification');

module.exports.notifications_get = async (req, res) => {
  try {
    const notifications = await Notification.findOne({userId: req.user._id});
    
    res.status(200).json({status: 200, data: notifications});
  } catch (error) {
    console.log(`notifications_get error: ${error}`);
    res.status(500).json({error});
  }
}

module.exports.notifications_post = async (req, res) => {
  try {
    const group_addsMe = req.body.group_addsMe ? req.body.group_addsMe.trim() : '';
    const group_addsExp = req.body.group_addsExp ? req.body.group_addsExp.trim() : '';
    const group_paysMe = req.body.group_paysMe ? req.body.group_paysMe.trim() : '';
    const tr_dailySpend = req.body.tr_dailySpend ? req.body.tr_dailySpend.trim() : '';
    const tr_weeklySpend = req.body.tr_weeklySpend ? req.body.tr_weeklySpend.trim() : '';

    if (group_addsMe == '' || group_addsExp == '' || group_paysMe == '' || tr_dailySpend == '' || tr_weeklySpend == '') {
      return res.status(422).json({ status: 422, msg: 'group_addsMe, group_addsExp, group_paysMe, tr_dailySpend and tr_weeklySpend are required...'});
    }

    const foundNotification = await Notification.findOne({userId: req.user._id});
    
    if (foundNotification) {
      await Notification.findByIdAndUpdate(foundNotification._id, {
        group_addsExp, group_addsMe, group_paysMe, tr_dailySpend, tr_weeklySpend
      });

      res.status(200).json({status: 200, data: 'Notifications for user updated successfully'});
    } else {
      const newNotification = new Notification({
        userId: req.user._id,
        group_addsExp,
        group_addsMe,
        group_paysMe,
        tr_dailySpend,
        tr_weeklySpend,
      });
      await newNotification.save();
      
      res.status(200).json({status: 200, data: 'Notifications for user created successfully'});
    }
    
  } catch (error) {
    console.log(`notifications_get error: ${error}`);
    res.status(500).json({error});
  }
}