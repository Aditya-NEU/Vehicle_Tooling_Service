const newToll = require("../controllers/postToll.js")
const getallRecords = require("../controllers/totalVehiclesByBridge.js")
const newCustomer = require("../controllers/newCustomer.js")
const totalVehiclesLastMonth = require ("../controllers/totalNumberOfVehicles.js")
const locationByTollTagLP = require("../controllers/locationByTollTagLP.js")
const customerIdLocation = require("../controllers/customerIdLocations.js")

module.exports = function(app) {

  app.post('/customer',
  newCustomer.postNewCustomer
  )

  app.post('/toll',
    newToll.postNewToll
    );

app.get('/totalVehiclesByBridge',
  getallRecords.totalVehiclesByBridge
  );

app.get('/totalVehiclesLastMonth',
totalVehiclesLastMonth.totalVehiclesLastMonth
);

app.get('/locationsLastMonth',
locationByTollTagLP.locationByTollTagLP
)

app.get('/customerLocationsLastMonth',
customerIdLocation.customerLocationsLastMonth
)

}