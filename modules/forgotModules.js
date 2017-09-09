const crypto = require('crypto')

var randomToken = () => {
  var token = crypto.randomBytes(20)
  return token.toString('hex')
}

var forgotHtml = (host, token) => {
  return (
    `<h3>您或者某人對此請求重製密碼</h3>
    <p>請點擊下方連結或黏貼到瀏覽器以便更新密碼</p>
    <p>http://${host}/api/user/forgotPassword/${token}</p>
    <p>如果你沒有請求，請別理會此信件</p>`
  )
}

var passwordUpdatedHtml = (email) => {
  return (
    `<h3>${email} 您好！您的密碼已更新了</h3>
    <p>這是通知您密碼已成功更新的信件</p>`
  )
}


module.exports = { randomToken, forgotHtml, passwordUpdatedHtml }
