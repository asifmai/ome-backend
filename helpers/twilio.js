const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

module.exports.sendPhoneVerificationSMS = (number, verificationCode) => {
  const phone = '+1' + number;
  const smsBody = `OME\nYour verification code is: ${verificationCode}`;
  client.messages
    .create({
        body: smsBody,
        from: process.env.TWILIO_FROM_NUMBER,
        to: phone
      })
    .then(message => {
      console.log(`Twilio Message Sent to ${phone} with SID: ${message.sid}`);
    })
    .catch(error => {
      console.log(`Twilio Message Send Error: ${error}`)
    })
}

module.exports.sendInvitation = (number, userName, transactionName, amount) => {
  const phone = '+1' + number;
  const smsBody = `OME\n${userName} has sent you a reimbursement of amount ${amount} against transaction ${transactionName}. Please download OME from the link below to signup.`;
  client.messages
    .create({
        body: smsBody,
        from: process.env.TWILIO_FROM_NUMBER,
        to: phone
      })
    .then(message => {
      console.log(`Twilio Message Sent to ${phone} with SID: ${message.sid}`);
    })
    .catch(error => {
      console.log(`Twilio Message Send Error: ${error}`)
    })
}

module.exports.sendSMS = (number, smsBody) => {
  const phone = '+1' + number;
  client.messages
    .create({
        body: smsBody,
        from: process.env.TWILIO_FROM_NUMBER,
        to: phone
      })
    .then(message => {
      console.log(`Twilio Message Sent to ${phone} with SID: ${message.sid}`);
    })
    .catch(error => {
      console.log(`Twilio Message Send Error: ${error}`)
    })
}
