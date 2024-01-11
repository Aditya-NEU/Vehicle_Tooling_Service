// Mapping between customer IDs and their details
const customerData = new Map();

// Mapping between license plates and customer IDs
const licensePlateToCustomerId = new Map();

// Mapping between toll tags and customer IDs
const tollTagToCustomerId = new Map();


exports.postNewToll = async (req,res)=>{

const { name, licensePlate, tollTag } = req.body;

// Check if licensePlate and tollTag are provided
if (!licensePlate || !tollTag) {
  return res.status(400).json({ error: 'License plate and toll tag are required' });
}

// Check if the license plate is unique
if (licensePlateToCustomerId.has(licensePlate)) {
  const existingCustomerId = licensePlateToCustomerId.get(licensePlate);
  return res.status(400).json({
    error: `License plate ${licensePlate} is already associated with Customer ID ${existingCustomerId}`,
  });
}

// Check if the toll tag is unique
if (tollTagToCustomerId.has(tollTag)) {
  const existingCustomerId = tollTagToCustomerId.get(tollTag);
  return res.status(400).json({
    error: `Toll tag ${tollTag} is already associated with Customer ID ${existingCustomerId}`,
  });
}

// Generate a unique UUID for the customer
const customerId = uuidv4();

const customerDetails = {
  id: customerId,
  name,
  licensePlate,
  tollTag,
};

// Use the UUID as the key for the Map
customerData.set(customerId, customerDetails);

// Map license plate and toll tag to customer ID for uniqueness checks
licensePlateToCustomerId.set(licensePlate, customerId);
tollTagToCustomerId.set(tollTag, customerId);

res.status(200).json({ id: customerId });









}