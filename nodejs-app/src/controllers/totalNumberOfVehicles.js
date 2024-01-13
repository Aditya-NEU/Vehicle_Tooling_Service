const { tollData } = require("./postToll");
const customerModule = require("./newCustomer");
const moment = require('moment-timezone');


totalVehiclesLastMonth = async (req, res) => {
  // Get the current date
  const currentDate = moment();

  // Calculate the start date of the last calendar month
  const startDateLastMonth = currentDate.clone().subtract(1, 'months').startOf('month');

  // Filter toll records for the last calendar month
  const tollRecordsLastMonth = Array.from(tollData.values()).filter(
    (record) => {
      const recordDate = moment(record.timestamp);
      return recordDate.isSameOrAfter(startDateLastMonth) && recordDate.isBefore(currentDate);
    }
  );

  // Calculate the total count
  const totalCount = tollRecordsLastMonth.length;

  res.json({ totalCount });
}


module.exports= {
    totalVehiclesLastMonth
}