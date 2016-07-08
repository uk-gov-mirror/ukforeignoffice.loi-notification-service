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

var templator = require('./app/templateCreator.js');
var common = require('./config/common.js');
var sendGridSettings = common.config();
require('./config/logs');

var sendGrid = sendGridSettings.configs.proxy ? require('sendgrid')(sendGridSettings.configs.api_key, { proxy: sendGridSettings.configs.proxy }) : require('sendgrid')(sendGridSettings.configs.api_key);


// =====================================
// CONFIGURATION
// =====================================
app.use(bodyParser()); //get information from HTML forms

// =====================================
// ROUTES
// =====================================
var router = express.Router(); //get instance of Express router
require('./app/routes.js')(router, sendGrid, sendGridSettings,templator); //load routes passing in app and configured passport
app.use('/api/notification', router); //prefix all requests with 'api'

// =====================================
// LAUNCH
// =====================================
app.listen(port);
console.log('notification-service running on port: ' + port);
module.exports.getApp = app;