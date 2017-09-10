const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
})

var successSignupMail = {
  from: process.env.GMAIL_USER,
  subject: '聯合大學金頭腦成功註冊通知信'
};

var successCreateMail = {
from: process.env.GMAIL_USER,
subject: '聯合大學金頭腦建立隊伍通知信'
};

var forgotPasswordMail = {
  from: process.env.GMAIL_USER,
  subject: '聯合大學金頭腦忘記密碼通知信'
}

var updatePasswordMail = {
  from: process.env.GMAIL_USER,
  subject: '聯合大學金頭腦密碼已更改通知信'
}

var sendEmail = function (payload) {
 transporter.sendMail(payload, function(error, info){
    if (error) {
      console.log("send mail fail")
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

var sendEmailPromise = function (payload) {
   return new Promise((resolve, reject) => {
     transporter.sendMail(payload, function(error, info){
        if (error) {
          reject(error)
        } else {
          console.log('Email sent: ' + info.response);
          resolve(info)
        }
      });
   })
}

module.exports = { transporter, successSignupMail, successCreateMail, sendEmail, forgotPasswordMail, updatePasswordMail, sendEmailPromise}
