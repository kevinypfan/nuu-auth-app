const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const {User} = require('./models/user.js');
const {Team} = require('./models/team.js');
const {Post} = require('./models/post.js')
const {Point} = require('./models/point.js')
const {System} = require('./models/system.js');

const moment = require('moment');

var userRouter = require('./api/user.js')
var postRouter = require('./api/post.js')
var teamRouter = require('./api/team.js')
var pointRouter = require('./api/point.js')
var systemRouter = require('./api/system.js')

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/NuuGBrain', { useMongoClient: true });

var app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname))

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('/uploads', express.static('uploads'));
app.use('/api/user', userRouter)
app.use('/api/post', postRouter)
app.use('/api/team', teamRouter)
app.use('/api/point', pointRouter)
app.use('/api/system', systemRouter)


// app.all('/*', function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
//   res.header('Access-Control-Allow-Credentials', true);
//   next();
// });
//找陣列裡東西
app.get('/test', (req, res) => {
  Team.findOne({"registers":{$elemMatch:{"email" : "isdbfiusdfub@yahoo.com.tw"}}}).then((result)=>{
    res.send(result)
  })
})

app.get('/test3', (req, res) => {
  Point.find().populate('_teamId').then((result) => {
    res.send(result)
  })
})

app.get('/test4', (req, res) => {
  Point.find({ 'points.name': { $ne : 'May'}})
  .then((result) => {
    res.send(result)
  })
})

app.get('/test2', (req, res) => {
  res.send(req.headers.host)
})
//寄郵件
app.post('/sendMail',(req,res)=>{
  var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'uranoni777@gmail.com',
    pass: 'lucky909075'
  }
});

var mailOptions = {
  from: 'uranoni777@gmail.com',
  to: 'kg650034@gmail.com',
  subject: 'HI~哲歌 using Node.js',
  html:'<h1>wwwwwwwwwwwwwwwwwwwwwwwwww</h1><br><h1>wwwwwwwwwwwwwwwwwwwwwwwwww</h1>'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
    res.status(200).send("OK")
  }
});
})


app.listen(3000, () => {
  var date = Date.now()
  console.log( `[${moment(date).format("YYYY-MM-DD HH:MM:SS")}]--> start up post 3000` );
})
