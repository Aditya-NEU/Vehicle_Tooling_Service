const { v4: uuidv4 } = require('uuid');
const tollData = new Map();
const customerModule = require("./newCustomer");
const moment = require('moment-timezone');

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

const postNewToll = async (req, res) => {

try{

  const { licensePlate, tollTag, location, timestamp } = req.body;

  console.log(`Received POST request for new toll: ${JSON.stringify(req.body)}`);

    if (!locationCodeToName[location]) {
      return res.status(400).json({ error: 'Invalid location code' });
    }

 
 const isTimestampRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
 if (!isTimestampRegex.test(timestamp)) {
   return res.status(400).json({ error: 'Invalid timestamp format. It should be in the format "2023-12-20T00:24:50.888Z"' });
 }
  const tollId = uuidv4()

  const tollRecord = {
    tollId: tollId,
    customerId: customerModule.licensePlateToCustomerId.get(licensePlate) || customerModule.tollTagToCustomerId.get(tollData),
    licensePlate,
    tollTag,
    location,
    timestamp
  };

  console.log(`Storing new toll record data: ${JSON.stringify(tollRecord)}`);

  if (!timestamp || !location || !licensePlate && !tollTag) {
    console.log('Error: Timestamp and Location are required fields.');
    return res.status(400).json({ error: 'Timestamp and Location are required field.' });
  }

  if (!customerModule.licensePlateToCustomerId.has(licensePlate) && !customerModule.tollTagToCustomerId.has(tollTag)) {
    return res.status(400).json({
      error: `This License plate ${licensePlate} and this ${tollTag} Toll Tag are not registered.`,
    });
  }

  const pstTimestamp = moment.tz(timestamp, 'UTC').tz('America/Los_Angeles');

  if (customerModule.licensePlateToCustomerId.has(licensePlate) && customerModule.tollTagToCustomerId.has(tollTag)) {

    let customerIDFromlp = customerModule.licensePlateToCustomerId.get(licensePlate)
    let customerIDFromtt = customerModule.tollTagToCustomerId.get(tollTag)
    if (customerIDFromlp == customerIDFromtt) {
      tollData.set(tollId, tollRecord);
      return res.status(200).json({     
        tollId: tollId,
        customerId: tollRecord.customerId,
        licensePlate: licensePlate,
        tollTag:tollTag,
        timestamp:pstTimestamp.format()
      });
    }

    else {
      console.log(`Error: License plate ${licensePlate} is not registered with this ${tollTag} Toll Tag.`);
      return res.status(400).json({
        error: `License plate ${licensePlate} is not registered with this ${tollTag} Toll Tag.`,
      });
    }
  }

  if (licensePlate != undefined && tollTag != undefined) {
    if (customerModule.licensePlateToCustomerId.has(licensePlate) && !customerModule.tollTagToCustomerId.has(tollTag) || !customerModule.licensePlateToCustomerId.has(licensePlate) && customerModule.tollTagToCustomerId.has(tollTag)) {
      return res.status(400).json({
        error: `License plate ${licensePlate} is not registered with this ${tollTag} Toll Tag.`,
      });
    }
  }

  if (customerModule.licensePlateToCustomerId.has(licensePlate) && tollTag == undefined || customerModule.tollTagToCustomerId.has(tollTag) && licensePlate == undefined) {
    tollData.set(tollId, tollRecord);
    console.log('New toll record data successfully stored.');

    return res.status(200).json({ 
      tollId: tollId,
      customerId: tollRecord.customerId,
      licensePlate: licensePlate,
      tollTag:tollTag,
      timestamp:pstTimestamp.format()
    });
  }

}

catch (error) {
  console.error(`An error occurred in postNewToll endpoint: ${error.message}`);
  return res.status(500).json({ error: 'Internal Server Error' });
}

}


module.exports = { tollData, 
  postNewToll,
  locationCodeToName
 };