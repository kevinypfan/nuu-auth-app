const {verifyRole} = require('../middleware/authenticate.js')
const express = require('express');
const _ = require('lodash');
const {System} = require('../models/system.js');
const { storage, uploadSingle } = require('../modules/gameUploadStorege.js')

var systemRouter = express.Router();


systemRouter.post('/successCreate', verifyRole, (req, res) => {
  var successCreate = req.body.successCreate
  System.findOneAndUpdate({'name':"systemArg"},{
    $set: { successCreate }
  }).then((result)=>{
    res.send("成功更新或修改")
  }).catch((e)=>{
      res.status(404).send("取得失敗");
  })
})

systemRouter.post('/successSignup', verifyRole, (req, res) => {
  var successSignup = req.body.successSignup
  System.findOneAndUpdate({'name':'systemArg'}, {
    $set: { successSignup }
  }).then((result)=>{
    res.send("成功更新或修改")
  }).catch((e)=>{
    res.status(403).send("取得失敗");
  })
})

systemRouter.post('/uploadGameFile', verifyRole, uploadSingle, (req, res) => {
  var pathRegexp = new RegExp("\/gameUploads.*");
  var gamePath = req.file.destination.match(pathRegexp)[0]+'/'+req.file.filename;
  System.findOne({name: "systemArg"}).then((system) => {
    var system = new System(system);
    return system.pushGamePath(gamePath)
  }).then(() => {
    res.send("新增或更新成功")
  }).catch((e) => {
    res.status(403).send("失敗")
  })
})


systemRouter.post('/sysArgument',verifyRole,(req,res)=>{
  var body = _.pick(req.body,['gameTitle','email','score1Percent','score2Percent','registrationStart','registrationEnd','firstTrialStart','finalTrialStart'])

  var systems = new System(body)
  systems.save().then(()=>{
    res.send(systems)
  }).catch((e)=>{
    res.status(401).send(e)
  })
})

systemRouter.get('/getArg',verifyRole,(req,res)=>{
  System.find({'name':"systemArg"}).then((result)=>{
    console.log(result);
    if(result == null){
      res.status(404).send("取得失敗")
    }
    else {
      res.send(result)
    }
  })
})

systemRouter.patch('/updateArg', verifyRole, (req, res) => {
    var body =_.pick(req.body,['gameTitle','email','score1Percent','score2Percent','registrationStart','registrationEnd','firstTrialStart','finalTrialStart'])
    console.log(body)
    var {gameTitle,email,score1Percent,score2Percent,registrationStart,registrationEnd,firstTrialStart,finalTrialStart} = body
    System.findOneAndUpdate({'name':"systemArg"},{
      $set:{
      gameTitle,email,score1Percent,score2Percent,registrationStart,registrationEnd,firstTrialStart,finalTrialStart
    }
    }).then(()=>{
      res.send(body)
    }).catch((e)=>{
        res.status(404).send("取得失敗");
      })
})


module.exports = systemRouter;
