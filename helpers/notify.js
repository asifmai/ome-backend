const twilio = require('./twilio');
const mailer = require('./mailer')

module.exports.sendSMS = (body = '', number) => {
  try {
    if (body != '') {
      if (number != '') {
        twilio.sendSMS(number, body);
      }
    } else {
      console.log(`sendSMS: Body found...`);
    }

  } catch (error) {
    console.log(`sendSMS Error: ${error}`);
  }
}

module.exports.sendEmail = (subject = '', body = '', email) => {
  try {
    if (body != '' && subject != '') {
      if (email != '') {
        mailer.sendEmail(email, subject, body);
      }
    } else {
      console.log(`sendEmail: Subject or Body found...`);
    }

  } catch (error) {
    console.log(`sendEmail Error: ${error}`);
  }
}