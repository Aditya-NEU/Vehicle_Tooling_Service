const { tollData } = require("./postToll");
const customerModule = require("./newCustomer");

exports.getallRecords = async (req,res)=>{
     // const allTollRecords = Array.from(customerData.values());

   console.log(customerModule.customerData.size)  

     console.log(customerModule.licensePlateToCustomerId.size)

}
