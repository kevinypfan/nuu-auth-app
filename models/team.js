const mongoose = require('mongoose');
const _ = require('lodash');

var TeamSchema = new mongoose.Schema({
  teamName: {
    type: String,
    trim: true,
    minlength: 1,
    unique: true,
    required: true
  },
  title: {
    type: String,
    required: true,
    minlength: 1,
    // unique: true,
    trim: true
  },
  teacher: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  leader: {
    name: {
      type: String,
      trim: true,
      required: true
    },
    email: {
      type: String,
      trim: true,
      required: true
    }
  },
  registers: [{
    name: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true
    }
  }],
  qualification: {
    type: Boolean,
    default: false
  },
  plan: {
    type: String,
    required: true,
    trim: true
  },
  video: {
    type: String,
    required: true,
    trim: true
  }
})

TeamSchema.methods.planUpdate = function (payload) {
  var team = this;
  return team.update({ $set: {
    plan: payload
  }})
}
TeamSchema.methods.ma4Update = function (payload) {
  var team = this;
  return team.update({ $set: {
    video: payload
  }})
}
var Team = mongoose.model('Team', TeamSchema)
module.exports = {Team}
