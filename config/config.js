var env = process.env.NODE_ENV || "development";

if (env === "development") {
  var config = require('./config.dev.json')
  var envConfig = config[env];
  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key]
  })
}

if (env === "product") {
  var config = require('./config.prod.json')
  var envConfig = config[env]
  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key]
  })
}
