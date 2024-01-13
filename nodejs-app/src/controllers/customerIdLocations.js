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

  customerLocationsLastMonth = async (req, res) => {
    const { customerId } = req.query;

    if (!customerId) {
      return res.status(400).json({ error: 'customerId parameter is required' });
    }
  
    // Get the current date
    const currentDate = moment();
  
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
    const customerLocationsLastMonth = tollRecordsLastMonth.map((record) => locationCodeToName[record.location]);
  
    res.json({ customerLocationsLastMonth });
}


module.exports= {
    customerLocationsLastMonth
}