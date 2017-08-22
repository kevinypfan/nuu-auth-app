const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const {User} = require('./models/user.js');
const {Team} = require('./models/team.js');
const {Post} = require('./models/post.js')
const moment = require('moment-timezone');
const {ObjectID} = require('mongodb')
const {authenticate} = require('./middleware/authenticate.js')
const {verifyRole} = require('./middleware/authenticate.js')
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/NuuGBrain', { useMongoClient: true });


var app = express();
app.use(bodyParser.json());

//新建隊伍
app.post('/newTeam', authenticate, (req, res) => {
  var body = _.pick(req.body,['teamName','title','registers','qualification','video','plan','teacher'])
  var team = new Team(body)
  team.save().then(()=>{
    res.send(team)
  }).catch((e)=>{
    res.status(403).send(e)
  })
})
//建立文章
app.post('/newPost',verifyRole, (req, res) => {
   var author = req.user.name;
   console.log(author);
  var body = _.pick(req.body,['PostId','title','content','time'])
  var posts = new Post(body)
  posts.author=author;
  posts.save().then(()=>{
    res.send(posts)
  }).catch((e)=>{
    res.status(403).send(e)
  })
})

//註冊
app.post('/signup',(req, res) => {
  var body = _.pick(req.body, ['email', 'password', 'name', 'phone', 'studentId', 'department', 'lineId', 'roleId'])
  body.time = new Date().toString();
  var user = new User(body);
  user.save().then(() => {
    user.generateAuthToken();
  }).then((token) => {
    res.header('authToken', token).send();
  }).catch((e) => {
    res.status(400).send(e);
  })
});
//登入
app.post('/signin', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('authToken', token).send();
    }).catch(() => {
      res.status(403).send();
    })
  })
})

app.get('/me', authenticate, (req, res) => {
  var user = req.user
  var objUser = user.toJson()
  res.send(objUser);
})
//測試驗證用
app.get('/meverfy', verifyRole, (req, res) => {
  var user = req.user
  var objUser = user.toJson()
  res.send(objUser);
})

app.delete('/logout', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(()=>{
    res.status(200).send();
  }).catch(() => {
    res.status(400).send();
  })
});

app.patch('/userUpdata', authenticate, (req, res) => {
  var body = _.pick(req.body, ['name','phone','studentId','department','lineId'])
  var token = req.token
  User.findByToken(token).then(user => {
    return user.userUpdata(body)
  }).then((user) => {
    res.send();
  }).catch((e) => {
    res.status(403).send();
  })
})

app.get('/role/:email', (req, res) => {
  var email = req.params.email;
  User.findOne({email}).then((user) => {
    res.send({roleId: user.roleId,name: user.name})
  }).catch((e)=>{
    res.status(403).send();
  })
})

app.listen(3000, () => {
  var date = moment().tz("Asia/Taipei")

  //console.log('start up post 3000'+ date);
})
