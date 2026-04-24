import axios from 'axios'
import { expect } from 'chai'
import { getApp } from '../../server.js'

before('Run Server', (done) => {
  getApp
  done()
})

describe('Healthcheck is working', () => {
  describe('GET /healthcheck', () => {
    const url = 'http://localhost:1234/api/notification/healthcheck'

    it('returns status 200', (done) => {
      axios
        .get(url)
        .then((response) => {
          expect(response.status).to.equal(200)
          done()
        })
        .catch((error) => {
          done(error)
        })
    })

    it('JSON body is correct', (done) => {
      axios
        .get(url)
        .then((response) => {
          // Directly checking the property of the response object
          expect(response.data).to.have.property('message', 'Notification Service is running')
          done()
        })
        .catch((error) => {
          done(error)
        })
    })
  })
})
