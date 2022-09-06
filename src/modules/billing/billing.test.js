import chai from 'chai';
import chaiHttp from 'chai-http';
import 'dotenv/config';

import app from '../../../index';
import * as fixtures from './billing.fixtures';
import { seedCustomer } from '../customer/service';

const { expect } = chai;
chai.use(chaiHttp);

describe('Billing API', () => {
    before( async () => {
        await seedCustomer(fixtures.customerInfo);
        process.env.CUSTOMERID = fixtures.transactionInfo.customerId;
    });

    it('Should fail when payload contains wrong customerId', done => {
        chai.request(app)
        .post(`/billing`)
        .send(fixtures.wrongCustomerId)
        .end((_err, res) => {
            const { message } = res.body;
            expect(res.statusCode).to.equal(400);
            expect(message).to.equal('Please enter a valid customerId');
            done();
        });
    });

    it('Should fail when payload has no customerId', done => {
        chai.request(app)
        .post(`/billing`)
        .send(fixtures.noCustomerId)
        .end((_err, res) => {
            const { message } = res.body;
            expect(res.statusCode).to.equal(400);
            expect(message).to.equal('Please enter your customerId');
            done();
        });
    });

    it('Should fail when payload has no amount', done => {
        chai.request(app)
        .post(`/billing`)
        .send(fixtures.noAmount)
        .end((_err, res) => {
            const { message } = res.body;
            expect(res.statusCode).to.equal(400);
            expect(message).to.equal('Please enter amount');
            done();
        });
    });

    it('Should fail when payload amount is not a number', done => {
        chai.request(app)
        .post(`/billing`)
        .send(fixtures.wrongAmount)
        .end((_err, res) => {
            const { message } = res.body;
            expect(res.statusCode).to.equal(400);
            expect(message).to.equal('amount must be a number');
            done();
        });
    });

    it('Should fail when payload has no payment mode', done => {
        chai.request(app)
        .post(`/billing`)
        .send(fixtures.noPaymentMode)
        .end((_err, res) => {
            const { message } = res.body;
            expect(res.statusCode).to.equal(400);
            expect(message).to.equal('Please enter mode of payment');
            done();
        });
    });

    it('Should fail when payload has no payment mode', done => {
        chai.request(app)
        .post(`/billing`)
        .send(fixtures.wrongPaymentMode)
        .end((_err, res) => {
            const { message } = res.body;
            expect(res.statusCode).to.equal(400);
            expect(message).to.equal('paymentMode must be one of [cash, transfer, card, cheque, other]');
            done();
        });
    });

    it('should fail if customer does not exist', (done) => {
        chai.request(app)
        .post(`/billing`)
        .send(fixtures.customerNotExist)
        .end((_err, res) => {
            const { message } = res.body;
            expect(res.statusCode).to.equal(400);
            expect(message).to.equal('Invalid customer');
            done();
        });
    });

    it('should create a transaction', (done) => {
        chai.request(app)
            .post(`/billing`)
            .send(fixtures.transactionInfo)
            .end((_err, res) => {
                const { message } = res.body;
                expect(res.statusCode).to.equal(201);
                expect(message).to.equal('Transaction posted successfully!');
                done();
            });
    });
});
