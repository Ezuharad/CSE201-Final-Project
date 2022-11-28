let request = require('supertest')
describe('loading express', function () {
    let server;
    beforeEach(function () {
        server = require('./server.js');
    });
    afterEach(function () {
        server.close();
    });
    it('responds to /index.html', function testSlash(done) {
        request(server).get('/index.html').expect(200, done);
    });
    it('404 everything else', function testPath(done) {
        request(server).get('/l').expect(404, done);
    })
});
