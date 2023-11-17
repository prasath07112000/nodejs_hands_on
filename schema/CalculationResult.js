const mongoose = require('mongoose');

const CalculationResultSchema = new mongoose.Schema({
  startDate: {
    type: String,
    //required: true,
  },
  endDate: {
    type: String,
    //required: true,
  },
  startTime: {
    type: String,
    //required: true,
  },
  endTime: {
    type: String,
    //required: true,
  },
  duration: {
    type: String,
    ///equired: true,
  },
  breakDuration: {
    type: String,
    //required: true,
  },
  calculatedData: {
    type: String,
    //required: true,
    // Other configurations as needed
  },
  // Add other properties based on your 'result' object structure if needed
});

const CalculationResult = mongoose.model('calculationResult', CalculationResultSchema);

module.exports = CalculationResult;


//module.exports = mongoose.model('CalculationResult', CalculationResultSchema);