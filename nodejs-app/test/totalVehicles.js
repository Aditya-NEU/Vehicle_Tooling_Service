let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
const { totalVehiclesLastMonth } = require('../src/controllers/totalNumberOfVehicles.js');
const { postNewToll,tollData } = require('../src/controllers/postToll.js');
const { v4: uuidv4 } = require('uuid');
const { postNewCustomer,licensePlateToCustomerId,tollTagToCustomerId} = require('../src/controllers/newCustomer');

describe('totalVehiclesLastMonth endpoint', () => {

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


    const tollReq = {
      body:{
        licensePlate : 'ABC123',
        location : 'BEN',
        timestamp: '2023-12-20T00:24:50.888Z',
        tollTag: 'T123'

      }
    }

    const tollRes = {
      status: (statusCode) => ({
        json: (data) => {
          chai.expect(statusCode).to.equal(200);
          chai.expect(data).to.have.property('tollId');
        },
      }),
    };

    await postNewToll(tollReq,tollRes);

  });

  it('should return total vehicles passed through last month', async () => {

    const testTollId = uuidv4();

    tollData.set('testTollId', {
      tollId:testTollId,
      licensePlate: 'ABC123',
      tollTag: 'T1234',
      location: 'BEN',
      timestamp: '2023-12-20T00:24:50.888Z',
    });

    const req = {
      query: {},
    };

    const res = {
      status: (statusCode) => ({
        json: (data) => {
          chai.expect(statusCode).to.equal(200);
          chai.expect(data).to.have.property('totalCount');
          chai.expect(data).to.have.property('tollRecords');
        },
      }),
    };

    await totalVehiclesLastMonth(req, res);
  });

});
