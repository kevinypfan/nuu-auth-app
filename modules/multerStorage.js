const fs = require('fs')
const multer = require('multer');
const moment = require('moment');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    var team = JSON.parse(req.body.teamData)
    if (!fs.existsSync( `${__dirname}/../uploads/${team.teamName}`)){
        fs.mkdirSync(`${__dirname}/../uploads/${team.teamName}`);
    }
    cb(null,`${__dirname}/../uploads/${team.teamName}`)
    },
    filename: function (req, file, cb) {
      var team = JSON.parse(req.body.teamData)
      function getFileExtension1(filename) {
        return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename)[0] : undefined;
      }
      var fileName = getFileExtension1(file.originalname);
      var date = Date.now()
      cb(null, `${team.teamName}_${moment(date).format("YYYYMMDD_HHmmss")}.${fileName}`)
    }
  })
var upload = multer({ storage }).any()
module.exports = {storage, upload}
