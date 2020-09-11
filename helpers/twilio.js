const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

module.exports.sendSMS = (number, body) => {
  client.messages
    .create({
        body: body,
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
