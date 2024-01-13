const express = require('express');
const { v4: uuidv4, stringify } = require('uuid');
const tollData = new Map();
const customerModule = require("./newCustomer");

const postNewToll = async (req,res)=>{
  const { licensePlate, tollTag, location, timestamp } = req.body;
  const tollId = uuidv4()

  const tollRecord = {
    id: tollId,
    customerId: customerModule.licensePlateToCustomerId.get(licensePlate) || customerModule.tollTagToCustomerId.get(tollData) ,
    licensePlate,
    tollTag,
    location,
    timestamp,
  };

if( !timestamp || !location ){
  return res.status(400).json({ error: 'Timestamp and Location are required field.' });
}

  // Check if licensePlate or tollTag are provided
  if (!licensePlate && !tollTag) {
    return res.status(400).json({ error: 'License plate or toll tag one of them is required.' });
  }

  if ( !customerModule.licensePlateToCustomerId.has(licensePlate) && !customerModule.tollTagToCustomerId.has(tollTag) ){
    return res.status(400).json({
      error: `This License plate ${licensePlate} and this ${tollTag} Toll Tag are not registered.`,
    });
  }

  if( customerModule.licensePlateToCustomerId.has(licensePlate) && customerModule.tollTagToCustomerId.has(tollTag)){

    let customerIDFromlp = customerModule.licensePlateToCustomerId.get(licensePlate)
    let customerIDFromtt = customerModule.tollTagToCustomerId.get(tollTag)
    if(customerIDFromlp == customerIDFromtt){
      tollData.set(tollId, tollRecord);
     return res.status(200).json({ id: tollId });
    }

    else{
      return res.status(400).json({
        error: `License plate ${licensePlate} is not registered with this ${tollTag} Toll Tag.`,
      });
    }
  }

  if (customerModule.licensePlateToCustomerId.has(licensePlate) &&  tollTag == undefined || customerModule.tollTagToCustomerId.has(tollTag) && licensePlate == undefined){
      // Use the UUID as the key for the Map
    tollData.set(tollId, tollRecord);
    return res.status(200).json({ id: tollId });
  }

  if (licensePlate !=undefined && tollTag != undefined){

    if(customerModule.licensePlateToCustomerId.has(licensePlate) && !customerModule.tollTagToCustomerId.has(tollTag) || !customerModule.licensePlateToCustomerId.has(licensePlate) && customerModule.tollTagToCustomerId.has(tollTag)){
      return res.status(400).json({
        error: `License plate ${licensePlate} is not registered with this ${tollTag} Toll Tag.`,
      });

    }
  }


}
module.exports = { tollData, postNewToll };