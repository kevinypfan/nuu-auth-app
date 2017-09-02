const express = require('express');
const _ = require('lodash');
const {Team} = require('../models/team.js');
const {Point} = require('../models/point.js');
const {ObjectID} = require('mongodb')
const {authenticate} = require('../middleware/authenticate.js')
const {verifyRole} = require('../middleware/authenticate.js')

var {storage, upload} = require('../modules/multerStorage.js')
var teamRouter = express.Router();

teamRouter.patch('/updatePDF', authenticate, upload, (req, res) => {
  var teamData = JSON.parse(req.body.teamData)
  var pathRegexp = new RegExp("\/uploads.*");
  var planPath = req.files[0].destination.match(pathRegexp)[0]+'/'+req.files[0].filename;
  Team.findOne({_id: teamData._id}).then((team) => {
    return team.planUpdate(planPath)
  }).then((team) => {
    res.send(team)
  }).catch((e) => {
    res.status(403).send(e)
  })
})
//更新mp4
teamRouter.patch('/updateMP4', authenticate, upload, (req, res) => {
  var teamData = JSON.parse(req.body.teamData)
  var pathRegexp = new RegExp("\/uploads.*");
  var mp4Path = req.files[0].destination.match(pathRegexp)[0]+'/'+req.files[0].filename;
  Team.findOne({_id: teamData._id}).then((team) => {
    return team.ma4Update(mp4Path)
  }).then((team) => {
    res.send(team)
  }).catch((e) => {
    res.status(403).send(e)
  })
})

//建立隊伍(新)
teamRouter.post('/creatTeam', authenticate, upload, function (req, res) {
  var body = JSON.parse(req.body.teamData)
  var teamData =  _.pick(body,['teamName','title','registers','qualification','teacher', 'leader'])
  var videoObj = req.files.filter((v)=>{
    return v.mimetype == 'video/mp4'
  })
  var planObj = req.files.filter((p)=>{
    return p.mimetype == 'application/pdf'
  })
  console.log(req.files);
  var pathRegexp = new RegExp("\/uploads.*");
  var videoPath = videoObj[0].destination.match(pathRegexp)[0]
  var planPath = planObj[0].destination.match(pathRegexp)[0]
  teamData.video = `${videoPath}/${videoObj[0].filename}`;
  teamData.plan = `${planPath}/${planObj[0].filename}`;
  var team = new Team(teamData)
  team.save().then((result)=>{
    var point = new Point({_teamId: result._id})
    return point.save()
  }).then(() => {
    res.send(team)
  }).catch((e)=>{
    res.status(403).send(e)
  })
})

module.exports = teamRouter;