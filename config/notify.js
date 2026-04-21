const dotenv = require('dotenv')
const _env = dotenv.config({ path: process.env.DOTENV || '.env' })
const configs = JSON.parse(process.env.CONFIGS)
const templates = JSON.parse(process.env.TEMPLATES)
const urls = JSON.parse(process.env.URLS)
const config = { configs: configs, templates: templates, urls: urls }
module.exports = config
