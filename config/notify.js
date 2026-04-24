import dotenv from 'dotenv'

const env = dotenv.config({ path: process.env.DOTENV || '.env' })
const configs = JSON.parse(process.env.CONFIGS)
const templates = JSON.parse(process.env.TEMPLATES)
const urls = JSON.parse(process.env.URLS)

export const notify = { configs, templates, urls, env }
