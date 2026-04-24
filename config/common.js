/**
 * Created by skaifem on 31/12/2015.
 */

const notify = require('./notify.js')

exports.config = () => {
  const _node_env = process.env.NODE_ENV || 'development'

  return notify
}
