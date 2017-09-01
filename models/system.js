const mongoose = require('mongoose');

var SystemSchema = new mongoose.Schema({
  carousel: [
    imgPath: {
      type: String
    }
  ],
  successMail: {
    type: String
  },
  failMail: {
    type: String
  },
  gameTitle: {
    type: String
  },
  registrationStart: {
    type: String
  },
  registrationEnd: {
    type: String
  },
  firstTrialStart: {
    type: String
  },
  finalTrialStart: {
    type: String
  }
})
// EMAIL
// 初審權重
// 複審權重
// 比賽辦法path

var System = mongoose.model('System',SystemSchema)

module.exports = {
  System
}
