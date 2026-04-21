/**
 * Created by skaifem on 25/11/2015.
 */

// =====================================
// SETUP
// =====================================

const defaultPort = 1234
const port =
  process.argv[2] && !Number.isNaN(Number(process.argv[2])) ? process.argv[2] : process.env.PORT || defaultPort
var express = require('express')

var app = express()
var bodyParser = require('body-parser')

var common = require('./config/common.js')
var notifySettings = common.config()
require('./config/logs')

var notify = require('notifications-node-client').NotifyClient

// =====================================
// CONFIGURATION
// =====================================
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
)

app.use(bodyParser.json())

// =====================================
// ROUTES
// =====================================
var router = express.Router() //get instance of Express router
require('./app/routes.js')(router, notify, notifySettings) //load routes passing in app and configured passport
app.use('/api/notification', router) //prefix all requests with 'api'

// =====================================
// LAUNCH
// =====================================
app.listen(port, (err) => {
  if (err) {
    return console.error(`Failed to start server on port ${port}`, err)
  }
  console.log(`Notification-service running on port: ${port}`)
})

module.exports.getApp = app
