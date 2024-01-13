const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment-timezone');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// In-memory storage for toll data using Map
const tollData = new Map();

// Mapping between location codes and long-form toll bridge names
const locationCodeToName = {
  ANT: 'Antioch Bridge',
  BEN: 'Benicia–Martinez Bridge',
  CAR: 'Carquinez Bridge',
  DUM: 'Dumbarton Bridge',
  GOL: 'Golden Gate Bridge',
  RIC: 'Richmond–San Rafael Bridge',
  SFO: 'San Francisco–Oakland Bay Bridge',
  SMH: 'San Mateo–Hayward Bridge',
};

// Mapping between customer IDs and their details
const customerData = new Map();

// Mapping between license plates and customer IDs
const licensePlateToCustomerId = new Map();

// Mapping between toll tags and customer IDs
const tollTagToCustomerId = new Map();

// Endpoint to accept toll data
app.post('/toll', (req, res) => {
  const { licensePlate, tollTag, location, timestamp } = req.body;

  // Check if licensePlate and tollTag are provided
  if (!licensePlate || !tollTag) {
    return res.status(400).json({ error: 'License plate and toll tag are required' });
  }

  // Check if the license plate is associated with a customer
  if (!licensePlateToCustomerId.has(licensePlate)) {
    return res.status(400).json({ error: `License plate ${licensePlate} is not associated with any customer` });
  }

  // Check if the toll tag is associated with a customer
  if (!tollTagToCustomerId.has(tollTag)) {
    return res.status(400).json({ error: `Toll tag ${tollTag} is not associated with any customer` });
  }

  // Generate a unique UUID for the toll record
  const tollId = uuidv4();

  const tollRecord = {
    id: tollId,
    customerId: licensePlateToCustomerId.get(licensePlate) || tollTagToCustomerId.get(tollTag),
    licensePlate,
    tollTag,
    location,
    timestamp,
  };

  // Use the UUID as the key for the Map
  tollData.set(tollId, tollRecord);
  res.status(200).json({ id: tollId });
});

// Example endpoint: Retrieve toll data by ID
app.get('/toll/:id', (req, res) => {
  const { id } = req.params;
  const tollRecord = tollData.get(id);
  res.json(tollRecord);
});

// Example endpoint: Total number of vehicles passing through all toll bridges for last calendar month
app.get('/totalLastMonth', (req, res) => {
  // Get the current date
  const currentDate = new Date();

  // Calculate the first day of the last calendar month
  const firstDayLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);

  // Filter toll records for the last calendar month
  const lastMonthTollRecords = Array.from(tollData.values()).filter(
    (record) =>
      new Date(record.timestamp) >= firstDayLastMonth && new Date(record.timestamp) <= currentDate
  );

  // Calculate the total count
  const totalCount = lastMonthTollRecords.length;

  res.json({ totalCount });
});

// Example endpoint: Retrieve toll data with toll bridge location in long form and timestamp in PST
app.get('/tollWithLocation/:id', (req, res) => {
  const { id } = req.params;
  const tollRecord = tollData.get(id);

  if (tollRecord) {
    // Map location code to long-form toll bridge name
    const longFormLocation = locationCodeToName[tollRecord.location] || tollRecord.location;

    // Convert timestamp to PST timezone
    const timestampInPST = moment(tollRecord.timestamp).tz('America/Los_Angeles').format();

    // Include the long-form location and timestamp in PST in the response
    const response = {
      ...tollRecord,
      longFormLocation,
      timestampInPST,
    };

    res.json(response);
  } else {
    res.status(404).json({ error: 'Toll record not found' });
  }
});

// Example endpoint: Retrieve all toll records with details
app.get('/allTollRecords', (req, res) => {
  const allTollRecords = Array.from(tollData.values());

  // Map location codes to long-form toll bridge names and convert timestamps to PST timezone
  const tollRecordsWithDetails = allTollRecords.map((record) => ({
    ...record,
    longFormLocation: locationCodeToName[record.location] || record.location,
    timestampInPST: moment(record.timestamp).tz('America/Los_Angeles').format(),
  }));

  res.json(tollRecordsWithDetails);
});

// Endpoint to add a new customer
app.post('/customer', (req, res) => {
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
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
