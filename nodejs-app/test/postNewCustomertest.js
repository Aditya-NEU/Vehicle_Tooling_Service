let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
const { postNewCustomer, customerData, licensePlateToCustomerId, tollTagToCustomerId } = require('../src/controllers/newCustomer');

describe('postNewCustomer endpoint', () => {
  beforeEach(() => {
    customerData.clear();
    licensePlateToCustomerId.clear();
    tollTagToCustomerId.clear();
  });

  it('should create a new customer', async () => {
    const req = {
      body: {
        name: 'John Doe',
        licensePlate: 'ABC123',
        tollTag: 'T123',
      },
    };

    const res = {
      status: (statusCode) => ({
        json: (data) => {
          chai.expect(statusCode).to.equal(200);
          chai.expect(data).to.have.property('customerId');
          chai.expect(data).to.have.property('name', 'John Doe');
          chai.expect(data).to.have.property('licensePlate', 'ABC123');
          chai.expect(data).to.have.property('tollTag', 'T123');
        },
      }),
    };

    await postNewCustomer(req, res);
  });

  it('should not create a new customer', async () => {
    const req = {
      body: {
        name: 'John Doe',
        tollTag: 'T123',
      },
    };

    const res = {
      status: (statusCode) => ({
        json: (data) => {
          chai.expect(statusCode).to.equal(400);
          chai.expect(data).not.have.property('customerId');
          chai.expect(data).not.have.property('name', 'John Doe');
          chai.expect(data).not.have.property('tollTag', 'T123');
        },
      }),
    };

    await postNewCustomer(req, res);
  });

});