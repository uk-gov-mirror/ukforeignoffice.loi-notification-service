import dotenv from 'dotenv'
import { emailTemplates } from './emailTemplates.js'
import { notifyAuth } from './notifyAuth.js'
import { URLS } from './serviceUrls.js'

export const notify = () => {
  const env = dotenv.config({ path: '.env' })
  const configs = {
    ...notifyAuth,
    ...(process.env.CONFIGS ? JSON.parse(process.env.CONFIGS) : {}),
  }
  const templates = {
    ...emailTemplates,
    ...(process.env.TEMPLATES ? JSON.parse(process.env.TEMPLATES) : {}),
  }
  const urls = {
    ...URLS,
    ...(process.env.URLS ? JSON.parse(process.env.URLS) : {}),
  }
  return { configs, templates, urls, env }
}
