require('./config/config.js')

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const moment = require('moment');

const {User} = require('./models/user.js');
const {Team} = require('./models/team.js');
const {Post} = require('./models/post.js')
const {Point} = require('./models/point.js')
const {System} = require('./models/system.js');

var userRouter = require('./api/user.js')
var postRouter = require('./api/post.js')
var teamRouter = require('./api/team.js')
var pointRouter = require('./api/point.js')
var systemRouter = require('./api/system.js')

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URL, { useMongoClient: true });

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


app.listen(process.env.PORT, () => {
  var date = Date.now()
  console.log( `[${moment(date).format("YYYY-MM-DD HH:MM:SS")}]--> start up post ${process.env.PORT}` );
})
