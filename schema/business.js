const mongoose = require('mongoose');

const business_schema = new mongoose.Schema({
  ownername: {
    type: String,
    
  },
  business_name: {
    type: String,
    
  },
  email: {
    type: String,
    
  },
  
  password: {
    type: String,
    
  },
  mobile: {
    type: String
    
  },
  products:[ {
    type: String
    
  }]
});

module.exports = mongoose.model('Business', business_schema);


