const mongoose = require('mongoose');
const moment = require('moment-timezone');
const _ = require('lodash');
var SystemSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "systemArg"
  },
  carousel: [{
    imgPath: {
      type: String
    }
  }],
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
  },
  score1Percent: {
    type: Number
  },
  score2Percent: {
    type: Number
  },
  gamePath: {
    type: String
  },
  email: {
    type: String
  }
})




var System = mongoose.model('System',SystemSchema)

module.exports = {System}
