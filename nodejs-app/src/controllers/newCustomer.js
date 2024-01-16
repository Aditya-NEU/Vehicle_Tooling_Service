// Mapping between customer IDs and their details
const customerData = new Map();

const { v4: uuidv4, stringify } = require('uuid');

// Mapping between license plates and customer IDs
const licensePlateToCustomerId = new Map();

// Mapping between toll tags and customer IDs
const tollTagToCustomerId = new Map();

// Generate a unique UUID for the customerc

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
  
    // Check if licensePlate and tollTag and name are provided
    if (!licensePlate || !tollTag || !name) {
      console.log('Error: License Plate, Toll Tag, and Name are required');
      return res.status(400).json({ error: 'License Plate, Toll Tag and Name are required' });
    }
  
    // Log customer data before storing
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