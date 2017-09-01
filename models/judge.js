const mongoose = require('mongoose');
const {ObjectID} = require('mongodb');
const {Team} = require('./team.js');


var JudgeSchema = new mongoose.Schema({
  _judgeId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  firstTrialDate: {
    type: String
  },
  reviewTrialDate: {
    type: String
  },
  teamDecides: [{
    _teamId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Team'
    },
    firstTrial: {
      type: Number
    },
    reviewTrial: {
      type: Number
    },
    judgeComment: {
      type: String
    }
  }]
})

JudgeSchema.methods.judgeDecide = function (teamDecide) {
  var judge = this;
  // console.log(judge);
  var {_teamId,firstTrial,reviewTrial,judgeComment} = teamDecide
  judge.teamDecides.push({_teamId,firstTrial,reviewTrial,judgeComment})
  return judge.save();
}

var Judge = mongoose.model('Judge', JudgeSchema);

module.exports = {Judge}
