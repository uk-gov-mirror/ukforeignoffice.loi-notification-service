import { notify } from './notify.js'

export const config = () => {
  const _node_env = process.env.NODE_ENV || 'development'

  return notify
}
