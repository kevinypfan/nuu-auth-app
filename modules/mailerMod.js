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
  subject: '聯合大學金頭腦通知信'
};

var successCreate = {
from: 'nuuGbrainDev@gmail.com',
subject: '聯合大學金頭腦通知信'
};


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

// var mailOptions = {
//   from: 'uranoni777@gmail.com',
//   to: 'kg650034@gmail.com',
//   subject: 'HI~哲歌 using Node.js',
//   html:'<h1>wwwwwwwwwwwwwwwwwwwwwwwwww</h1><br><h1>wwwwwwwwwwwwwwwwwwwwwwwwww</h1>'
// };

// transporter.sendMail(mailOptions, function(error, info){
//     if (error) {
//       console.log(error);
//     } else {
//       console.log('Email sent: ' + info.response);
//       res.status(200).send("OK")
//     }
//   });


module.exports = { transporter, successSignup, successCreate, sendEmail}
