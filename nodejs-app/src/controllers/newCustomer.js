const customerData = new Map();
const { v4: uuidv4, stringify } = require('uuid');
const licensePlateToCustomerId = new Map();
const tollTagToCustomerId = new Map();



postNewCustomer = async (req, res) => {

  try{

    const { name, licensePlate, tollTag } = req.body;
    const customerId = uuidv4();

    console.log(`Received POST request for creating a new customer: ${JSON.stringify(req.body)}`);
  
    const customerRecords = {
      customerId: customerId,
      name,
      licensePlate,
      tollTag
    }
  
    if (licensePlateToCustomerId.has(licensePlate) || tollTagToCustomerId.has(tollTag)) {
      console.log(`Error: Toll Tag ${tollTag} is linked to another License Plate`);
      return res.status(400).json({
        error: `Toll Tag is linked to another License Plate`
      })
    }
  

    if (!licensePlate || !tollTag || !name) {
      console.log('Error: License Plate, Toll Tag, and Name are required');
      return res.status(400).json({ error: 'License Plate, Toll Tag and Name are required' });
    }
  

    console.log(`Storing new customer data: ${JSON.stringify(customerRecords)}`);

    customerData.set(customerId, customerRecords)
    licensePlateToCustomerId.set(licensePlate, customerId)
    tollTagToCustomerId.set(tollTag, customerId)


    console.log(`New customer data successfully stored. Responding with customer details.`);

    res.status(200).json({ 
      customerId: customerId,
      name: name,
      licensePlate: licensePlate,
      tollTag:tollTag
    });


  }

  catch{
    console.error(`An error occurred in postNewCustomer endpoint: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }



}

module.exports = {
  postNewCustomer,
  customerData,
  licensePlateToCustomerId,
  tollTagToCustomerId
};