const mongoose = require('mongoose');
const _ = require('lodash');
const validator = require('validator');
const moment = require('moment-timezone');
var PostSchema = new mongoose.Schema({
  PostId: {
    type: Number,
    unique: true,
  },
  title: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,

  },
  author: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  content: {
    type: String,
    required: true
  },

  time: {
    type: String,
    default: moment().tz("Asia/Taipei")
  }
})

var Post = mongoose.model('Post', PostSchema)
// console.log(Team);
module.exports = {Post}
