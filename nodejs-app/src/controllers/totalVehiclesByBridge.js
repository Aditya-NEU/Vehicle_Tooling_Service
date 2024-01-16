const { tollData } = require("./postToll");
const moment = require('moment-timezone');
const locationCodeToName = require ("./postToll")


totalVehiclesByBridge = async (req, res) => {

  try{
    const { bridge, date } = req.query;

    const validDateFormat = /^\d{4}-\d{2}-\d{2}$/;
    if (!validDateFormat.test(date)) {
      console.log('Error: Invalid date format. It should be in the format "YYYY-MM-DD"');
      return res.status(400).json({ error: 'Invalid date format. It should be in the format "YYYY-MM-DD"' });
    }  

  if (!bridge || !date) {
    console.log('Error: Both bridge and date parameters are required');
    return res.status(400).json({ error: 'Both bridge and date parameters are required' });
  }

  const formattedDate = moment(date).format('YYYY-MM-DD');

  const tollRecordsForBridgeAndDate = Array.from(tollData.values()).filter(
    (record) => {
      const recordDate = moment(record.timestamp).utcOffset(record.timestamp).format('YYYY-MM-DD');
      return record.location === bridge && recordDate === formattedDate;
    }
  );


  const tollRecordsWithLongForm = tollRecordsForBridgeAndDate.map((record) => ({
    licensePlate: record.licensePlate,
    tollTag: record.tollTag,
    location: locationCodeToName.locationCodeToName[record.location],
    timestamp: moment(record.timestamp).tz('America/Los_Angeles').format(),
  }));

  console.log(`Total vehicles passed through ${bridge} bridge on ${formattedDate}: ${tollRecordsForBridgeAndDate.length}`);
  console.log(`Detailed toll records: ${JSON.stringify(tollRecordsWithLongForm)}`);

  const totalCount = tollRecordsForBridgeAndDate.length;
  res.status(200).json({ 
    totalCount,
    tollRecords: tollRecordsWithLongForm 
  
  });
  }

  catch{
    console.error(`An error occurred in totalVehiclesByBridge endpoint: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }


}

module.exports = {
  totalVehiclesByBridge
}