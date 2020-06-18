/**
 * Created by skaifem on 25/11/2015.
 */

// =====================================
// SETUP
// =====================================
var port = (process.argv[2] && !isNaN(process.argv[2])  ? process.argv[2] : (process.env.PORT || 1234));
var express = require('express');

var app = express();
var bodyParser = require('body-parser');

var common = require('./config/common.js');
var notifySettings = common.config();
require('./config/logs');

var notify = require('notifications-node-client').NotifyClient

// =====================================
// CONFIGURATION
// =====================================
app.use(bodyParser.json()); //get information from HTML forms

// =====================================
// ROUTES
// =====================================
var router = express.Router(); //get instance of Express router
require('./app/notifications.js')(router, notify, notifySettings); //load routes passing in app and configured passport
app.use('/api/notification', router); //prefix all requests with 'api'

// =====================================
// LAUNCH
// =====================================
app.listen(port);
console.log('Notification-service running on port: ' + port);
module.exports.getApp = app;
