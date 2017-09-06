const {verifyRole} = require('../middleware/authenticate.js')
const express = require('express');
const _ = require('lodash');
const {System} = require('../models/system.js');

var systemRouter = express.Router();

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
