const mongoose = require('mongoose');
const _ = require('lodash');

var TeamSchema = new mongoose.Schema({
  teamName: {
    type: String,
    trim: true,
    minlength: 1,
    unique: true,
    required: true
  },
  title: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true
  },
  teacher: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  registers: {
    type: Array,
    required: true
  },
  qualification: {
    type: Boolean,
    required: true
  },
  plan: {
    type: String,
    required: true,
    trim: true
  },
  video: {
    type: String,
    required: true,
    trim: true
  }
})

var Team = mongoose.model('Team', TeamSchema)
module.exports = {Team}
