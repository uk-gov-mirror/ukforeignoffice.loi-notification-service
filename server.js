import bodyParser from 'body-parser'
import express from 'express'
import notifyClient from 'notifications-node-client'
import { routes } from './app/routes.js'
import { config } from './config/common.js'
import { logger } from './config/logs.js'

// =====================================
// SETUP
// =====================================
const defaultPort = 1234
const port =
  process.argv[2] && !Number.isNaN(Number(process.argv[2])) ? process.argv[2] : process.env.PORT || defaultPort

const app = express()

const notifySettings = config()

const notify = notifyClient.NotifyClient

// =====================================
// CONFIGURATION
// =====================================
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
)

app.use(bodyParser.json())

// =====================================
// ROUTES
// =====================================
const router = express.Router() //get instance of Express router
routes(router, notify, notifySettings) //load routes passing in app and configured passport
app.use('/api/notification', router) //prefix all requests with 'api'

// =====================================
// LAUNCH
// =====================================
app.listen(port, (err) => {
  if (err) {
    return logger.error(`Failed to start server on port ${port}`, err)
  }
  logger.info(`Notification-service running on port: ${port}`)
})

export const getApp = app
