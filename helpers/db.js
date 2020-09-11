const mongoose = require('mongoose');
const config = require('../config/main');

module.exports = () => new Promise(async (resolve, reject) => {
  try {
    // Connect to MongoDB
    const db = await mongoose.connect(config.database, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    
    mongoose.set('debug', true);

    resolve(true);
  } catch (error) {
    console.log('MongoDB Connection Error: ', error);
    reject(error);
  }
});