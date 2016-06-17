/**
 * Created by skaifem on 10/12/2015.
 */
var dotenv = require('dotenv');
var env = dotenv.config();
var configs = JSON.parse(env.CONFIGS);
var fromAddresses = JSON.parse(env.FROMADDRESSES);
var templates = JSON.parse(env.TEMPLATES);
var urls = JSON.parse(env.URLS);
var config = {configs: configs,
        fromAddresses:fromAddresses,
        templates:templates,
        urls:urls};
module.exports = config;
