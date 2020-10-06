const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

module.exports.sendPhoneVerificationSMS = (number, verificationCode) => {
  const smsBody = `OME\nYour verification code is: ${verificationCode}`;
  client.messages
    .create({
        body: smsBody,
        from: process.env.TWILIO_FROM_NUMBER,
        to: number
      })
    .then(message => {
      console.log(`Twilio Message Sent to ${number} with SID: ${message.sid}`);
    })
    .catch(error => {
      console.log(`Twilio Message Send Error: ${error}`)
    })
}

module.exports.sendInvitation = (number, userName, transactionName, amount) => {
  const smsBody = `OME\n${userName} has sent you a reimbursement of amount ${amount} against transaction ${transactionName}. Please download OME from the link below to signup.`;
  client.messages
    .create({
        body: smsBody,
        from: process.env.TWILIO_FROM_NUMBER,
        to: number
      })
    .then(message => {
      console.log(`Twilio Message Sent to ${number} with SID: ${message.sid}`);
    })
    .catch(error => {
      console.log(`Twilio Message Send Error: ${error}`)
    })
}

module.exports.sendSMS = (number, smsBody) => {
  client.messages
    .create({
        body: smsBody,
        from: process.env.TWILIO_FROM_NUMBER,
        to: number
      })
    .then(message => {
      console.log(`Twilio Message Sent to ${number} with SID: ${message.sid}`);
    })
    .catch(error => {
      console.log(`Twilio Message Send Error: ${error}`)
    })
}
