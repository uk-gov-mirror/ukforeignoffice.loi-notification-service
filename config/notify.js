/**
 * Created by skaifem on 10/12/2015.
 */
require('dotenv').config()
var configs = JSON.parse(process.env.CONFIGS);
var templates = JSON.parse(process.env.TEMPLATES);
var urls = JSON.parse(process.env.URLS);
var config = {configs: configs,
        templates:templates,
        urls:urls};
module.exports = config;
