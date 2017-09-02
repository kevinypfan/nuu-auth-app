const mongoose = require('mongoose');

var PointShema = new mongoose.Schema({
  _teamId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Team'
  },
  points: [{
    _jurorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Juror'
    },
    score1: {
      type: Number
    },
    score2: {
      type: Number
    },
    comment: {
      type: String
    }
  }]
})



var Point = mongoose.model('Point', PointShema)

module.exports = {Point}
