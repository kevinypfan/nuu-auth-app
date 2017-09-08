const nodemailer = require('nodemailer');


var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'nuuGbrainDev@gmail.com',
    pass: 'nuuPWD123'
  }
})

var successSignup = {
  from: 'nuuGbrainDev@gmail.com',
  subject: '聯合大學金頭腦成功註冊通知信'
};

var successCreate = {
from: 'nuuGbrainDev@gmail.com',
subject: '聯合大學金頭腦建立隊伍通知信'
};


var forgotPassword = {
  from: 'nuuGbrainDev@gmail.com',
  subject: '聯合大學金頭腦忘記密碼通知信'
}

var sendEmail = function (payload) {
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


module.exports = { transporter, successSignup, successCreate, sendEmail, forgotPassword}
