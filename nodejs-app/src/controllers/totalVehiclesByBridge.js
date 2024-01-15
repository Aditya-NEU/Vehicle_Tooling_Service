const { tollData } = require("./postToll");
const moment = require('moment-timezone');
const locationCodeToName = require ("./postToll")


totalVehiclesByBridge = async (req, res) => {
  const { bridge, date } = req.query;

    // Check if the date parameter has the correct format
    const validDateFormat = /^\d{4}-\d{2}-\d{2}$/;
    if (!validDateFormat.test(date)) {
      return res.status(400).json({ error: 'Invalid date format. It should be in the format "YYYY-MM-DD"' });
    }  

  if (!bridge || !date) {
    return res.status(400).json({ error: 'Both bridge and date parameters are required' });
  }

  const formattedDate = moment(date).format('YYYY-MM-DD');

  const tollRecordsForBridgeAndDate = Array.from(tollData.values()).filter(
    (record) => {
      const recordDate = moment(record.timestamp).utcOffset(record.timestamp).format('YYYY-MM-DD');
      return record.location === bridge && recordDate === formattedDate;
    }
  );

  // Map toll bridge location codes to long form names
  const tollRecordsWithLongForm = tollRecordsForBridgeAndDate.map((record) => ({
    licensePlate: record.licensePlate,
    tollTag: record.tollTag,
    location: locationCodeToName.locationCodeToName[record.location],
    timestamp: moment(record.timestamp).tz('America/Los_Angeles').format(),
  }));

  const totalCount = tollRecordsForBridgeAndDate.length;
  res.status(200).json({ 
    totalCount,
    tollRecords: tollRecordsWithLongForm 
  
  });

}

module.exports = {
  totalVehiclesByBridge
}