const { tollData } = require("./postToll");
const moment = require('moment-timezone');
const locationCodeToName = require("./postToll");


totalVehiclesLastMonth = async (req, res) => {

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

  // Respond with the total count and detailed toll records
  res.status(200).json({
    totalCount: tollRecordsLastMonth.length,
    tollRecords: tollRecordsWithLongForm,
  });

}

module.exports = {
  totalVehiclesLastMonth
}