const expect = require('chai').expect
const axios = require('axios')

before('Run Server', function (done) {
  let server = require('../../server').getApp
  done()
})

describe('Healthcheck is working', function () {
  describe('GET /healthcheck', function () {
    const url = 'http://localhost:1234/api/notification/healthcheck'

    it('returns status 200', function (done) {
      axios
        .get(url)
        .then(function (response) {
          expect(response.status).to.equal(200)
          done()
        })
        .catch(function (error) {
          done(error)
        })
    })

    it('JSON body is correct', function (done) {
      axios
        .get(url)
        .then(function (response) {
          // Directly checking the property of the response object
          expect(response.data).to.have.property('message', 'Notification Service is running')
          done()
        })
        .catch(function (error) {
          done(error)
        })
    })
  })
})
