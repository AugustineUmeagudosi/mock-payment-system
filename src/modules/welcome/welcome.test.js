import chai from 'chai';
import chaiHttp from 'chai-http';
import 'dotenv/config';

import app from '../../../index';

const { expect } = chai;
chai.use(chaiHttp);

describe('Welcome', () => {
  it('Hello World', done => {
    chai.request(app)
      .get(`/`)
      .set('Content-Type', 'application/json')
      .end((_err, res) => {
        const { message } = res.body;
        expect(res.statusCode).to.equal(200);
        expect(message).to.equal('Hello World');
        done();
      });
  });

  it('Health check', done => {
    chai.request(app)
      .get(`/healthCheck/ping`)
      .set('Content-Type', 'application/json')
      .end((_err, res) => {
        const { message } = res.body;
        expect(res.statusCode).to.equal(200);
        expect(message).to.equal('PONG');
        done();
      });
  });
});
