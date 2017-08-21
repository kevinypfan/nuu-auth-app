const mongoose = require('mongoose');
const validator = require('validator');
const moment = require('moment-timezone');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const _ = require('lodash');
const {ObjectID} = require('mongodb');


var UserSchema = new mongoose.Schema({
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
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    minlength: 1
  },
  phone: {
    type: String,
    required: true,
    minlength: 6
  },
  time: {
    type: String,
    default: moment().tz("Asia/Taipei")
  },
  studentId: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  lineId: {
    type: String
  },
  roleId: {
    type: String,
    required: true
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = user.roleId;
  var token = jwt.sign({_id: user._id.toHexString(), access},'abc123').toString();

  user.tokens.push({access, token});

  return user.save().then(() => {
    return token
  })
}

UserSchema.methods.toJson = function () {
  var user = this;
  var userObject = user.toObject();
  return _.pick(userObject, ['_id', 'email','name','phone','studentId','department','lineId','roleId'])
}

UserSchema.methods.userUpdata = function (body) {
  var user = this;
  var {name,phone,studentId,department,lineId} = body
  return user.update({
    $set: {
      name,phone,studentId,department,lineId
    }
  })
}

UserSchema.methods.removeToken = function (token) {
  var user = this;

  return user.update({
    $pull: {
      tokens: {token}
    }
  })
}

UserSchema.statics.findByCredentials = function (email, password) {
  var User = this;

  return User.findOne({email}).then(user => {
    if (!email) {
      return Promise.reject("找不到這個信箱");
    }
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password).then(res => {
        if(res) {
          resolve(user);
        } else {
          reject("您的密碼錯誤");
        }
      })
    })
  })
}
UserSchema.statics.findByToken = function (token) {
  var User = this;
  var decoded;
  try {
    decoded = jwt.verify(token, 'abc123')
  } catch (e) {
    return Promise.reject();
  }
  return User.findOne({
    _id: decoded._id,
    'tokens.token': token,
    'tokens.access': decoded.access
  })
}


UserSchema.pre('save', function (next) {
  var user = this;
  if (user.isModified('password')){
    bcrypt.hash(user.password, 10).then(hash => {
      user.password = hash;
      next();
    })
  } else {
    next();
  }
})

var User = mongoose.model('User', UserSchema);

module.exports = {User}
