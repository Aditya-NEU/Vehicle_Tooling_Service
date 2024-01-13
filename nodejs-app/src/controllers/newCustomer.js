// Mapping between customer IDs and their details
const customerData = new Map();

const { v4: uuidv4, stringify } = require('uuid');

// Mapping between license plates and customer IDs
const licensePlateToCustomerId = new Map();

// Mapping between toll tags and customer IDs
const tollTagToCustomerId = new Map();

// Generate a unique UUID for the customerc

postNewCustomer = async (req, res) => {

  const { name, licensePlate, tollTag } = req.body;
  const customerId = uuidv4();
  
  const customerRecords = {
    id: customerId,
    name,
    licensePlate,
    tollTag
  }

  if (licensePlateToCustomerId.has(licensePlate) || tollTagToCustomerId.has(tollTag)) {
      return res.status(400).json({
        error: `Toll Tag is linked to another License Plate`
      })
  }

  // Check if licensePlate and tollTag and name are provided
  if (!licensePlate || !tollTag || !name) {
    return res.status(400).json({ error: 'License Plate and Toll Tag and Name are required' });
  }

  customerData.set(customerId, customerRecords)
  licensePlateToCustomerId.set(licensePlate, customerId)
  tollTagToCustomerId.set(tollTag, customerId)
  res.status(200).json({ id: customerId });

}

module.exports = {
  postNewCustomer,
  customerData,
  licensePlateToCustomerId,
  tollTagToCustomerId
};