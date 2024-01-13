const newToll = require("../controllers/postToll.js")
const getallRecords = require("../controllers/getTollRecord.js")
const newCustomer = require("../controllers/newCustomer.js")

module.exports = function(app) {

  app.post('/customer',
  newCustomer.postNewCustomer
  )

  app.post('/toll',
    newToll.postNewToll
    );

app.get('/getAllTollRecords',
  getallRecords.getallRecords

  );

}