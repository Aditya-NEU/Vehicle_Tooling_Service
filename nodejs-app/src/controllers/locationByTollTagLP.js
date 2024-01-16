const { tollData } = require("./postToll");
const moment = require('moment-timezone');
const locationCodeToName = require("./postToll");

locationByTollTagLP = async (req, res) => {

  try {
    const { tollTag, licensePlate } = req.query;
    console.log(`Received GET request for locationByTollTagLP: ${JSON.stringify(req.query)}`);

    if (!tollTag && !licensePlate) {
      return res.status(400).json({ error: 'Either tollTag or licensePlate parameter is required' });
    }


    const currentDate = moment();


    const startDateLastMonth = currentDate.clone().subtract(1, 'months').startOf('month');

    const tollRecordsLastMonth = Array.from(tollData.values()).filter(
      (record) => {
        const recordDate = moment(record.timestamp);
        const matchesTollTag = tollTag && record.tollTag === tollTag;
        const matchesLicensePlate = licensePlate && record.licensePlate === licensePlate;
        return (matchesTollTag || matchesLicensePlate) && recordDate.isSameOrAfter(startDateLastMonth) && recordDate.isBefore(currentDate);
      }
    );


    const locationsLastMonth = tollRecordsLastMonth.map((record) => locationCodeToName.locationCodeToName[record.location]);

    console.log(`Locations passed through last month: ${JSON.stringify(locationsLastMonth)}`);

    res.json({ locationsLastMonth });
  }


  catch {
    console.error(`An error occurred in locationByTollTagLP endpoint: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }

}


module.exports = {
  locationByTollTagLP,
  locationCodeToName
}