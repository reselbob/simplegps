'use strict';
const supertest = require('supertest');
const chai = require('chai');
const expect = require('chai').expect;
const describe = require('mocha').describe;
const it = require('mocha').it;

const {server,shutdown} = require('../index');

describe('API Tests: ', () => {
    after(function () {
        shutdown();
    });

    it('Can access GET currentLocation', function(done){
        //Current Location Test
        supertest(server)
            .get('/currentLocation')
            .set('Accept', 'application/json')
            .then((res) => {
                expect(res.body).to.be.an('object');
                done();
            })
            .catch(done);
    });
});