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
