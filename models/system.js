const mongoose = require('mongoose');
const moment = require('moment-timezone');
const _ = require('lodash');
var SystemSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "systemArg",
    unique: true
  },
  carousel: [{
    imgPath: {
      type: String
    }
  }],
  successSignup: {
    type: String
  },
  successCreate: {
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

SystemSchema.methods.pushGamePath = function (gamePath) {
  var system = this;
  console.log(system);
  return system.update({$set: {gamePath}})
}

var System = mongoose.model('System',SystemSchema)

module.exports = {System}
