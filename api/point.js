const express = require('express');
const _ = require('lodash');
const {Point} = require('../models/point.js');
const {authenticate} = require('../middleware/authenticate.js')
const {ObjectID} = require('mongodb')

var pointRouter = express.Router();

pointRouter.get('/jurorGrade', authenticate, (req, res) => {
  var _jurorId = req.user._id
  Point.find()
    .populate({
        path: '_teamId',
        select: ['teamName','teacher','registers','video', 'plan','qualification','leader','title']
      })
    .populate({
        path: 'points._jurorId',
        select: ['email','name','phone','studentId','department','lineId','roleId']
      })
    .then((result) => {
      console.log(JSON.stringify(result,null,1));
      return result.map((r) => {
        r.points = r.points.filter((a) => {
          return a._jurorId._id.toHexString() == _jurorId
        })
        return r
      })
    }).then((result) => {
      res.send(result)
    }).catch((e) => {
      res.status(403).send(e)
    })
})


pointRouter.post('/grade', authenticate, (req, res) => {
  if (req.user.roleId !== "juror") {
    res.status(402).send("你不是裁判")
  } else {
    var body = _.pick(req.body, ['score1', 'comment']);
    var _teamId = req.body.teamId
    Point.findOne({_teamId}).then((point) => {
      return point.checkFirst(req.user._id)
    }).then((point) => {
      return point.grade(body, req.user._id)
    }).then((point)=>{
      res.send(point)
    }).catch((e) => {
      res.status(403).send(e)
    })
  }
})

//第二次評分
pointRouter.patch('/grade', authenticate, (req, res) => {
  if (req.user.roleId !== "juror") {
    res.status(402).send("你不是裁判")
  } else {
    var body = _.pick(req.body, ['score1', 'comment']);
    var _teamId = req.body.teamId
    Point.findOne({_teamId}).then((point) => {
      return point.checkFirst(req.user._id)
    }).then((point) => {
      return point.grade(body, req.user._id)
    }).then((point)=>{
      res.send(point)
    }).catch((e) => {
      res.status(403).send(e)
    })
  }
})

pointRouter.get('/noGrade', authenticate, (req, res) => {
  var _jurorId = req.user._id
  Point.find({'points._jurorId':{$ne: _jurorId}})
  .populate({
      path: '_teamId',
      select: ['teamName','teacher','registers','video', 'plan','qualification','leader']
    })
  .populate({
      path: 'points._jurorId',
      select: ['email','name','phone','studentId','department','lineId','roleId']
    }).then((result) => {
    if (result.length == 0) {
      res.status(403).send("您都評過分數囉！")
    } else {
      console.log(result);
      var data = result.map(m => {
        m.points = []
        return m
      })
      res.send(data)
    }
  },(e) => {
    res.status(403).send("err")
  })
})

pointRouter.get('/haveGrade', authenticate, (req, res) => {
  var _jurorId = req.user._id
  Point.find({'points':{$elemMatch: {_jurorId}}})
  .populate({
      path: '_teamId',
      select: ['teamName','teacher','registers','video', 'plan','qualification','leader']
    })
  .populate({
      path: 'points._jurorId',
      select: ['email','name','phone','studentId','department','lineId','roleId']
    }).then((result) => {
    if (result.length == 0) {
      res.status(403).send("您還沒評過分數喔！")
    } else {
      var data = result.map((r) => {
        r.points = r.points.filter((a) => {
          return a._jurorId._id.toHexString() == _jurorId
        })
        return r
      })
      res.send(data)
    }
  })
})

pointRouter.patch('/updateGrade', authenticate, (req, res) => {
  var _jurorId = req.user._id
  var body = _.pick(req.body, ['newScore1', 'newComment']);
  var _teamId = req.body.teamId

  Point.findOneAndUpdate({_teamId,'points._jurorId':_jurorId}, {$set: {'points.$.score1': body.newScore1, 'points.$.comment': body.newComment}}).then(() => {
    return Point.findOne({_teamId,'points._jurorId':_jurorId})
  }).then((result) => {
    res.send(result)
  }).catch((e) => {
    res.status(403).send(e)
  })
})

module.exports = pointRouter;
