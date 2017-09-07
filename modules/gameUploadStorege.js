const multer = require('multer');
const moment = require('moment');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null,`${__dirname}/../gameUploads/rule`)
    },
    filename: function (req, file, cb) {
      function getFileExtension1(filename) {
        return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename)[0] : undefined;
      }
      var fileName = getFileExtension1(file.originalname);
      var date = Date.now()
      cb(null, `gameFile_${moment(date).format("YYYYMMDD_HHmmss")}.${fileName}`)
    }
  })

var uploadSingle = multer({ storage }).single('gameFile')
module.exports = { storage, uploadSingle }
