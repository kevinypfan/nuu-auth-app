const express = require('express');
const _ = require('lodash');
const {Team} = require('../models/team.js');
const {Point} = require('../models/point.js');
const {System} = require('../models/system.js');
const {ObjectID} = require('mongodb')
const {authenticate} = require('../middleware/authenticate.js')
const {verifyRole} = require('../middleware/authenticate.js')
var { successCreateMail, sendEmail } = require('../modules/mailerMod.js')

var {storage, upload} = require('../modules/multerStorage.js')
var teamRouter = express.Router();

var options = {
  // 是否顯示被隱藏的細節
  showHidden: true,
  // 是否著色
  colors: true,
  // 在該物件中遞迴向下檢查的層數
  // depth: 1,
};

teamRouter.patch('/updatePDF', authenticate, upload, (req, res) => {
  var teamData = JSON.parse(req.body.teamData)
  var pathRegexp = new RegExp("\/uploads.*");
  var planPath = req.files[0].destination.match(pathRegexp)[0]+'/'+req.files[0].filename;

  Team.findOne({_id: teamData._id}).then((team) => {
    console.log(team);
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

teamRouter.get('/getUsableTeam', (req,res) => {
  Team.find().then((result)=>{
    var data = result.filter((r) => {
      return !r.qualification
    })
    res.send(data)
  }).catch((e)=>{
    res.status(403).send(e)
  })
})

teamRouter.get('/getAllTeam',verifyRole,(req,res)=>{
    Team.find().then((result)=>{
      res.send(result)
    }).catch((e)=>{
      res.status(403).send(e)
    })
})

teamRouter.patch('/setQualification', verifyRole, (req, res) => {
    var qualification = req.body.qualification
  Team.findOneAndUpdate({_id: req.body._teamId},{$set:{qualification}})
    .then((result) => {
      res.send(qualification)
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
  var pathRegexp = new RegExp("\/uploads.*");
  var videoPath = videoObj[0].destination.match(pathRegexp)[0]
  var planPath = planObj[0].destination.match(pathRegexp)[0]
  teamData.video = `${videoPath}/${videoObj[0].filename}`;
  teamData.plan = `${planPath}/${planObj[0].filename}`;
  var team = new Team(teamData)
  team.save().then((result)=>{
    var point = new Point({_teamId: result._id})
    return point.save()
  }).then((result) => {
    return System.findOne({'name':"systemArg"})
  }).then((system) => {
    successCreateMail.to = teamData.leader.email
    successCreateMail.html = system.successCreate
    sendEmail(successCreateMail)
    res.send("報名成功")
  }).catch((e)=>{
    res.status(403).send(e)
  })
})

module.exports = teamRouter;
