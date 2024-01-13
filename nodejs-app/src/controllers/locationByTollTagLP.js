const { tollData } = require("./postToll");
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

locationByTollTagLP = async (req, res) => {
    const { tollTag, licensePlate } = req.query;

    if (!tollTag && !licensePlate) {
      return res.status(400).json({ error: 'Either tollTag or licensePlate parameter is required' });
    }
  
    // Get the current date
    const currentDate = moment();
  
    // Calculate the start date of the last calendar month
    const startDateLastMonth = currentDate.clone().subtract(1, 'months').startOf('month');
  
    // Filter toll records for the last calendar month based on tollTag or licensePlate
    const tollRecordsLastMonth = Array.from(tollData.values()).filter(
      (record) => {
        const recordDate = moment(record.timestamp);
        const matchesTollTag = tollTag && record.tollTag === tollTag;
        const matchesLicensePlate = licensePlate && record.licensePlate === licensePlate;
  
        return (matchesTollTag || matchesLicensePlate) && recordDate.isSameOrAfter(startDateLastMonth) && recordDate.isBefore(currentDate);
      }
    );
  
    // Map toll bridge locations to full toll bridge names
    const locationsLastMonth = tollRecordsLastMonth.map((record) => locationCodeToName[record.location]);
  
    res.json({ locationsLastMonth });
}


module.exports= {
    locationByTollTagLP
}