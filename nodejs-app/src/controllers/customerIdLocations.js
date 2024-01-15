const {tollData} = require("./postToll");
const moment = require('moment-timezone');
const locationCodeToName = require("./postToll");


customerLocationsLastMonth = async (req, res) => {
  const { customerId } = req.query;
  const currentDate = moment();
  
  if (!customerId) {
    return res.status(400).json({ error: 'customerId parameter is required' });
  }

  // Calculate the start date of the last calendar month
  const startDateLastMonth = currentDate.clone().subtract(1, 'months').startOf('month');

  // Filter toll records for the last calendar month based on customerId
  const tollRecordsLastMonth = Array.from(tollData.values()).filter(
    (record) => {
      const recordDate = moment(record.timestamp);
      const matchesCustomerId = record.customerId === customerId;
      return matchesCustomerId && recordDate.isSameOrAfter(startDateLastMonth) && recordDate.isBefore(currentDate);
    }
  );

  // Map toll bridge locations to full toll bridge names
  const customerLocationsLastMonth = tollRecordsLastMonth.map((record) => locationCodeToName.locationCodeToName[record.location]);

  res.json({ customerLocationsLastMonth });
}

module.exports = {
  customerLocationsLastMonth
}