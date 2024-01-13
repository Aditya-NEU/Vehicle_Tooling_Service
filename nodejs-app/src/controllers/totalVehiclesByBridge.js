const { tollData } = require("./postToll");
const customerModule = require("./newCustomer");
const moment = require('moment-timezone');

totalVehiclesByBridge = async (req, res) => {
  const { bridge, date } = req.query;

  if (!bridge || !date) {
    return res.status(400).json({ error: 'Both bridge and date parameters are required' });
  }

  // Correct the date format for comparison
  const formattedDate = moment(date).format('YYYY-MM-DD');

  // Filter toll records for the specified bridge and date
  const tollRecordsForBridgeAndDate = Array.from(tollData.values()).filter(
    (record) => {
      const recordDate = moment(record.timestamp).utcOffset(record.timestamp).format('YYYY-MM-DD');
      console.log(`Record Date: ${recordDate}, Formatted Date: ${formattedDate}`);
      return record.location === bridge && recordDate === formattedDate;
    }
  );

  console.log('Filtered Records:', tollRecordsForBridgeAndDate);
  // Calculate the total count
  const totalCount = tollRecordsForBridgeAndDate.length;
  res.status(200).json({ totalCount });

}


module.exports= {
  totalVehiclesByBridge
}