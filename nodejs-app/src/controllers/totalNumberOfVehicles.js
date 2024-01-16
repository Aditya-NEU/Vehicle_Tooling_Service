const { tollData } = require("./postToll");
const moment = require('moment-timezone');
const locationCodeToName = require("./postToll");


const totalVehiclesLastMonth = async (req, res) => {

  try{

    console.log(`Received GET request for totalVehiclesLastMonth: ${JSON.stringify(req.query)}`);
    
    const lastMonthStart = moment().subtract(1, 'month').startOf('month');
    const lastMonthEnd = moment().subtract(1, 'month').endOf('month');
  
    // Filter toll records for the last calendar month
    const tollRecordsLastMonth = Array.from(tollData.values()).filter((record) => {
      const recordDate = moment(record.timestamp).utcOffset(record.timestamp).format('YYYY-MM-DD');
      return moment(recordDate).isBetween(lastMonthStart, lastMonthEnd, null, '[]');
    });
  
    // Map toll bridge location codes to long form names
    const tollRecordsWithLongForm = tollRecordsLastMonth.map((record) => ({
      licensePlate: record.licensePlate,
      tollTag: record.tollTag,
      location: locationCodeToName.locationCodeToName[record.location],
      timestamp: moment(record.timestamp).tz('America/Los_Angeles').format(),
    }));
  
    // Log the result
    console.log(`Total vehicles passed through last month: ${tollRecordsLastMonth.length}`);
    console.log(`Detailed toll records: ${JSON.stringify(tollRecordsWithLongForm)}`);
  
    // Respond with the total count and detailed toll records
    res.status(200).json({
      totalCount: tollRecordsLastMonth.length,
      tollRecords: tollRecordsWithLongForm,
    });

}
catch{
  console.error(`An error occurred in totalVehiclesLastMonth endpoint: ${error.message}`);
  res.status(500).json({ error: 'Internal Server Error' });
}

}

module.exports = {
  totalVehiclesLastMonth
}