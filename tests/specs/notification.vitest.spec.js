import axios from 'axios'
import { beforeAll, describe, expect, it } from 'vitest'
import { getApp } from '../../server.js'

beforeAll(() => {
  getApp
})

describe('Healthcheck is working', () => {
  describe('GET /healthcheck', () => {
    const url = 'http://localhost:1234/api/notification/healthcheck'

    it('returns status 200', async () => {
      const response = await axios.get(url)
      expect(response.status).toBe(200)
    })

    it('JSON body is correct', async () => {
      const response = await axios.get(url)
      expect(response.data).toHaveProperty('message', 'Notification Service is running')
    })
  })
})
