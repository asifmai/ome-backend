const nodemailer = require('nodemailer');

module.exports.sendEmail = async (email, subject, body) => {
  nodemailer.createTestAccount((err, account) => {
    if (err) {
      console.log(err);
    } else {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASSWORD,
        },
      });
  
      const mailOptions = {
        from: 'OME.com <appome15@gmail.com>',
        to: email,
        subject,
        html: generateEmailBody(body),
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log(`Email Sent to ${email}: %s`, info.response);
      });
    }
  });
};

function generateEmailBody (body) {
  return `<h1 style="text-align:center;margin-bottom:2em;">OME</h1><p>${body}</p>`;
}
