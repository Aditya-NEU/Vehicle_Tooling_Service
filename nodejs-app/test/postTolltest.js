let chai = require('chai');
let chaiHttp = require('chai-http');
let moment = require('moment-timezone');
chai.use(chaiHttp);
const { postNewToll } = require('../src/controllers/postToll');
const { postNewCustomer,licensePlateToCustomerId,tollTagToCustomerId} = require('../src/controllers/newCustomer');

describe('postNewToll endpoint', () => {

  beforeEach(async () => {

    licensePlateToCustomerId.clear();
    tollTagToCustomerId.clear();

    const customerReq = {
      body: {
        name: 'John Doe',
        licensePlate: 'ABC123',
        tollTag: 'T123',
      },
    };

    const customerRes = {
      status: (statusCode) => ({
        json: (data) => {
          chai.expect(statusCode).to.equal(200);
          chai.expect(data).to.have.property('customerId');
        },
      }),
    };

    await postNewCustomer(customerReq, customerRes);
  });

  it('should successfully create a new toll record', async () => {
    const req = {
      body: {
        licensePlate: 'ABC123',
        tollTag: 'T123',
        location: 'BEN',
        timestamp: '2023-12-20T00:24:50.888Z',
      },
    };

    const res = {
      status: (statusCode) => ({
        json: (data) => {
          chai.expect(statusCode).to.equal(200);
          chai.expect(data).to.have.property('tollId');
          chai.expect(data).to.have.property('customerId');
          chai.expect(data).to.have.property('licensePlate', 'ABC123');
          chai.expect(data).to.have.property('tollTag', 'T123');
        },
      }),
    };

    await postNewToll(req, res);
  });

  it('should handle invalid location code', async () => {
    const req = {
      body: {
        licensePlate: 'ABC123',
        tollTag: 'T123',
        location: 'invalidLocation',
        timestamp: moment.utc().format(),
      },
    };

    const res = {
      status: (statusCode) => ({
        json: (data) => {
          chai.expect(statusCode).to.equal(400);
          chai.expect(data).to.have.property('error').that.includes('Invalid location code');
        },
      }),
    };

    await postNewToll(req, res);
  });


});
