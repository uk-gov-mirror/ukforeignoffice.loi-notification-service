var baseUrl = 'http://localhost:6000/api/notification';
var server = request.agent(baseUrl);

describe('Work with Notifications', function () {
    it('runs health check', function (done) {
        request(baseUrl).get('/healthcheck')
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body.message).to.equal('is-notification-service running');
                done();
            });
    });
});
