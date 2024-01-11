const express = require('express');
const { v4: uuidv4 } = require('uuid');
const tollData = new Map();

// Mapping between location codes and long-form toll bridge names
exports.postNewToll = async (req,res)=>{

  const { licensePlate, tollTag, location, timestamp } = req.body;

  // Check if licensePlate and tollTag are provided
  if (!licensePlate || !tollTag) {
    return res.status(400).json({ error: 'License plate and toll tag are required' });
  }

  // Check if the license plate is unique
  if (licensePlateToCustomerId.has(licensePlate)) {
    const existingCustomerId = licensePlateToCustomerId.get(licensePlate);
    return res.status(400).json({
      error: `License plate ${licensePlate} is already associated with Customer ID ${existingCustomerId}`,
    });
  }

  // Check if the toll tag is unique
  if (tollTagToCustomerId.has(tollTag)) {
    const existingCustomerId = tollTagToCustomerId.get(tollTag);
    return res.status(400).json({
      error: `Toll tag ${tollTag} is already associated with Customer ID ${existingCustomerId}`,
    });
  }

  // Generate a unique UUID for the toll record
  const tollId = uuidv4();

  const tollRecord = {
    id: tollId,
    customerId: licensePlateToCustomerId.get(licensePlate) || tollTagToCustomerId.get(tollTag),
    licensePlate,
    tollTag,
    location,
    timestamp,
  };

  // Use the UUID as the key for the Map
  tollData.set(tollId, tollRecord);
  res.status(200).json({ id: tollId });


}
