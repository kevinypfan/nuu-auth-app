const express = require('express');
const _ = require('lodash');
const {User} = require('../models/user.js');
const {ObjectID} = require('mongodb')
const {authenticate} = require('../middleware/authenticate.js')
const {verifyRole} = require('../middleware/authenticate.js')
const {verifyJuror} = require('../middleware/authenticate.js')

var userRouter = express.Router();

userRouter.patch('/updatePassword', authenticate, (req, res) => {
  var body = req.body
  User.findOne({email: req.user.email})
  .then((user) => {
    return user.updatePassword(body.oldPassword, body.newPassword)
  }).then((user) => {
    console.log(user);
    return user.save()
  }).then((user) => {
    res.send(user)
  }).catch((err) => {
    res.status(403).send(err)
  })
})


//註冊
userRouter.post('/signup',(req, res) => {
  var body = _.pick(req.body, ['email', 'password', 'name', 'phone', 'studentId', 'department', 'lineId', 'roleId'])
  body.time = new Date().toString();
  var user = new User(body);
  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('authToken', token).send();
  }).catch((e) => {
    res.status(400).send(e);
  })
});

//登入OK
userRouter.post('/signin', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken()
    .then((token) => {
      res.header('authToken', token).send();
    })
  }).catch((e) => {
    res.status(403).send(e);
  })
})

//評審登入用
userRouter.post('/jurorSignin', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  User.findByJuror(body.email, body.password).then((user) => {
    return user.generateAuthToken()
    .then((token) => {
      res.header('authToken', token).send();
    })
  }).catch((e) => {
    res.status(403).send("查無此評審");
  })
})



userRouter.get('/me', authenticate, (req, res) => {
  var user = req.user
  var objUser = user.toJson()
  res.send(objUser);
})
//測試驗證用
userRouter.get('/meverfy', verifyJuror, (req, res) => {
  var user = req.user
  var objUser = user.toJson()
  res.send(objUser);
})

userRouter.delete('/logout', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(()=>{
    res.status(200).send();
  }).catch(() => {
    res.status(400).send();
  })
})

userRouter.patch('/userUpdata', authenticate, (req, res) => {
  var body = _.pick(req.body, ['name','phone','studentId','department','lineId'])
  var token = req.token
  User.findByToken(token).then(user => {
    return user.userUpdata(body)
  }).then((user) => {
    res.send("更改成功");
  }).catch((e) => {
    res.status(403).send();
  })
})

userRouter.get('/role/:email', (req, res) => {
  var email = req.params.email;
  User.findOne({email}).then((user) => {
    res.send({roleId: user.roleId,name: user.name})
  }).catch((e)=>{
    res.status(403).send();
  })
})

module.exports = userRouter;
