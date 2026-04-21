const expect = require('chai').expect
const axios = require('axios')
const httpOkStatus = 200

before('Run Server', (done) => {
  const _server = require('../../server').getApp
  done()
})

describe('Healthcheck is working', () => {
  describe('GET /healthcheck', () => {
    const url = 'http://localhost:1234/api/notification/healthcheck'

    it('returns status httpOkStatus', (done) => {
      axios
        .get(url)
        .then((response) => {
          expect(response.status).to.equal(httpOkStatus)
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
