/**
 * Created by skaifem on 10/12/2015.
 */
var dotenv = require('dotenv');
var env = dotenv.config({path: process.env.DOTENV || '.env'});
var configs = JSON.parse(env.CONFIGS);
var templates = JSON.parse(env.TEMPLATES);
var urls = JSON.parse(env.URLS);
var config = {configs: configs,
        templates:templates,
        urls:urls};
module.exports = config;
