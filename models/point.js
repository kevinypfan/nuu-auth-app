const mongoose = require('mongoose');
const {ObjectID} = require('mongodb')

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
      ref: 'User'
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

PointShema.methods.checkFirst = function (userId) {
  var point = this;
  return new Promise((resolve, reject) => {
    console.log(userId);
    var tmp = point.points.filter((p) => {
      console.log(p._jurorId);
      return p._jurorId.toHexString() == userId
    })

    if (tmp.length > 0) {
      reject("您已評過分了");
    } else {
      resolve(point);
    }
  })
}

PointShema.methods.grade = function (body, _jurorId) {
  var point = this;
  var {score1, comment} = body
  var tmp = { score1, comment, _jurorId }
  point.points.push(tmp)
  return point.save()
}

var Point = mongoose.model('Point', PointShema)

module.exports = {Point}
