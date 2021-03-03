var dotenv = require('dotenv');
var env = dotenv.config({path: process.env.DOTENV || '.env'});
var configs = JSON.parse(process.env.CONFIGS);
var templates = JSON.parse(process.env.TEMPLATES);
var urls = JSON.parse(process.env.URLS);
var config = {configs: configs,
        templates:templates,
        urls:urls};
module.exports = config;
