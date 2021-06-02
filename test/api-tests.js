'use strict';
const supertest = require('supertest');
const chai = require('chai');
const expect = require('chai').expect;
const describe = require('mocha').describe;
const it = require('mocha').it;

const { server, shutdown } = require('../index');
const { logger } = require('../logger/logger');

const isNumeric = (num)=> {
    return ! isNaN(num)
  }

describe('API Tests: ', () => {
    after(async () => {
        await shutdown();
    });

    beforeEach((done) => {
        setTimeout(done, 10000)
    });

    function waiter() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 2000)
        })
    }

    it('Can access GET distance with current location', async function () {
        //Current Location Test
        await waiter();
        await supertest(server)
            .get('/currentLocation')
            .set('Accept', 'application/json')
            .then(async (res) => {
                expect(res.body).to.be.an('object');
                const location = res.body;
                const locationRes = await supertest(server)
                    .post('/isnear')
                    .set('Content-type', 'application/json')
                    .send(location);
                logger.debug({ test: 'Can access GET distance', result: res.body })
                expect(locationRes.status).to.equal(200);
                expect(locationRes.body).to.be.an('object');
                expect(isNumeric(locationRes.body.distance)).to.be.true;
                expect(locationRes.body.distance).to.be.a('string');
            });
    }).timeout(5000);

    it('Can access GET distance', async function () {
        const yourLocation = {
            latitude: 3401.2106,
            latHemisphere: 'N',
            longitude: 11824.67467,
            longHemisphere: 'W',
            altitude: 21.7,
            altitudeUnit: 'M'
        }

        const res = await supertest(server)
            .post('/isnear')
            .set('Content-type', 'application/json')
            .send(yourLocation);
        logger.debug({ test: 'Can access GET distance', result: res.body })
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');

    });

});