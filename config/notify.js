const dotenv = require('dotenv')
const env = dotenv.config({ path: process.env.DOTENV || '.env' })
const configs = JSON.parse(process.env.CONFIGS)
const templates = JSON.parse(process.env.TEMPLATES)
const urls = JSON.parse(process.env.URLS)

module.exports = { configs, templates, urls, env }
