const newToll = require("../controllers/postToll.js")
const newCusomter = require("../controllers/postCustomer.js")


module.exports = function(app) {

  app.post('/toll',
    newToll.postNewToll
  );

  app.post('/customer',

  
  )



}