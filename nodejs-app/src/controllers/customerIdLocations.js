const {tollData} = require("./postToll");
const moment = require('moment-timezone');
const locationCodeToName = require("./postToll");


customerLocationsLastMonth = async (req, res) => {
  try{
    console.log(`Received GET request for customerLocationsLastMonth: ${JSON.stringify(req.query)}`);

    const { customerId } = req.query;
    const currentDate = moment();
    
    if (!customerId) {
      console.log('Error: customerId parameter is required');
      return res.status(400).json({ error: 'customerId parameter is required' });
    }
  

    const startDateLastMonth = currentDate.clone().subtract(1, 'months').startOf('month');

    const tollRecordsLastMonth = Array.from(tollData.values()).filter(
      (record) => {
        const recordDate = moment(record.timestamp);
        const matchesCustomerId = record.customerId === customerId;
        return matchesCustomerId && recordDate.isSameOrAfter(startDateLastMonth) && recordDate.isBefore(currentDate);
      }
    );

    
    const customerLocationsLastMonth = tollRecordsLastMonth.map((record) => locationCodeToName.locationCodeToName[record.location]);

    console.log(`Locations passed through last month by customer ${customerId}: ${JSON.stringify(customerLocationsLastMonth)}`);
  
    res.json({ customerLocationsLastMonth });
  }
catch{

  console.error(`An error occurred in customerLocationsLastMonth endpoint: ${error.message}`);
  res.status(500).json({ error: 'Internal Server Error' });

    
  }

  }





module.exports = {
  customerLocationsLastMonth
}