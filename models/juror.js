const mongoose = require('mongoose');
const validator = require('validator');


var JurorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: (value)=>{validator.isEmail(value)},
      message: '{VALUE} 不是合法的信箱'
    }
  },
  phone: {
    type: String,
    required: true,
    minlength: 6
  },
  roleId: {
    type: String,
    default: 'juror'
  },
  department: {
    type: String,
    required: true
  }
})
